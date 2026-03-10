#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Usage: npx create-my-react my-app');
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

console.log(`Creating project: ${projectName}`);

fs.mkdirSync(projectPath, { recursive: true });
process.chdir(projectPath);

/* =========================
   PACKAGE.JSON
========================= */

const pkg = {
  name: projectName,
  version: '1.0.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

/* =========================
   INSTALL DEPENDENCIES
========================= */

console.log('Installing dependencies...');

execSync('npm install react react-dom react-router-dom', { stdio: 'inherit' });

execSync('npm install -D vite typescript @vitejs/plugin-react', {
  stdio: 'inherit',
});

execSync('npm install -D tailwindcss @tailwindcss/vite @tailwindcss/postcss', {
  stdio: 'inherit',
});

/* =========================
   TYPESCRIPT
========================= */

console.log('Creating TypeScript config...');

execSync('npx tsc --init', { stdio: 'inherit' });

/* =========================
   FSD STRUCTURE
========================= */

console.log('Creating FSD structure...');

const folders = [
  'src',
  'src/app',
  'src/pages',
  'src/widgets',
  'src/features',
  'src/entities',
  'src/shared/ui',
  'src/shared/lib',
  'src/shared/api',
  'src/shared/config',
];

folders.forEach((folder) => {
  fs.mkdirSync(folder, { recursive: true });
});

/* =========================
   VITE CONFIG
========================= */

console.log('Creating vite.config.ts');

fs.writeFileSync(
  'vite.config.ts',
  `import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ]
})
`,
);

/* =========================
   POSTCSS
========================= */

fs.writeFileSync(
  'postcss.config.js',
  `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
`,
);

/* =========================
   TAILWIND
========================= */

fs.writeFileSync(
  'tailwind.config.js',
  `export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
);

/* =========================
   HTML
========================= */

fs.writeFileSync(
  'index.html',
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>React App</title>
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
</body>
</html>
`,
);

/* =========================
   CSS
========================= */

fs.writeFileSync(
  'src/index.css',
  `@import "tailwindcss";
`,
);

/* =========================
   REACT FILES
========================= */

fs.writeFileSync(
  'src/main.tsx',
  `import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./app/App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
`,
);

fs.writeFileSync(
  'src/app/App.tsx',
  `export default function App() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold">
        React + Vite + Tailwind + FSD
      </h1>
    </div>
  )
}
`,
);

/* =========================
   DONE
========================= */

console.log('');
console.log('Project created successfully!');
