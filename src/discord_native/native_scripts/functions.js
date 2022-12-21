// A shortcut for document.getElementById("beans")
const get = (elementID) => {
    if(StrIEORS(elementID))
    {
        document.body.innerHTML = `<p>Couldn't find "${elementID}"!</p><br>` + document.body.innerHTML;
    }
    else
    {
        if(document.getElementById(elementID) !== null)
        {
            return document.getElementById(elementID);
        }
    }
};

// Returns a boolean, True if it found (spaces or it's empty), False if it doesn't found any.
const StrIEORS = (String) => {
    return String === null || String.match(/^ *$/) !== null;
}

async function checkResponseTime(dataURL) {
    let time1 = performance.now();
    await fetch(testURL);
    let time2 = performance.now();
    return time2 - time1;
}

const getData = async (dataURL) => {
    fetch(dataURL).then((response) => response.json()).then((data) => {
        return data;
    });
}

async function randomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
const SaveOnDevice = async ( key, value ) => {
    await localStorage.setItem(key, value);
}

const GetSavedOnDevice = ( key ) => {
    return localStorage.getItem(key);
}

const RemoveSavedOnDevice = async ( key ) => {
    localStorage.removeItem(key);
}

// There's no HTMLElement.destroy(), So this is an alternative for it!
const destroyComponent = ( component_id ) => {
    get(component_id).outerHTML = '';
};

const reloadPageInGeneral = ( ) => {
    location.reload();
};