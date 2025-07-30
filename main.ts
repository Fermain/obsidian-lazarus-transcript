import {
	Plugin,
	PluginSettingTab,
	Setting,
	App,
	MarkdownRenderer,
	Notice,
	MarkdownView,
	MarkdownPostProcessorContext,
	Editor,
} from "obsidian";

interface LazarusPluginSettings {
	marginWidth: string;
}

const DEFAULT_SETTINGS: LazarusPluginSettings = {
	marginWidth: "10rem",
};

export default class LazarusPlugin extends Plugin {
	settings: LazarusPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new LazarusSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("lt", (source, el, ctx) =>
			this.lazarusTranscript(source, el, ctx)
		);

		this.applySettings();
	}

	onunload() {
		// Clean up any classes we added
		document.body.removeClass(
			"lt-wide-margin",
			"lt-narrow-margin",
			"lt-auto-margin"
		);
	}

	applySettings() {
		// Remove any existing margin classes
		document.body.removeClass(
			"lt-wide-margin",
			"lt-narrow-margin",
			"lt-auto-margin"
		);

		// Apply CSS class based on margin width setting
		if (this.isValidCSSLength(this.settings.marginWidth)) {
			this.applyMarginClass(this.settings.marginWidth);
		}
	}

	private applyMarginClass(marginWidth: string) {
		// Define some common margin classes instead of dynamic styles
		const widthValue = parseFloat(marginWidth);
		const unit = marginWidth.replace(/[\d.]/g, "");

		if (
			marginWidth === "auto" ||
			marginWidth.includes("max-content") ||
			marginWidth.includes("min-content")
		) {
			document.body.addClass("lt-auto-margin");
		} else if (
			(unit === "rem" && widthValue >= 12) ||
			(unit === "px" && widthValue >= 192)
		) {
			document.body.addClass("lt-wide-margin");
		} else if (
			(unit === "rem" && widthValue <= 6) ||
			(unit === "px" && widthValue <= 96) ||
			unit === "%"
		) {
			document.body.addClass("lt-narrow-margin");
		}
		// Default (no class) handles the standard 10rem case
	}

	isValidCSSLength(value: string): boolean {
		// Basic CSS length validation - accepts common units
		const cssLengthRegex =
			/^(auto|max-content|min-content|fit-content|\d*\.?\d+(px|em|rem|%|ch|vw|vh|vmin|vmax|ex|cm|mm|in|pt|pc))$/i;
		return cssLengthRegex.test(value.trim());
	}

	lazarusTranscript(
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	) {
		const container = el.createEl("blockquote", {
			cls: "lt",
			attr: {
				role: "group",
				"aria-label": "Transcript dialogue",
			},
		});

		this.processDialog(source, container, ctx);
	}

	private async processDialog(
		source: string,
		container: HTMLElement,
		ctx: MarkdownPostProcessorContext
	) {
		const lines = source.split("\n").filter(Boolean);

		if (lines.length === 0) {
			container.createEl("div", {
				text: "Empty transcript block",
				cls: "lt-empty",
			});
			return;
		}

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue; // Skip empty lines

			const element = container.createEl(i === 0 ? "strong" : "q", {
				cls: `lt-${i === 0 ? "speaker" : "line"} lt-clickable`,
				attr: {
					...(i === 0
						? {
								role: "heading",
								"aria-level": "3",
						  }
						: {}),
					"data-line-index": i.toString(), // Store which line in the transcript this is
					"data-source-content": line, // Store the content to help find it in source
				},
			});

			// Add click handler for edit functionality
			this.registerDomEvent(element, "click", async (event) => {
				event.preventDefault();
				const lineIndex = parseInt(
					element.getAttribute("data-line-index") || "0"
				);
				const sourceContent =
					element.getAttribute("data-source-content") || "";
				await this.openEditMode(ctx, lineIndex, sourceContent);
			});

			try {
				// Render markdown for each line of text
				await MarkdownRenderer.render(
					this.app,
					line,
					element,
					"",
					this
				);
			} catch (error) {
				console.error("Lazarus transcript render error:", error);
				// Fallback to plain text if markdown rendering fails
				element.textContent = line;
			}
		}
	}

	private async openEditMode(
		ctx: MarkdownPostProcessorContext,
		lineIndex: number,
		sourceContent: string
	) {
		// Get the current view
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		// Get the editor
		const editor = view.editor;
		if (!editor) return;

		// Find the exact line with this content in the source
		const targetLine = this.findSourceLineByContent(editor, sourceContent);
		if (targetLine === -1) return;

		// Switch to source mode if in live preview
		if (view.getMode() === "preview") {
			await view.setState({ mode: "source" }, { history: false });
		}

		// Focus and select the target line
		const lineContent = editor.getLine(targetLine);
		const lineStart = { line: targetLine, ch: 0 };
		const lineEnd = { line: targetLine, ch: lineContent.length };

		editor.setSelection(lineStart, lineEnd);
		editor.focus();
		editor.scrollIntoView({ from: lineStart, to: lineEnd });
	}

	private findSourceLineByContent(editor: Editor, content: string): number {
		const editorContent = editor.getValue();
		const lines = editorContent.split("\n");

		// Search for the exact line content
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line === content) {
				return i;
			}
		}

		// If no exact match, try to find a line that contains the content
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.includes(content) || content.includes(line)) {
				return i;
			}
		}

		return -1;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class LazarusSettingTab extends PluginSettingTab {
	plugin: LazarusPlugin;

	constructor(app: App, plugin: LazarusPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Margin width setting with validation
		new Setting(containerEl)
			.setName("Margin width")
			.setDesc(
				"Set the margin width around the dialogue. Narrow (≤6rem), Default (10rem), Wide (≥12rem), or Auto (max-content) margins are supported. Use CSS units like 5rem, 15rem, auto, or max-content."
			)
			.addText((text) => {
				text.setPlaceholder("10rem")
					.setValue(this.plugin.settings.marginWidth)
					.onChange(async (value) => {
						const trimmedValue = value.trim();

						if (this.plugin.isValidCSSLength(trimmedValue)) {
							// Valid CSS value
							text.inputEl.removeClass("lt-invalid-input");
							this.plugin.settings.marginWidth = trimmedValue;
							await this.plugin.saveSettings();
							this.plugin.applySettings();
						} else {
							// Invalid CSS value - show visual feedback
							text.inputEl.addClass("lt-invalid-input");
							if (trimmedValue) {
								new Notice(
									"Invalid CSS length. Use values like 10rem, 150px, 20%, auto, or max-content.",
									3000
								);
							}
						}
					});

				// Apply initial styling if needed
				if (
					!this.plugin.isValidCSSLength(
						this.plugin.settings.marginWidth
					)
				) {
					text.inputEl.addClass("lt-invalid-input");
				}
			});
	}
}
