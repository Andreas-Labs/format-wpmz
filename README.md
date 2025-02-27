# format-wpmz

WPMZ parser and writer for DJI Drone Automation, Extension of KML

## Usage

### Template (KML)

```ts
import { generateKML, generateXML, KMLTemplate } from "format-wpmz";

// Create a new KML template
const template = new KMLTemplate({
  author: "fly",
  missionConfig: {
    flyToWaylineMode: "safely",
    finishAction: "goHome",
    exitOnRCLost: "executeLostAction",
    executeRCLostAction: "hover",
    globalTransitionalSpeed: 17,
    droneInfo: {
      droneEnumValue: 68,
      droneSubEnumValue: 0,
    },
  },
});

// Generate KML from the template in XML form you can write to a file
const generatedKML = generateKML(template, true);
```

### Waylines (WPML)

Basic Mission

```ts
// Create mission config
const missionConfig = new MissionConfig({
  globalTransitionalSpeed: 12,
});

// Create a wayline
const wayline = new Wayline({
  autoFlightSpeed: 2.5,
});

// Create waypoints
const waypoint1 = new Waypoint({
  index: 0,
  coordinate: new Coordinate(-120.382555963215, 37.1612792001469),
  executeHeight: 2,
  waypointSpeed: 12,
  headingParam: new WaypointHeadingParam({
    mode: "smoothTransition",
    angle: -114,
    angleEnable: 1,
  }),
  turnParam: new WaypointTurnParam({
    mode: "toPointAndStopWithContinuityCurvature",
  }),
});

// Create actions for waypoint1
const gimbalActionParam = new ActionFunctionParam("gimbalRotate", {
  gimbalHeadingYawBase: "aircraft",
  gimbalRotateMode: "absoluteAngle",
  gimbalPitchRotateEnable: 1,
  gimbalPitchRotateAngle: -0.3,
  gimbalRollRotateEnable: 0,
  gimbalRollRotateAngle: 0,
  gimbalYawRotateEnable: 0,
  gimbalYawRotateAngle: 0,
  gimbalRotateTimeEnable: 0,
  gimbalRotateTime: 0,
  payloadPositionIndex: 0,
});

const action1 = new Action(1, "gimbalRotate", gimbalActionParam);

const actionGroup1 = new ActionGroup({
  id: 1,
  startIndex: 0,
  endIndex: 0,
  actions: [action1],
});

waypoint1.actionGroups.push(actionGroup1);

// Create waypoint2
const waypoint2 = new Waypoint({
  index: 1,
  coordinate: new Coordinate(-120.382376785585, 37.1632062446645),
  executeHeight: 4,
  waypointSpeed: 12,
  turnParam: new WaypointTurnParam({
    mode: "toPointAndPassWithContinuityCurvature",
  }),
});

// Add waypoints to wayline
wayline.waypoints.push(waypoint1, waypoint2);

// Create and return the document
return new WPMLDocument({
  author: "fly",
  createTime: Date.now(),
  updateTime: Date.now(),
  missionConfig,
  waylines: [wayline],
});
```

TODO

```ts
import { generateXML, WPMLTemplate } from "format-wpmz";

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
