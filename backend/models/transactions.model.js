import db from '../common/db.js';
import logger from '../common/logger.js';

class Transactions {
	constructor(transactions) {
		this.transaction_id = transactions.transaction_id;
		this.order_id = transactions.order_id;
		this.method_id = transactions.method_id;
		this.amount = transactions.amount;
		this.transaction_status = transactions.transaction_status;
		this.transaction_date = transactions.transaction_date;
		this.transaction_code = transactions.transaction_code;
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
		const sql = 'SELECT * FROM transactions LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM transactions';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM transactions WHERE transaction_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(transactions) {
		const sql = 'INSERT INTO transactions SET ?';
		return await this.query(sql, transactions);
	}

	static async update(id, transactions) {
		const sql = 'UPDATE transactions SET ? WHERE transaction_id = ?';
		return await this.query(sql, [transactions, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM transactions WHERE transaction_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Transactions;
