import express from 'express';
import { getAll, getById, insert, update, deleteproducts } from '../controllers/products.controller.js';
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
const productsValidation = validationConfig['products'] || [
	body('product_id').optional(),
	body('product_name').optional(),
	body('brand_id').optional(),
	body('category_id').optional(),
	body('price').optional(),
	body('discount_price').optional(),
	body('description').optional(),
	body('specifications').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['products'].getAll === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['products'].getAll)];
const getByIdMiddleware = routeConfig['products'].getById === 'public' ? [] : [authenticateJWT, restrictTo(routeConfig['products'].getById)];
const insertMiddleware = routeConfig['products'].insert === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['products'].insert), csrfProtection];
const updateMiddleware = routeConfig['products'].update === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['products'].update), csrfProtection];
const deleteMiddleware = routeConfig['products'].delete === 'public' ? [csrfProtection] : [authenticateJWT, restrictTo(routeConfig['products'].delete), csrfProtection];
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Fetches a paginated list of products from the database.
 *     tags: [Products]
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
 *         description: A list of products
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
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *                       brand_id:
 *                         type: number
 *                       category_id:
 *                         type: number
 *                       price:
 *                         type: number
 *                       discount_price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       specifications:
 *                         type: string
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
 * /api/v1/products/{id}:
 *   get:
 *     summary: Retrieve a single products by ID
 *     description: Fetches a products by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The products ID
 *     responses:
 *       200:
 *         description: A single products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     product_name:
 *                       type: string
 *                     brand_id:
 *                       type: number
 *                     category_id:
 *                       type: number
 *                     price:
 *                       type: number
 *                     discount_price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     specifications:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);
/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new products
 *     description: Creates a new products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: number
 *                 description: The product_id of the products
 *               product_name:
 *                 type: string
 *                 description: The product_name of the products
 *               brand_id:
 *                 type: number
 *                 description: The brand_id of the products
 *               category_id:
 *                 type: number
 *                 description: The category_id of the products
 *               price:
 *                 type: number
 *                 description: The price of the products
 *               discount_price:
 *                 type: number
 *                 description: The discount_price of the products
 *               description:
 *                 type: string
 *                 description: The description of the products
 *               specifications:
 *                 type: string
 *                 description: The specifications of the products
 *               created_at:
 *                 type: string
 *                 description: The created_at of the products
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the products
 *     responses:
 *       201:
 *         description: Products created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     product_name:
 *                       type: string
 *                     brand_id:
 *                       type: number
 *                     category_id:
 *                       type: number
 *                     price:
 *                       type: number
 *                     discount_price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     specifications:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Products already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...productsValidation], validate, insert);
/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a products by ID
 *     description: Updates an existing products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The products ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: number
 *                 description: The product_id of the products
 *               product_name:
 *                 type: string
 *                 description: The product_name of the products
 *               brand_id:
 *                 type: number
 *                 description: The brand_id of the products
 *               category_id:
 *                 type: number
 *                 description: The category_id of the products
 *               price:
 *                 type: number
 *                 description: The price of the products
 *               discount_price:
 *                 type: number
 *                 description: The discount_price of the products
 *               description:
 *                 type: string
 *                 description: The description of the products
 *               specifications:
 *                 type: string
 *                 description: The specifications of the products
 *               created_at:
 *                 type: string
 *                 description: The created_at of the products
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the products
 *     responses:
 *       200:
 *         description: Products updated
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
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...productsValidation], validate, update);
/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a products by ID
 *     description: Deletes a products by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The products ID
 *     responses:
 *       200:
 *         description: Products deleted
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
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproducts);
export default router;
