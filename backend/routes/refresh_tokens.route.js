import express from 'express';
import { getAll, getById, insert, update, deleterefresh_tokens } from '../controllers/refresh_tokens.controller.js';
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
const refresh_tokensValidation = validationConfig['refresh_tokens'] || [
	body('user_id').optional(),
	body('token').optional(),
];
const getAllMiddleware = routeConfig['refresh_tokens'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['refresh_tokens'].getAll)];
const getByIdMiddleware = routeConfig['refresh_tokens'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['refresh_tokens'].getById)];
const insertMiddleware = routeConfig['refresh_tokens'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['refresh_tokens'].insert), csrfProtection];
const updateMiddleware = routeConfig['refresh_tokens'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['refresh_tokens'].update), csrfProtection];
const deleteMiddleware = routeConfig['refresh_tokens'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['refresh_tokens'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/refresh_tokens:
 *   get:
 *     summary: Retrieve a list of refresh_tokens
 *     description: Fetches a paginated list of refresh_tokens from the database.
 *     tags: [Refresh_tokens]
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
 *         description: A list of refresh_tokens
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
 *                       user_id:
 *                         type: number
 *                       token:
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
 * /api/v1/refresh_tokens/{id}:
 *   get:
 *     summary: Retrieve a single refresh_tokens by ID
 *     description: Fetches a refresh_tokens by its ID.
 *     tags: [Refresh_tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The refresh_tokens ID
 *     responses:
 *       200:
 *         description: A single refresh_tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: number
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Refresh_tokens not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/refresh_tokens:
 *   post:
 *     summary: Create a new refresh_tokens
 *     description: Creates a new refresh_tokens.
 *     tags: [Refresh_tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: The user_id of the refresh_tokens
 *               token:
 *                 type: string
 *                 description: The token of the refresh_tokens
 *     responses:
 *       201:
 *         description: Refresh_tokens created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: number
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Refresh_tokens already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...refresh_tokensValidation], validate, insert);
/**
 * @swagger
 * /api/v1/refresh_tokens/{id}:
 *   put:
 *     summary: Update a refresh_tokens by ID
 *     description: Updates an existing refresh_tokens.
 *     tags: [Refresh_tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The refresh_tokens ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: The user_id of the refresh_tokens
 *               token:
 *                 type: string
 *                 description: The token of the refresh_tokens
 *     responses:
 *       200:
 *         description: Refresh_tokens updated
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
 *         description: Refresh_tokens not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...refresh_tokensValidation], validate, update);
/**
 * @swagger
 * /api/v1/refresh_tokens/{id}:
 *   delete:
 *     summary: Delete a refresh_tokens by ID
 *     description: Deletes a refresh_tokens by its ID.
 *     tags: [Refresh_tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The refresh_tokens ID
 *     responses:
 *       200:
 *         description: Refresh_tokens deleted
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
 *         description: Refresh_tokens not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleterefresh_tokens);
export default router;
