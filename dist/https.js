"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
function get(url) {
    return new Promise((resolve, reject) => {
        const req = https_1.get(url, res => {
            let html = '';
            res.on('data', (data) => html += data);
            res.on('end', () => resolve(html));
            res.on('error', reject);
        }).on('error', reject);
        req.shouldKeepAlive = false;
    });
}
exports.get = get;
