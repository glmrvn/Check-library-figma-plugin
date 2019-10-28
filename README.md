# Check library. Figma plugin. 
A designer should run this plugin after adding new assets to the library and check the library status.

## What plugin do
* Validates object names (frames, instances, colors, text style)
* Sort all layers by name
* Show an alert if you have mistakes or all right

## How to install
* Select the Plugins Page in the File Browser
* Use the plus button in the Development section
* Choose manifest.json file
* Done

## Validating regular expression**
Only lowercase (a-z, 0-9) with "_"

    /^[a-z\d_]*$/
