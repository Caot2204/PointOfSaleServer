import { DataTypes, DATE, Sequelize } from 'sequelize';
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
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false
    }
);

export const Product = dataSource.define(
    "Product",
    {
        code: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false
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
        isInfinityStock: {
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
        },
        dateOfSale: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

export const SalesProducts = dataSource.define(
    "SalesProducts",
    {
        saleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productCode: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        currentPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        }
    },
    {
        timestamps: false
    }
);

Category.hasMany(Product);
Product.belongsTo(Category);

User.hasMany(Sale);
Sale.belongsTo(User);

//Sale.belongsToMany(Product, { through: SalesProducts });

//Product.belongsToMany(Sale, { through: SalesProducts });

await dataSource.sync();
console.log("Database at time");