const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTables = async (req, res, next) => {
  try {
    const { location, status, available } = req.query;

    const where = {};

    if (location) where.location = location;
    if (status) where.status = status;
    if (available === 'true') where.status = 'AVAILABLE';

    const tables = await prisma.table.findMany({
      where,
      orderBy: { tableNumber: 'asc' }
    });

    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    next(error);
  }
};

const getTableById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id: parseInt(id) },
      include: {
        orders: {
          where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] } }
        }
      }
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location, status } = req.body;

    const table = await prisma.table.create({
      data: { tableNumber, capacity, location, status }
    });

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: table
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, status } = req.body;

    const table = await prisma.table.update({
      where: { id: parseInt(id) },
      data: { tableNumber, capacity, location, status }
    });

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: table
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.table.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};
