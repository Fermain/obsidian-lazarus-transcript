import { Plugin, PluginSettingTab, Setting, App, MarkdownRenderer } from "obsidian";

interface LazarusPluginSettings {
	colorScheme: string; 
	marginWidth: string; 
}

const DEFAULT_SETTINGS: LazarusPluginSettings = {
	colorScheme: 'dark',
	marginWidth: '10rem', 
};

export default class LazarusPlugin extends Plugin {
	settings: LazarusPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new LazarusSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("lt", this.lazarusTranscript.bind(this));

		this.applySettings();
	}

	applySettings() {
		const root = document.documentElement;

		// Apply margin width
		root.style.setProperty('--lt-margin-width', this.settings.marginWidth);
	}

	lazarusTranscript(source: string, el: HTMLElement) {
		this.processDialog(source, el.createEl("blockquote", { cls: "lt" }));
	}

	private async processDialog(source: string, container: HTMLElement) {
		const lines = source.split("\n").filter(Boolean);
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			const element = container.createEl(i ? 'q' : 'strong', { cls: `lt-${i ? 'line' : 'speaker'}`});
			
			// Render markdown for each line of text
			await MarkdownRenderer.renderMarkdown(line, element, "", this);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

		// Margin width setting
		new Setting(containerEl)
			.setName('Margin Width')
			.setDesc('Set the margin width around the dialogue (e.g., 10rem, 15px, auto, max-content).')
			.addText(text => text
				.setPlaceholder('10rem')
				.setValue(this.plugin.settings.marginWidth)
				.onChange(async (value) => {
					this.plugin.settings.marginWidth = value;
					await this.plugin.saveSettings();
					this.plugin.applySettings();
				}));
	}
}
