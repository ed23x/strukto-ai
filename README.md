# Struckto AI

**Struckto AI** is a modern web-based Nassi-Shneiderman diagram editor. It uses Artificial Intelligence to analyze your source code and automatically generate structured, visual algorithms (Struktogramme).

![Struckto AI Interface](https://via.placeholder.com/800x400?text=Struckto+AI+Interface+Preview)

## Features

- 🧠 **AI-Powered Generation**: Converts code (Java, Python, C++, JS, etc.) into diagrams using the **Xiaomi Mimo V2 Flash** model (via OpenRouter).
- 🎨 **Visual Rendering**: Renders Sequences, Loops, If/Else blocks (with diagonal headers), and Switch statements dynamically.
- 🌓 **Dark/Light Mode**: Fully responsive UI with theme support.
- 📤 **Export**:
  - **Single Export**: Download individual function diagrams as PNGs.
  - **Bulk Export**: Download all generated diagrams at once.
- 🛠 **Customizable**: Settings panel to provide your own API Key.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: [OpenAI SDK](https://github.com/openai/openai-node) (configured for [OpenRouter](https://openrouter.ai/))
- **Export**: `html-to-image`
- **Icons**: `lucide-react`

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- An API Key from [OpenRouter](https://openrouter.ai/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/struckto-ai.git
    cd struckto-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and add your OpenRouter API Key:
    ```env
    OPENROUTER_API_KEY=sk-or-v1-your-key-here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  Paste your source code into the editor on the left.
2.  Click **"Generate Diagrams"**.
3.  View the generated Nassi-Shneiderman diagrams on the right.
4.  Click **Export All** or the individual download icons to save them as images.

## License

MIT