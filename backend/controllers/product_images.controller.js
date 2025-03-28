import { getAllProduct_images, getProduct_imagesById, createProduct_images, updateProduct_images, deleteProduct_images } from '../services/product_images.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllProduct_images({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all product_images failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table product_images does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching product_images: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getProduct_imagesById(id);
		if (!data) return res.status(404).json({ message: `product_images not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get product_images by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching product_images: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const product_images = req.body;
	try {
		const data = await createProduct_images(product_images);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert product_images failed: ${error.message}`, { data: product_images, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `product_images already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting product_images: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const product_images = req.body;
	try {
		const success = await updateProduct_images(id, product_images);
		if (!success) return res.status(404).json({ message: `product_images not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update product_images failed: ${error.message}`, { id, data: product_images, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating product_images: ${error.message}` });
		}
	}
};

export const deleteproduct_images = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteProduct_images(id);
		if (!success) return res.status(404).json({ message: `product_images not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete product_images failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting product_images: ${error.message}` });
		}
	}
};
