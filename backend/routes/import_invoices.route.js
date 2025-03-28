import express from 'express';
import { getAll, getById, insert, update, deleteimport_invoices } from '../controllers/import_invoices.controller.js';
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
const import_invoicesValidation = validationConfig['import_invoices'] || [
	body('invoice_id').optional(),
	body('supplier_id').optional(),
	body('staff_id').optional(),
	body('total_amount').optional(),
	body('invoice_date').optional(),
	body('warehouse_id').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['import_invoices'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['import_invoices'].getAll)];
const getByIdMiddleware = routeConfig['import_invoices'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['import_invoices'].getById)];
const insertMiddleware = routeConfig['import_invoices'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoices'].insert), csrfProtection];
const updateMiddleware = routeConfig['import_invoices'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoices'].update), csrfProtection];
const deleteMiddleware = routeConfig['import_invoices'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoices'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/import_invoices:
 *   get:
 *     summary: Retrieve a list of import_invoices
 *     description: Fetches a paginated list of import_invoices from the database.
 *     tags: [Import_invoices]
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
 *         description: A list of import_invoices
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
 *                       invoice_id:
 *                         type: number
 *                       supplier_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       invoice_date:
 *                         type: string
 *                       warehouse_id:
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
 * /api/v1/import_invoices/{id}:
 *   get:
 *     summary: Retrieve a single import_invoices by ID
 *     description: Fetches a import_invoices by its ID.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoices ID
 *     responses:
 *       200:
 *         description: A single import_invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_id:
 *                       type: number
 *                     supplier_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     invoice_date:
 *                       type: string
 *                     warehouse_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Import_invoices not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/import_invoices:
 *   post:
 *     summary: Create a new import_invoices
 *     description: Creates a new import_invoices.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *             properties:
 *               invoice_id:
 *                 type: number
 *                 description: The invoice_id of the import_invoices
 *               supplier_id:
 *                 type: number
 *                 description: The supplier_id of the import_invoices
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the import_invoices
 *               total_amount:
 *                 type: number
 *                 description: The total_amount of the import_invoices
 *               invoice_date:
 *                 type: string
 *                 description: The invoice_date of the import_invoices
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the import_invoices
 *               created_at:
 *                 type: string
 *                 description: The created_at of the import_invoices
 *     responses:
 *       201:
 *         description: Import_invoices created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_id:
 *                       type: number
 *                     supplier_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     invoice_date:
 *                       type: string
 *                     warehouse_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Import_invoices already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...import_invoicesValidation], validate, insert);
/**
 * @swagger
 * /api/v1/import_invoices/{id}:
 *   put:
 *     summary: Update a import_invoices by ID
 *     description: Updates an existing import_invoices.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoices ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *             properties:
 *               invoice_id:
 *                 type: number
 *                 description: The invoice_id of the import_invoices
 *               supplier_id:
 *                 type: number
 *                 description: The supplier_id of the import_invoices
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the import_invoices
 *               total_amount:
 *                 type: number
 *                 description: The total_amount of the import_invoices
 *               invoice_date:
 *                 type: string
 *                 description: The invoice_date of the import_invoices
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the import_invoices
 *               created_at:
 *                 type: string
 *                 description: The created_at of the import_invoices
 *     responses:
 *       200:
 *         description: Import_invoices updated
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
 *         description: Import_invoices not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...import_invoicesValidation], validate, update);
/**
 * @swagger
 * /api/v1/import_invoices/{id}:
 *   delete:
 *     summary: Delete a import_invoices by ID
 *     description: Deletes a import_invoices by its ID.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoices ID
 *     responses:
 *       200:
 *         description: Import_invoices deleted
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
 *         description: Import_invoices not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteimport_invoices);
export default router;
