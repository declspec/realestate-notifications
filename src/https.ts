import { get as httpsGet } from 'https';

export function get(url: string) {
    return new Promise<string>((resolve, reject) => {
        const req = httpsGet(url, res => {
            let html = '';
            
            res.on('data', (data: string) => html += data);
            res.on('end', () => resolve(html));
            res.on('error', reject);
        }).on('error', reject);
    
        req.shouldKeepAlive = false;
    });
}