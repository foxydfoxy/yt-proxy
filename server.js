const express = require('express');
const cors = require('cors');
const { exec, execSync } = require('child_process');
const app = express();

app.use(cors());

try {
    execSync('yt-dlp --version');
    console.log('yt-dlp ok');
} catch(e) {
    try { execSync('pip install yt-dlp'); } catch(e2) {}
}

app.get('/video', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL manquante');
    exec('yt-dlp -f "best[ext=mp4]/best" --get-url "' + url + '"', (err, stdout, stderr) => {
        if (err) return res.status(500).send('Erreur: ' + stderr);
        res.redirect(stdout.trim());
    });
});

app.get('/health', (req, res) => res.send('OK'));
app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));
