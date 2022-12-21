"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const functionality_1 = require("./bdx2/functionality");
const express_2 = __importDefault(require("express"));
const mongo_db_1 = require("./mongo-db");
const crypto_1 = require("crypto");
const router = (0, express_1.Router)({ strict: true });
exports.router = router;
router.use(express_2.default.json({ limit: '1mb' }));
router.use(express_2.default.urlencoded({ extended: true }));
// **** App Original **** //
router.get('/', async (req, res) => {
    res.render('index');
});
router.get('/app', async (req, res) => {
    res.render('app');
});
router.get('/register', async (req, res) => {
    res.render('register');
});
router.get('/bootup', async (req, res) => {
    res.render('app');
});
// **** App Access **** //
router.post('/ssr/api/connection/db/login', async (req, res) => {
    const data = req.body;
    const email = data?.email;
    const password = await (0, functionality_1.encodeString)(data?.password);
    const uncoddedpass = data?.password;
    const failureJson = {
        'status': 'NoAuthorize_Fail',
    };
    if (!email || !password || (email === null || password === null))
        return res.json(failureJson);
    const userInformationExists = mongo_db_1.usersCollection.find({ userEmail: email, userPasskey: password }, { projection: { _id: 0, userEmail: 1, userPasskey: 1, userDisplayName: 1 } });
    userInformationExists.count().then((e) => {
        if (e > 0) {
            userInformationExists.toArray((err, Rdata) => {
                if (err)
                    throw err;
                const jsonData = JSON.parse(JSON.stringify(Rdata));
                const successJson = {
                    'status': 'LoginAuthorizedSuccessfully',
                    'emailAddress': jsonData[0]?.userEmail,
                    'displayName': jsonData[0]?.userDisplayName,
                    'userId': (0, crypto_1.randomUUID)(),
                    'passKey': uncoddedpass,
                };
                return res.json(successJson);
            });
        }
        else {
            const dJson = {
                'status': 'NoAccountExists',
            };
            return res.json(dJson);
        }
    }).catch((err) => console.error('@DEPRECATED | \'.count() > 0\' is being used in \'/ssr/api/\' post.'));
});
router.post('/ssr/api/connection/db/register', async (req, res) => {
    const data = req.body;
    const email = data?.email;
    const fullname = data?.fullname;
    const displayname = data?.displayname;
    const birthday = data?.birthday;
    const best = data?.favourited;
    const password = await (0, functionality_1.encodeString)(data?.password);
    const emailDoesExists = await mongo_db_1.usersCollection.find({ userEmail: email }, { projection: { _id: 0, userEmail: 1 } }).count() > 0;
    if (emailDoesExists) {
        const failureJson = {
            'status': 'EmailAlreadyFound',
        };
        return res.json(failureJson);
    }
    const registerInstruction = {
        userEmail: email,
        userDisplayName: displayname,
        userBirthday: birthday,
        userPasskey: password,
    };
    mongo_db_1.usersCollection.insertOne(registerInstruction).then(() => {
        const successJson = {
            'status': 'RegisterationAuthorizedSuccessfully'
        };
        return res.json(successJson);
    });
});
// **** App AddOns **** //
router.get('/loading', async (req, res) => {
    res.render('loading');
});
