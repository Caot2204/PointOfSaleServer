import { User } from '../db/dbConnection.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

/**
 * Repository for User entity, responsable of control the datasource operations.
 * 
 * The data source can be changed, whether local or remote, and the controller does not know where the data is.
 */
class UserRepository {

    async insertUser(name, password, isAdmin) {
        if (this.#validateUserData(name, password, isAdmin)) {
            const encryptPassword = await bcrypt.hash(password, Number(process.env.SALT_FOR_HASH));
            await User.create({ name: name, password: encryptPassword, isAdmin: isAdmin });
        }
    }

    async updateUser(id, name, password, isAdmin) {
        if (this.#validateUserData(name, password, isAdmin)) {
            const user = await this.getOneUser(id);

            if (password != user.password) {
                const encryptPassword = await bcrypt.hash(password, Number(process.env.SALT_FOR_HASH));
                user.set({ password: encryptPassword });
            }

            user.set({ name: name, isAdmin: isAdmin });

            await user.save();
        }
    }

    async deleteUser(id) {
        const user = await this.getOneUser(id);
        await user.destroy();
    }

    async getAllUsers() {
        const users = await User.findAll({
            attributes: ['id', 'name', 'isAdmin']
        });
        users.every(user => user instanceof User);
        return users;
    }

    async getOneUser(id) {
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            throw Error("User not exists");
        }
        return user;
    }

    async getUserByName(name) {
        const user = await User.findOne({ where: { name: name } });
        if (!user) {
            throw Error("User not exists");
        }
        return user;
    }

    async isAdminUser(userName) {
        const user = await this.getUserByName(userName);
        return user.isAdmin;
    }

    #validateUserData(name, password, isAdmin) {
        if (!name) throw Error("Please send de user name");
        if (!password) throw Error("Please send password");
        if (isAdmin == null) throw Error("Please specify if the user is admin or not");
        return true;
    }

}

export default new UserRepository();