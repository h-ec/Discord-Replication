(async () => {
    setTimeout(( ) => {
        if(!GetSavedOnDevice('EmailAddress') || !GetSavedOnDevice('Password') || !GetSavedOnDevice('DisplayName') || !GetSavedOnDevice('UniqueID'))
        {}
        else
        {
            window.location.href = '/loading';
        }
    }, Number(GetSavedOnDevice('TimeOutState')) ? 4 : 6)
})();