import { parseXML } from './xml/parser.ts';
import { generateXML } from './xml/generator.ts';
import { generateKML } from './kml/generate.ts';
import { KMLTemplate } from './kml/template.ts';
import { createSimpleWPMLDocument } from './kml/wpml_generate.ts';

// Add this interface at the top of the file
interface XMLParseError extends Error {
	position: number;
	fileName: string;
}

// Function to load file content as text
async function loadFileAsText(filePath: string): Promise<string> {
	try {
		return await Deno.readTextFile(new URL(filePath, import.meta.url));
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to read file ${filePath}: ${error.message}`,
			);
		}
		throw error;
	}
}

// Helper function to show context around error
function getErrorContext(content: string, position: number): string {
	const lines = content.split('\n');
	let currentPos = 0;

	for (let i = 0; i < lines.length; i++) {
		const lineLength = lines[i].length + 1; // +1 for newline
		if (currentPos + lineLength > position) {
			// Return the problematic line with line number and pointer
			const lineNum = i + 1;
			const columnNum = position - currentPos + 1;
			return [
				`Line ${lineNum}:`,
				lines[i],
				' '.repeat(columnNum - 1) + '^',
			].join('\n');
		}
		currentPos += lineLength;
	}
	return 'Position not found in file';
}

async function writeJSONToFile(data: unknown, filePath: string) {
	try {
		const jsonString = JSON.stringify(data, null, 2); // Pretty print with 2 spaces
		await Deno.writeTextFile(filePath, jsonString);
		console.log(`Successfully wrote JSON to ${filePath}`);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to write JSON file ${filePath}: ${error.message}`,
			);
		}
		throw error;
	}
}

// Example usage
async function main() {
	try {
		// Example of creating a KML template and generating XML
		const template = new KMLTemplate({
			author: 'fly',
			missionConfig: {
				flyToWaylineMode: 'safely',
				finishAction: 'goHome',
				exitOnRCLost: 'executeLostAction',
				executeRCLostAction: 'hover',
				globalTransitionalSpeed: 17,
				droneInfo: {
					droneEnumValue: 68,
					droneSubEnumValue: 0,
				},
			},
		});

		const generatedKML = generateKML(template, true);
		await Deno.writeTextFile('generated.kml', generatedKML);
		console.log('Generated KML file: generated.kml');

		// Load and parse the KML template file
		const kmlContent = await loadFileAsText('../examples/template.kml');
		const kmlParsed = parseXML(kmlContent, 'KML');
		await writeJSONToFile(kmlParsed, 'template.json');
		console.log('Parsed KML:', kmlParsed);

		// Load and parse the WPML file
		const wpmlContent = await loadFileAsText('../examples/waylines.wpml');
		const wpmlParsed = parseXML(wpmlContent, 'WPML');
		await writeJSONToFile(wpmlParsed, 'waylines.json');
		console.log('Parsed WPML:', wpmlParsed);

		// Generate XML from the parsed JSON
		const regeneratedXML = generateXML(kmlParsed, true); // true for pretty printing
		await Deno.writeTextFile('regenerated.kml', regeneratedXML);
		console.log('Generated XML file: regenerated.kml');
	} catch (error) {
		if (error instanceof Error && 'position' in error) {
			const xmlError = error as XMLParseError;
			const content = xmlError.fileName === 'KML'
				? await loadFileAsText('../examples/template.kml')
				: await loadFileAsText('../examples/waylines.wpml');

			console.error('XML Parsing Error:', xmlError.message);
			console.error('\nContext:');
			console.error(getErrorContext(content, xmlError.position));
		} else {
			console.error('Error:', error);
		}
	}

	const wpml = createSimpleWPMLDocument();
	await Deno.writeTextFile('simple.wpml', generateXML(wpml.toXMLNode()));
	console.log('Generated WPML file: simple.wpml');
}

// Run the main function
await main();
