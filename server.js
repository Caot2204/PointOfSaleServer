import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dataSource } from './datasource/db/dbConnection.js';

import roleRoutes from './routes/roleRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/roles', roleRoutes);

try {
    await dataSource.authenticate();
    console.log("Connection has been successfully")
} catch (error) {
    console.log("Unable to connect db: ", error);
}

try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Server listen on " + PORT + " port");
    });
} catch (error) {
    console.log(error);
}