const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { menuItems: true } } }
    });

    res.json({
      success: true,
      data: categories
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
