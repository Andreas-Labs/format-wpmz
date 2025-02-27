interface XMLNode {
	tagName: string;
	namespace: string | null;
	attributes: Record<string, string>;
	children: XMLNode[];
	textContent: string;
}

export class XMLParser {
	private pos: number = 0;
	private input: string = '';
	private fileName: string = '';

	public parse(xmlString: string, fileName = ''): XMLNode {
		this.input = xmlString.trim();
		this.pos = 0;
		this.fileName = fileName;

		// Skip XML declaration if present
		if (this.input.startsWith('<?xml')) {
			this.skipXMLDeclaration();
		}

		return this.parseNode();
	}

	private skipXMLDeclaration(): void {
		while (this.pos < this.input.length) {
			if (
				this.input[this.pos] === '?' &&
				this.input[this.pos + 1] === '>'
			) {
				this.pos += 2;
				this.skipWhitespace();
				break;
			}
			this.pos++;
		}
	}

	private createError(message: string): Error {
		const error = new Error(message) as Error & {
			position: number;
			fileName: string;
		};
		error.position = this.pos;
		error.fileName = this.fileName;
		return error;
	}

	private parseNode(): XMLNode {
		this.skipWhitespace();

		// Expect opening tag
		if (this.input[this.pos] !== '<') {
			throw this.createError('Expected "<" at position ' + this.pos);
		}
		this.pos++; // Skip '<'

		// Parse tag name and namespace
		const fullTagName = this.parseTagName();
		const [namespace, tagName] = this.splitNamespace(fullTagName);

		// Parse attributes
		const attributes = this.parseAttributes();

		// Handle self-closing tags
		if (this.input[this.pos] === '/' && this.input[this.pos + 1] === '>') {
			this.pos += 2;
			return {
				tagName,
				namespace,
				attributes,
				children: [],
				textContent: '',
			};
		}

		// Skip closing '>'
		if (this.input[this.pos] !== '>') {
			throw this.createError('Expected ">" at position ' + this.pos);
		}
		this.pos++;

		// Parse children and text content
		const children: XMLNode[] = [];
		let textContent = '';

		while (this.pos < this.input.length) {
			this.skipWhitespace();

			// Check for closing tag
			if (
				this.input[this.pos] === '<' &&
				this.input[this.pos + 1] === '/'
			) {
				this.pos += 2;
				const closingFullTag = this.parseTagName();
				if (closingFullTag !== fullTagName) {
					throw this.createError(
						`Mismatched closing tag. Expected "${fullTagName}" but got "${closingFullTag}"`,
					);
				}
				// Skip closing '>'
				if (this.input[this.pos] !== '>') {
					throw this.createError(
						'Expected ">" at position ' + this.pos,
					);
				}
				this.pos++;
				break;
			}

			// Check for child node
			if (this.input[this.pos] === '<') {
				children.push(this.parseNode());
			} else {
				// Parse text content
				textContent += this.parseTextContent();
			}
		}

		return {
			tagName,
			namespace,
			attributes,
			children,
			textContent: textContent.trim(),
		};
	}

	private parseTagName(): string {
		this.skipWhitespace();
		let fullTagName = '';
		while (this.pos < this.input.length) {
			const char = this.input[this.pos];
			if (
				char === ' ' ||
				char === '>' ||
				char === '/' ||
				char === '\n' ||
				char === '\t'
			) {
				break;
			}
			fullTagName += char;
			this.pos++;
		}
		return fullTagName;
	}

	private parseAttributes(): Record<string, string> {
		const attributes: Record<string, string> = {};

		while (this.pos < this.input.length) {
			this.skipWhitespace();

			// Check if we're at the end of the tag
			if (
				this.input[this.pos] === '>' ||
				(this.input[this.pos] === '/' &&
					this.input[this.pos + 1] === '>')
			) {
				break;
			}

			// Parse attribute name
			const name = this.parseAttributeName();

			this.skipWhitespace();

			// Expect equals sign
			if (this.input[this.pos] !== '=') {
				throw this.createError('Expected "=" after attribute name');
			}
			this.pos++;

			this.skipWhitespace();

			// Parse attribute value
			attributes[name] = this.parseAttributeValue();
		}

		return attributes;
	}

	private parseAttributeName(): string {
		let name = '';
		while (this.pos < this.input.length) {
			const char = this.input[this.pos];
			// Break only on whitespace or equals sign, allow colons and other valid chars
			if (
				char === '=' ||
				char === ' ' ||
				char === '\n' ||
				char === '\t' ||
				char === '>'
			) {
				break;
			}
			name += char;
			this.pos++;
		}
		return name;
	}

	private parseAttributeValue(): string {
		// Expect quote
		const quote = this.input[this.pos];
		if (quote !== '"' && quote !== "'") {
			throw this.createError('Expected quote for attribute value');
		}
		this.pos++;

		let value = '';
		while (this.pos < this.input.length && this.input[this.pos] !== quote) {
			value += this.input[this.pos];
			this.pos++;
		}

		// Skip closing quote
		this.pos++;

		return value;
	}

	private parseTextContent(): string {
		let content = '';
		while (this.pos < this.input.length && this.input[this.pos] !== '<') {
			content += this.input[this.pos];
			this.pos++;
		}
		return content;
	}

	private skipWhitespace(): void {
		while (this.pos < this.input.length) {
			const char = this.input[this.pos];
			if (
				char !== ' ' &&
				char !== '\n' &&
				char !== '\t' &&
				char !== '\r'
			) {
				break;
			}
			this.pos++;
		}
	}

	private splitNamespace(fullTagName: string): [string | null, string] {
		const parts = fullTagName.split(':');
		if (parts.length === 2) {
			return [parts[0], parts[1]];
		}
		return [null, fullTagName];
	}
}

// Export a convenience function to parse XML
export function parseXML(xmlString: string, fileName = ''): XMLNode {
	const parser = new XMLParser();
	return parser.parse(xmlString, fileName);
}
