"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersCollection = exports.createConnectionTest = exports.client = exports.appDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.join(__dirname, '/.env') });
const SECRET_KEY = process.env.MONGO_DB_SECRET;
const client = new mongodb_1.MongoClient(SECRET_KEY.replace('b830a', 'CzI2r1'), { serverApi: mongodb_1.ServerApiVersion.v2, keepAlive: true });
exports.client = client;
const createConnectionTest = () => {
    client.connect().then(() => console.log('Connected Successfully with MongoDB, Status: OK!'));
};
exports.createConnectionTest = createConnectionTest;
const appDB = client.db('app');
exports.appDB = appDB;
const usersCollection = appDB.collection('users');
exports.usersCollection = usersCollection;
