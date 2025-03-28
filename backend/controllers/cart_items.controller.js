import { getAllCart_items, getCart_itemsById, createCart_items, updateCart_items, deleteCart_items } from '../services/cart_items.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllCart_items({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all cart_items failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table cart_items does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching cart_items: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getCart_itemsById(id);
		if (!data) return res.status(404).json({ message: `cart_items not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get cart_items by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching cart_items: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const cart_items = req.body;
	try {
		const data = await createCart_items(cart_items);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert cart_items failed: ${error.message}`, { data: cart_items, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `cart_items already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting cart_items: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const cart_items = req.body;
	try {
		const success = await updateCart_items(id, cart_items);
		if (!success) return res.status(404).json({ message: `cart_items not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update cart_items failed: ${error.message}`, { id, data: cart_items, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating cart_items: ${error.message}` });
		}
	}
};

export const deletecart_items = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteCart_items(id);
		if (!success) return res.status(404).json({ message: `cart_items not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete cart_items failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting cart_items: ${error.message}` });
		}
	}
};
