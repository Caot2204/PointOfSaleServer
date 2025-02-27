import roleRepository from "../repository/roleRepository.js";

/**
 * Controller for Role routes in the server.
 */
class RoleController {
    
    /**
     * Save a new Role in the database
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {
        try {
            const { name } = req.body;
            await roleRepository.insertRole(name);
            res.status(201).json({ msg: "Role created" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.msg });
        }
    }

    /**
     * Update a exist Role in the database
     * @param {*} req 
     * @param {*} res 
     */
    async update(req, res) {
        const { id } = req.params;
        try {
            const { name } = req.body;
            await roleRepository.updateRole(id, name);
            res.status(201).json({ msg: "Role updated" });
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }

    /**
     * Delete a exist Role in the database
     * @param {*} req 
     * @param {*} res 
     */
    async delete(req, res) {
        const { id } = req.params;
        try {
            await roleRepository.deleteRole(id);
            res.status(200).json({ msg: "Role deleted" });
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }

    /**
     * Returns all Roles registered in the database
     * @param {*} req 
     * @param {*} res 
     */
    async getAll(req, res) {
        try {
            const roles = await roleRepository.findAll();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }

    /**
     * Returns a Role that the id matches with the id recived
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getOne(req, res) {
        const { id } = req.params;
        try {
            const role = await roleRepository.findOne(id);
            if (role == null) {
                return res.status(200).json({ msg: "Role not found" });
            }
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }

}

export default new RoleController();