import { getAllRefresh_tokens, getRefresh_tokensById, createRefresh_tokens, updateRefresh_tokens, deleteRefresh_tokens } from '../services/refresh_tokens.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllRefresh_tokens({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all refresh_tokens failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table refresh_tokens does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching refresh_tokens: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getRefresh_tokensById(id);
		if (!data) return res.status(404).json({ message: `refresh_tokens not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get refresh_tokens by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching refresh_tokens: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const refresh_tokens = req.body;
	try {
		const data = await createRefresh_tokens(refresh_tokens);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert refresh_tokens failed: ${error.message}`, { data: refresh_tokens, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `refresh_tokens already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting refresh_tokens: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const refresh_tokens = req.body;
	try {
		const success = await updateRefresh_tokens(id, refresh_tokens);
		if (!success) return res.status(404).json({ message: `refresh_tokens not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update refresh_tokens failed: ${error.message}`, { id, data: refresh_tokens, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating refresh_tokens: ${error.message}` });
		}
	}
};

export const deleterefresh_tokens = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteRefresh_tokens(id);
		if (!success) return res.status(404).json({ message: `refresh_tokens not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete refresh_tokens failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting refresh_tokens: ${error.message}` });
		}
	}
};
