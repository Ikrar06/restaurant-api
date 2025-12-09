const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

const getOrders = async (req, res, next) => {
  try {
    const { status, orderType } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;

    const where = {};

    if (userRole === 'CUSTOMER') {
      where.userId = userId;
    }

    if (status) where.status = status;
    if (orderType) where.orderType = orderType;

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        table: true,
        orderItems: { include: { menuItem: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.userId;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true, email: true } },
        table: true,
        orderItems: { include: { menuItem: true } }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (userRole === 'CUSTOMER' && order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view your own orders'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { tableId, orderType, items, notes } = req.body;
    const userId = req.user.userId;

    if (orderType === 'DINE_IN' && tableId) {
      const table = await prisma.table.findUnique({
        where: { id: tableId }
      });

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }

      if (table.status !== 'AVAILABLE') {
        return res.status(400).json({
          success: false,
          message: 'Table is not available'
        });
      }
    }

    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } }
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more menu items not found'
      });
    }

    const unavailableItems = menuItems.filter(item => !item.isAvailable);
    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some menu items are not available'
      });
    }

    const orderNumber = generateOrderNumber();

    let totalAmount = 0;
    const orderItemsData = items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal: subtotal,
        notes: item.notes
      };
    });

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          tableId,
          orderType,
          totalAmount,
          notes,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: { include: { menuItem: true } },
          table: true,
          user: { select: { name: true, email: true } }
        }
      });

      if (orderType === 'DINE_IN' && tableId) {
        await tx.table.update({
          where: { id: tableId },
          data: { status: 'OCCUPIED' }
        });
      }

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userRole = req.user.role;
    const userId = req.user.userId;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (userRole === 'CUSTOMER') {
      if (order.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update your own orders'
        });
      }

      if (status !== 'CANCELLED' || order.status !== 'PENDING') {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel pending orders'
        });
      }
    }

    const statusFlow = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);

    if (userRole === 'STAFF' && status !== 'CANCELLED') {
      if (newIndex !== currentIndex + 1 && status !== order.status) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status transition'
        });
      }
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: parseInt(id) },
        data: { status, notes },
        include: {
          orderItems: { include: { menuItem: true } },
          table: true
        }
      });

      if ((status === 'COMPLETED' || status === 'CANCELLED') && order.tableId) {
        await tx.table.update({
          where: { id: order.tableId },
          data: { status: 'AVAILABLE' }
        });
      }

      return updated;
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Only cancelled orders can be deleted'
      });
    }

    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
