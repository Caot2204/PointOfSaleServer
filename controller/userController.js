import userRepository from "../datasource/repository/userRepository.js";
import { generateToken } from '../authentication/authentication.js';
import bcrypt from "bcryptjs";

/**
 * Controller for User routes in the server.
 */
class UserController {

    /**
     * Save a new user in the database
     * @param {*} req 
     * @param {*} res 
     */
    async saveUser(req, res) {
        try {
            const { name, password, isAdmin } = req.body;
            await userRepository.insertUser(name, password, isAdmin);
            res.status(201).json({ message: "User created" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Updates a user in the database
     * @param {*} req 
     * @param {*} res 
     */
    async updateUser(req, res) {
        const { id } = req.params;
        try {
            const { name, password, isAdmin } = req.body;
            await userRepository.updateUser(id, name, password, isAdmin);
            res.status(200).json({ message: "User updated" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Deletes a user in the database
     * @param {*} req 
     * @param {*} res 
     */
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await userRepository.deleteUser(id);
            res.status(200).json({ message: "User deleted" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Returns to client the user list registered in the database
     * @param {*} req 
     * @param {*} res 
     * @returns User list in JSON format
     */
    async getAllUsers(req, res) {
        try {
            const users = await userRepository.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Return to client a specific User registered in the database
     * @param {*} req 
     * @param {*} res 
     * @returns User in JSON format
     */
    async getUser(req, res) {
        const { id } = req.params;
        try {
            const user = await userRepository.getOneUser(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    /**
     * Permits the access for a user from client
     * @param {*} req 
     * @param {*} res 
     * @returns jsonWebToken
     */
    async login(req, res) {
        try {
            const { userName, password } = req.body;
            const user = await userRepository.getUserByName(userName);
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            const token = generateToken(user.name);
            res.status(200).json({ token: token });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default new UserController();