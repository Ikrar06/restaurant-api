require('dotenv').config();
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const securityHeaders = require('./middlewares/security');
const corsConfig = require('./middlewares/corsConfig');
const compressionMiddleware = require('./middlewares/compressionMiddleware');
const { generalLimiter } = require('./middlewares/rateLimiter');
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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
