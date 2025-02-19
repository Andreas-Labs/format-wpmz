import { assertEquals } from "jsr:@std/assert";
import { parseXML } from "./parser.ts";
import { generateXML } from "./generator.ts";

// Helper function to normalize XML string (remove whitespace differences)
function normalizeXML(xml: string): string {
	return xml
		.replace(/>\s+</g, "><") // Remove whitespace between tags
		.replace(/\s+/g, " ") // Replace multiple spaces with single space
		.replace(/\s*,\s*/g, ",") // Remove spaces around commas in coordinates
		.replace(/>\s+([^<])/g, ">$1") // Remove leading whitespace in text content
		.replace(/([^>])\s+</g, "$1<") // Remove trailing whitespace in text content
		.trim(); // Remove leading/trailing whitespace
}

Deno.test({
	name: "KML parse and generate cycle test",
	permissions: { read: true },
	async fn() {
		const kmlContent = await Deno.readTextFile("./examples/template.kml");
		const kmlParsed = parseXML(kmlContent, "KML");
		const kmlRegenerated = generateXML(kmlParsed, false); // false to avoid pretty printing

		assertEquals(
			normalizeXML(kmlContent),
			normalizeXML(kmlRegenerated),
			"KML regeneration should match original"
		);
	},
});

Deno.test({
	name: "WPML parse and generate cycle test",
	permissions: { read: true },
	async fn() {
		const wpmlContent = await Deno.readTextFile("./examples/waylines.wpml");
		const wpmlParsed = parseXML(wpmlContent, "WPML");
		const wpmlRegenerated = generateXML(wpmlParsed, false);
		assertEquals(
			normalizeXML(wpmlContent),
			normalizeXML(wpmlRegenerated),
			"WPML regeneration should match original"
		);
	},
});

// Test specific XML node structure
Deno.test("XML node structure test", () => {
	const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:wpml="http://www.dji.com/wpmz/1.0.2">
      <Document>
        <wpml:author>fly</wpml:author>
      </Document>
    </kml>`;

	const parsed = parseXML(kmlContent);

	// Test the structure of parsed XML
	assertEquals(parsed.tagName, "kml");
	assertEquals(parsed.namespace, null);
	assertEquals(parsed.attributes["xmlns"], "http://www.opengis.net/kml/2.2");
	assertEquals(
		parsed.attributes["xmlns:wpml"],
		"http://www.dji.com/wpmz/1.0.2"
	);
	assertEquals(parsed.children.length, 1);

	const document = parsed.children[0];
	assertEquals(document.tagName, "Document");
	assertEquals(document.children.length, 1);

	const author = document.children[0];
	assertEquals(author.tagName, "author");
	assertEquals(author.namespace, "wpml");
	assertEquals(author.textContent, "fly");
});
