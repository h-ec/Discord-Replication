const maxButton = get("maximizeButton");
const minButton = get("minimizeButton");
const closeButton = get("closeButton");

maxButton.addEventListener("click",   () => process.app.maximize());
minButton.addEventListener("click",   () => process.app.minimize());
closeButton.addEventListener("click", () => process.app.close   ());