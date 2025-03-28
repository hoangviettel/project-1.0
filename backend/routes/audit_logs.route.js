import express from 'express';
import { getAll, getById, insert, update, deleteaudit_logs } from '../controllers/audit_logs.controller.js';
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
const audit_logsValidation = validationConfig['audit_logs'] || [
	body('log_id').optional(),
	body('table_name').optional(),
	body('action').optional(),
	body('record_id').optional(),
	body('staff_id').optional(),
	body('details').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['audit_logs'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['audit_logs'].getAll)];
const getByIdMiddleware = routeConfig['audit_logs'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['audit_logs'].getById)];
const insertMiddleware = routeConfig['audit_logs'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['audit_logs'].insert), csrfProtection];
const updateMiddleware = routeConfig['audit_logs'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['audit_logs'].update), csrfProtection];
const deleteMiddleware = routeConfig['audit_logs'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['audit_logs'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/audit_logs:
 *   get:
 *     summary: Retrieve a list of audit_logs
 *     description: Fetches a paginated list of audit_logs from the database.
 *     tags: [Audit_logs]
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
 *         description: A list of audit_logs
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
 *                       log_id:
 *                         type: number
 *                       table_name:
 *                         type: string
 *                       action:
 *                         type: string
 *                       record_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       details:
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
 * /api/v1/audit_logs/{id}:
 *   get:
 *     summary: Retrieve a single audit_logs by ID
 *     description: Fetches a audit_logs by its ID.
 *     tags: [Audit_logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The audit_logs ID
 *     responses:
 *       200:
 *         description: A single audit_logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     log_id:
 *                       type: number
 *                     table_name:
 *                       type: string
 *                     action:
 *                       type: string
 *                     record_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     details:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Audit_logs not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/audit_logs:
 *   post:
 *     summary: Create a new audit_logs
 *     description: Creates a new audit_logs.
 *     tags: [Audit_logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - log_id
 *             properties:
 *               log_id:
 *                 type: number
 *                 description: The log_id of the audit_logs
 *               table_name:
 *                 type: string
 *                 description: The table_name of the audit_logs
 *               action:
 *                 type: string
 *                 description: The action of the audit_logs
 *               record_id:
 *                 type: number
 *                 description: The record_id of the audit_logs
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the audit_logs
 *               details:
 *                 type: string
 *                 description: The details of the audit_logs
 *               created_at:
 *                 type: string
 *                 description: The created_at of the audit_logs
 *     responses:
 *       201:
 *         description: Audit_logs created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     log_id:
 *                       type: number
 *                     table_name:
 *                       type: string
 *                     action:
 *                       type: string
 *                     record_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     details:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Audit_logs already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...audit_logsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/audit_logs/{id}:
 *   put:
 *     summary: Update a audit_logs by ID
 *     description: Updates an existing audit_logs.
 *     tags: [Audit_logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The audit_logs ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - log_id
 *             properties:
 *               log_id:
 *                 type: number
 *                 description: The log_id of the audit_logs
 *               table_name:
 *                 type: string
 *                 description: The table_name of the audit_logs
 *               action:
 *                 type: string
 *                 description: The action of the audit_logs
 *               record_id:
 *                 type: number
 *                 description: The record_id of the audit_logs
 *               staff_id:
 *                 type: number
 *                 description: The staff_id of the audit_logs
 *               details:
 *                 type: string
 *                 description: The details of the audit_logs
 *               created_at:
 *                 type: string
 *                 description: The created_at of the audit_logs
 *     responses:
 *       200:
 *         description: Audit_logs updated
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
 *         description: Audit_logs not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...audit_logsValidation], validate, update);
/**
 * @swagger
 * /api/v1/audit_logs/{id}:
 *   delete:
 *     summary: Delete a audit_logs by ID
 *     description: Deletes a audit_logs by its ID.
 *     tags: [Audit_logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The audit_logs ID
 *     responses:
 *       200:
 *         description: Audit_logs deleted
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
 *         description: Audit_logs not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteaudit_logs);
export default router;
