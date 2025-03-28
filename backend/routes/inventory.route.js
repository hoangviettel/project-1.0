import express from 'express';
import { getAll, getById, insert, update, deleteinventory } from '../controllers/inventory.controller.js';
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
const inventoryValidation = validationConfig['inventory'] || [
	body('inventory_id').optional(),
	body('product_id').optional(),
	body('warehouse_id').optional(),
	body('stock').optional(),
	body('last_updated').optional(),
];
const getAllMiddleware = routeConfig['inventory'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['inventory'].getAll)];
const getByIdMiddleware = routeConfig['inventory'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['inventory'].getById)];
const insertMiddleware = routeConfig['inventory'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['inventory'].insert), csrfProtection];
const updateMiddleware = routeConfig['inventory'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['inventory'].update), csrfProtection];
const deleteMiddleware = routeConfig['inventory'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['inventory'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Retrieve a list of inventory
 *     description: Fetches a paginated list of inventory from the database.
 *     tags: [Inventory]
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
 *         description: A list of inventory
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
 *                       inventory_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       warehouse_id:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       last_updated:
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
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Retrieve a single inventory by ID
 *     description: Fetches a inventory by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory ID
 *     responses:
 *       200:
 *         description: A single inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     inventory_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *                     stock:
 *                       type: number
 *                     last_updated:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/inventory:
 *   post:
 *     summary: Create a new inventory
 *     description: Creates a new inventory.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventory_id
 *             properties:
 *               inventory_id:
 *                 type: number
 *                 description: The inventory_id of the inventory
 *               product_id:
 *                 type: number
 *                 description: The product_id of the inventory
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the inventory
 *               stock:
 *                 type: number
 *                 description: The stock of the inventory
 *               last_updated:
 *                 type: string
 *                 description: The last_updated of the inventory
 *     responses:
 *       201:
 *         description: Inventory created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     inventory_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *                     stock:
 *                       type: number
 *                     last_updated:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Inventory already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...inventoryValidation], validate, insert);
/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   put:
 *     summary: Update a inventory by ID
 *     description: Updates an existing inventory.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventory_id
 *             properties:
 *               inventory_id:
 *                 type: number
 *                 description: The inventory_id of the inventory
 *               product_id:
 *                 type: number
 *                 description: The product_id of the inventory
 *               warehouse_id:
 *                 type: number
 *                 description: The warehouse_id of the inventory
 *               stock:
 *                 type: number
 *                 description: The stock of the inventory
 *               last_updated:
 *                 type: string
 *                 description: The last_updated of the inventory
 *     responses:
 *       200:
 *         description: Inventory updated
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
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...inventoryValidation], validate, update);
/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   delete:
 *     summary: Delete a inventory by ID
 *     description: Deletes a inventory by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory ID
 *     responses:
 *       200:
 *         description: Inventory deleted
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
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteinventory);
export default router;
