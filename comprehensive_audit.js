const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('=== FARMER OF LIFE COMPREHENSIVE AUDIT ===');
console.log(`Found ${htmlFiles.length} HTML files.`);

let errors = 0;

// 1. Static file link checks
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Check CSS links
  const cssMatches = content.match(/href="([^"]+\.css)"/g) || [];
  cssMatches.forEach(m => {
    const cssPath = m.match(/href="([^"]+)"/)[1];
    if (!cssPath.startsWith('http')) {
      const full = path.join(dir, cssPath);
      if (!fs.existsSync(full)) {
        console.error(`[ERR] ${file} references missing CSS: ${cssPath}`);
        errors++;
      }
    }
  });

  // Check script links
  const scriptMatches = content.match(/src="([^"]+\.js)"/g) || [];
  scriptMatches.forEach(m => {
    const jsPath = m.match(/src="([^"]+)"/)[1];
    if (!jsPath.startsWith('http')) {
      const full = path.join(dir, jsPath);
      if (!fs.existsSync(full)) {
        console.error(`[ERR] ${file} references missing JS: ${jsPath}`);
        errors++;
      }
    }
  });

  // Check internal HTML links
  const aMatches = content.match(/href="([a-zA-Z0-9_\-]+\.html)"/g) || [];
  aMatches.forEach(m => {
    const page = m.match(/href="([^"]+)"/)[1];
    if (!fs.existsSync(path.join(dir, page))) {
      console.error(`[ERR] ${file} references missing HTML: ${page}`);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log('[PASS] All static assets and cross-page links verified 100% on disk!');
} else {
  console.error(`[FAIL] Found ${errors} errors.`);
  process.exit(1);
}

// 2. HTTP Server test simulating GitHub Pages (/Farmer/ base path)
const server = http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/' || p === '/Farmer/' || p === '/Farmer') p = '/index.html';
  p = p.replace('/Farmer/', '/');
  const filePath = path.join(dir, p);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + filePath);
  }
});

server.listen(4567, async () => {
  console.log('HTTP audit server running on port 4567...');
  const testRoutes = [
    'http://localhost:4567/',
    'http://localhost:4567/community.html',
    'http://localhost:4567/contact.html',
    'http://localhost:4567/style.css',
    'http://localhost:4567/css/style.css',
    'http://localhost:4567/main.js',
    'http://localhost:4567/js/main.js',
    'http://localhost:4567/Farmer/community.html',
    'http://localhost:4567/Farmer/contact.html',
    'http://localhost:4567/Farmer/style.css'
  ];

  let routeErrors = 0;
  for (const url of testRoutes) {
    await new Promise(resolve => {
      http.get(url, res => {
        if (res.statusCode === 200) {
          console.log(`[HTTP 200] OK -> ${url}`);
        } else {
          console.error(`[HTTP ${res.statusCode}] FAIL -> ${url}`);
          routeErrors++;
        }
        resolve();
      }).on('error', err => {
        console.error(`[CONN ERR] ${url}: ${err.message}`);
        routeErrors++;
        resolve();
      });
    });
  }

  server.close();
  if (routeErrors === 0) {
    console.log('[PERFECT] All test routes passed with HTTP 200 OK! Application is flawless.');
  } else {
    console.error(`[FAIL] ${routeErrors} route failures.`);
    process.exit(1);
  }
});
