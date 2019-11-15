//REGEX. Only lowercase (a-z) with '_'
const regex = /^[a-z\d_]*$/;

const startIndex = 100000;

//Find frames, instances and colors on the current page
const allFrames = figma.currentPage.findAll(node => node.type === "FRAME" && node.parent.type != "FRAME");
const allInstances = figma.currentPage.findAll(node => node.type === "INSTANCE" && node.parent.type != "INSTANCE" && node.parent.type != "FRAME");
const allColors = figma.currentPage.findAll(node => node.type === "RECTANGLE" && node.parent.type === "PAGE" && node.width === 40);
const allText = figma.currentPage.findAll(node => node.type === "TEXT" && node.parent.type === "PAGE");

//Merging frame, instances and colors
const allNodes = [...allFrames, ...allInstances, ...allColors];

// Validating frames and instances with regex
const problemObjects = allNodes.filter((node) => !regex.test(node.name));
const namesDictionary = allNodes.reduce((c, v) => {
    const daySuffix = "_day";
    const nightSuffix = "_night";

    const name = v.name;

    if (!name.endsWith(daySuffix) && !name.endsWith(nightSuffix)) {
      const dayName = name + daySuffix
      c[dayName] = c[dayName] || [];
      c[dayName].push(v);

      const nightName = name + nightSuffix
      c[nightName] = c[nightName] || [];
      c[nightName].push(v);
    } else {
      c[name] = c[name] || [];
      c[name].push(v);
    }

    return c;
  }, {});

//Check duplicate object names
const duplicateNames = Object.values(namesDictionary).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);

if (duplicateNames.length > 0) {
  figma.notify('🚨🚨🚨 You are have name duplicates', { timeout: 3000 });
  figma.currentPage.selection = duplicateNames;
  figma.viewport.scrollAndZoomIntoView(duplicateNames);
}

// Find all sorting objects
const allSortedNodes = figma.currentPage.findAll(node => node.parent.type === "PAGE")

// Sorting layers by name
allSortedNodes
  .map(node => {
    const parent = node.parent;
    startIndex = Math.min(startIndex, parent.children.indexOf(node));
    return {node, parent};
  })
  .sort((a, b) =>
    figma.command === "desc" ?
        a.node.name.localeCompare(b.node.name, undefined, {numeric: true}) :
        b.node.name.localeCompare(a.node.name, undefined, {numeric: true})
  )
  .forEach((obj, i) => {
    obj.parent.insertChild(startIndex + i, obj.node);
  });

// Showing notification
if (problemObjects.length == 0 && duplicateNames.length == 0) {
    figma.notify('Cool 😎', { timeout: 2000 });
}
if (problemObjects.length > 0 && duplicateNames.length == 0) {
    // Selecting problem elements and move to viewport
    figma.currentPage.selection = problemObjects;
    figma.viewport.scrollAndZoomIntoView(problemObjects);

    // Error notification text
    figma.notify(`🚨🚨🚨 ${problemObjects.length} naming errors`, { timeout: 3000 });
}

// Close plugin
figma.closePlugin();