import express from 'express';
import { getAll, getById, insert, update, deletetransactions } from '../controllers/transactions.controller.js';
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
const transactionsValidation = validationConfig['transactions'] || [
	body('transaction_id').optional(),
	body('order_id').optional(),
	body('method_id').optional(),
	body('amount').optional(),
	body('transaction_status').optional(),
	body('transaction_date').optional(),
	body('transaction_code').optional(),
];
const getAllMiddleware = routeConfig['transactions'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['transactions'].getAll)];
const getByIdMiddleware = routeConfig['transactions'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['transactions'].getById)];
const insertMiddleware = routeConfig['transactions'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['transactions'].insert), csrfProtection];
const updateMiddleware = routeConfig['transactions'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['transactions'].update), csrfProtection];
const deleteMiddleware = routeConfig['transactions'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['transactions'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Retrieve a list of transactions
 *     description: Fetches a paginated list of transactions from the database.
 *     tags: [Transactions]
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
 *         description: A list of transactions
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
 *                       transaction_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       method_id:
 *                         type: number
 *                       amount:
 *                         type: number
 *                       transaction_status:
 *                         type: string
 *                       transaction_date:
 *                         type: string
 *                       transaction_code:
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
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Retrieve a single transactions by ID
 *     description: Fetches a transactions by its ID.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transactions ID
 *     responses:
 *       200:
 *         description: A single transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     method_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     transaction_status:
 *                       type: string
 *                     transaction_date:
 *                       type: string
 *                     transaction_code:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transactions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new transactions
 *     description: Creates a new transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction_id
 *             properties:
 *               transaction_id:
 *                 type: number
 *                 description: The transaction_id of the transactions
 *               order_id:
 *                 type: number
 *                 description: The order_id of the transactions
 *               method_id:
 *                 type: number
 *                 description: The method_id of the transactions
 *               amount:
 *                 type: number
 *                 description: The amount of the transactions
 *               transaction_status:
 *                 type: string
 *                 description: The transaction_status of the transactions
 *               transaction_date:
 *                 type: string
 *                 description: The transaction_date of the transactions
 *               transaction_code:
 *                 type: string
 *                 description: The transaction_code of the transactions
 *     responses:
 *       201:
 *         description: Transactions created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     method_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     transaction_status:
 *                       type: string
 *                     transaction_date:
 *                       type: string
 *                     transaction_code:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Transactions already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...transactionsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update a transactions by ID
 *     description: Updates an existing transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transactions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction_id
 *             properties:
 *               transaction_id:
 *                 type: number
 *                 description: The transaction_id of the transactions
 *               order_id:
 *                 type: number
 *                 description: The order_id of the transactions
 *               method_id:
 *                 type: number
 *                 description: The method_id of the transactions
 *               amount:
 *                 type: number
 *                 description: The amount of the transactions
 *               transaction_status:
 *                 type: string
 *                 description: The transaction_status of the transactions
 *               transaction_date:
 *                 type: string
 *                 description: The transaction_date of the transactions
 *               transaction_code:
 *                 type: string
 *                 description: The transaction_code of the transactions
 *     responses:
 *       200:
 *         description: Transactions updated
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
 *         description: Transactions not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...transactionsValidation], validate, update);
/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete a transactions by ID
 *     description: Deletes a transactions by its ID.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transactions ID
 *     responses:
 *       200:
 *         description: Transactions deleted
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
 *         description: Transactions not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletetransactions);
export default router;
