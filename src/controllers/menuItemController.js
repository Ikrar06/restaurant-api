const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMenuItems = async (req, res, next) => {
  try {
    const { categoryId, isAvailable, minPrice, maxPrice, search } = req.query;

    const where = {};

    if (categoryId) where.categoryId = parseInt(categoryId);
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: { category: true }
    });

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const avgRating = await prisma.review.aggregate({
      where: { menuItemId: parseInt(id) },
      _avg: { rating: true },
      _count: true
    });

    res.json({
      success: true,
      data: {
        ...menuItem,
        avgRating: avgRating._avg.rating || 0,
        reviewCount: avgRating._count
      }
    });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, imageUrl, isAvailable, preparationTime } = req.body;

    const menuItem = await prisma.menuItem.create({
      data: { name, description, price, categoryId, imageUrl, isAvailable, preparationTime },
      include: { category: true }
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, imageUrl, isAvailable, preparationTime } = req.body;

    const menuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: { name, description, price, categoryId, imageUrl, isAvailable, preparationTime },
      include: { category: true }
    });

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
