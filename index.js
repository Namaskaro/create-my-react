#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';

const projectName = process.argv[2];

if (!projectName) {
  console.log('Write project name:');
  console.log('npx github:namaskaro/create-my-react my-app');
  process.exit(1);
}

console.log(
  chalk.green(`Creating React + Vite + TypeScript project: ${projectName}`),
);

execSync(`npm create vite@latest ${projectName} -- --template react-ts`, {
  stdio: 'inherit',
});
process.chdir(projectName);

// Установка зависимостей
console.log(chalk.green('Installing dependencies...'));
execSync(`npm install`, { stdio: 'inherit' });
execSync(`npm install react-router-dom`, { stdio: 'inherit' });
execSync(`npm install -D tailwindcss postcss autoprefixer`, {
  stdio: 'inherit',
});
execSync(`npx tailwindcss init -p`, { stdio: 'inherit' });
execSync(`npx shadcn-ui@latest init -y`, { stdio: 'inherit' });

// Создание FSD структуры
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

// Настройка alias для TypeScript
console.log(chalk.green('Configuring TS paths...'));
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

// Настройка alias для Vite
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

console.log(chalk.green('\nProject created successfully!'));
console.log(`cd ${projectName}`);
console.log('npm run dev');
