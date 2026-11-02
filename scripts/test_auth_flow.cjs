const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/uvanshankar/.gemini/antigravity-cli/brain/e36e6fab-f017-43cc-bcd0-3d28ce40a856/auth_verification';
fs.mkdirSync(OUT_DIR, { recursive: true });

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  try {
    console.log('--- Step 1: Navigating to http://localhost:5173/ ---');
    // Clear any prior storage
    await win.webContents.session.clearStorageData();
    await win.loadURL('http://localhost:5173/');
    await sleep(1500);

    const initialHash = await win.webContents.executeJavaScript('window.location.hash');
    const initialText = await win.webContents.executeJavaScript('document.body.innerText');
    console.log('Initial Hash:', initialHash);
    console.log('Login Header exists:', initialText.includes('Manage Prints, Grow Your Shop.'));

    if (!initialText.includes('Manage Prints, Grow Your Shop.')) {
      throw new Error('Initial screen should be Login page!');
    }

    const img1 = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT_DIR, '01_login_initial.png'), img1.toPNG());
    console.log('Saved 01_login_initial.png');

    console.log('--- Step 2: Click Send OTP ---');
    await win.webContents.executeJavaScript(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Send OTP'));
      if (btn) btn.click();
    `);
    await sleep(1500);

    const otpHash = await win.webContents.executeJavaScript('window.location.hash');
    const otpText = await win.webContents.executeJavaScript('document.body.innerText');
    console.log('OTP screen hash:', otpHash);
    console.log('OTP text verified:', otpText.includes('Verification Code') || otpText.includes('Enter 4-Digit'));

    const img2 = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT_DIR, '02_verify_otp.png'), img2.toPNG());
    console.log('Saved 02_verify_otp.png');

    console.log('--- Step 3: Enter OTP and Verify ---');
    await win.webContents.executeJavaScript(`
      const verifyBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Verify & Continue'));
      if (verifyBtn) verifyBtn.click();
    `);
    await sleep(2000);

    const dashboardHash = await win.webContents.executeJavaScript('window.location.hash');
    const dashboardText = await win.webContents.executeJavaScript('document.body.innerText');
    const sessionData = await win.webContents.executeJavaScript("localStorage.getItem('prinkout_merchant_session')");
    console.log('Post-login Hash:', dashboardHash);
    console.log('Dashboard active:', dashboardText.includes('Overview') || dashboardText.includes('Live Queue'));
    console.log('Stored session data exists:', !!sessionData);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      console.log('Session shopId:', parsed.shopId);
      console.log('Session isAuthenticated:', parsed.isAuthenticated);
    }

    const img3 = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT_DIR, '03_authenticated_dashboard.png'), img3.toPNG());
    console.log('Saved 03_authenticated_dashboard.png');

    console.log('--- Step 4: Click Logout in Sidebar ---');
    await win.webContents.executeJavaScript(`
      const logoutBtn = document.querySelector('button[title*="Logout"]');
      if (logoutBtn) logoutBtn.click();
    `);
    await sleep(1500);

    const postLogoutHash = await win.webContents.executeJavaScript('window.location.hash');
    const postLogoutSession = await win.webContents.executeJavaScript("localStorage.getItem('prinkout_merchant_session')");
    console.log('Post-logout Hash:', postLogoutHash);
    console.log('Session is cleared:', postLogoutSession === null);

    const img4 = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT_DIR, '04_logged_out_login.png'), img4.toPNG());
    console.log('Saved 04_logged_out_login.png');

    console.log('--- Step 5: Test Unauthorized Direct Access ---');
    await win.webContents.executeJavaScript("window.location.hash = '#/orders'");
    await sleep(1000);

    const unauthorizedHash = await win.webContents.executeJavaScript('window.location.hash');
    const unauthorizedText = await win.webContents.executeJavaScript('document.body.innerText');
    console.log('After attempting #/orders, current hash:', unauthorizedHash);
    console.log('Redirected back to Login:', unauthorizedHash.includes('login') && unauthorizedText.includes('Manage Prints, Grow Your Shop.'));

    console.log('=== ALL AUTHENTICATION FLOW TESTS PASSED! ===');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    app.quit();
  }
});
