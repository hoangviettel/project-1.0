import db from '../common/db.js';
import logger from '../common/logger.js';

class Orders {
	constructor(orders) {
		this.order_id = orders.order_id;
		this.customer_id = orders.customer_id;
		this.staff_id = orders.staff_id;
		this.total_amount = orders.total_amount;
		this.order_status = orders.order_status;
		this.shipping_method_id = orders.shipping_method_id;
		this.shipping_address = orders.shipping_address;
		this.method_id = orders.method_id;
		this.payment_status = orders.payment_status;
		this.created_at = orders.created_at;
		this.updated_at = orders.updated_at;
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
		const sql = 'SELECT * FROM orders LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM orders';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM orders WHERE order_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(orders) {
		const sql = 'INSERT INTO orders SET ?';
		return await this.query(sql, orders);
	}

	static async update(id, orders) {
		const sql = 'UPDATE orders SET ? WHERE order_id = ?';
		return await this.query(sql, [orders, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM orders WHERE order_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Orders;
