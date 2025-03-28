import express from 'express';
import { getAll, getById, insert, update, deletepromotions } from '../controllers/promotions.controller.js';
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
const promotionsValidation = validationConfig['promotions'] || [
	body('promotion_id').optional(),
	body('promotion_code').optional(),
	body('description').optional(),
	body('discount_type').optional(),
	body('discount_value').optional(),
	body('min_order_value').optional(),
	body('start_date').optional(),
	body('end_date').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['promotions'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['promotions'].getAll)];
const getByIdMiddleware = routeConfig['promotions'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['promotions'].getById)];
const insertMiddleware = routeConfig['promotions'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['promotions'].insert), csrfProtection];
const updateMiddleware = routeConfig['promotions'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['promotions'].update), csrfProtection];
const deleteMiddleware = routeConfig['promotions'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['promotions'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/promotions:
 *   get:
 *     summary: Retrieve a list of promotions
 *     description: Fetches a paginated list of promotions from the database.
 *     tags: [Promotions]
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
 *         description: A list of promotions
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
 *                       promotion_id:
 *                         type: number
 *                       promotion_code:
 *                         type: string
 *                       description:
 *                         type: string
 *                       discount_type:
 *                         type: string
 *                       discount_value:
 *                         type: number
 *                       min_order_value:
 *                         type: number
 *                       start_date:
 *                         type: string
 *                       end_date:
 *                         type: string
 *                       is_active:
 *                         type: number
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
 * /api/v1/promotions/{id}:
 *   get:
 *     summary: Retrieve a single promotions by ID
 *     description: Fetches a promotions by its ID.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The promotions ID
 *     responses:
 *       200:
 *         description: A single promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     promotion_id:
 *                       type: number
 *                     promotion_code:
 *                       type: string
 *                     description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     min_order_value:
 *                       type: number
 *                     start_date:
 *                       type: string
 *                     end_date:
 *                       type: string
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Promotions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/promotions:
 *   post:
 *     summary: Create a new promotions
 *     description: Creates a new promotions.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotion_id
 *             properties:
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the promotions
 *               promotion_code:
 *                 type: string
 *                 description: The promotion_code of the promotions
 *               description:
 *                 type: string
 *                 description: The description of the promotions
 *               discount_type:
 *                 type: string
 *                 description: The discount_type of the promotions
 *               discount_value:
 *                 type: number
 *                 description: The discount_value of the promotions
 *               min_order_value:
 *                 type: number
 *                 description: The min_order_value of the promotions
 *               start_date:
 *                 type: string
 *                 description: The start_date of the promotions
 *               end_date:
 *                 type: string
 *                 description: The end_date of the promotions
 *               is_active:
 *                 type: number
 *                 description: The is_active of the promotions
 *               created_at:
 *                 type: string
 *                 description: The created_at of the promotions
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the promotions
 *     responses:
 *       201:
 *         description: Promotions created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     promotion_id:
 *                       type: number
 *                     promotion_code:
 *                       type: string
 *                     description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     min_order_value:
 *                       type: number
 *                     start_date:
 *                       type: string
 *                     end_date:
 *                       type: string
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Promotions already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...promotionsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/promotions/{id}:
 *   put:
 *     summary: Update a promotions by ID
 *     description: Updates an existing promotions.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The promotions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotion_id
 *             properties:
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the promotions
 *               promotion_code:
 *                 type: string
 *                 description: The promotion_code of the promotions
 *               description:
 *                 type: string
 *                 description: The description of the promotions
 *               discount_type:
 *                 type: string
 *                 description: The discount_type of the promotions
 *               discount_value:
 *                 type: number
 *                 description: The discount_value of the promotions
 *               min_order_value:
 *                 type: number
 *                 description: The min_order_value of the promotions
 *               start_date:
 *                 type: string
 *                 description: The start_date of the promotions
 *               end_date:
 *                 type: string
 *                 description: The end_date of the promotions
 *               is_active:
 *                 type: number
 *                 description: The is_active of the promotions
 *               created_at:
 *                 type: string
 *                 description: The created_at of the promotions
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the promotions
 *     responses:
 *       200:
 *         description: Promotions updated
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
 *         description: Promotions not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...promotionsValidation], validate, update);
/**
 * @swagger
 * /api/v1/promotions/{id}:
 *   delete:
 *     summary: Delete a promotions by ID
 *     description: Deletes a promotions by its ID.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The promotions ID
 *     responses:
 *       200:
 *         description: Promotions deleted
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
 *         description: Promotions not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletepromotions);
export default router;
