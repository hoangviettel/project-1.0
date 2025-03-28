import express from 'express';
import { getAll, getById, insert, update, deleteorders } from '../controllers/orders.controller.js';
import { body, param, validationResult } from 'express-validator';
import { authenticateJWT, restrictTo, csrfProtection } from '../middleware/authMiddleware.js';
import validationConfig from '../common/validationConfig.js';
import routeConfig from '../common/routeConfig.js';
import logger from '../common/logger.js';

const router = express.Router();
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		logger.warn(`Validation failed for ${tableName}: ${JSON.stringify(errors.array())}`, { method: req.method, url: req.url });
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
const ordersValidation = validationConfig['orders'] || [
	body('order_id').optional(),
	body('customer_id').optional(),
	body('staff_id').optional(),
	body('total_amount').optional(),
	body('order_status').optional(),
	body('shipping_method_id').optional(),
	body('shipping_address').optional(),
	body('method_id').optional(),
	body('payment_status').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['orders'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['orders'].getAll)];
const getByIdMiddleware = routeConfig['orders'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['orders'].getById)];
const insertMiddleware = routeConfig['orders'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['orders'].insert), csrfProtection];
const updateMiddleware = routeConfig['orders'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['orders'].update), csrfProtection];
const deleteMiddleware = routeConfig['orders'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['orders'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     description: Fetches a paginated list of orders from the database.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       order_status:
 *                         type: string
 *                       shipping_method_id:
 *                         type: number
 *                       shipping_address:
 *                         type: string
 *                       method_id:
 *                         type: number
 *                       payment_status:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       updated_at:
 *                         type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', [...getAllMiddleware], getAll);
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Retrieve a single orders by ID
 *     description: Fetches a orders by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The orders ID
 *     responses:
 *       200:
 *         description: A single orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     order_status:
 *                       type: string
 *                     shipping_method_id:
 *                       type: number
 *                     shipping_address:
 *                       type: string
 *                     method_id:
 *                       type: number
 *                     payment_status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new orders
 *     description: Creates a new orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: number
 *                 description: The order_id of the orders
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the orders
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the orders
 *               total_amount:
 *                 type: number
 *                 description: The total_amount of the orders
 *               order_status:
 *                 type: string
 *                 description: The order_status of the orders
 *               shipping_method_id:
 *                 type: number
 *                 description: The shipping_method_id of the orders
 *               shipping_address:
 *                 type: string
 *                 description: The shipping_address of the orders
 *               method_id:
 *                 type: number
 *                 description: The method_id of the orders
 *               payment_status:
 *                 type: string
 *                 description: The payment_status of the orders
 *               created_at:
 *                 type: string
 *                 description: The created_at of the orders
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the orders
 *     responses:
 *       201:
 *         description: Orders created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     order_status:
 *                       type: string
 *                     shipping_method_id:
 *                       type: number
 *                     shipping_address:
 *                       type: string
 *                     method_id:
 *                       type: number
 *                     payment_status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Orders already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...ordersValidation], validate, insert);
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update a orders by ID
 *     description: Updates an existing orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The orders ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: number
 *                 description: The order_id of the orders
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the orders
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the orders
 *               total_amount:
 *                 type: number
 *                 description: The total_amount of the orders
 *               order_status:
 *                 type: string
 *                 description: The order_status of the orders
 *               shipping_method_id:
 *                 type: number
 *                 description: The shipping_method_id of the orders
 *               shipping_address:
 *                 type: string
 *                 description: The shipping_address of the orders
 *               method_id:
 *                 type: number
 *                 description: The method_id of the orders
 *               payment_status:
 *                 type: string
 *                 description: The payment_status of the orders
 *               created_at:
 *                 type: string
 *                 description: The created_at of the orders
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the orders
 *     responses:
 *       200:
 *         description: Orders updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...ordersValidation], validate, update);
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete a orders by ID
 *     description: Deletes a orders by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The orders ID
 *     responses:
 *       200:
 *         description: Orders deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted successfully
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteorders);
export default router;
