# Check library. Figma plugin. 
A designer should run this plugin after adding new assets to the library and check status.

## What plugin do
* Validates object names (frames, instances, colors, text style)
* Sort all layers by name
* Show an alert if the library has mistakes

## How to install
* Select the Plugins Page in the Figma File Browser
* Use the plus (+) button in the Development section
* Choose file manifest.json 
* Done

## Validating regular expression
Only lowercase (a-z, 0-9) with "_"

    /^[a-z\d_]*$/
