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

console.log(chalk.green('Creating React + Vite + TypeScript project...'));

execSync(`npm create vite@latest ${projectName} -- --template react-ts`, {
  stdio: 'inherit',
});

process.chdir(projectName);

console.log(chalk.green('Installing dependencies...'));
execSync(`npm install`, { stdio: 'inherit' });

console.log(chalk.green('Installing React Router...'));
execSync(`npm install react-router-dom`, { stdio: 'inherit' });

console.log(chalk.green('Installing Tailwind...'));
execSync(`npm install -D tailwindcss postcss autoprefixer`, {
  stdio: 'inherit',
});
execSync(`npx tailwindcss init -p`, { stdio: 'inherit' });

console.log(chalk.green('Installing shadcn/ui...'));
execSync(`npx shadcn-ui@latest init -y`, { stdio: 'inherit' });

/* =========================
   CREATE FSD STRUCTURE
========================= */

console.log(chalk.green('Creating Feature-Sliced Design structure...'));

fs.mkdirSync('src/app', { recursive: true });
fs.mkdirSync('src/pages', { recursive: true });
fs.mkdirSync('src/widgets', { recursive: true });
fs.mkdirSync('src/features', { recursive: true });
fs.mkdirSync('src/entities', { recursive: true });

fs.mkdirSync('src/shared/ui', { recursive: true });
fs.mkdirSync('src/shared/lib', { recursive: true });
fs.mkdirSync('src/shared/api', { recursive: true });
fs.mkdirSync('src/shared/config', { recursive: true });

/* =========================
   SETUP TYPESCRIPT ALIASES
========================= */

console.log(chalk.green('Configuring path aliases...'));

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

/* =========================
   CONFIGURE VITE ALIASES
========================= */

console.log(chalk.green('Configuring Vite aliases...'));

const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

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
})
`;

fs.writeFileSync('vite.config.ts', viteConfig);

/* =========================
   FINISH
========================= */

console.log('');
console.log(chalk.green('Project created successfully!'));
console.log('');
console.log(`cd ${projectName}`);
console.log(`npm run dev`);
