const Model = require('../model');

class User extends Model {
    constructor(attributes) {
        super('users', attributes);
        this.id = attributes.id;
        this.login = attributes.login;
        this.password = attributes.password;
        this.email = attributes.email;
        this.searching = attributes.searching;
    }
}

module.exports = User;