import express from 'express';
import { getAll, getById, insert, update, deleteimport_invoice_details } from '../controllers/import_invoice_details.controller.js';
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
const import_invoice_detailsValidation = validationConfig['import_invoice_details'] || [
	body('detail_id').optional(),
	body('invoice_id').optional(),
	body('product_id').optional(),
	body('quantity').optional(),
	body('price').optional(),
];
const getAllMiddleware = routeConfig['import_invoice_details'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['import_invoice_details'].getAll)];
const getByIdMiddleware = routeConfig['import_invoice_details'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['import_invoice_details'].getById)];
const insertMiddleware = routeConfig['import_invoice_details'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoice_details'].insert), csrfProtection];
const updateMiddleware = routeConfig['import_invoice_details'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoice_details'].update), csrfProtection];
const deleteMiddleware = routeConfig['import_invoice_details'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['import_invoice_details'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/import_invoice_details:
 *   get:
 *     summary: Retrieve a list of import_invoice_details
 *     description: Fetches a paginated list of import_invoice_details from the database.
 *     tags: [Import_invoice_details]
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
 *         description: A list of import_invoice_details
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
 *                       detail_id:
 *                         type: number
 *                       invoice_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
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
 * /api/v1/import_invoice_details/{id}:
 *   get:
 *     summary: Retrieve a single import_invoice_details by ID
 *     description: Fetches a import_invoice_details by its ID.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoice_details ID
 *     responses:
 *       200:
 *         description: A single import_invoice_details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     invoice_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Import_invoice_details not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/import_invoice_details:
 *   post:
 *     summary: Create a new import_invoice_details
 *     description: Creates a new import_invoice_details.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - detail_id
 *             properties:
 *               detail_id:
 *                 type: number
 *                 description: The detail_id of the import_invoice_details
 *               invoice_id:
 *                 type: number
 *                 description: The invoice_id of the import_invoice_details
 *               product_id:
 *                 type: number
 *                 description: The product_id of the import_invoice_details
 *               quantity:
 *                 type: number
 *                 description: The quantity of the import_invoice_details
 *               price:
 *                 type: number
 *                 description: The price of the import_invoice_details
 *     responses:
 *       201:
 *         description: Import_invoice_details created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     invoice_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Import_invoice_details already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...import_invoice_detailsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/import_invoice_details/{id}:
 *   put:
 *     summary: Update a import_invoice_details by ID
 *     description: Updates an existing import_invoice_details.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoice_details ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - detail_id
 *             properties:
 *               detail_id:
 *                 type: number
 *                 description: The detail_id of the import_invoice_details
 *               invoice_id:
 *                 type: number
 *                 description: The invoice_id of the import_invoice_details
 *               product_id:
 *                 type: number
 *                 description: The product_id of the import_invoice_details
 *               quantity:
 *                 type: number
 *                 description: The quantity of the import_invoice_details
 *               price:
 *                 type: number
 *                 description: The price of the import_invoice_details
 *     responses:
 *       200:
 *         description: Import_invoice_details updated
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
 *         description: Import_invoice_details not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...import_invoice_detailsValidation], validate, update);
/**
 * @swagger
 * /api/v1/import_invoice_details/{id}:
 *   delete:
 *     summary: Delete a import_invoice_details by ID
 *     description: Deletes a import_invoice_details by its ID.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoice_details ID
 *     responses:
 *       200:
 *         description: Import_invoice_details deleted
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
 *         description: Import_invoice_details not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteimport_invoice_details);
export default router;
