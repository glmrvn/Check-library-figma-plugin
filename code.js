//REGEX. Only lowercase (a-z) with '_'
var regex = /^[a-z\d_]*$/;

//Creating variables
var allNodes;
var problemObjects = [];
let count = 0;
let startIndex = 100000;

//Find frames, instances and colors on the current page
const allFrames = figma.currentPage.findAll(node => node.type === "FRAME" && node.parent.type != "FRAME");
const allInstances = figma.currentPage.findAll(node => node.type === "INSTANCE" && node.parent.type != "INSTANCE" && node.parent.type != "FRAME");
const allColors = figma.currentPage.findAll(node => node.type === "RECTANGLE" && node.parent.type === "PAGE" && node.width === 40);
const allText = figma.currentPage.findAll(node => node.type === "TEXT" && node.parent.type === "PAGE");

//Merging frame, instances and colors
allNodes = allFrames.concat(allInstances, allColors, allText);

// Validating frames and instances with regex
for (let index in allNodes) {
    let frame = allNodes[index];
    if (regex.test(frame.name) != true) {
        count++;
        problemObjects.push(frame);
        continue;
    }
}

//Check duplicate object names
var duplicates = Object.values(allNodes.reduce((c, v) => {
  let k = v.name;
  c[k] = c[k] || [];
  c[k].push(v);
  return c;
}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);

if (duplicates.length > 0) {
  figma.notify('🚨🚨🚨 You are have name duplicates', { timeout: 3000 });
  figma.currentPage.selection = duplicates;
  figma.viewport.scrollAndZoomIntoView(duplicates);
}

// Find all sorting objects
const allSorted = figma.currentPage.findAll(node => node.parent.type === "PAGE")

// Sorting layers by name
allSorted
  .map(node => {
    const parent = node.parent;
    startIndex = Math.min(startIndex, parent.children.indexOf(node));
    return {
      node,
      parent
    };
  })
  .sort((a, b) =>
    figma.command === "desc"
      ? a.node.name.localeCompare(b.node.name, undefined, {
          numeric: true
        })
      : b.node.name.localeCompare(a.node.name, undefined, {
          numeric: true
        })
  )
  .forEach((obj, i) => {
    obj.parent.insertChild(startIndex + i, obj.node);
  });

// Showing notification
if (count == 0 && duplicates.length == 0) {
    figma.notify('Cool 😎', { timeout: 2000 });
}
if (count > 0) {
    // Selecting problem elements and move to viewport
    figma.currentPage.selection = problemObjects;
    figma.viewport.scrollAndZoomIntoView(problemObjects);

    // Error notification text
    figma.notify('🚨🚨🚨 You are have ' + count + ' errors', { timeout: 3000 });
}

// Close plugin
figma.closePlugin();
