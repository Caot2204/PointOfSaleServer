import { DataTypes, Sequelize } from 'sequelize';
import 'dotenv/config';

export const dataSource = new Sequelize(
    process.env.NAME_DB,
    process.env.USER_DB,
    process.env.PSW_DB,
    {
        host: process.env.HOST_DB,
        dialect: process.env.TYPE_DB
    }
)

export const User = dataSource.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false       
        }
    },
    {
        timestamps: false
    }
);

export const Category = dataSource.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

export const Product = dataSource.define(
    "Product",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: { min: 0 }
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0 }
        },
        is_infinity_stock: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        timestamps: false
    }
);

export const Sale = dataSource.define(
    "Sale",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        timestamps: true,
        createdAt: 'date_of_sale',
        updatedAt: false
    }
);

export const SalesProducts = dataSource.define(
    "SalesProducts",
    {
        sale_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Sale,
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: 'id'
            }
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        }
    }
);

Category.hasMany(Product, {
    foreignKey: 'category_id'
});
Product.belongsTo(Category);

User.hasMany(Sale, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
});
Sale.belongsTo(User);

Sale.belongsToMany(Product, { through: SalesProducts });

Product.belongsToMany(Sale, { through: SalesProducts });

await dataSource.sync();
console.log("Database at time");