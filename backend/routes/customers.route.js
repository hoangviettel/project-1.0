import express from 'express';
import { getAll, getById, insert, update, deletecustomers } from '../controllers/customers.controller.js';
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
const customersValidation = validationConfig['customers'] || [
	body('customer_id').optional(),
	body('username').optional(),
	body('email').optional(),
	body('password_hash').optional(),
	body('full_name').optional(),
	body('birth_date').optional(),
	body('gender').optional(),
	body('phone').optional(),
	body('address').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['customers'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['customers'].getAll)];
const getByIdMiddleware = routeConfig['customers'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['customers'].getById)];
const insertMiddleware = routeConfig['customers'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['customers'].insert), csrfProtection];
const updateMiddleware = routeConfig['customers'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['customers'].update), csrfProtection];
const deleteMiddleware = routeConfig['customers'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['customers'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     description: Fetches a paginated list of customers from the database.
 *     tags: [Customers]
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
 *         description: A list of customers
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
 *                       customer_id:
 *                         type: number
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       password_hash:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
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
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Retrieve a single customers by ID
 *     description: Fetches a customers by its ID.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customers ID
 *     responses:
 *       200:
 *         description: A single customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: number
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password_hash:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     birth_date:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
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
 *         description: Customers not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new customers
 *     description: Creates a new customers.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *             properties:
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the customers
 *               username:
 *                 type: string
 *                 description: The username of the customers
 *               email:
 *                 type: string
 *                 description: The email of the customers
 *               password_hash:
 *                 type: string
 *                 description: The password_hash of the customers
 *               full_name:
 *                 type: string
 *                 description: The full_name of the customers
 *               birth_date:
 *                 type: string
 *                 description: The birth_date of the customers
 *               gender:
 *                 type: string
 *                 description: The gender of the customers
 *               phone:
 *                 type: string
 *                 description: The phone of the customers
 *               address:
 *                 type: string
 *                 description: The address of the customers
 *               created_at:
 *                 type: string
 *                 description: The created_at of the customers
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the customers
 *     responses:
 *       201:
 *         description: Customers created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: number
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password_hash:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     birth_date:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
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
 *         description: Customers already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...customersValidation], validate, insert);
/**
 * @swagger
 * /api/v1/customers/{id}:
 *   put:
 *     summary: Update a customers by ID
 *     description: Updates an existing customers.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customers ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *             properties:
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the customers
 *               username:
 *                 type: string
 *                 description: The username of the customers
 *               email:
 *                 type: string
 *                 description: The email of the customers
 *               password_hash:
 *                 type: string
 *                 description: The password_hash of the customers
 *               full_name:
 *                 type: string
 *                 description: The full_name of the customers
 *               birth_date:
 *                 type: string
 *                 description: The birth_date of the customers
 *               gender:
 *                 type: string
 *                 description: The gender of the customers
 *               phone:
 *                 type: string
 *                 description: The phone of the customers
 *               address:
 *                 type: string
 *                 description: The address of the customers
 *               created_at:
 *                 type: string
 *                 description: The created_at of the customers
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the customers
 *     responses:
 *       200:
 *         description: Customers updated
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
 *         description: Customers not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...customersValidation], validate, update);
/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     summary: Delete a customers by ID
 *     description: Deletes a customers by its ID.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customers ID
 *     responses:
 *       200:
 *         description: Customers deleted
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
 *         description: Customers not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecustomers);
export default router;
