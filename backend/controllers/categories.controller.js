import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories } from '../services/categories.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllCategories({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all categories failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table categories does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching categories: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getCategoriesById(id);
		if (!data) return res.status(404).json({ message: `categories not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get categories by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching categories: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const categories = req.body;
	try {
		const data = await createCategories(categories);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert categories failed: ${error.message}`, { data: categories, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `categories already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting categories: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const categories = req.body;
	try {
		const success = await updateCategories(id, categories);
		if (!success) return res.status(404).json({ message: `categories not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update categories failed: ${error.message}`, { id, data: categories, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating categories: ${error.message}` });
		}
	}
};

export const deletecategories = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteCategories(id);
		if (!success) return res.status(404).json({ message: `categories not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete categories failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting categories: ${error.message}` });
		}
	}
};
