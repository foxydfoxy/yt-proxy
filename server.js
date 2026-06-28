const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/video', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL manquante');
    
    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest',
            filter: 'videoandaudio'
        });
        
        res.redirect(format.url);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur: ' + err.message);
    }
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy démarré sur port ' + PORT));
