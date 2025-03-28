import { getAllPromotions, getPromotionsById, createPromotions, updatePromotions, deletePromotions } from '../services/promotions.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllPromotions({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all promotions failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table promotions does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching promotions: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getPromotionsById(id);
		if (!data) return res.status(404).json({ message: `promotions not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching promotions: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const promotions = req.body;
	try {
		const data = await createPromotions(promotions);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert promotions failed: ${error.message}`, { data: promotions, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `promotions already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting promotions: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const promotions = req.body;
	try {
		const success = await updatePromotions(id, promotions);
		if (!success) return res.status(404).json({ message: `promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update promotions failed: ${error.message}`, { id, data: promotions, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating promotions: ${error.message}` });
		}
	}
};

export const deletepromotions = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deletePromotions(id);
		if (!success) return res.status(404).json({ message: `promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete promotions failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting promotions: ${error.message}` });
		}
	}
};
