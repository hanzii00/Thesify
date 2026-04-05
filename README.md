# Thesify

A capstone project generator powered by Groq and Llama. Thesify helps students generate and structure capstone/thesis content using AI, built as a modern web application.

**Live Demo:** [thesify.netlify.app](http://thesify.netlify.app)

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **AI:** Groq API + Llama (via API calls)
- **Routing:** React Router DOM v6
- **Forms:** React Hook Form + Zod
- **State/Data:** TanStack Query
- **Animations:** Framer Motion
- **Document Export:** docx
- **Testing:** Vitest + Playwright

---

## Project Structure

```
Thesify/
├── public/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Route-level pages
│   └── ...
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Groq API key

### Installation

```bash
# Clone the repository
git clone https://github.com/hanzii00/Thesify.git
cd Thesify

# Install dependencies
npm install
# or
bun install
```

### Environment Variables

Create a `.env` file in the root directory and add your Groq API key:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Run end-to-end tests (Playwright)
npx playwright test
```

---

## Deployment

The app is deployed on Netlify. To deploy your own instance:

1. Build the project with `npm run build`
2. Deploy the `dist/` folder to Netlify or any static hosting provider

---

## License

This project is currently unlicensed. All rights reserved by the author.