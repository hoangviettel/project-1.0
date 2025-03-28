import express from 'express';
import { getAll, getById, insert, update, deletepayment_methods } from '../controllers/payment_methods.controller.js';
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
const payment_methodsValidation = validationConfig['payment_methods'] || [
	body('method_id').optional(),
	body('method_name').optional(),
	body('description').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['payment_methods'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['payment_methods'].getAll)];
const getByIdMiddleware = routeConfig['payment_methods'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['payment_methods'].getById)];
const insertMiddleware = routeConfig['payment_methods'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['payment_methods'].insert), csrfProtection];
const updateMiddleware = routeConfig['payment_methods'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['payment_methods'].update), csrfProtection];
const deleteMiddleware = routeConfig['payment_methods'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['payment_methods'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/payment_methods:
 *   get:
 *     summary: Retrieve a list of payment_methods
 *     description: Fetches a paginated list of payment_methods from the database.
 *     tags: [Payment_methods]
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
 *         description: A list of payment_methods
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
 *                       method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       description:
 *                         type: string
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
 * /api/v1/payment_methods/{id}:
 *   get:
 *     summary: Retrieve a single payment_methods by ID
 *     description: Fetches a payment_methods by its ID.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payment_methods ID
 *     responses:
 *       200:
 *         description: A single payment_methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Payment_methods not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/payment_methods:
 *   post:
 *     summary: Create a new payment_methods
 *     description: Creates a new payment_methods.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method_id
 *             properties:
 *               method_id:
 *                 type: number
 *                 description: The method_id of the payment_methods
 *               method_name:
 *                 type: string
 *                 description: The method_name of the payment_methods
 *               description:
 *                 type: string
 *                 description: The description of the payment_methods
 *               is_active:
 *                 type: number
 *                 description: The is_active of the payment_methods
 *               created_at:
 *                 type: string
 *                 description: The created_at of the payment_methods
 *     responses:
 *       201:
 *         description: Payment_methods created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Payment_methods already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...payment_methodsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/payment_methods/{id}:
 *   put:
 *     summary: Update a payment_methods by ID
 *     description: Updates an existing payment_methods.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payment_methods ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method_id
 *             properties:
 *               method_id:
 *                 type: number
 *                 description: The method_id of the payment_methods
 *               method_name:
 *                 type: string
 *                 description: The method_name of the payment_methods
 *               description:
 *                 type: string
 *                 description: The description of the payment_methods
 *               is_active:
 *                 type: number
 *                 description: The is_active of the payment_methods
 *               created_at:
 *                 type: string
 *                 description: The created_at of the payment_methods
 *     responses:
 *       200:
 *         description: Payment_methods updated
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
 *         description: Payment_methods not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...payment_methodsValidation], validate, update);
/**
 * @swagger
 * /api/v1/payment_methods/{id}:
 *   delete:
 *     summary: Delete a payment_methods by ID
 *     description: Deletes a payment_methods by its ID.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payment_methods ID
 *     responses:
 *       200:
 *         description: Payment_methods deleted
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
 *         description: Payment_methods not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletepayment_methods);
export default router;
