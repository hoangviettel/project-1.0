import express from 'express';
import { getAll, getById, insert, update, deleteorder_promotions } from '../controllers/order_promotions.controller.js';
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
const order_promotionsValidation = validationConfig['order_promotions'] || [
	body('order_promotion_id').optional(),
	body('order_id').optional(),
	body('promotion_id').optional(),
	body('applied_discount').optional(),
];
const getAllMiddleware = routeConfig['order_promotions'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['order_promotions'].getAll)];
const getByIdMiddleware = routeConfig['order_promotions'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['order_promotions'].getById)];
const insertMiddleware = routeConfig['order_promotions'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_promotions'].insert), csrfProtection];
const updateMiddleware = routeConfig['order_promotions'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_promotions'].update), csrfProtection];
const deleteMiddleware = routeConfig['order_promotions'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['order_promotions'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/order_promotions:
 *   get:
 *     summary: Retrieve a list of order_promotions
 *     description: Fetches a paginated list of order_promotions from the database.
 *     tags: [Order_promotions]
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
 *         description: A list of order_promotions
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
 *                       order_promotion_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       promotion_id:
 *                         type: number
 *                       applied_discount:
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
 * /api/v1/order_promotions/{id}:
 *   get:
 *     summary: Retrieve a single order_promotions by ID
 *     description: Fetches a order_promotions by its ID.
 *     tags: [Order_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_promotions ID
 *     responses:
 *       200:
 *         description: A single order_promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_promotion_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     promotion_id:
 *                       type: number
 *                     applied_discount:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order_promotions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/order_promotions:
 *   post:
 *     summary: Create a new order_promotions
 *     description: Creates a new order_promotions.
 *     tags: [Order_promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_promotion_id
 *             properties:
 *               order_promotion_id:
 *                 type: number
 *                 description: The order_promotion_id of the order_promotions
 *               order_id:
 *                 type: number
 *                 description: The order_id of the order_promotions
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the order_promotions
 *               applied_discount:
 *                 type: number
 *                 description: The applied_discount of the order_promotions
 *     responses:
 *       201:
 *         description: Order_promotions created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_promotion_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     promotion_id:
 *                       type: number
 *                     applied_discount:
 *                       type: number
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Order_promotions already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...order_promotionsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/order_promotions/{id}:
 *   put:
 *     summary: Update a order_promotions by ID
 *     description: Updates an existing order_promotions.
 *     tags: [Order_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_promotions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_promotion_id
 *             properties:
 *               order_promotion_id:
 *                 type: number
 *                 description: The order_promotion_id of the order_promotions
 *               order_id:
 *                 type: number
 *                 description: The order_id of the order_promotions
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the order_promotions
 *               applied_discount:
 *                 type: number
 *                 description: The applied_discount of the order_promotions
 *     responses:
 *       200:
 *         description: Order_promotions updated
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
 *         description: Order_promotions not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...order_promotionsValidation], validate, update);
/**
 * @swagger
 * /api/v1/order_promotions/{id}:
 *   delete:
 *     summary: Delete a order_promotions by ID
 *     description: Deletes a order_promotions by its ID.
 *     tags: [Order_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_promotions ID
 *     responses:
 *       200:
 *         description: Order_promotions deleted
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
 *         description: Order_promotions not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteorder_promotions);
export default router;
