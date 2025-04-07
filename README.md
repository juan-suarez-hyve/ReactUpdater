# HYVE Icons App

HYVE Icons App is an application developed with Electron and TypeScript that allows efficient management and visualization of icon packs

## Prerequisites

To run the project, make sure you meet the following requirements:

#### Required Software

- Node.js (version 18 or higher): Download it from Node.js or with nvm.
- npm (Node Package Manager): Installed with Node.js
- Git: Required to clone the repository. Download it from Git.

## Installation

### 1. Clone the Repository

   ```shell
   git clone https://github.com/your-username/hyve-icons-app
   ```
   ```shell
   cd hyve-icons-app
   ```
   
### 2. Set up the Environment

   #### Verify and install Node.js.

   If using nvm, install and use the correct Node.js version:

   ```shell
   nvm install
   ```
   ```shell
   nvm use
   ```

   #### Install Dependencies

   Run the following command to install all dependencies:

   ```shell
   npm ci    # or 'npm install'
   ```

## Usage

  ### Development Mode
  - To start the application with hot-reloading

  ```shell
  npm run dev
   ```

  ### Build for Production
  - To compile the application and generate executable binaries

   ```shell
   npm run build
   ```

  ### Run the Compiled Application
  - Run the application

   ```shell
   npm run start
   ```


## Project Structure

```plaintext
|--.vite/
|--css/
|--dist/
|--img/
|--node_modules
|--out/
|--public/                     # Static files
|--src                         # Main source code
    |--index.css               # CSS style file
    |--main.ts                 # Electron's main process
    |--renderer.ts             # User interface code
|--.eslintrc.json
|--.nvmrc
|--forge.config.ts
|--forge.env.d.ts
|--index.html                  # Base HTML file
|--package-lock.json
|--package.json                # Project configuration and dependencies
|--tsconfig.json
|--vite.main.config.ts
|--vite.preload.config.ts
|--vite.renderer.config.ts
```

## Technologies Used

  - **Electron:** Framework for building desktop applications 
  - **TypeScript:** Typed language for improved code safety
  - **Vite:** Bundling tool

  
