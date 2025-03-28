import express from 'express';
import { getAll, getById, insert, update, deletereviews } from '../controllers/reviews.controller.js';
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
const reviewsValidation = validationConfig['reviews'] || [
	body('review_id').optional(),
	body('customer_id').optional(),
	body('product_id').optional(),
	body('rating').optional(),
	body('comment').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['reviews'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['reviews'].getAll)];
const getByIdMiddleware = routeConfig['reviews'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['reviews'].getById)];
const insertMiddleware = routeConfig['reviews'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['reviews'].insert), csrfProtection];
const updateMiddleware = routeConfig['reviews'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['reviews'].update), csrfProtection];
const deleteMiddleware = routeConfig['reviews'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['reviews'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Retrieve a list of reviews
 *     description: Fetches a paginated list of reviews from the database.
 *     tags: [Reviews]
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
 *         description: A list of reviews
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
 *                       review_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       comment:
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
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Retrieve a single reviews by ID
 *     description: Fetches a reviews by its ID.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reviews ID
 *     responses:
 *       200:
 *         description: A single reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     rating:
 *                       type: number
 *                     comment:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reviews not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Create a new reviews
 *     description: Creates a new reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review_id
 *             properties:
 *               review_id:
 *                 type: number
 *                 description: The review_id of the reviews
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the reviews
 *               product_id:
 *                 type: number
 *                 description: The product_id of the reviews
 *               rating:
 *                 type: number
 *                 description: The rating of the reviews
 *               comment:
 *                 type: string
 *                 description: The comment of the reviews
 *               created_at:
 *                 type: string
 *                 description: The created_at of the reviews
 *     responses:
 *       201:
 *         description: Reviews created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     rating:
 *                       type: number
 *                     comment:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Reviews already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...reviewsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Update a reviews by ID
 *     description: Updates an existing reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reviews ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review_id
 *             properties:
 *               review_id:
 *                 type: number
 *                 description: The review_id of the reviews
 *               customer_id:
 *                 type: number
 *                 description: The customer_id of the reviews
 *               product_id:
 *                 type: number
 *                 description: The product_id of the reviews
 *               rating:
 *                 type: number
 *                 description: The rating of the reviews
 *               comment:
 *                 type: string
 *                 description: The comment of the reviews
 *               created_at:
 *                 type: string
 *                 description: The created_at of the reviews
 *     responses:
 *       200:
 *         description: Reviews updated
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
 *         description: Reviews not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...reviewsValidation], validate, update);
/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a reviews by ID
 *     description: Deletes a reviews by its ID.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reviews ID
 *     responses:
 *       200:
 *         description: Reviews deleted
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
 *         description: Reviews not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletereviews);
export default router;
