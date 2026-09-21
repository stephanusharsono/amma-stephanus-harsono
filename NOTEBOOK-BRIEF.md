# Studentenschrift proef

Een lokale uitbreiding van de bestaande sollicitatiepagina, bezoekersmodus Operate binnen een Persuade-pagina. De gebruiker vraagt weekdoelen met behaald/niet behaald, open opmerkingen en een kleine uitbreiding van zijn studentvoortgang. De gebruiker heeft nu echte schriftvoorbeelden aangeleverd en bevestigd: beide rollen; twee stukken en één oefening; concrete problemen en oefenstappen als kern. Weekplan per stuk, weekdoelen samen voor docent, vaardighedenoverzicht voor beiden. Alleen geanonimiseerde, bewerkte voorbeelden worden gebruikt; geen echte studentnamen, account of backend.

## Direction contract

THESIS: één lescyclus daadwerkelijk uitproberen: probleem, weekdoel, oefenstappen en vaardigheden. Weekdoelen worden apart beoordeeld; alle stappen doorlopen is geen automatische doelbeheersing.

OWN-WORLD: bestaande warme lichte achtergrond, donkergroene inkt en blauwe interactiekleur. De werkruimte gebruikt het bestaande sans-serif lettertype en native formulieren, zonder decoratieve animatie.

STORY: de bezoeker opent de proef op de homepage, past drie fictieve doelen aan en begrijpt hoe lesnotities de volgende les voorbereiden. De proef is expliciet een ontwikkelrichting uit de brief.

FIRST VIEWPORT: korte uitnodiging met uitklapbare werkruimte. Voorbeeldstudent, rol- en leskeuze, drie weergaveknoppen; weekplan links, lesnotities en volgende-lesactie rechts. Per stuk een aandachtspunt, weekdoelcheckbox en geordende oefenstappen met vaardigheid en checkbox. Mobiel staat de notitiekolom onder het plan.

FORM: lokale componentuitbreiding met specifiek gevraagde checklijst; geen concept-seed of comp vereist. Signature interaction: open weekdoelen gaan met hun stappen en vinkjes naar een nieuwe les; eerdere les blijft raadpleegbaar. Opslag lokaal, reset met bevestiging, lege lijst met uitleg. Geen nieuwe rasterassets.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Geen nieuwe visuele identiteit of rasterassets. Bestaande ontwerpbeslissingen blijven leidend. Toetsenbordgebruik en kleine schermen zijn onderdeel van de controle.

## Implementatie en controle · 19 september 2026

De uitbreiding hergebruikt de bestaande kleur- en lettertypetokens uit `src/styles/global.css`: papier, groene inkt, salie en blauw voor interactie. Dunne scheidingslijnen en native velden dragen de werkruimte; er is geen nieuwe visuele identiteit of rasterbeeld toegevoegd. Onder 850 px staan de lesnotities onder het weekplan; onder 600 px worden formulieren één kolom en invoervelden 16 px. Focus gebruikt de bestaande globale focusring; de uitklapindicator respecteert verminderde beweging.

De documentatiecontrole heeft de component, het stylesheet en beide implementatiescripts vergeleken met het surface-contract en `PRODUCT.md`. Er is geen `DESIGN.md` of design-sidecar aangetroffen in deze projectmap. De bestaande globale CSS blijft daarom de geraadpleegde visuele bron; deze beperkte uitbreiding herschrijft geen product- of ontwerpdocumentatie.

De uitvoerende agent heeft desktop (1280 px) en mobiel (390 px) bekeken en geen horizontale overflow gevonden. Die agent controleerde ook afzonderlijke rolnotities, onafhankelijke weekdoel- en stapcheckboxes, het meenemen van uitsluitend open weekdoelen, alleen-lezen afgesloten lessen en opslag na herladen. Build en vijf modeltests zijn geslaagd; de afzonderlijke codereview meldde geen materiële blokkades. De documentatiecontrole heeft deze browsertests niet opnieuw uitgevoerd en had geen onafhankelijke visuele review. De proef is lokaal en niet gedeployed.
