import express from 'express';
import { getAll, getById, insert, update, deletesuppliers } from '../controllers/suppliers.controller.js';
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
const suppliersValidation = validationConfig['suppliers'] || [
	body('supplier_id').optional(),
	body('supplier_name').optional(),
	body('contact_name').optional(),
	body('phone').optional(),
	body('email').optional(),
	body('address').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['suppliers'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['suppliers'].getAll)];
const getByIdMiddleware = routeConfig['suppliers'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['suppliers'].getById)];
const insertMiddleware = routeConfig['suppliers'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['suppliers'].insert), csrfProtection];
const updateMiddleware = routeConfig['suppliers'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['suppliers'].update), csrfProtection];
const deleteMiddleware = routeConfig['suppliers'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['suppliers'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Retrieve a list of suppliers
 *     description: Fetches a paginated list of suppliers from the database.
 *     tags: [Suppliers]
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
 *         description: A list of suppliers
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
 *                       supplier_id:
 *                         type: number
 *                       supplier_name:
 *                         type: string
 *                       contact_name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       address:
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
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Retrieve a single suppliers by ID
 *     description: Fetches a suppliers by its ID.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The suppliers ID
 *     responses:
 *       200:
 *         description: A single suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     supplier_id:
 *                       type: number
 *                     supplier_name:
 *                       type: string
 *                     contact_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Suppliers not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a new suppliers
 *     description: Creates a new suppliers.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_id
 *             properties:
 *               supplier_id:
 *                 type: number
 *                 description: The supplier_id of the suppliers
 *               supplier_name:
 *                 type: string
 *                 description: The supplier_name of the suppliers
 *               contact_name:
 *                 type: string
 *                 description: The contact_name of the suppliers
 *               phone:
 *                 type: string
 *                 description: The phone of the suppliers
 *               email:
 *                 type: string
 *                 description: The email of the suppliers
 *               address:
 *                 type: string
 *                 description: The address of the suppliers
 *               created_at:
 *                 type: string
 *                 description: The created_at of the suppliers
 *     responses:
 *       201:
 *         description: Suppliers created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     supplier_id:
 *                       type: number
 *                     supplier_name:
 *                       type: string
 *                     contact_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Suppliers already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...suppliersValidation], validate, insert);
/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   put:
 *     summary: Update a suppliers by ID
 *     description: Updates an existing suppliers.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The suppliers ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_id
 *             properties:
 *               supplier_id:
 *                 type: number
 *                 description: The supplier_id of the suppliers
 *               supplier_name:
 *                 type: string
 *                 description: The supplier_name of the suppliers
 *               contact_name:
 *                 type: string
 *                 description: The contact_name of the suppliers
 *               phone:
 *                 type: string
 *                 description: The phone of the suppliers
 *               email:
 *                 type: string
 *                 description: The email of the suppliers
 *               address:
 *                 type: string
 *                 description: The address of the suppliers
 *               created_at:
 *                 type: string
 *                 description: The created_at of the suppliers
 *     responses:
 *       200:
 *         description: Suppliers updated
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
 *         description: Suppliers not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...suppliersValidation], validate, update);
/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   delete:
 *     summary: Delete a suppliers by ID
 *     description: Deletes a suppliers by its ID.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The suppliers ID
 *     responses:
 *       200:
 *         description: Suppliers deleted
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
 *         description: Suppliers not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletesuppliers);
export default router;
