import { getAllCustomers, getCustomersById, createCustomers, updateCustomers, deleteCustomers } from '../services/customers.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllCustomers({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all customers failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table customers does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching customers: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getCustomersById(id);
		if (!data) return res.status(404).json({ message: `customers not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get customers by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching customers: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const customers = req.body;
	try {
		const data = await createCustomers(customers);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert customers failed: ${error.message}`, { data: customers, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `customers already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting customers: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const customers = req.body;
	try {
		const success = await updateCustomers(id, customers);
		if (!success) return res.status(404).json({ message: `customers not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update customers failed: ${error.message}`, { id, data: customers, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating customers: ${error.message}` });
		}
	}
};

export const deletecustomers = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteCustomers(id);
		if (!success) return res.status(404).json({ message: `customers not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete customers failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting customers: ${error.message}` });
		}
	}
};
