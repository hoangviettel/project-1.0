import db from '../common/db.js';
import logger from '../common/logger.js';

class Cart_items {
	constructor(cart_items) {
		this.cart_item_id = cart_items.cart_item_id;
		this.cart_id = cart_items.cart_id;
		this.product_id = cart_items.product_id;
		this.quantity = cart_items.quantity;
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
		const sql = 'SELECT * FROM cart_items LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM cart_items';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM cart_items WHERE cart_item_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(cart_items) {
		const sql = 'INSERT INTO cart_items SET ?';
		return await this.query(sql, cart_items);
	}

	static async update(id, cart_items) {
		const sql = 'UPDATE cart_items SET ? WHERE cart_item_id = ?';
		return await this.query(sql, [cart_items, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM cart_items WHERE cart_item_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Cart_items;
