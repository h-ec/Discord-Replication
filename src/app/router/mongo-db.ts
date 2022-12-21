import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '/.env') });
const SECRET_KEY: string | any = process.env.MONGO_DB_SECRET;

const client: MongoClient = new MongoClient(SECRET_KEY.replace('b830a', 'CzI2r1'), { serverApi: ServerApiVersion.v2, keepAlive: true });

const createConnectionTest = ( ) => {
    client.connect().then(( ) => console.log('Connected Successfully with MongoDB, Status: OK!'))
};

const appDB = client.db('app');
const usersCollection = appDB.collection('users');

export {
    appDB,
    client,
    createConnectionTest,
    usersCollection
}