let email = get('email').value;
let displayname = get('displayname').value;
let birthday = get('birthday').value;
let password = get('password').value;

const emailErrorPlace = get('email-inf-err');
const passErrorPlace = get('password-inf-err');
const usrnErrorPlace = get('usrname-inf-err');

let EmailError = false;
let PasswordError = false;
let FullNameError = false;
let UserNameError = false;

const showEMError = ( ) => {
    emailErrorPlace.style.animationName = 'show';
    emailErrorPlace.style.display = 'block';
    EmailError = true;
}

const hideEMError = ( ) => {
    emailErrorPlace.style.animationName = 'hide';
    setTimeout(( ) => {
        emailErrorPlace.style.display = 'none';
        EmailError = false;
    }, 256)
}

const showPKError = ( ) => {
    passErrorPlace.style.animationName = 'show';
    passErrorPlace.style.display = 'block';
    PasswordError = true;
}

const hidePKError = ( ) => {
    passErrorPlace.style.animationName = 'hide';
    setTimeout(( ) => {
        passErrorPlace.style.display = 'none';
        PasswordError = false;
    }, 256)
}

const showUNError = () => {
    usrnErrorPlace.style.animationName = 'show';
    usrnErrorPlace.style.display = 'block';
    UserNameError = true;
}

const hideUNError = () => {
    usrnErrorPlace.style.animationName = 'hide';
    setTimeout(() => {
        usrnErrorPlace.style.display = 'none';
        UserNameError = false;
    }, 256)
}

hidePKError();
hideUNError();

const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const passRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/);
const nameRegex = new RegExp(/([A-Z][a-z]{3,} )([A-Z][a-z]{3,} )?([A-Z][a-z]{3,})/);
const usrNameRegex = new RegExp(/^(?=[a-zA-Z0-9._]{3,32}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
// const nameRegex = new RegExp(/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/);

get('email').addEventListener('input', ( ) => {
    email = get('email').value;
    if(email.length < 5 || email.length > 64 || StrIEORS(email) || !email.includes('@') || !email.includes('.') || !email.match(emailRegex))
    {
        showEMError();
    }
    else
    {
        hideEMError();
    }
})

get('password').addEventListener('input', ( ) => {
    password = get('password').value;
    const consistsRepeatedSubstring = (str) => `${str}${str}`.indexOf(str, 1) !== str.length;
    if((StrIEORS(password)) || consistsRepeatedSubstring(password) || !password.match(passRegex) || password === 'MySecret404Password!')
    {
        showPKError();
    }
    else
    {
        hidePKError();
    }
})

get('displayname').addEventListener('input', ( ) => {
    displayname = get('displayname').value;
    if((StrIEORS(displayname)) || !displayname.match(usrNameRegex))
    {
        showUNError();
    }
    else
    {
        hideUNError();
    }
});

get('close-popup').addEventListener('click', ( ) => {
    get('miss-popup').style.animationName = 'hide';
    get('back-popup').style.animationName = 'hide';
    get('popup-text').innerHTML = `You forgot to fill every input there! Or if you already did please take another check :)`;
})

get('back-popup').addEventListener('click', ( ) => {
    get('miss-popup').style.animationName = 'hide';
    get('back-popup').style.animationName = 'hide';
    get('popup-text').innerHTML = `You forgot to fill every input there! Or if you already did please take another check :)`;
})

get('sclose-popup').addEventListener('click', ( ) => {
    get('second-popup').style.animationName = 'hide';
    get('sback-popup').style.animationName = 'hide';
    window.location.href = '/loading';
})

get('sback-popup').addEventListener('click', ( ) => {
    get('second-popup').style.animationName = 'hide';
    get('sback-popup').style.animationName = 'hide';
    window.location.href = '/loading';
})

get('register-button').addEventListener('click', async ( e ) => {
    if(EmailError || PasswordError || UserNameError || !get('birthday').value) 
    {
        get('back-popup').style.animationName = 'show';
        return get('miss-popup').style.animationName = 'show';
    }

    email = get('email').value;
    displayname = get('displayname').value;
    birthday = get('birthday').value;
    password = get('password').value;

    const data = {
        email,
        fullname,
        displayname,
        birthday,
        favourited,
        password,
    };

    const dataJson = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/ssr/api/connection/db/register', dataJson);
    response.json().then((e) => {
        console.log(e);
        if(JSON.stringify(e).toString().indexOf('RegisterationAuthorizedSuccessfully') !== -1)
        {
            get('second-popup').style.animationName = 'show';
            get('sback-popup').style.animationName =  'show';
            party.confetti(get('second-popup'), {
                count: party.variation.range(0, 60),
            });
            party.confetti(get('second-popup'), {
                count: party.variation.range(0, 35),
            });

            SaveOnDevice('EmailAddress', email);
            SaveOnDevice('Password', password);
            SaveOnDevice('DisplayName', displayname);
        }
        else
        {
            get('popup-text').innerHTML = `Email address already exists.`
            get('miss-popup').style.animationName = 'show';
            get('back-popup').style.animationName = 'show';
        }
    })
})