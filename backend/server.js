import express from 'express';
import createError from 'http-errors';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import { login, refreshToken, logout, csrfProtection, authenticateJWT } from './middleware/authMiddleware.js';
import authRoutes from './routes/auth.route.js';
import audit_logsRoutes from './routes/audit_logs.route.js';
import brandsRoutes from './routes/brands.route.js';
import cart_itemsRoutes from './routes/cart_items.route.js';
import cartsRoutes from './routes/carts.route.js';
import categoriesRoutes from './routes/categories.route.js';
import customersRoutes from './routes/customers.route.js';
import import_invoice_detailsRoutes from './routes/import_invoice_details.route.js';
import import_invoicesRoutes from './routes/import_invoices.route.js';
import inventoryRoutes from './routes/inventory.route.js';
import order_detailsRoutes from './routes/order_details.route.js';
import order_promotionsRoutes from './routes/order_promotions.route.js';
import ordersRoutes from './routes/orders.route.js';
import payment_methodsRoutes from './routes/payment_methods.route.js';
import product_imagesRoutes from './routes/product_images.route.js';
import productsRoutes from './routes/products.route.js';
import promotionsRoutes from './routes/promotions.route.js';
import refresh_tokensRoutes from './routes/refresh_tokens.route.js';
import reviewsRoutes from './routes/reviews.route.js';
import shipping_methodsRoutes from './routes/shipping_methods.route.js';
import suppliersRoutes from './routes/suppliers.route.js';
import transactionsRoutes from './routes/transactions.route.js';
import usersRoutes from './routes/users.route.js';
import warehousesRoutes from './routes/warehouses.route.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use('/api/v1/login', login);
app.use('/api/v1/refresh', refreshToken);
app.use('/api/v1/logout', logout);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/audit_logs', audit_logsRoutes);
app.use('/api/v1/brands', brandsRoutes);
app.use('/api/v1/cart_items', cart_itemsRoutes);
app.use('/api/v1/carts', cartsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/import_invoice_details', import_invoice_detailsRoutes);
app.use('/api/v1/import_invoices', import_invoicesRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/order_details', order_detailsRoutes);
app.use('/api/v1/order_promotions', order_promotionsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/payment_methods', payment_methodsRoutes);
app.use('/api/v1/product_images', product_imagesRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/promotions', promotionsRoutes);
app.use('/api/v1/refresh_tokens', refresh_tokensRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/shipping_methods', shipping_methodsRoutes);
app.use('/api/v1/suppliers', suppliersRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/warehouses', warehousesRoutes);
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Ecommerce Platform API', version: '1.0.0', description: 'API cho nền tảng thương mại điện tử' },
    servers: [{ url: `http://localhost:${port}`, description: 'Development server' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
  },
  apis: ['./routes/*.route.js', './middleware/authMiddleware.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, next) => next(createError(404, 'Resource not found')));
app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	res.status(status).json({ error: { status, message } });
});
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
