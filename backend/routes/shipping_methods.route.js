import express from 'express';
import { getAll, getById, insert, update, deleteshipping_methods } from '../controllers/shipping_methods.controller.js';
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
const shipping_methodsValidation = validationConfig['shipping_methods'] || [
	body('shipping_method_id').optional(),
	body('method_name').optional(),
	body('cost').optional(),
	body('estimated_delivery_time').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['shipping_methods'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['shipping_methods'].getAll)];
const getByIdMiddleware = routeConfig['shipping_methods'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['shipping_methods'].getById)];
const insertMiddleware = routeConfig['shipping_methods'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['shipping_methods'].insert), csrfProtection];
const updateMiddleware = routeConfig['shipping_methods'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['shipping_methods'].update), csrfProtection];
const deleteMiddleware = routeConfig['shipping_methods'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['shipping_methods'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/shipping_methods:
 *   get:
 *     summary: Retrieve a list of shipping_methods
 *     description: Fetches a paginated list of shipping_methods from the database.
 *     tags: [Shipping_methods]
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
 *         description: A list of shipping_methods
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
 *                       shipping_method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       cost:
 *                         type: number
 *                       estimated_delivery_time:
 *                         type: number
 *                       is_active:
 *                         type: number
 *                       created_at:
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
 * /api/v1/shipping_methods/{id}:
 *   get:
 *     summary: Retrieve a single shipping_methods by ID
 *     description: Fetches a shipping_methods by its ID.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The shipping_methods ID
 *     responses:
 *       200:
 *         description: A single shipping_methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipping_method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     cost:
 *                       type: number
 *                     estimated_delivery_time:
 *                       type: number
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shipping_methods not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/shipping_methods:
 *   post:
 *     summary: Create a new shipping_methods
 *     description: Creates a new shipping_methods.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_method_id
 *             properties:
 *               shipping_method_id:
 *                 type: number
 *                 description: The shipping_method_id of the shipping_methods
 *               method_name:
 *                 type: string
 *                 description: The method_name of the shipping_methods
 *               cost:
 *                 type: number
 *                 description: The cost of the shipping_methods
 *               estimated_delivery_time:
 *                 type: number
 *                 description: The estimated_delivery_time of the shipping_methods
 *               is_active:
 *                 type: number
 *                 description: The is_active of the shipping_methods
 *               created_at:
 *                 type: string
 *                 description: The created_at of the shipping_methods
 *     responses:
 *       201:
 *         description: Shipping_methods created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipping_method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     cost:
 *                       type: number
 *                     estimated_delivery_time:
 *                       type: number
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Shipping_methods already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...shipping_methodsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/shipping_methods/{id}:
 *   put:
 *     summary: Update a shipping_methods by ID
 *     description: Updates an existing shipping_methods.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The shipping_methods ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_method_id
 *             properties:
 *               shipping_method_id:
 *                 type: number
 *                 description: The shipping_method_id of the shipping_methods
 *               method_name:
 *                 type: string
 *                 description: The method_name of the shipping_methods
 *               cost:
 *                 type: number
 *                 description: The cost of the shipping_methods
 *               estimated_delivery_time:
 *                 type: number
 *                 description: The estimated_delivery_time of the shipping_methods
 *               is_active:
 *                 type: number
 *                 description: The is_active of the shipping_methods
 *               created_at:
 *                 type: string
 *                 description: The created_at of the shipping_methods
 *     responses:
 *       200:
 *         description: Shipping_methods updated
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
 *         description: Shipping_methods not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...shipping_methodsValidation], validate, update);
/**
 * @swagger
 * /api/v1/shipping_methods/{id}:
 *   delete:
 *     summary: Delete a shipping_methods by ID
 *     description: Deletes a shipping_methods by its ID.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The shipping_methods ID
 *     responses:
 *       200:
 *         description: Shipping_methods deleted
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
 *         description: Shipping_methods not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteshipping_methods);
export default router;
