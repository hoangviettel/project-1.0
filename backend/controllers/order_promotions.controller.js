import { getAllOrder_promotions, getOrder_promotionsById, createOrder_promotions, updateOrder_promotions, deleteOrder_promotions } from '../services/order_promotions.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllOrder_promotions({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all order_promotions failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table order_promotions does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching order_promotions: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getOrder_promotionsById(id);
		if (!data) return res.status(404).json({ message: `order_promotions not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get order_promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching order_promotions: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const order_promotions = req.body;
	try {
		const data = await createOrder_promotions(order_promotions);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert order_promotions failed: ${error.message}`, { data: order_promotions, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `order_promotions already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting order_promotions: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const order_promotions = req.body;
	try {
		const success = await updateOrder_promotions(id, order_promotions);
		if (!success) return res.status(404).json({ message: `order_promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update order_promotions failed: ${error.message}`, { id, data: order_promotions, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating order_promotions: ${error.message}` });
		}
	}
};

export const deleteorder_promotions = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteOrder_promotions(id);
		if (!success) return res.status(404).json({ message: `order_promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete order_promotions failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting order_promotions: ${error.message}` });
		}
	}
};
