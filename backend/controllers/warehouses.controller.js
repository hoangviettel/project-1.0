import { getAllWarehouses, getWarehousesById, createWarehouses, updateWarehouses, deleteWarehouses } from '../services/warehouses.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllWarehouses({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all warehouses failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table warehouses does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching warehouses: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getWarehousesById(id);
		if (!data) return res.status(404).json({ message: `warehouses not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get warehouses by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching warehouses: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const warehouses = req.body;
	try {
		const data = await createWarehouses(warehouses);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert warehouses failed: ${error.message}`, { data: warehouses, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `warehouses already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting warehouses: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const warehouses = req.body;
	try {
		const success = await updateWarehouses(id, warehouses);
		if (!success) return res.status(404).json({ message: `warehouses not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update warehouses failed: ${error.message}`, { id, data: warehouses, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating warehouses: ${error.message}` });
		}
	}
};

export const deletewarehouses = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteWarehouses(id);
		if (!success) return res.status(404).json({ message: `warehouses not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete warehouses failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting warehouses: ${error.message}` });
		}
	}
};
