import { generateWPML, createSimpleWPMLDocument } from "../kml/wpml_generate.ts";
import { 
  WPMLDocument, 
  Wayline, 
  Waypoint, 
  Coordinate, 
  ActionGroup, 
  Action, 
  ActionFunctionParam 
} from "../kml/wayline.ts";

// Create a custom WPML document
async function createAndSaveWPML() {
  // Option 1: Use the helper function for a simple document
  const simpleDocument = createSimpleWPMLDocument();
  const simpleWPML = generateWPML(simpleDocument, true);
  await Deno.writeTextFile("simple_waylines.wpml", simpleWPML);
  
  // Option 2: Create a more complex document manually
  const document = new WPMLDocument({
    author: 'custom_author',
    createTime: Date.now(),
    updateTime: Date.now()
  });
  
  // Add a wayline with multiple waypoints
  const wayline = new Wayline({
    autoFlightSpeed: 3.0
  });
  
  // Create several waypoints in a pattern
  for (let i = 0; i < 4; i++) {
    const waypoint = new Waypoint({
      index: i,
      coordinate: new Coordinate(-120.38 + (i * 0.001), 37.16 + (i * 0.001)),
      executeHeight: 2 + i,
      waypointSpeed: 10
    });
    
    // Add an action to adjust gimbal angle for each waypoint
    if (i > 0) {
      const gimbalParam = new ActionFunctionParam('gimbalEvenlyRotate', {
        gimbalPitchRotateAngle: -1 * (i + 1),
        gimbalRollRotateAngle: 0,
        payloadPositionIndex: 0
      });
      
      const action = new Action(i + 1, 'gimbalEvenlyRotate', gimbalParam);
      
      const actionGroup = new ActionGroup({
        id: 1,
        startIndex: i - 1,
        endIndex: i,
        actions: [action]
      });
      
      waypoint.actionGroups.push(actionGroup);
    }
    
    wayline.waypoints.push(waypoint);
  }
  
  document.waylines.push(wayline);
  
  // Generate and save the WPML file
  const wpml = generateWPML(document, true);
  await Deno.writeTextFile("custom_waylines.wpml", wpml);
  
  console.log("WPML files created successfully!");
}

// Run the example
await createAndSaveWPML(); 