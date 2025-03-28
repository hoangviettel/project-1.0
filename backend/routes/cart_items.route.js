import express from 'express';
import { getAll, getById, insert, update, deletecart_items } from '../controllers/cart_items.controller.js';
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
const cart_itemsValidation = validationConfig['cart_items'] || [
	body('cart_item_id').optional(),
	body('cart_id').optional(),
	body('product_id').optional(),
	body('quantity').optional(),
];
const getAllMiddleware = routeConfig['cart_items'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['cart_items'].getAll)];
const getByIdMiddleware = routeConfig['cart_items'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['cart_items'].getById)];
const insertMiddleware = routeConfig['cart_items'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['cart_items'].insert), csrfProtection];
const updateMiddleware = routeConfig['cart_items'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['cart_items'].update), csrfProtection];
const deleteMiddleware = routeConfig['cart_items'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['cart_items'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/cart_items:
 *   get:
 *     summary: Retrieve a list of cart_items
 *     description: Fetches a paginated list of cart_items from the database.
 *     tags: [Cart_items]
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
 *         description: A list of cart_items
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
 *                       cart_item_id:
 *                         type: number
 *                       cart_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       quantity:
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
 * /api/v1/cart_items/{id}:
 *   get:
 *     summary: Retrieve a single cart_items by ID
 *     description: Fetches a cart_items by its ID.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart_items ID
 *     responses:
 *       200:
 *         description: A single cart_items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_item_id:
 *                       type: number
 *                     cart_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Cart_items not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/cart_items:
 *   post:
 *     summary: Create a new cart_items
 *     description: Creates a new cart_items.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_item_id
 *             properties:
 *               cart_item_id:
 *                 type: number
 *                 description: The cart_item_id of the cart_items
 *               cart_id:
 *                 type: number
 *                 description: The cart_id of the cart_items
 *               product_id:
 *                 type: number
 *                 description: The product_id of the cart_items
 *               quantity:
 *                 type: number
 *                 description: The quantity of the cart_items
 *     responses:
 *       201:
 *         description: Cart_items created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_item_id:
 *                       type: number
 *                     cart_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Cart_items already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...cart_itemsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/cart_items/{id}:
 *   put:
 *     summary: Update a cart_items by ID
 *     description: Updates an existing cart_items.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart_items ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_item_id
 *             properties:
 *               cart_item_id:
 *                 type: number
 *                 description: The cart_item_id of the cart_items
 *               cart_id:
 *                 type: number
 *                 description: The cart_id of the cart_items
 *               product_id:
 *                 type: number
 *                 description: The product_id of the cart_items
 *               quantity:
 *                 type: number
 *                 description: The quantity of the cart_items
 *     responses:
 *       200:
 *         description: Cart_items updated
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
 *         description: Cart_items not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...cart_itemsValidation], validate, update);
/**
 * @swagger
 * /api/v1/cart_items/{id}:
 *   delete:
 *     summary: Delete a cart_items by ID
 *     description: Deletes a cart_items by its ID.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart_items ID
 *     responses:
 *       200:
 *         description: Cart_items deleted
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
 *         description: Cart_items not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecart_items);
export default router;
