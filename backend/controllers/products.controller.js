import { getAllProducts, getProductsById, createProducts, updateProducts, deleteProducts } from '../services/products.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllProducts({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all products failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table products does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching products: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getProductsById(id);
		if (!data) return res.status(404).json({ message: `products not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get products by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching products: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const products = req.body;
	try {
		const data = await createProducts(products);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert products failed: ${error.message}`, { data: products, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `products already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting products: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const products = req.body;
	try {
		const success = await updateProducts(id, products);
		if (!success) return res.status(404).json({ message: `products not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update products failed: ${error.message}`, { id, data: products, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating products: ${error.message}` });
		}
	}
};

export const deleteproducts = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteProducts(id);
		if (!success) return res.status(404).json({ message: `products not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete products failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting products: ${error.message}` });
		}
	}
};
