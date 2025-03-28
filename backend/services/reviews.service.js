import Reviews from '../models/reviews.model.js';
import logger from '../common/logger.js';

export const getAllReviews = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Reviews.getAll({ limit, offset });
		const [countResult] = await Reviews.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all reviews failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getReviewsById = async (id) => {
	try {
		const [rows] = await Reviews.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get reviews by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createReviews = async (reviews) => {
	try {
		if (!reviews || Object.keys(reviews).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Reviews.insert(reviews);
		return { id: result.insertId, ...reviews };
	} catch (error) {
		logger.error(`Create reviews failed: ${error.message}`, { data: reviews, stack: error.stack });
		throw error;
	}
};

export const updateReviews = async (id, reviews) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!reviews || Object.keys(reviews).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Reviews.update(id, reviews);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update reviews failed: ${error.message}`, { id, data: reviews, stack: error.stack });
		throw error;
	}
};

export const deleteReviews = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Reviews.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete reviews failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
