# Lazarus Transcript Plugin for Obsidian

Lazarus Transcript is an Obsidian plugin that enables a lightweight syntax for creating inline quotes and dialogues with support for markdown formatting. This plugin is perfect for transcribing conversations, quotes, or dialogues in a visually appealing way while using standard markdown for styling, such as _italic_ and **bold**.

## Installation

### From Community Plugins (Recommended)

1. In Obsidian, open **Settings** → **Community Plugins**
2. Click **Browse** and search for "Lazarus Transcript"  
3. Click **Install** and then **Enable**

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/Fermain/obsidian-lazarus-transcript/releases)
2. Extract the files to your vault's `.obsidian/plugins/lazarus-transcript/` folder
3. Reload Obsidian and enable the plugin in **Settings** → **Community Plugins**

## Usage

### Syntax

Once the plugin is enabled, you can create inline quotes and dialogues using the `lt` code block.

#### Basic Example

```lt
Timmy
How do you do, sir?
```

This will render as:

> **Timmy**: How do you do, sir?

#### Multi-line Example with Markdown

You can also use markdown formatting (e.g., _italic_, **bold**) within your dialogues.

```lt
Unknown (Male)
How do you do, sir?

James
I'm fine, thank you!  
_And you?_
```

This will render as:

> **Unknown (Male)**: How do you do, sir?  
> **James**: I'm fine, thank you!  
> _And you?_

### Customizing Margins

You can adjust the margin width around your quotes to suit your preference:

1. Open **Settings** > **Lazarus Transcript**.
2. Adjust the **Margin Width** (e.g., `10rem`, `15px`, `auto`, or `max-content`).

This allows you to fine-tune the visual layout of your dialogues to fit the style of your note.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Obsidian](https://obsidian.md/)

### Build Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/Fermain/obsidian-lazarus-transcript.git
   cd obsidian-lazarus-transcript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. The built files (`main.js`, `manifest.json`, `styles.css`) will be in the root directory, ready for use.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
