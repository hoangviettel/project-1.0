import express from 'express';
import { getAll, getById, insert, update, deletecategories } from '../controllers/categories.controller.js';
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
const categoriesValidation = validationConfig['categories'] || [
	body('category_id').optional(),
	body('category_name').optional(),
	body('description').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['categories'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['categories'].getAll)];
const getByIdMiddleware = routeConfig['categories'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['categories'].getById)];
const insertMiddleware = routeConfig['categories'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['categories'].insert), csrfProtection];
const updateMiddleware = routeConfig['categories'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['categories'].update), csrfProtection];
const deleteMiddleware = routeConfig['categories'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['categories'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     description: Fetches a paginated list of categories from the database.
 *     tags: [Categories]
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
 *         description: A list of categories
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
 *                       category_id:
 *                         type: number
 *                       category_name:
 *                         type: string
 *                       description:
 *                         type: string
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
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Retrieve a single categories by ID
 *     description: Fetches a categories by its ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The categories ID
 *     responses:
 *       200:
 *         description: A single categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: number
 *                     category_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Categories not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new categories
 *     description: Creates a new categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *             properties:
 *               category_id:
 *                 type: number
 *                 description: The category_id of the categories
 *               category_name:
 *                 type: string
 *                 description: The category_name of the categories
 *               description:
 *                 type: string
 *                 description: The description of the categories
 *               created_at:
 *                 type: string
 *                 description: The created_at of the categories
 *     responses:
 *       201:
 *         description: Categories created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: number
 *                     category_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Categories already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...categoriesValidation], validate, insert);
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a categories by ID
 *     description: Updates an existing categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The categories ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *             properties:
 *               category_id:
 *                 type: number
 *                 description: The category_id of the categories
 *               category_name:
 *                 type: string
 *                 description: The category_name of the categories
 *               description:
 *                 type: string
 *                 description: The description of the categories
 *               created_at:
 *                 type: string
 *                 description: The created_at of the categories
 *     responses:
 *       200:
 *         description: Categories updated
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
 *         description: Categories not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...categoriesValidation], validate, update);
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a categories by ID
 *     description: Deletes a categories by its ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The categories ID
 *     responses:
 *       200:
 *         description: Categories deleted
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
 *         description: Categories not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecategories);
export default router;
