import db from '../common/db.js';
import logger from '../common/logger.js';

class Order_promotions {
	constructor(order_promotions) {
		this.order_promotion_id = order_promotions.order_promotion_id;
		this.order_id = order_promotions.order_id;
		this.promotion_id = order_promotions.promotion_id;
		this.applied_discount = order_promotions.applied_discount;
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
		const sql = 'SELECT * FROM order_promotions LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM order_promotions';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM order_promotions WHERE order_promotion_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(order_promotions) {
		const sql = 'INSERT INTO order_promotions SET ?';
		return await this.query(sql, order_promotions);
	}

	static async update(id, order_promotions) {
		const sql = 'UPDATE order_promotions SET ? WHERE order_promotion_id = ?';
		return await this.query(sql, [order_promotions, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM order_promotions WHERE order_promotion_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Order_promotions;
