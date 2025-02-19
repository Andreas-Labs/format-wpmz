# format-wpmz
WPMZ parser and writer for DJI Drone Automation, Extension of KML

## Usage

### Template (KML)

```ts
import { KMLTemplate, generateXML } from "format-wpmz";

// Create a new KML template
const template = new KMLTemplate({
    author: "fly",
    missionConfig: {
        flyToWaylineMode: 'safely',
        finishAction: 'goHome',
        exitOnRCLost: 'executeLostAction',
        executeRCLostAction: 'hover',
        globalTransitionalSpeed: 17,
        droneInfo: {
            droneEnumValue: 68,
            droneSubEnumValue: 0
        }
    }
});

// Generate KML from the template in XML form you can write to a file
const generatedKML = generateKML(template, true);
```

### Waylines (WPML)

TODO

```ts
import { WPMLTemplate, generateXML } from "format-wpmz";

// Create a new WPML template
const template = new WPMLTemplate();

// Generate WPML from the template in XML form you can write to a file
const generatedWPML = generateXML(template, true);
```

## Example

```ts
const template = new KMLTemplate();
```

## Test

```bash
deno test
```

## Generate Example Files

```bash
deno run --allow-read --allow-write src/main.ts
``` 
