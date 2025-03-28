import express from 'express';
import { getAll, getById, insert, update, deleteproduct_images } from '../controllers/product_images.controller.js';
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
const product_imagesValidation = validationConfig['product_images'] || [
	body('image_id').optional(),
	body('product_id').optional(),
	body('image_url').optional(),
	body('is_primary').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['product_images'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['product_images'].getAll)];
const getByIdMiddleware = routeConfig['product_images'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['product_images'].getById)];
const insertMiddleware = routeConfig['product_images'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['product_images'].insert), csrfProtection];
const updateMiddleware = routeConfig['product_images'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['product_images'].update), csrfProtection];
const deleteMiddleware = routeConfig['product_images'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['product_images'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/product_images:
 *   get:
 *     summary: Retrieve a list of product_images
 *     description: Fetches a paginated list of product_images from the database.
 *     tags: [Product_images]
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
 *         description: A list of product_images
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
 *                       image_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       image_url:
 *                         type: string
 *                       is_primary:
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
 * /api/v1/product_images/{id}:
 *   get:
 *     summary: Retrieve a single product_images by ID
 *     description: Fetches a product_images by its ID.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_images ID
 *     responses:
 *       200:
 *         description: A single product_images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     image_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     image_url:
 *                       type: string
 *                     is_primary:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product_images not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/product_images:
 *   post:
 *     summary: Create a new product_images
 *     description: Creates a new product_images.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image_id
 *             properties:
 *               image_id:
 *                 type: number
 *                 description: The image_id of the product_images
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_images
 *               image_url:
 *                 type: string
 *                 description: The image_url of the product_images
 *               is_primary:
 *                 type: number
 *                 description: The is_primary of the product_images
 *               created_at:
 *                 type: string
 *                 description: The created_at of the product_images
 *     responses:
 *       201:
 *         description: Product_images created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     image_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     image_url:
 *                       type: string
 *                     is_primary:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Product_images already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...product_imagesValidation], validate, insert);
/**
 * @swagger
 * /api/v1/product_images/{id}:
 *   put:
 *     summary: Update a product_images by ID
 *     description: Updates an existing product_images.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_images ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image_id
 *             properties:
 *               image_id:
 *                 type: number
 *                 description: The image_id of the product_images
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_images
 *               image_url:
 *                 type: string
 *                 description: The image_url of the product_images
 *               is_primary:
 *                 type: number
 *                 description: The is_primary of the product_images
 *               created_at:
 *                 type: string
 *                 description: The created_at of the product_images
 *     responses:
 *       200:
 *         description: Product_images updated
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
 *         description: Product_images not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_imagesValidation], validate, update);
/**
 * @swagger
 * /api/v1/product_images/{id}:
 *   delete:
 *     summary: Delete a product_images by ID
 *     description: Deletes a product_images by its ID.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_images ID
 *     responses:
 *       200:
 *         description: Product_images deleted
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
 *         description: Product_images not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_images);
export default router;
