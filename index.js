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

execSync(`npm init -y`, { stdio: 'inherit' });

// Устанавливаем React, ReactDOM, Vite и TypeScript
console.log(
  chalk.green(
    'Installing React, ReactDOM, Vite, TypeScript and React Router...',
  ),
);
execSync(`npm install react react-dom react-router-dom`, { stdio: 'inherit' });
execSync(
  `npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom`,
  {
    stdio: 'inherit',
  },
);

// Устанавливаем Tailwind и плагины для Vite
console.log(chalk.green('Installing TailwindCSS + plugins...'));
execSync(`npm install -D tailwindcss @tailwindcss/vite @tailwindcss/postcss`, {
  stdio: 'inherit',
});

// Создаём структуру Feature-Sliced Design
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

// Создаём tsconfig.json с правильными путями и настройками
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

// Создаём базовый index.css с Tailwind
fs.mkdirSync('src', { recursive: true });
fs.writeFileSync(path.join('src', 'index.css'), `@tailwindcss;`);

// Обновляем package.json для type="module" и скриптов
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
console.log(`npm run dev`);
