import { assertEquals } from "jsr:@std/assert";
import { KMLTemplate } from "./template.ts";

Deno.test("KMLTemplate XML structure", () => {
    const template = new KMLTemplate();
    const xmlNode = template.toXMLNode();
    
    // Test XML structure
    assertEquals(xmlNode.tagName, "kml");
    assertEquals(xmlNode.attributes["xmlns"], "http://www.opengis.net/kml/2.2");
    assertEquals(xmlNode.attributes["xmlns:wpml"], "http://www.dji.com/wpmz/1.0.2");
    
    // Test Document node
    const document = xmlNode.children[0];
    assertEquals(document.tagName, "Document");
    
    // Test wpml:author node
    const author = document.children[0];
    assertEquals(author.tagName, "author");
    assertEquals(author.namespace, "wpml");
    assertEquals(author.textContent, "fly");
    
    // Test missionConfig structure
    const missionConfig = document.children[3];
    assertEquals(missionConfig.tagName, "missionConfig");
    assertEquals(missionConfig.namespace, "wpml");
    
    // Test droneInfo structure
    const droneInfo = missionConfig.children[5];
    assertEquals(droneInfo.tagName, "droneInfo");
    assertEquals(droneInfo.namespace, "wpml");
    assertEquals(droneInfo.children.length, 2);
}); 