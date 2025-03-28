import express from 'express';
import { getAll, getById, insert, update, deletebrands } from '../controllers/brands.controller.js';
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
const brandsValidation = validationConfig['brands'] || [
	body('brand_id').optional(),
	body('brand_name').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['brands'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['brands'].getAll)];
const getByIdMiddleware = routeConfig['brands'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['brands'].getById)];
const insertMiddleware = routeConfig['brands'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['brands'].insert), csrfProtection];
const updateMiddleware = routeConfig['brands'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['brands'].update), csrfProtection];
const deleteMiddleware = routeConfig['brands'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['brands'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Retrieve a list of brands
 *     description: Fetches a paginated list of brands from the database.
 *     tags: [Brands]
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
 *         description: A list of brands
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
 *                       brand_id:
 *                         type: number
 *                       brand_name:
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
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Retrieve a single brands by ID
 *     description: Fetches a brands by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brands ID
 *     responses:
 *       200:
 *         description: A single brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     brand_id:
 *                       type: number
 *                     brand_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Brands not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/brands:
 *   post:
 *     summary: Create a new brands
 *     description: Creates a new brands.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_id
 *             properties:
 *               brand_id:
 *                 type: number
 *                 description: The brand_id of the brands
 *               brand_name:
 *                 type: string
 *                 description: The brand_name of the brands
 *               created_at:
 *                 type: string
 *                 description: The created_at of the brands
 *     responses:
 *       201:
 *         description: Brands created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     brand_id:
 *                       type: number
 *                     brand_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Brands already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...brandsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/brands/{id}:
 *   put:
 *     summary: Update a brands by ID
 *     description: Updates an existing brands.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brands ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_id
 *             properties:
 *               brand_id:
 *                 type: number
 *                 description: The brand_id of the brands
 *               brand_name:
 *                 type: string
 *                 description: The brand_name of the brands
 *               created_at:
 *                 type: string
 *                 description: The created_at of the brands
 *     responses:
 *       200:
 *         description: Brands updated
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
 *         description: Brands not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...brandsValidation], validate, update);
/**
 * @swagger
 * /api/v1/brands/{id}:
 *   delete:
 *     summary: Delete a brands by ID
 *     description: Deletes a brands by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brands ID
 *     responses:
 *       200:
 *         description: Brands deleted
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
 *         description: Brands not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletebrands);
export default router;
