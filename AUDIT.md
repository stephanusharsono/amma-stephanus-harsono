# AMMA website audit — 19 september 2026

De implementatie is coherent en specifiek voor deze sollicitatie. De leesbaarheid is goed; het gedrag bereikt de gevraagde referenties nog niet. De homepage bevat vóór deze ronde geen productie-JavaScript, geen scrollgestuurde compositie en geen overgang tussen pagina’s. Alleen ankers scrollen soepel en linkpijlen verschuiven 3 px. De Impeccable-detector gaf geen bevindingen; dit sluit ontwerptekorten niet uit.

## Technische nulmeting

| Onderdeel | Score | Belangrijkste observatie |
|---|---:|---|
| Toegankelijkheid | 3/4 | Semantiek, focus en contrast goed; volledige conformiteit niet gecertificeerd. |
| Performance | 4/4 | 5,5 kB HTML, 8,1 kB CSS, 125 kB portret; geen productie-JS op de homepage. |
| Responsive | 3/4 | Werkende mobiele compositie; verscheidene klikvlakken kleiner dan 44 px. |
| Theming | 3/4 | Samenhangende tokens, maar meerdere losse kleurwaarden. Geen donkere modus vereist. |
| Implementatie | 3/4 | Heldere inhoudelijke structuur; institutioneel diagram heeft onduidelijke labelplaatsing. |
| **Totaal** | **16/20** | **Goed technisch fundament; geen Awwwards-score.** |

Dit is een handmatige code- en browseraudit, geen Lighthouse-, netwerksimulatie- of Core Web Vitals-meting. De nulmeting is op de huidige lokale versie uitgevoerd; de mobiele 390 px-controle uit de voorafgaande ronde betreft dezelfde ongewijzigde CSS. Een score 4 voor performance betreft de eenvoudige implementatie en kleine bestanden, geen bewezen snelheid op elk apparaat.

## Gecontroleerde referenties

