// ------------------------------------CONSTANTS---------------------------------------

// REGEX. Only lowercase (a-z) with '_'
const regex = /^[a-z\d_]*$/

const themeSuffixSeparator = "_"
const daySuffix = "day"
const nightSuffix = "night"

// ----------------------------------FIGMA OBJECTS-------------------------------------

const allFrames = collectObjectsWithPredicate(node => node.type === "FRAME" && node.parent.type != "FRAME")
const allInstances = collectObjectsWithPredicate(node => node.type === "INSTANCE" && node.parent.type != "INSTANCE" && node.parent.type != "FRAME")
const allColors = collectObjectsWithPredicate(node => node.type === "RECTANGLE" && node.parent.type === "PAGE" && node.width === 40)

const allNodes = [...allFrames, ...allInstances, ...allColors]

// ------------------------------------------------------------------------------------
// ------------------------------------VALIDAION---------------------------------------

const objectsWithInvalidNames = allNodes.filter((node) => !regex.test(node.name))

if (objectsWithInvalidNames.length > 0) {
  notify(`🚨🚨🚨 ${objectsWithInvalidNames.length} naming errors`, objectsWithInvalidNames)
  exit()
}

// ------------------------------------------------------------------------------------

const namesStats = collectNamesStats(allNodes)

for (const normalizedName in namesStats) {
  const stats = namesStats[normalizedName]

  if (stats[daySuffix] > 1) {
    notify(`🚨🚨🚨 Too much day-theme objects`, stats.objects)
    exit()
  }

  if (stats[nightSuffix] > 1) {
    notify(`🚨🚨🚨 Too much night-theme objects`, stats.objects)
    exit()
  }

  if (stats[daySuffix] !== stats[nightSuffix]) {
    notify(`🚨🚨🚨 Unbalanced names`, stats.objects)
    exit()
  }
}

// -------------------------------------SORTING----------------------------------------

const allSortedNodes = collectObjectsWithPredicate(node => node.parent.type === "PAGE")

let startIndex = 100000
allSortedNodes
  .map(node => {
    const parent = node.parent
    startIndex = Math.min(startIndex, parent.children.indexOf(node))
    return { node, parent }
  })
  .sort((a, b) =>
    figma.command === "desc" ?
        a.node.name.localeCompare(b.node.name, undefined, {numeric: true}) :
        b.node.name.localeCompare(a.node.name, undefined, {numeric: true})
  )
  .forEach((obj, i) => {
    obj.parent.insertChild(startIndex + i, obj.node)
  })

// ------------------------------------------------------------------------------------

notify("👌🏻 Everything is okay")
exit()

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

function collectObjectsWithPredicate(predicate) {
  return figma.currentPage.findAll(predicate)
}

function getNormalizedName(name) {
  const parts = name.split(themeSuffixSeparator)
  const partsNumber = parts.length

  if (partsNumber == 0) { return name }
  const lastPart = parts[partsNumber - 1]

  if (lastPart === daySuffix) {
    return { name: parts.slice(0, -1).join(themeSuffixSeparator), suffix: daySuffix }
  } else if (lastPart === nightSuffix) {
    return { name: parts.slice(0, -1).join(themeSuffixSeparator), suffix: nightSuffix }
  } else {
    return { name }
  }
}

function collectNamesStats(objects) {
  return objects.reduce((acc, obj) => {
    const normalizedName = getNormalizedName(obj.name)

    if (acc[normalizedName.name]) {
      if (normalizedName.suffix) {
        acc[normalizedName.name][normalizedName.suffix] += 1
      } else {
        acc[normalizedName.name][daySuffix] += 1
        acc[normalizedName.name][nightSuffix] += 1
      }

      acc[normalizedName.name].objects.push(obj)
    } else {
      acc[normalizedName.name] = { objects: [obj] }

      if (normalizedName.suffix) {
        acc[normalizedName.name][daySuffix] = 0
        acc[normalizedName.name][nightSuffix] = 0
        acc[normalizedName.name][normalizedName.suffix] = 1
      } else {
        acc[normalizedName.name][daySuffix] = 1
        acc[normalizedName.name][nightSuffix] = 1
      }
    }

    return acc
  }, {})
}

// ------------------------------------------------------------------------------------
// -------------------------------------SUPPORT----------------------------------------

function notify(notification, objectsToReveal) {
  // Showing notification
  figma.notify(notification, { timeout: 3000 })
  // Selecting duplicate elements and move to viewport
  if (objectsToReveal) {
    figma.currentPage.selection = objectsToReveal
    figma.viewport.scrollAndZoomIntoView(objectsToReveal)
  }
}

function exit() {
  figma.closePlugin()
  return
}
