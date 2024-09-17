const bcrypt = require('bcryptjs');
const connection = require('./config/db');

class Model {
    constructor(tableName, attributes) {
        this.tableName = tableName;
        this.attributes = attributes;
    }

    static async findByProperty(property, value) {
        const [rows] = await connection.query(`SELECT * FROM users WHERE ${property} = ?`, [value]);
        if (rows.length > 0) {
            return new this(rows[0]);
        }
        return null;
    }

    static async find(id) {
        const [rows] = await connection.query(`SELECT * FROM users WHERE id = ?`, [id]);
        if (rows.length > 0) {
            return new this.constructor(rows[0]);
        }
        return null;
    }

    async delete() {
        const findId = await this.constructor.find(this.id);
        if (!findId) {
            throw new Error('Not found');
        }
        const [result] = await connection.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [this.id]);
        return result.affectedRows > 0;
    }

    async save() {
        if (this.attributes.password) {
            this.attributes.password = hashPassword(this.attributes.password);
        }
        const findId = await this.constructor.find(this.id);
        const [rows] = await connection.query(`SELECT * FROM ${this.tableName} WHERE login = ? OR email = ?`, [this.login, this.email]);
        if (rows.length > 0 && rows[0].id !== this.id) {
            throw new Error(`User with login ${this.login} or email ${this.email} already exists.`);
        }
        if (!findId) {
            const [result] = await connection.query(`INSERT INTO ${this.tableName} SET ?`, this.attributes);
            return result.affectedRows > 0;
        } else {
            const updateAttributes = {
                login: this.login,
                password: this.password,
                email: this.email
            };
            const setClause = Object.keys(updateAttributes).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updateAttributes), this.id];
            const [result] = await connection.query(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`, values);
            return result.affectedRows > 0;
        }
    }
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

module.exports = Model;