- [Igloo Inc](https://www.igloo.inc/): een herkenbaar ruimtelijk object draagt de hele ervaring. De [case study van de makers op Awwwards](https://www.awwwards.com/igloo-inc-case-study.html) beschrijft hoe de navigatie, scèneovergangen en intro als één geheel zijn ontworpen. Vertaling voor AMMA: één verbinding tussen twee instellingen die zich door de pagina ontwikkelt.
- [Lando Norris](https://landonorris.com/): waargenomen grote typografie, gelaagd beeld en een overgang van een portret-/signatuurscène naar een typografisch statement. Vertaling voor AMMA: een geregisseerde opening en variatie in het scrollritme, afgestemd op een korte sollicitatiepagina.
- Awwwards kent beide referenties een Site of the Day toe: [Igloo](https://www.awwwards.com/sites/igloo-inc), [Lando Norris](https://www.awwwards.com/sites/lando-norris). Een prijs garandeert geen toegankelijkheid of geschiktheid voor deze lezer.

## Geprioriteerde bevindingen

Geen P0-blokkades of aangetoonde P1/WCAG-AA-overtredingen. Vier technische bevindingen: drie P2, één P3. Daarnaast drie ontwerptekorten tegenover de gevraagde interactieambitie.

### P2 — Kleine klikvlakken

- Locatie vóór wijzigingen: `src/styles/global.css:38`, `:68`, `:80`, `:112`.
- Browsermetingen bij 736 px: Brief-navigatie 29 × 44 px; contactlinks circa 38 px hoog; slotlink circa 35 px hoog. Mobiele navigatie heeft minder verticale padding.
- Gevolg: links vragen meer precisie, vooral op touchscreens.
- Aanpak: minimaal 44 × 44 px voor zelfstandige bedieningen, zonder het letterbeeld onnodig te vergroten. Dit is een comfortabel doel en de WCAG 2.5.5 AAA-maat; kleiner dan 44 px is niet automatisch een WCAG-AA-fout.
- Command: `$impeccable adapt`.

### P2 — Onduidelijke verbinding in het diagram

- Locatie vóór wijzigingen: `src/pages/index.astro:14` en `src/styles/global.css:49`.
- Beide lijnen beginnen links bij CvA, terwijl UvA rechts na AMMA staat. De beoogde twee-bronnenrelatie is visueel niet expliciet.
- Gevolg: het centrale beeldidee blijft decoratie en helpt de lezer nauwelijks.
- Aanpak: geef CvA en UvA elk een eigen ingang naar een gezamenlijk AMMA-punt. Maak datzelfde beeld bruikbaar als oriëntatie tijdens het lezen.
- Command: `$impeccable clarify`, daarna `$impeccable animate`.

### P2 — Geen actuele sectiestatus

- Locatie vóór wijzigingen: `src/layouts/Base.astro:6` en `src/styles/global.css:32`.
- Na navigatie naar Ervaring heeft geen enkele navigatielink `aria-current`. De header heeft `position: static`.
- Gevolg: de pagina geeft tijdens het scrollen geen plaatsbepaling; navigatie verdwijnt boven het scherm.
- Aanpak: compacte bereikbare navigatie, actuele sectie, en duidelijke plaatsbepaling bij de vier ervaringen. Geen scrollblokkering.
- Command: `$impeccable animate` / `$impeccable harden`.

### P3 — Verspreide kleurtokens en apparaatgebonden fonts

- Locatie vóór wijzigingen: `src/styles/global.css:11`, `:18`, `:43`, `:64`, `:78`.
- Gevolg: kleine palettewijzigingen vragen meerdere edits; Iowan/Avenir zijn niet op alle systemen aanwezig, waardoor het letterbeeld varieert.
- Aanpak: losse functionele kleuren benoemen; een eventueel zelf gehost lettertype later bewust kiezen en met Windows-fallback vergelijken.
- Command: `$impeccable document` / `$impeccable typeset`.

## Ontwerptekorten tegenover de referenties

1. **De opening heeft geen eigen bewegingsidee.** Titel, portret en verbinding verschijnen als losse statische elementen. Laat de twee helften van de titel en de twee instellingslijnen in één korte beweging samenkomen.
2. **Scrollen geeft geen ontwikkeling.** Vier gelijksoortige rijen blijven visueel hetzelfde. Laat een vaste verbindingsfiguur het actuele praktijkvoorbeeld volgen; alle tekst blijft normaal leesbaar.
3. **Navigatie heeft geen continuïteit.** De brief opent als een harde paginawissel. Geef merk en pagina een korte overgang, met normale navigatie als fallback.

Deze punten zijn ontwerpbeoordelingen, geen WCAG-overtredingen. De tekst, het lichte palet, het portret en de inhoudelijke koppeling aan de vacature blijven waardevol.

## Bewegingsplan voor de uitvoering

- Kern: **twee instellingen komen samen rond de student**. Eén herbruikbare SVG-verbinding draagt de opening en de ervaringssectie.
- Opening: korte convergentie van de twee titelregels; een rechthoekige onthulling van het echte portret; lijnen tekenen naar het gedeelde punt. Maximaal circa 800 ms, zonder wachtpagina.
- Scroll: een vast paneel naast de vier ervaringen volgt de actieve rij. De bezoeker kan via de sectielinks direct springen; het normale scrollgedrag blijft behouden.
- Feedback: onderstrepingen, pijlen, actieve sectie en toetsenbordfocus vertellen hetzelfde verhaal.
- Continuïteit: native view transitions waar ondersteund, gewone paginanavigatie elders.
- Minder beweging: statische geometrie en portret, met kleur- en statusterugkoppeling. Geen zichtbare inhoud afhankelijk maken van JavaScript.
- Budget: geen animatiebibliotheek of WebGL nodig; homepage-JS onder 10 kB ongecomprimeerd. Scrollmetingen in één read-pass, DOM-updates daarna in één write-pass. Geen doorlopende renderlus als er niets gebeurt.

Aanbevolen volgorde: `$impeccable animate` → `$impeccable adapt` → `$impeccable polish`. De gebruiker kan deze stappen gezamenlijk of afzonderlijk laten uitvoeren; de huidige opdracht autoriseert de interactieverbetering na deze audit. Een latere `$impeccable audit` kan de technische score opnieuw bepalen.

## Uitgevoerd en gecontroleerd

Na de nulmeting zijn de convergerende titelregels, portretonthulling en SVG-verbinding gebouwd. Op desktop blijft de leeswijzer naast de vier praktijkvoorbeelden staan; de actieve rij en navigatielink volgen het scrollen. Mobiel staat de leeswijzer gewoon in de documentstroom. De hoofd- en contactlinks hebben nu minimaal 44 px hoge klikvlakken; de smalle Brief-link is ook 44 px breed. Ondersteunende browsers krijgen native paginaovergangen.

De nieuwe productiecode voor beweging is 2.560 bytes (1.096 bytes gzip), zonder extra bibliotheek. De build slaagt en de Impeccable-detector meldt geen bevindingen. Browsercontrole bij 1280 px en in een 390 px iframe bevestigt geen horizontale overloop, werkende hoofdstuklinks, een vaste desktop-leeswijzer op 125 px, correcte `aria-current`-status en een werkende briefroute. De browserlog bevatte geen fouten. Dit is geen test op een fysiek mobiel toestel. Het pad voor minder beweging en de zichtbare HTML-fallback zijn in de bron gecontroleerd; de systeemvoorkeur is niet in de browser omgeschakeld.

De boekenkastpassage is op verzoek inhoudelijk gecorrigeerd in de website en de Word-brief: menselijk gedrag, communicatie en organisatie. De brief is opnieuw gerenderd en de volledige pagina visueel gecontroleerd. De URL blijft nog een invulplek. Deze wijzigingen staan lokaal en zijn niet gepubliceerd. De score hierboven blijft de nulmeting; er is geen nieuwe formele score toegekend.
