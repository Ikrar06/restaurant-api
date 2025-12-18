require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const securityHeaders = require('./middleware/security');
const corsConfig = require('./middleware/corsConfig');
const compressionMiddleware = require('./middleware/compressionMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(securityHeaders);
app.use(corsConfig);
app.use(compressionMiddleware);
app.use(express.json());
app.use(logger);
app.use(generalLimiter);

app.get('/', (req, res) => {
  res.json({ message: 'Restaurant API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
