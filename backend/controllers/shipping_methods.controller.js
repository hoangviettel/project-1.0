import { getAllShipping_methods, getShipping_methodsById, createShipping_methods, updateShipping_methods, deleteShipping_methods } from '../services/shipping_methods.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllShipping_methods({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all shipping_methods failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table shipping_methods does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching shipping_methods: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getShipping_methodsById(id);
		if (!data) return res.status(404).json({ message: `shipping_methods not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get shipping_methods by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching shipping_methods: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const shipping_methods = req.body;
	try {
		const data = await createShipping_methods(shipping_methods);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert shipping_methods failed: ${error.message}`, { data: shipping_methods, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `shipping_methods already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting shipping_methods: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const shipping_methods = req.body;
	try {
		const success = await updateShipping_methods(id, shipping_methods);
		if (!success) return res.status(404).json({ message: `shipping_methods not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update shipping_methods failed: ${error.message}`, { id, data: shipping_methods, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating shipping_methods: ${error.message}` });
		}
	}
};

export const deleteshipping_methods = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteShipping_methods(id);
		if (!success) return res.status(404).json({ message: `shipping_methods not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete shipping_methods failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting shipping_methods: ${error.message}` });
		}
	}
};
