//Validate regex. Only lowercase (a-z) and with '_' frames 
var regex = /^[a-z\d_]*$/;
var allNodes;
var problemObjects = [];
let count = 0;

//Search all frames and instances on the current page
const allFrames = figma.currentPage.findAll(node => node.type === "FRAME" && node.parent.type != "FRAME");
const allInstances = figma.currentPage.findAll(node => node.type === "INSTANCE" && node.parent.type != "INSTANCE" && node.parent.type != "FRAME");

//Merging frame and instances names
allNodes = allFrames.concat(allInstances);

// Check frames and instances with regex
for (let index in allNodes) {
    let frame = allNodes[index];
    if (regex.test(frame.name) != true) {
        count++;
        problemObjects.push(frame);
        continue;
    }
}

// Showing alert
if (count == 0) {
    alert('Cool 😎');
}
else {
    // Selecting problem elements
    figma.currentPage.selection = problemObjects;
    figma.viewport.scrollAndZoomIntoView(problemObjects);

    // Error alert text
    alert('🚨🚨🚨 You have ' + count + ' errors.');
}

// Close plugin
figma.closePlugin();
