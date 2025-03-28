import { getAllCarts, getCartsById, createCarts, updateCarts, deleteCarts } from '../services/carts.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllCarts({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all carts failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table carts does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching carts: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getCartsById(id);
		if (!data) return res.status(404).json({ message: `carts not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get carts by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching carts: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const carts = req.body;
	try {
		const data = await createCarts(carts);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert carts failed: ${error.message}`, { data: carts, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `carts already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting carts: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const carts = req.body;
	try {
		const success = await updateCarts(id, carts);
		if (!success) return res.status(404).json({ message: `carts not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update carts failed: ${error.message}`, { id, data: carts, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating carts: ${error.message}` });
		}
	}
};

export const deletecarts = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteCarts(id);
		if (!success) return res.status(404).json({ message: `carts not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete carts failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting carts: ${error.message}` });
		}
	}
};
