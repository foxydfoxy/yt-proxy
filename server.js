const express = require('express');
const cors = require('cors');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
app.use(cors());

// Copier cookies dans un dossier accessible
try {
    fs.copyFileSync('/etc/secrets/cookies.txt', '/tmp/cookies.txt');
    console.log('Cookies copiés dans /tmp/');
} catch(e) {
    console.log('Erreur copie cookies:', e.message);
}

app.get('/video', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL manquante');
    
    exec(`yt-dlp --cookies /tmp/cookies.txt --js-runtimes node:${process.execPath} -f "best[ext=mp4][height<=720]/best[ext=mp4]/best" --get-url "${url}"`,
    { timeout: 60000 },
    (err, stdout, stderr) => {
        if (err) return res.status(500).json({ error: stderr });
        const lines = stdout.trim().split('\n');
        const videoUrl = lines[lines.length - 1];
        res.json({ url: videoUrl });
    });
});

app.get('/health', (req, res) => res.send('OK'));

setInterval(() => {
    require('https').get('https://yt-proxy-w57x.onrender.com/health', () => {}).on('error', () => {});
}, 10 * 60 * 1000);

app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));
