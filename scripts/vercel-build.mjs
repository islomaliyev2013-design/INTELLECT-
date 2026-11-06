import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const isLinux = process.platform === 'linux';

if (isLinux) {
  try {
    // Ensure Linux native binaries exist if Windows node_modules was committed to Git
    const needsFreshLinuxInstall =
      !existsSync('./node_modules/@esbuild/linux-x64') ||
      !existsSync('./node_modules/@rollup/rollup-linux-x64-gnu');

    if (needsFreshLinuxInstall) {
      console.log('Detected Windows node_modules on Linux build server. Reinstalling clean Linux dependencies...');
      execSync('rm -rf node_modules package-lock.json && npm install --legacy-peer-deps --no-audit --no-fund', {
        stdio: 'inherit',
      });
    }

    // Ensure all binaries inside node_modules have +x permission on Linux
    execSync('chmod -R +x ./node_modules/.bin ./node_modules/@esbuild ./node_modules/esbuild 2>/dev/null || true', {
      stdio: 'inherit',
    });
  } catch (err) {
    console.warn('Linux pre-build permission fix warning:', err.message);
  }
}

// Run Vite build directly via Node (bypasses .bin/vite shell permission issues)
execSync('node ./node_modules/vite/bin/vite.js build', {
  stdio: 'inherit',
});

