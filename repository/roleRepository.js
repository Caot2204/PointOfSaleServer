import { Role } from "../datasource/db/dbConnection.js";

/**
 * Repository for Role entity, responsable of control the datasource operations.
 * 
 * The data source can be changed, whether local or remote, and the controller does'nt know where the data is.
 */
class RoleRepository {

    /**
     * 
     * @param {string} roleName Role's name to save
     */
    async insertRole(roleName) {
        await Role.create({ name: roleName });
        console.log("Role created");            
    }

    /**
     * 
     * @param {number} id Role's identifier 
     * @param {string} name Role's name to update
     */
    async updateRole(id, name) {
        await Role.update({ name: name }, { where: { id: id } });
    }

    /**
     * 
     * @param {number} id Role's identifier to delete 
     */
    async deleteRole(id) {
        await Role.destroy({ where: { id: id } });
    }

    /**
     * 
     * @returns List of Roles in the database
     */
    async findAll() {
        const roles = await Role.findAll({
            attributes: ['id', 'name']
        });
        roles.every(role => role instanceof Role);
        return roles;
    }

    /**
     * 
     * @param {number} id Role's identifier to search
     * @returns Role that the id matches or null if the id not match
     */
    async findOne(id) {
        return await Role.findOne({ where: { id: id } });
    }

}

export default new RoleRepository();