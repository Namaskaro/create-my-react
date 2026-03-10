#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Usage:');
  console.log('npx create-my-react my-app');
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

console.log(`Creating project: ${projectName}`);

fs.mkdirSync(projectPath, { recursive: true });
process.chdir(projectPath);

execSync('npm init -y', { stdio: 'inherit' });

console.log('Installing dependencies...');

execSync(
  'npm install react react-dom react-router-dom vite typescript @vitejs/plugin-react',
  { stdio: 'inherit' },
);

execSync('npm install -D tailwindcss @tailwindcss/vite @tailwindcss/postcss', {
  stdio: 'inherit',
});

console.log('Creating project structure...');

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

console.log('Creating tsconfig...');

execSync('npx tsc --init', { stdio: 'inherit' });

console.log('Creating Tailwind config...');

fs.writeFileSync(
  'tailwind.config.js',
  `/** @type {import('tailwindcss').Config} */
export default {
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

fs.writeFileSync(
  'postcss.config.js',
  `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
);

console.log('Creating Vite config...');

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

console.log('Creating HTML...');

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

console.log('Creating styles...');

fs.writeFileSync(
  'src/index.css',
  `@import "tailwindcss";
`,
);

console.log('Creating React files...');

fs.writeFileSync(
  'src/main.tsx',
  `import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
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

console.log('Updating package.json scripts...');

const pkg = JSON.parse(fs.readFileSync('package.json'));

pkg.scripts = {
  dev: 'vite',
  build: 'vite build',
  preview: 'vite preview',
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('');
console.log('Project created successfully');
console.log('');
console.log(`cd ${projectName}`);
console.log('npm run dev');
console.log('');
