# Lazarus Transcript Plugin for Obsidian

Lazarus Transcript is an Obsidian plugin that enables a lightweight syntax for creating inline quotes and dialogues with support for markdown formatting. This plugin is perfect for transcribing conversations, quotes, or dialogues in a visually appealing way while using standard markdown for styling, such as _italic_ and **bold**.

## Installation

1. **Download the plugin**:
   - Clone or download this repository to your local machine.

2. **Install the plugin**:
   - In Obsidian, open the **Settings** menu.
   - Go to the **Community Plugins** section.
   - Enable **Safe Mode** (if not already enabled).
   - Click on **Open Plugins Folder**.
   - Copy the downloaded folder containing the plugin into this directory.

3. **Enable the plugin**:
   - Go back to Obsidian and open the **Settings** menu again.
   - Go to **Community Plugins**.
   - Enable the "Lazarus Transcript" plugin.

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
   git clone https://github.com/Fermain/lazarus-transcript.git
   cd lazarus-transcript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Copy the `main.js` and `manifest.json` files from the `dist/` folder into your Obsidian plugins folder.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
