#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Write project name:');
  console.log('npx create-my-react my-app');
  process.exit(1);
}

console.log(
  chalk.green(`Creating React + Vite + TypeScript project: ${projectName}`),
);

// Создаём папку проекта и инициализируем npm
fs.mkdirSync(projectName);
process.chdir(projectName);
execSync('npm init -y', { stdio: 'inherit' });

// Создаём index.html в корне проекта
fs.writeFileSync(
  path.join(projectName, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
);

// Устанавливаем React, ReactDOM, React Router, Vite и TypeScript
console.log(
  chalk.green('Installing React, ReactDOM, React Router, Vite, TypeScript...'),
);
execSync('npm install react react-dom react-router-dom', { stdio: 'inherit' });
execSync(
  'npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom',
  { stdio: 'inherit' },
);

// Устанавливаем Tailwind и плагины для Vite
console.log(chalk.green('Installing TailwindCSS + plugins...'));
execSync('npm install -D tailwindcss @tailwindcss/vite @tailwindcss/postcss', {
  stdio: 'inherit',
});

// Создаём FSD структуру
console.log(chalk.green('Creating Feature-Sliced Design structure...'));
const folders = [
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
folders.forEach((f) => fs.mkdirSync(f, { recursive: true }));

// Создаём tsconfig.json с путями
console.log(chalk.green('Creating tsconfig.json...'));
const tsconfig = {
  compilerOptions: {
    target: 'ES2017',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
      '@pages/*': ['./src/pages/*'],
      '@providers/*': ['./src/app/_/providers/*'],
      '@shared/*': ['./src/shared/*'],
      '@features/*': ['./src/features/*'],
      '@entities/*': ['./src/entities/*'],
      '@widgets/*': ['./src/widgets/*'],
    },
  },
  include: ['**/*.ts', '**/*.tsx'],
  exclude: ['node_modules'],
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// Создаём vite.config.ts с Tailwind плагином
console.log(chalk.green('Creating vite.config.ts...'));
const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared")
    }
  }
});
`;
fs.writeFileSync('vite.config.ts', viteConfig);

// Создаём index.css для Tailwind
fs.mkdirSync('src', { recursive: true });
fs.writeFileSync(
  path.join('src', 'index.css'),
  `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
);

// Создаём main.tsx с BrowserRouter
fs.writeFileSync(
  path.join('src', 'main.tsx'),
  `
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`,
);

// Создаём App.tsx
fs.mkdirSync('src/app', { recursive: true });
fs.writeFileSync(
  path.join('src/app', 'App.tsx'),
  `import React from 'react';

export default function App() {
  return (
    <div className="text-center text-blue-500">
      Hello, React + Vite + TypeScript + Tailwind + FSD!
    </div>
  );
}`,
);

// Обновляем package.json
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.type = 'module';
pkg.scripts = {
  dev: 'vite',
  build: 'vite build',
  preview: 'vite preview',
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('');
console.log(chalk.green('Project created successfully!'));
console.log('');
console.log(`cd ${projectName}`);
console.log('npm run dev');
