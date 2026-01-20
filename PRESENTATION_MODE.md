# 🎯 Presentation Mode - VS Code Settings

## Overview

This file explains the VS Code settings configured for **clean presentation** during class demonstrations.

## What's Hidden in VS Code

For a clean presentation, the following are **hidden** in VS Code:
- ✅ All documentation files (`.md` files)
- ✅ All diagram guides (`HOW_TO_CREATE_*.md`)
- ✅ All utility scripts (`.js` helper files)
- ✅ All PowerShell scripts (`.ps1` files)
- ✅ Database dumps and temporary files

## What's Visible in VS Code

Only **source code** and **configuration files** are visible:
- ✅ `src/` - React components and pages
- ✅ `server.js` - Backend Express server
- ✅ `prisma/` - Database schema
- ✅ `services/` - Business logic services
- ✅ `public/` - Static assets
- ✅ `package.json` - Dependencies
- ✅ `vite.config.mjs` - Build configuration
- ✅ `tailwind.config.js` - Styling configuration
- ✅ `.vscode/` - VS Code settings

## Accessing Documentation

**All documentation is still accessible in:**
1. **Cursor IDE** - Open the project in Cursor to see all files
2. **File Explorer** - Navigate to the project folder in Windows Explorer
3. **GitHub** - All files are committed to the repository

## Key Documentation Files

When you need documentation, access these in Cursor or File Explorer:
- `PROJECT_DOCUMENTATION.md` - Complete project documentation (Chapters 1-8)
- `ALL_DIAGRAM_GUIDES.md` - Master guide for all diagrams
- `HOW_TO_CREATE_*.md` - Individual diagram creation guides (7 files)
- `README.md` - Project overview

## Running the System

To run the system in VS Code:

1. **Use VS Code Tasks:**
   - Press `Ctrl+Shift+P`
   - Type "Tasks: Run Task"
   - Select "🚀 Start Full System (Frontend + Backend)"

2. **Or use Terminal:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Prisma Studio: Run `npm run prisma:studio`

## Presentation Tips

1. **Clean Interface:** VS Code shows only source code
2. **Focus on Code:** Highlight React components, API endpoints, database schema
3. **Live Demo:** Run the system and show it working
4. **Architecture:** Show the folder structure and explain the stack

## Need Documentation During Presentation?

If you need to reference documentation during presentation:
- Open Cursor IDE in a separate window
- Or use File Explorer to navigate to `.md` files
- Or access GitHub repository online

---

**Note:** This is a presentation-friendly configuration. All files are still in the project and accessible when needed.
