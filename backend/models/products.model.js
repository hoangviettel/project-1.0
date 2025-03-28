import db from '../common/db.js';
import logger from '../common/logger.js';

class Products {
	constructor(products) {
		this.product_id = products.product_id;
		this.product_name = products.product_name;
		this.brand_id = products.brand_id;
		this.category_id = products.category_id;
		this.price = products.price;
		this.discount_price = products.discount_price;
		this.description = products.description;
		this.specifications = products.specifications;
		this.created_at = products.created_at;
		this.updated_at = products.updated_at;
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
		const sql = 'SELECT * FROM products LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM products';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM products WHERE product_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(products) {
		const sql = 'INSERT INTO products SET ?';
		return await this.query(sql, products);
	}

	static async update(id, products) {
		const sql = 'UPDATE products SET ? WHERE product_id = ?';
		return await this.query(sql, [products, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM products WHERE product_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Products;
