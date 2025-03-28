import express from 'express';
import { getAll, getById, insert, update, deleteorder_details } from '../controllers/order_details.controller.js';
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
const order_detailsValidation = validationConfig['order_details'] || [
	body('detail_id').optional(),
	body('order_id').optional(),
	body('product_id').optional(),
	body('quantity').optional(),
	body('price').optional(),
	body('warehouse_id').optional(),
];
const getAllMiddleware = routeConfig['order_details'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['order_details'].getAll)];
const getByIdMiddleware = routeConfig['order_details'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['order_details'].getById)];
const insertMiddleware = routeConfig['order_details'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_details'].insert), csrfProtection];
const updateMiddleware = routeConfig['order_details'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_details'].update), csrfProtection];
const deleteMiddleware = routeConfig['order_details'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_details'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/order_details:
 *   get:
 *     summary: Retrieve a list of order_details
 *     description: Fetches a paginated list of order_details from the database.
 *     tags: [Order_details]
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
 *         description: A list of order_details
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
 *                       detail_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       warehouse_id:
 *                         type: number
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
 * /api/v1/order_details/{id}:
 *   get:
 *     summary: Retrieve a single order_details by ID
 *     description: Fetches a order_details by its ID.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_details ID
 *     responses:
 *       200:
 *         description: A single order_details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order_details not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/order_details:
 *   post:
 *     summary: Create a new order_details
 *     description: Creates a new order_details.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - detail_id
 *             properties:
 *               detail_id:
 *                 type: number
 *                 description: The detail_id of the order_details
 *               order_id:
 *                 type: number
 *                 description: The order_id of the order_details
 *               product_id:
 *                 type: number
 *                 description: The product_id of the order_details
 *               quantity:
 *                 type: number
 *                 description: The quantity of the order_details
 *               price:
 *                 type: number
 *                 description: The price of the order_details
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the order_details
 *     responses:
 *       201:
 *         description: Order_details created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Order_details already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...order_detailsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/order_details/{id}:
 *   put:
 *     summary: Update a order_details by ID
 *     description: Updates an existing order_details.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_details ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - detail_id
 *             properties:
 *               detail_id:
 *                 type: number
 *                 description: The detail_id of the order_details
 *               order_id:
 *                 type: number
 *                 description: The order_id of the order_details
 *               product_id:
 *                 type: number
 *                 description: The product_id of the order_details
 *               quantity:
 *                 type: number
 *                 description: The quantity of the order_details
 *               price:
 *                 type: number
 *                 description: The price of the order_details
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the order_details
 *     responses:
 *       200:
 *         description: Order_details updated
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
 *         description: Order_details not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...order_detailsValidation], validate, update);
/**
 * @swagger
 * /api/v1/order_details/{id}:
 *   delete:
 *     summary: Delete a order_details by ID
 *     description: Deletes a order_details by its ID.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_details ID
 *     responses:
 *       200:
 *         description: Order_details deleted
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
 *         description: Order_details not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteorder_details);
export default router;
