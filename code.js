//Validate regex. Only lowercase (a-z ) and with '_' frames 
var regex = /^[a-z\d_,]*$/;
var allNodes;

//Search all frames and instances on the current page
const allFrames = figma.currentPage.findAll(node => node.type === "FRAME" && node.parent.type != "FRAME").map(it => it.name).toString();
const allInstances = figma.currentPage.findAll(node => node.type === "INSTANCE" && node.parent.type != "INSTANCE").map(it => it.name).toString();

//Merging frame and instances names
allNodes = allFrames+allInstances

//Showing alert
if (regex.test(allNodes) == true) {
    alert('Cool 😎');
}
else {
    alert('🚨🚨🚨 Сheck your frame names');
}

figma.closePlugin()