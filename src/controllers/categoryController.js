const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', order = 'asc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { _count: { select: { menuItems: true } } },
        orderBy: { [sortBy]: order },
        skip,
        take
      }),
      prisma.category.count({ where })
    ]);

    res.json({
      success: true,
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { menuItems: true }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;

    const category = await prisma.category.create({
      data: { name, description, imageUrl }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description, imageUrl }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuCount = await prisma.menuItem.count({
      where: { categoryId: parseInt(id) }
    });

    if (menuCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing menu items'
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
