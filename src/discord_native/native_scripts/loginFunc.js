const loginButton = get('login-button');
const emailInput  = get('email');
const passkInput  = get('password');

get('close-popup').addEventListener('click', ( ) => {
    get('miss-popup').style.animationName = 'hide';
    get('back-popup').style.animationName = 'hide';
})

loginButton.addEventListener('click', async ( ) => {
    const email = emailInput.value;
    const password = passkInput.value;

    const data = {
        email,
        password,
    };

    const dataJson = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/ssr/api/connection/db/login', dataJson)
    response.json().then((e) => {
        if(e.status === 'LoginAuthorizedSuccessfully')
        {
            SaveOnDevice('EmailAddress', e.emailAddress);
            SaveOnDevice('Password', e.passKey);
            SaveOnDevice('DisplayName', e.displayName);
            SaveOnDevice('UniqueID', e.UniqueID);

            window.location.href = '/loading';
        }
        else
        {
            get('miss-popup').style.animationName = 'show';
            get('back-popup').style.animationName = 'show';
        }
    })
});