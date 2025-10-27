# Vercel Deployment Guide

This guide will walk you through deploying the Rock Paper Scissors FHEVM frontend to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (sign up at https://vercel.com)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel

1. Open https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your GitHub account

### Step 2: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"0xbyt4/zamagame"** and click **"Import"**

### Step 3: Configure Project Settings

Vercel should auto-detect the settings, but verify these:

**Framework Preset:** `Other`

**Root Directory:** `./` (leave as root)

**Build Command:**
```
cd frontend && npm run build
```

**Output Directory:**
```
frontend/dist
```

**Install Command:**
```
cd frontend && npm install
```

### Step 4: Environment Variables (Optional)

If you have environment variables in `frontend/.env`, add them:

1. Click **"Environment Variables"**
2. Add any variables from your `.env` file (if needed)
   - For this project, the Sepolia RPC URL is optional
   - Variable Name: `VITE_SEPOLIA_RPC_URL`
   - Value: `https://ethereum-sepolia.publicnode.com`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Once done, you'll get a URL like: `https://zamagame.vercel.app`

### Step 6: Test Your Deployment

1. Open the deployment URL
2. Connect your MetaMask wallet
3. Make sure you're on Sepolia network
4. Test creating and joining a game

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

From the project root directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? `zamagame` (or your choice)
- In which directory is your code located? `./`

The CLI will automatically use the `vercel.json` configuration.

### Step 4: Production Deployment

For production deployment:

```bash
vercel --prod
```

---

## Custom Domain (Optional)

### Add a Custom Domain

1. Go to your project on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency issues

**Solution:**
1. Make sure all dependencies are in `frontend/package.json`
2. Clear cache and redeploy: Settings → General → Clear Cache

### Environment Variables Not Working

**Error:** `undefined` values for env vars

**Solution:**
- Make sure env vars start with `VITE_` prefix
- Redeploy after adding environment variables

### Wrong Directory Structure

**Error:** `No output directory found`

**Solution:**
- Verify **Output Directory** is set to `frontend/dist`
- Verify **Build Command** includes `cd frontend &&`

---

## Expected Build Output

Successful build should show:

```
✓ Building...
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Output directory: frontend/dist
```

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Wallet connection works
- [ ] Network detection works (shows warning on wrong network)
- [ ] "Switch to Sepolia" button appears when needed
- [ ] Game creation works
- [ ] Game joining works
- [ ] Yellow favicon appears
- [ ] All styling looks correct

---

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches and pull requests

---

## Support

If you encounter issues:
- Check Vercel build logs in the deployment dashboard
- Verify all settings match this guide
- Make sure your GitHub repository is up to date

---

## Deployment URL

After successful deployment, your app will be live at:
- Production: `https://zamagame.vercel.app` (or your custom domain)
- Preview URLs: `https://zamagame-git-[branch].vercel.app`

Share the link and start playing encrypted Rock Paper Scissors! 🎮✨
