import { generateXML } from "../xml/generator.ts";
import type { KMLTemplate } from "./template.ts";

export function generateKML(template: KMLTemplate, pretty = true): string {
    const xmlNode = template.toXMLNode();
    return generateXML(xmlNode, pretty);
} 