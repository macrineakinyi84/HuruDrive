# 🚀 How to Run the System in VS Code

## Method 1: Using VS Code Tasks (Easiest)

1. **Press `Ctrl+Shift+P`** (or `Cmd+Shift+P` on Mac)
2. **Type:** `Tasks: Run Task`
3. **Select:** `🚀 Start Full System (Frontend + Backend)`
4. **Done!** Both servers will start automatically

---

## Method 2: Using Integrated Terminal

1. **Open Terminal:**
   - Press `` Ctrl+` `` (backtick) OR
   - Go to: `Terminal → New Terminal`

2. **Run the system:**
   ```bash
   npm run dev
   ```

3. **Access your app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## Method 3: Using Terminal Split View

1. **Open Terminal:** `` Ctrl+` ``
2. **Split Terminal:** Click the `+` icon or press `` Ctrl+Shift+` ``
3. **Terminal 1 - Backend:**
   ```bash
   npm run dev:server
   ```
4. **Terminal 2 - Frontend:**
   ```bash
   npm run dev:client
   ```

---

## Quick Commands

### Start Everything
```bash
npm run dev
```

### Backend Only
```bash
npm run dev:server
```

### Frontend Only
```bash
npm run dev:client
```

### Open Database (Prisma Studio)
```bash
npm run prisma:studio
```

---

## What Happens When You Run

✅ **Backend Server** starts on `http://localhost:3000`
- API endpoints available
- Database connected

✅ **Frontend Server** starts on `http://localhost:5173`
- React app loads
- Automatically opens in browser

---

## Troubleshooting

### Port Already in Use?
- Close other terminals running the servers
- Or change ports in `vite.config.mjs` and `server.js`

### Database Connection Error?
- Make sure PostgreSQL is running
- Check `.env` file has correct `DATABASE_URL`

### Can't See Terminal?
- Press `` Ctrl+` `` to toggle terminal
- Or: `View → Terminal`

---

## 🎯 Recommended: Use Tasks

**Just press `Ctrl+Shift+P` → `Tasks: Run Task` → `🚀 Start Full System`**

It's the easiest way! 🚀
