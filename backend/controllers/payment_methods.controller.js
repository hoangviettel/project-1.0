import { getAllPayment_methods, getPayment_methodsById, createPayment_methods, updatePayment_methods, deletePayment_methods } from '../services/payment_methods.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllPayment_methods({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all payment_methods failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table payment_methods does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching payment_methods: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getPayment_methodsById(id);
		if (!data) return res.status(404).json({ message: `payment_methods not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get payment_methods by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching payment_methods: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const payment_methods = req.body;
	try {
		const data = await createPayment_methods(payment_methods);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert payment_methods failed: ${error.message}`, { data: payment_methods, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `payment_methods already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting payment_methods: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const payment_methods = req.body;
	try {
		const success = await updatePayment_methods(id, payment_methods);
		if (!success) return res.status(404).json({ message: `payment_methods not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update payment_methods failed: ${error.message}`, { id, data: payment_methods, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating payment_methods: ${error.message}` });
		}
	}
};

export const deletepayment_methods = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deletePayment_methods(id);
		if (!success) return res.status(404).json({ message: `payment_methods not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete payment_methods failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting payment_methods: ${error.message}` });
		}
	}
};
