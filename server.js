const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const https = require('https');
const http = require('http');
const app = express();

app.use(cors());

app.get('/video', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL manquante');
    
    exec(`yt-dlp -f "best[ext=mp4][height<=720]/best[ext=mp4]/best" --get-url "${url}"`, (err, stdout, stderr) => {
        if (err) return res.status(500).send('Erreur: ' + stderr);
        
        const videoUrl = stdout.trim().split('\n')[0];
        
        const protocol = videoUrl.startsWith('https') ? https : http;
        protocol.get(videoUrl, (videoRes) => {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
            if (videoRes.headers['content-length']) {
                res.setHeader('Content-Length', videoRes.headers['content-length']);
            }
            videoRes.pipe(res);
        }).on('error', (e) => res.status(500).send('Erreur stream'));
    });
});

app.get('/health', (req, res) => res.send('OK'));
app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));
