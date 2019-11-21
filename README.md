# Check library. Figma plugin. 
A designer should run this plugin after adding new assets to the library and check status.

![Image of Yaktocat](https://i.imgur.com/4YcF6fo.png)

## What plugin do
* Validate objects name (frames, instances, colors)
* Sort all layers by name
* Check day/night objects balance
* Show an alert if the library has mistakes

## How to install
* Select the Plugins Page in the Figma File Browser
* Use the plus (+) button in the Development section
* Choose file manifest.json 
* Done

## Validating regular expression
Only lowercase (a-z, 0-9) with "_"

    /^[a-z\d_]*$/
