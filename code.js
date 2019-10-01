//Validate regex. Only lowercase (a-z ) and with '_' frames 
var regex = /^[a-z\d_,]*$/;

//Search all frames on the current page
const allNodes = figma.currentPage.findAll(node => node.type === "FRAME").map(it => it.name).toString();

//Showing alert
if (regex.test(allNodes) == true) {
    alert('Cool 😎');
}
else {
    alert('🚨🚨🚨 Сheck your frame names');
}

figma.closePlugin()