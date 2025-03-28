import express from 'express';
import { getAll, getById, insert, update, deletewarehouses } from '../controllers/warehouses.controller.js';
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
const warehousesValidation = validationConfig['warehouses'] || [
	body('warehouse_id').optional(),
	body('warehouse_name').optional(),
	body('location').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['warehouses'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['warehouses'].getAll)];
const getByIdMiddleware = routeConfig['warehouses'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['warehouses'].getById)];
const insertMiddleware = routeConfig['warehouses'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['warehouses'].insert), csrfProtection];
const updateMiddleware = routeConfig['warehouses'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['warehouses'].update), csrfProtection];
const deleteMiddleware = routeConfig['warehouses'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['warehouses'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/warehouses:
 *   get:
 *     summary: Retrieve a list of warehouses
 *     description: Fetches a paginated list of warehouses from the database.
 *     tags: [Warehouses]
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
 *         description: A list of warehouses
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
 *                       warehouse_id:
 *                         type: number
 *                       warehouse_name:
 *                         type: string
 *                       location:
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
 * /api/v1/warehouses/{id}:
 *   get:
 *     summary: Retrieve a single warehouses by ID
 *     description: Fetches a warehouses by its ID.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouses ID
 *     responses:
 *       200:
 *         description: A single warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     warehouse_id:
 *                       type: number
 *                     warehouse_name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Warehouses not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/warehouses:
 *   post:
 *     summary: Create a new warehouses
 *     description: Creates a new warehouses.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouse_id
 *             properties:
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the warehouses
 *               warehouse_name:
 *                 type: string
 *                 description: The warehouse_name of the warehouses
 *               location:
 *                 type: string
 *                 description: The location of the warehouses
 *               created_at:
 *                 type: string
 *                 description: The created_at of the warehouses
 *     responses:
 *       201:
 *         description: Warehouses created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     warehouse_id:
 *                       type: number
 *                     warehouse_name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Warehouses already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...warehousesValidation], validate, insert);
/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   put:
 *     summary: Update a warehouses by ID
 *     description: Updates an existing warehouses.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouses ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouse_id
 *             properties:
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the warehouses
 *               warehouse_name:
 *                 type: string
 *                 description: The warehouse_name of the warehouses
 *               location:
 *                 type: string
 *                 description: The location of the warehouses
 *               created_at:
 *                 type: string
 *                 description: The created_at of the warehouses
 *     responses:
 *       200:
 *         description: Warehouses updated
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
 *         description: Warehouses not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...warehousesValidation], validate, update);
/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   delete:
 *     summary: Delete a warehouses by ID
 *     description: Deletes a warehouses by its ID.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouses ID
 *     responses:
 *       200:
 *         description: Warehouses deleted
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
 *         description: Warehouses not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletewarehouses);
export default router;
