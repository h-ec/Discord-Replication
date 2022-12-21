import { Request, Response, Router } from 'express';
import { encodeString } from './bdx2/functionality';
import express from 'express';
import { client, usersCollection } from './mongo-db';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { app } from 'electron';
import { hookChromiumReloadScriptable } from '../electron';
import mkpath from 'mkpath';
import { randomUUID } from 'crypto';
const router: Router = Router({ strict: true });

router.use(express.json({ limit: '1mb' }))
router.use(express.urlencoded({ extended: true }))

// **** App Original **** //

router.get('/', async (req: Request, res: Response) => {
    res.render('index')
});

router.get('/app', async (req: Request, res: Response) => {
    res.render('app')
});

router.get('/register', async (req: Request, res: Response) => {
    res.render('register')
});

router.get('/bootup', async (req: Request, res: Response) => {
    res.render('app')
});


// **** App Access **** //

router.post('/ssr/api/connection/db/login', async (req: Request, res: Response) => {
    const data = req.body;
    const email = data?.email;
    const password = await encodeString(data?.password);
    const uncoddedpass = data?.password;
    
    const failureJson: { } = {
        'status': 'NoAuthorize_Fail',
    };

    if(!email || !password || (email === null || password === null)) return res.json(failureJson);
    const userInformationExists = usersCollection.find({ userEmail: email, userPasskey: password }, { projection: { _id: 0, userEmail: 1, userPasskey: 1, userDisplayName: 1 } });
    userInformationExists.count().then((e) => {
        if(e > 0)
        {
            userInformationExists.toArray((err, Rdata: any) => {
                if(err) throw err;
                const jsonData = JSON.parse(JSON.stringify(Rdata));

                const successJson: { } = {
                    'status': 'LoginAuthorizedSuccessfully',
                    'emailAddress': jsonData[0]?.userEmail,
                    'displayName': jsonData[0]?.userDisplayName,
                    'userId': randomUUID(),
                    'passKey': uncoddedpass,
                };

                return res.json(successJson);
            })
        }
        else
        {
            const dJson: { } = {
                'status': 'NoAccountExists',
            };
            return res.json(dJson);
        }
    }).catch((err) => console.error('@DEPRECATED | \'.count() > 0\' is being used in \'/ssr/api/\' post.'));
});

router.post('/ssr/api/connection/db/register', async (req: Request, res: Response) => {
    const data = req.body;

    const email       = data?.email;
    const fullname    = data?.fullname;
    const displayname = data?.displayname;
    const birthday    = data?.birthday;
    const best        = data?.favourited;
    const password     = await encodeString(data?.password);
    
    const emailDoesExists = await usersCollection.find({ userEmail: email }, { projection: { _id: 0, userEmail: 1 } }).count() > 0;
    if(emailDoesExists)
    {
        const failureJson: { } = {
            'status': 'EmailAlreadyFound',
        };
        return res.json(failureJson);
    }

    const registerInstruction: { } = {
        userEmail: email,
        userDisplayName: displayname,
        userBirthday: birthday,
        userPasskey: password,
    }

    usersCollection.insertOne(registerInstruction).then(( ) => {
        const successJson: { } = {
            'status': 'RegisterationAuthorizedSuccessfully'
        };
    
        return res.json(successJson);
    });
});

// **** App AddOns **** //

router.get('/loading', async (req: Request, res: Response) => { 
    res.render('loading')
});

// **** In App Page Stuff **** //

// router.get('/channels/:id/', (request: express.Request, response: express.Response) => {
//     usersCollection.find({}).toArray(function(err, animeDataDB) {
//         if(err) throw err;
//         animeDataDB?.forEach(data => {
//             if(request.params.anime === data.animeName) {
//                 response.render('watch', { reqData: data, data: request.params.watch });
//             }
//         })
//     })
// })

export {
    router
};