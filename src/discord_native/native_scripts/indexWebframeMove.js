(async( )=>{
    let timer = await checkResponseTime('/bootup') * 10;
    setTimeout(( ) => {
        document.getElementById('defaultEWebListener').innerHTML = get('temp-ldf').contentWindow.document.body.innerHTML;
        get('temp-ldf').addEventListener('load', () => {
            document.getElementById('defaultEWebListener').innerHTML = get('temp-ldf').contentWindow.document.body.innerHTML;
        });
    }, timer < 100 ? timer * 2 : timer)
})();