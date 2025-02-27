export class XMLGenerator {
	// Just style points :party:
	private indentLevel: number = 0;
	private indentSize: number = 2;

	public generate(node: XMLNode, pretty: boolean = true): string {
		this.indentLevel = 0;
		// Add XML declaration at the top
		let xml = '<?xml version="1.0" encoding="UTF-8"?>';
		if (pretty) xml += '\n';
		return xml + this.generateNode(node, pretty);
	}

	private generateNode(node: XMLNode, pretty: boolean): string {
		let xml = '';
		const indent = pretty ? ' '.repeat(this.indentLevel * this.indentSize) : '';

		// Start opening tag
		xml += indent + '<';

		// Add namespace prefix if exists
		if (node.namespace) {
			xml += `${node.namespace}:`;
		}

		xml += node.tagName;

		// Add attributes
		xml += this.generateAttributes(node.attributes);

		// Handle empty elements
		if (node.children.length === 0 && !node.textContent) {
			xml += '/>';
			return xml + (pretty ? '\n' : '');
		}

		xml += '>';

		// Handle text content and children
		if (node.children.length > 0) {
			if (pretty) xml += '\n';
			this.indentLevel++;

			for (const child of node.children) {
				xml += this.generateNode(child, pretty);
			}

			this.indentLevel--;
			if (pretty && node.children.length > 0) xml += indent;
		} else if (node.textContent) {
			xml += node.textContent;
		}

		// Closing tag
		xml += '</';
		if (node.namespace) {
			xml += `${node.namespace}:`;
		}
		xml += `${node.tagName}>${pretty ? '\n' : ''}`;

		return xml;
	}

	private generateAttributes(attributes: Record<string, string>): string {
		let result = '';
		for (const [key, value] of Object.entries(attributes)) {
			result += ` ${key}="${this.escapeAttributeValue(value)}"`;
		}
		return result;
	}

	private escapeAttributeValue(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}
}

// Export a convenience function to generate XML
export function generateXML(node: XMLNode, pretty: boolean = true): string {
	const generator = new XMLGenerator();
	return generator.generate(node, pretty);
}

// Re-export the XMLNode interface
export interface XMLNode {
	tagName: string;
	namespace: string | null;
	attributes: Record<string, string>;
	children: XMLNode[];
	textContent: string;
}
