const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReviews = async (req, res, next) => {
  try {
    const { menuItemId, userId, minRating, maxRating } = req.query;

    const where = {};

    if (menuItemId) where.menuItemId = parseInt(menuItemId);
    if (userId) where.userId = parseInt(userId);
    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) where.rating.gte = parseInt(minRating);
      if (maxRating) where.rating.lte = parseInt(maxRating);
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        menuItem: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true, email: true } },
        menuItem: { select: { name: true, description: true, price: true } }
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { menuItemId, rating, comment } = req.body;
    const userId = req.user.userId;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_menuItemId: {
          userId: userId,
          menuItemId: menuItemId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this menu item'
      });
    }

    const completedOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: 'COMPLETED',
        orderItems: {
          some: {
            menuItemId: menuItemId
          }
        }
      }
    });

    if (!completedOrder) {
      return res.status(403).json({
        success: false,
        message: 'You can only review menu items from your completed orders'
      });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        menuItemId,
        rating,
        comment
      },
      include: {
        user: { select: { name: true, email: true } },
        menuItem: { select: { name: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own reviews'
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { rating, comment },
      include: {
        user: { select: { name: true, email: true } },
        menuItem: { select: { name: true } }
      }
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (userRole !== 'ADMIN' && review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own reviews'
      });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
