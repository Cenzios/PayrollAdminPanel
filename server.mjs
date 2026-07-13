import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 80;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
    // Handle runtime config
    if (req.url === '/config.js') {
        const config = {
            VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
            VITE_DEBUG_MESSAGE: process.env.VITE_DEBUG_MESSAGE || 'Production Build',
        };
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(`window.RUNTIME_CONFIG = ${JSON.stringify(config)};`);
        return;
    }

    let filePath = req.url === '/' ? '/index.html' : req.url;
    // Remove query strings
    filePath = filePath.split('?')[0];

    let fullPath = path.join(__dirname, 'dist', filePath);

    // SPA fallback: if file doesn't exist, serve index.html
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        fullPath = path.join(__dirname, 'dist', 'index.html');
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            console.error(`Error reading ${fullPath}:`, err);
            res.writeHead(500);
            res.end('Server Error');
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': filePath === '/index.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Frontend server running on port ${PORT}`);
    console.log(`📂 Serving from: ${path.join(__dirname, 'dist')}`);
});
