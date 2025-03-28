import Promotions from '../models/promotions.model.js';
import logger from '../common/logger.js';

export const getAllPromotions = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Promotions.getAll({ limit, offset });
		const [countResult] = await Promotions.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all promotions failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getPromotionsById = async (id) => {
	try {
		const [rows] = await Promotions.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createPromotions = async (promotions) => {
	try {
		if (!promotions || Object.keys(promotions).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Promotions.insert(promotions);
		return { id: result.insertId, ...promotions };
	} catch (error) {
		logger.error(`Create promotions failed: ${error.message}`, { data: promotions, stack: error.stack });
		throw error;
	}
};

export const updatePromotions = async (id, promotions) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!promotions || Object.keys(promotions).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Promotions.update(id, promotions);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update promotions failed: ${error.message}`, { id, data: promotions, stack: error.stack });
		throw error;
	}
};

export const deletePromotions = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Promotions.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete promotions failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
