# MPEG to MP3 Converter Web App

A modern, fast, and entirely client-side web application that converts MPEG audio files to MP3 natively inside your browser. Built with React, TypeScript, Tailwind CSS, and `ffmpeg.wasm`.

## Features
- **Client-Side Processing**: Files are processed locally on the user's device using WebAssembly. No files are uploaded to any backend servers.
- **Privacy First**: "Your files stay on your device."
- **Batch Processing**: Upload multiple files and convert them seamlessly.
- **Conversion Settings**: Choose custom audio bitrates and sample rates.
- **Modern UI**: A responsive, vibrant interface built with Tailwind CSS.

## Getting Started Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🚀 Deployment Guide

This project is configured to run flawlessly on Vercel, including the specialized security headers required to run `ffmpeg.wasm`.

### Step 1: Upload to GitHub
1. Create a new repository on [GitHub](https://github.com/new). Do not initialize it with a README.
2. Open your terminal in this project's directory and run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MPEG to MP3 Converter"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```
   *(Be sure to replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details).*

### Step 2: Deploy to Vercel (For Free)
1. Go to [Vercel](https://vercel.com/) and sign up or log in using your GitHub account.
2. Click **Add New** > **Project**.
3. Find your newly created GitHub repository in the list and click **Import**.
4. Configure the Project:
   - **Framework Preset**: Vercel should automatically detect `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**!

### Important: Why `vercel.json` is included
To use the multi-threaded capabilities of `ffmpeg.wasm`, the browser requires a technology called `SharedArrayBuffer`. Browsers strictly enforce security policies that require specific HTTP headers to enable this feature.

This repository includes a `vercel.json` file that automatically configures Vercel to serve the site with the following headers:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Without this file, the conversion engine would fail to load in a production environment.

## Tech Stack
- React 18
- Vite
- TypeScript
- Tailwind CSS v4
- ffmpeg.wasm
- lucide-react
