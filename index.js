#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Write project name:');
  console.log('npx github:namaskaro/create-my-react my-app');
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
console.log(
  chalk.green(`Creating React + Vite + TypeScript project: ${projectName}`),
);

// 1. Создаём папку проекта
fs.mkdirSync(projectPath, { recursive: true });
process.chdir(projectPath);

// 2. Инициализация npm
execSync('npm init -y', { stdio: 'inherit' });

// 3. Устанавливаем React, Vite, TypeScript и React Router
console.log(
  chalk.green(
    'Installing React, ReactDOM, Vite, TypeScript and React Router...',
  ),
);
execSync(
  'npm install react react-dom react-router-dom vite typescript tsconfig-paths @vitejs/plugin-react',
  { stdio: 'inherit' },
);

// 4. Инициализируем tsconfig.json, если нет
if (!fs.existsSync('tsconfig.json')) {
  execSync('npx tsc --init', { stdio: 'inherit' });
}

// 5. Устанавливаем TailwindCSS
console.log(chalk.green('Installing TailwindCSS...'));
execSync('npm install -D tailwindcss postcss autoprefixer', {
  stdio: 'inherit',
});
const tailwindBinary = path.join(
  projectPath,
  'node_modules',
  '.bin',
  'tailwindcss',
);
execSync(`${tailwindBinary} init -p`, { stdio: 'inherit' });

// 6. Устанавливаем shadcn/ui
console.log(chalk.green('Installing shadcn/ui...'));
execSync('npm install @shadcn/ui', { stdio: 'inherit' });
const shadcnBinary = path.join(
  projectPath,
  'node_modules',
  '.bin',
  'shadcn-ui',
);
execSync(`${shadcnBinary} init -y`, { stdio: 'inherit' });

// 7. Создаём FSD структуру
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

// 8. Настраиваем alias для TypeScript
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

// 9. Настраиваем alias для Vite
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

// 10. Создаём базовые файлы React
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

// 11. Финальный вывод
console.log(chalk.green('\nProject created successfully!'));
console.log(`cd ${projectName}`);
console.log('npm run dev');
