import express from 'express';
import { getAll, getById, insert, update, deleteusers } from '../controllers/users.controller.js';
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
const usersValidation = validationConfig['users'] || [
	body('account_id').optional(),
	body('username').optional(),
	body('email').optional(),
	body('password_hash').optional(),
	body('full_name').optional(),
	body('birth_date').optional(),
	body('gender').optional(),
	body('phone').optional(),
	body('address').optional(),
	body('role').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['users'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['users'].getAll)];
const getByIdMiddleware = routeConfig['users'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['users'].getById)];
const insertMiddleware = routeConfig['users'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['users'].insert), csrfProtection];
const updateMiddleware = routeConfig['users'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['users'].update), csrfProtection];
const deleteMiddleware = routeConfig['users'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['users'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetches a paginated list of users from the database.
 *     tags: [Users]
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
 *         description: A list of users
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
 *                       account_id:
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
 *                       role:
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
 * /api/v1/users/{id}:
 *   get:
 *     summary: Retrieve a single users by ID
 *     description: Fetches a users by its ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The users ID
 *     responses:
 *       200:
 *         description: A single users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     account_id:
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
 *                     role:
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
 *         description: Users not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new users
 *     description: Creates a new users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_id
 *             properties:
 *               account_id:
 *                 type: number
 *                 description: The account_id of the users
 *               username:
 *                 type: string
 *                 description: The username of the users
 *               email:
 *                 type: string
 *                 description: The email of the users
 *               password_hash:
 *                 type: string
 *                 description: The password_hash of the users
 *               full_name:
 *                 type: string
 *                 description: The full_name of the users
 *               birth_date:
 *                 type: string
 *                 description: The birth_date of the users
 *               gender:
 *                 type: string
 *                 description: The gender of the users
 *               phone:
 *                 type: string
 *                 description: The phone of the users
 *               address:
 *                 type: string
 *                 description: The address of the users
 *               role:
 *                 type: string
 *                 description: The role of the users
 *               created_at:
 *                 type: string
 *                 description: The created_at of the users
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the users
 *     responses:
 *       201:
 *         description: Users created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     account_id:
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
 *                     role:
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
 *         description: Users already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...usersValidation], validate, insert);
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a users by ID
 *     description: Updates an existing users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The users ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_id
 *             properties:
 *               account_id:
 *                 type: number
 *                 description: The account_id of the users
 *               username:
 *                 type: string
 *                 description: The username of the users
 *               email:
 *                 type: string
 *                 description: The email of the users
 *               password_hash:
 *                 type: string
 *                 description: The password_hash of the users
 *               full_name:
 *                 type: string
 *                 description: The full_name of the users
 *               birth_date:
 *                 type: string
 *                 description: The birth_date of the users
 *               gender:
 *                 type: string
 *                 description: The gender of the users
 *               phone:
 *                 type: string
 *                 description: The phone of the users
 *               address:
 *                 type: string
 *                 description: The address of the users
 *               role:
 *                 type: string
 *                 description: The role of the users
 *               created_at:
 *                 type: string
 *                 description: The created_at of the users
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the users
 *     responses:
 *       200:
 *         description: Users updated
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
 *         description: Users not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...usersValidation], validate, update);
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a users by ID
 *     description: Deletes a users by its ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The users ID
 *     responses:
 *       200:
 *         description: Users deleted
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
 *         description: Users not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteusers);
export default router;
