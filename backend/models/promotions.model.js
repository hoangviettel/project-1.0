import db from '../common/db.js';
import logger from '../common/logger.js';

class Promotions {
	constructor(promotions) {
		this.promotion_id = promotions.promotion_id;
		this.promotion_code = promotions.promotion_code;
		this.description = promotions.description;
		this.discount_type = promotions.discount_type;
		this.discount_value = promotions.discount_value;
		this.min_order_value = promotions.min_order_value;
		this.start_date = promotions.start_date;
		this.end_date = promotions.end_date;
		this.is_active = promotions.is_active;
		this.created_at = promotions.created_at;
		this.updated_at = promotions.updated_at;
	}

	static async query(sql, params) {
		try {{
			return await db.query(sql, params);
		}} catch (error) {
			logger.error(`Database query error: ${error.message}`, { sql, params, stack: error.stack });
			throw new Error(`Database error: ${error.message}`);
		}
	}

	static async getAll({ limit = 10, offset = 0 } = {}) {
		const sql = 'SELECT * FROM promotions LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM promotions';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM promotions WHERE promotion_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(promotions) {
		const sql = 'INSERT INTO promotions SET ?';
		return await this.query(sql, promotions);
	}

	static async update(id, promotions) {
		const sql = 'UPDATE promotions SET ? WHERE promotion_id = ?';
		return await this.query(sql, [promotions, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM promotions WHERE promotion_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Promotions;
