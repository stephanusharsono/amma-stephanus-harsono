# Website Coördinator AMMA — Stephanus Harsono

Live: https://amma-stephanus-harsono.vercel.app (Vercel, deploy vanaf `main` van de private GitHub-repo).

Teksten staan los van de layout:
- `src/content/site.js` — overzichtspagina (ook `siteUrl`, documenten, contact)
- `src/content/brief.js` — volledige motivatiebrief; niet met de hand bewerken

De brief komt uit het Word-bestand van de gebruiker. Workflow na een briefwijziging (vanuit de map boven `site/`):
1. Werk `build_letter.py` bij zodat het Word-bestand identiek wordt gebouwd.
2. `python3 sync-brief.py` zet de tekst over naar `brief.js`.
3. Exporteer de brief als pdf naar `public/documenten/Motivatiebrief-Stephanus-Harsono.pdf`.

Lokaal: `npm install && npm run dev` (http://127.0.0.1:4321). Build: `npm run build`. Tests van het studentenschrift: `node --test src/scripts/notebook-model.test.js`.
