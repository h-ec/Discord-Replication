console.log('[WEEW] LOGGING BEFORE RESETTING');
try {
    console.log(`[WEEW] LAYERS CONTENT LENGTH: ${get('layer1').innerHTML.length}`);
    console.log(`[WEEW] LAYERS CONTENT LENGTH: ${get('layer2').innerHTML.length}`);
    console.log(`[WEEW] LAYERS CONTENT LENGTH: ${get('base1').innerHTML.length}`);
    setTimeout(( ) => {
        document.getElementById('layer1').remove();
        document.getElementById('layer2').remove();
        let l1 = document.getElementById('layer1');
        let l2 = document.getElementById('layer2');
        let b1 = document.getElementById('base1');
        document.getElementById("layer1").innerHTML = '<p>Lorem ipusim test</p>';
    }, 4000);   
} catch (error) {
    console.error(error);
}