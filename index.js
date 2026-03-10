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

const projectPath = path.resolve(process.cwd(), projectName);

console.log(
  chalk.green(`Creating React + Vite + TypeScript project: ${projectName}`),
);

// Создаём папку проекта
fs.mkdirSync(projectPath, { recursive: true });
process.chdir(projectPath);

// Инициализируем npm проект
execSync('npm init -y', { stdio: 'inherit' });

// Устанавливаем React, Vite и TypeScript
console.log(chalk.green('Installing React, ReactDOM, Vite and TypeScript...'));
execSync(
  'npm install react react-dom react-router-dom @vitejs/plugin-react vite typescript tsconfig-paths',
  { stdio: 'inherit' },
);

// Инициализируем tsconfig.json
if (!fs.existsSync('tsconfig.json')) {
  execSync('npx tsc --init', { stdio: 'inherit' });
}

// Устанавливаем TailwindCSS
console.log(chalk.green('Installing TailwindCSS...'));
execSync('npm install -D tailwindcss postcss autoprefixer', {
  stdio: 'inherit',
});
execSync('npx tailwindcss init -p', { stdio: 'inherit' });

// Устанавливаем shadcn/ui
console.log(chalk.green('Installing shadcn/ui...'));
execSync('npm install @shadcn/ui', { stdio: 'inherit' });
execSync('npx shadcn-ui init -y', { stdio: 'inherit' });

// Создаём FSD структуру
console.log(chalk.green('Creating Feature-Sliced Design structure...'));
[
  'src/app',
  'src/pages',
  'src/widgets',
  'src/features',
  'src/entities',
  'src/shared/ui',
  'src/shared/lib',
  'src/shared/api',
  'src/shared/config',
].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

// Настраиваем alias для TypeScript
console.log(chalk.green('Configuring TypeScript paths...'));
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json'));
tsconfig.compilerOptions = {
  ...tsconfig.compilerOptions,
  baseUrl: '.',
  paths: {
    '@/*': ['src/*'],
    '@app/*': ['src/app/*'],
    '@pages/*': ['src/pages/*'],
    '@widgets/*': ['src/widgets/*'],
    '@features/*': ['src/features/*'],
    '@entities/*': ['src/entities/*'],
    '@shared/*': ['src/shared/*'],
  },
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// Настраиваем alias для Vite
console.log(chalk.green('Configuring Vite aliases...'));
const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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

// Создаём базовые файлы React
fs.mkdirSync('src', { recursive: true });
fs.writeFileSync(
  'src/main.tsx',
  `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
);

fs.mkdirSync('src/app', { recursive: true });
fs.writeFileSync(
  'src/app/App.tsx',
  `
import React from 'react';

export default function App() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Hello, React + Tailwind + FSD!</h1>
    </div>
  );
}
`,
);

// Финальный вывод
console.log(chalk.green('\nProject created successfully!'));
console.log(`cd ${projectName}`);
console.log('npm run dev');
