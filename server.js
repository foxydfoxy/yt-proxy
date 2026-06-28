const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());

app.get('/video', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL manquante');
    
    exec(`yt-dlp --cookies cookies.txt -f "best[ext=mp4][height<=720]/best[ext=mp4]/best" --get-url "${url}"`,
    { timeout: 30000 },
    (err, stdout, stderr) => {
        if (err) return res.status(500).json({ error: stderr });
        const videoUrl = stdout.trim().split('\n')[0];
        res.json({ url: videoUrl });
    });
});

app.get('/health', (req, res) => res.send('OK'));

setInterval(() => {
    require('https').get('https://yt-proxy-w57x.onrender.com/health', () => {}).on('error', () => {});
}, 10 * 60 * 1000);

app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));
