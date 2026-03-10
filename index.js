#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Write project name:');
  console.log('npx create-my-react my-app');
  process.exit(1);
}

console.log(
  chalk.green(`Creating React + Vite + TypeScript project: ${projectName}`),
);

// Создаем проект без вопросов
execSync(
  `npm create vite@latest ${projectName} -- --template react-ts --yes --force`,
  { stdio: 'inherit' },
);

process.chdir(projectName);

// Устанавливаем базовые зависимости
console.log(
  chalk.green('Installing React, ReactDOM, React Router, TypeScript types...'),
);
execSync(
  'npm install react react-dom react-router-dom @types/react @types/react-dom',
  { stdio: 'inherit' },
);

// Устанавливаем TailwindCSS и PostCSS
console.log(chalk.green('Installing TailwindCSS and PostCSS...'));
execSync('npm install -D tailwindcss @tailwindcss/vite @tailwindcss/postcss', {
  stdio: 'inherit',
});
execSync('npx tailwindcss init -p', { stdio: 'inherit' });

// Устанавливаем shadcn/ui
console.log(chalk.green('Installing shadcn/ui...'));
execSync('npx shadcn-ui@latest init -y', { stdio: 'inherit' });

/* =========================
   CREATE FSD STRUCTURE
========================= */
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

/* =========================
   SETUP TYPESCRIPT CONFIG
========================= */
console.log(chalk.green('Configuring tsconfig.json...'));

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

/* =========================
   CONFIGURE VITE WITH ALIASES + TAILWIND
========================= */
console.log(chalk.green('Configuring vite.config.ts...'));

const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@shared": path.resolve(__dirname, "src/shared")
    }
  }
})
`;
fs.writeFileSync('vite.config.ts', viteConfig);

/* =========================
   FINISH
========================= */
console.log(chalk.green('\nProject created successfully!'));
console.log(`\nNext steps:`);
console.log(`cd ${projectName}`);
console.log(`npm install`);
console.log(`npm run dev`);
