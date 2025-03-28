import Refresh_tokens from '../models/refresh_tokens.model.js';
import logger from '../common/logger.js';

export const getAllRefresh_tokens = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Refresh_tokens.getAll({ limit, offset });
		const [countResult] = await Refresh_tokens.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all refresh_tokens failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getRefresh_tokensById = async (id) => {
	try {
		const [rows] = await Refresh_tokens.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get refresh_tokens by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createRefresh_tokens = async (refresh_tokens) => {
	try {
		if (!refresh_tokens || Object.keys(refresh_tokens).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Refresh_tokens.insert(refresh_tokens);
		return { id: result.insertId, ...refresh_tokens };
	} catch (error) {
		logger.error(`Create refresh_tokens failed: ${error.message}`, { data: refresh_tokens, stack: error.stack });
		throw error;
	}
};

export const updateRefresh_tokens = async (id, refresh_tokens) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!refresh_tokens || Object.keys(refresh_tokens).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Refresh_tokens.update(id, refresh_tokens);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update refresh_tokens failed: ${error.message}`, { id, data: refresh_tokens, stack: error.stack });
		throw error;
	}
};

export const deleteRefresh_tokens = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Refresh_tokens.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete refresh_tokens failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
