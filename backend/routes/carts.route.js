import express from 'express';
import { getAll, getById, insert, update, deletecarts } from '../controllers/carts.controller.js';
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
const cartsValidation = validationConfig['carts'] || [
	body('cart_id').optional(),
	body('customer_id').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['carts'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['carts'].getAll)];
const getByIdMiddleware = routeConfig['carts'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['carts'].getById)];
const insertMiddleware = routeConfig['carts'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['carts'].insert), csrfProtection];
const updateMiddleware = routeConfig['carts'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['carts'].update), csrfProtection];
const deleteMiddleware = routeConfig['carts'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['carts'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Retrieve a list of carts
 *     description: Fetches a paginated list of carts from the database.
 *     tags: [Carts]
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
 *         description: A list of carts
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
 *                       cart_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
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
 * /api/v1/carts/{id}:
 *   get:
 *     summary: Retrieve a single carts by ID
 *     description: Fetches a carts by its ID.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The carts ID
 *     responses:
 *       200:
 *         description: A single carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Carts not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/carts:
 *   post:
 *     summary: Create a new carts
 *     description: Creates a new carts.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_id
 *             properties:
 *               cart_id:
 *                 type: number
 *                 description: The cart_id of the carts
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the carts
 *               created_at:
 *                 type: string
 *                 description: The created_at of the carts
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the carts
 *     responses:
 *       201:
 *         description: Carts created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Carts already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...cartsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/carts/{id}:
 *   put:
 *     summary: Update a carts by ID
 *     description: Updates an existing carts.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The carts ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_id
 *             properties:
 *               cart_id:
 *                 type: number
 *                 description: The cart_id of the carts
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the carts
 *               created_at:
 *                 type: string
 *                 description: The created_at of the carts
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the carts
 *     responses:
 *       200:
 *         description: Carts updated
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
 *         description: Carts not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...cartsValidation], validate, update);
/**
 * @swagger
 * /api/v1/carts/{id}:
 *   delete:
 *     summary: Delete a carts by ID
 *     description: Deletes a carts by its ID.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The carts ID
 *     responses:
 *       200:
 *         description: Carts deleted
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
 *         description: Carts not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecarts);
export default router;
