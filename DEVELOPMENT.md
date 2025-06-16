# Development Guide for Study Sphere

Welcome to the development guide for **Study Sphere** — your all-in-one platform for studying smarter with notes, quizzes, and AI assistance.

---

## Project Setup

### Prerequisites

* **Bun** (JavaScript runtime) - [Install Bun](https://bun.sh/docs/installation)
* **Node.js** (Fallback)
* **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/k0msenapati/study-sphere.git
cd study-sphere
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_key_here
```

### 4. Run the Development Server

```bash
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
study-sphere/
├── public/
├── src/
│   ├── app/              # Next.js pages & routing
│   ├── components/       # UI components
│   ├── lib/              # Utility libraries
├── .env.local            # API Keys
├── next.config.mjs       # Next.js config
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config
└── biome.json            # Code formatting
```

---

## Testing & Linting

* **Biome** is used for formatting and linting.

```bash
bun run lint
bun run format
```

---

## Useful Scripts

| Script       | Description           |
| ------------ | --------------------- |
| `bun dev`    | Start dev server      |
| `bun build`  | Build for production  |
| `bun lint`   | Lint codebase (Biome) |
| `bun format` | Format code (Biome)   |

---

## Troubleshooting

* **Bun not working?** Try switching to Node.js + npm/yarn.
* **GROQ\_API\_KEY invalid?** Ensure your key is correct and has access to GROQ services.

---

Happy hacking! 🎉
