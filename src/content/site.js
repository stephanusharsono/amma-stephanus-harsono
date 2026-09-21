// Beknopt overzicht voor de AMMA-interessepeiling. Bron: motivatiebrief v36.
// De volledige brief staat in brief.js; de AMMA-motivatie is op verzoek aangescherpt.
// De RCO-bestanden zijn alleen stijlreferenties.
export const siteUrl = 'https://amma-stephanus-harsono.vercel.app';

// Downloads verschijnen vanzelf zodra het pdf-bestand in public/documenten/ staat.
// Zo kan er nooit een dode downloadlink op de site komen te staan.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
// Pak de eerste naam die echt bestaat, zodat een kleine naamsvariatie de download niet stilletjes uitzet.
const kies = (...namen) => {
  const gevonden = namen.find((n) => existsSync(join(process.cwd(), 'public', 'documenten', n)));
  return gevonden ? '/documenten/' + gevonden : '';
};
export const cvBestand = kies('CV-Stephanus-Harsono-AMMA.pdf', 'CV-Stephanus-Harsono.pdf', 'cv.pdf');
export const briefBestand = kies('Motivatiebrief-Stephanus-Harsono.pdf', 'Motivatiebrief_AMMA_Coordinator.pdf', 'motivatiebrief.pdf');
export const cvBeschikbaar = cvBestand !== '';
export const briefBeschikbaar = briefBestand !== '';
export const documenten = {
  titel: 'Documenten',
  brief: 'Motivatiebrief (pdf)',
  cv: 'Curriculum vitae (pdf)',
};

export const meta = {
  titel: 'Stephanus Harsono — interesse in Coördinator AMMA',
  beschrijving: 'Aanvulling op mijn motivatiebrief voor de interne interessepeiling Coördinator AMMA: mijn ervaring, de volledige brief en mijn cv.',
};

export const hero = {
  naam: 'Stephanus Harsono',
  titel: ['Twee instellingen.', 'Eén aanspreekpunt.'],
  introductie: 'Ik help studenten vooruit als docent en correpetitor aan het CvA. Bij AMMA wil ik de praktische zaken tussen CvA en UvA regelen, zodat studenten ruimte hebben voor de inhoud.',
  kop: 'Interne interessepeiling',
  procedure: 'Coördinator AMMA',
  rol: 'Docent · Correpetitor · Voorzitter AR/OC',
  actie: 'Ontdek mijn aanpak',
};

export const onderzoek = {
  titel: 'Nieuwsgierig, ook naast de piano.',
  tekst: 'Mijn masterscriptie verbond podiumpresentatie en muziekcognitie. Die ontmoeting van muziekpraktijk en onderzoek trekt mij ook in AMMA.',
  citaat: 'Bijna evenveel boeken als partituren.',
  toelichting: 'Thuis lees ik over communicatie, motivatie en organisatie. Mijn favoriet: The Culture Map van Erin Meyer, over culturele verschillen in samenwerking.',
};

export const ervaring = {
  titel: 'Zo werk ik.',
  // Twee stemmen, zoals de titel bovenaan: wat de vacature vraagt, en waar ik dat al deed.
  intro: ['Vier taken uit de vacature,', 'en waar ik ze al heb gedaan.'],

  onderdelen: [
    {
      id: 'studenten',
      label: 'Studenten',
      briefAnker: 'alinea-1',
      briefLink: 'Lees de passage over studentbegeleiding',
      anker: '±50',
      ankerToelichting: 'studenten per jaar',
      titel: 'Mijn deur staat open.',
      tekst: 'Ik ben het eerste aanspreekpunt voor circa vijftig studenten per jaar, ook via Teams. Ik help ze verder en houd hun voortgang systematisch bij.',
    },
    {
      id: 'administratie',
      label: 'Administratie',
      briefAnker: 'alinea-2',
      briefLink: 'Lees de passage over mijn administratieve werk',
      anker: '2021–2025',
      ankerToelichting: 'secretaris ondernemingsraad',
      titel: 'Overzicht, tot in de details.',
      tekst: 'Post, agenda, notulen en deadlines: mijn werk als OR-secretaris bij Platform C (2021–2025). Via de AR/OC ken ik ook de OER, studiepunten en toetsing.',
    },
    {
      id: 'afstemming',
      label: 'Afstemming',
      briefAnker: 'alinea-4',
      briefLink: 'Lees de passage over de moduleherziening',
      anker: '19 → 1',
      ankerToelichting: 'hoofdvakdocenten, 2025',
      titel: 'Negentien docenten. Eén gedragen module.',
      tekst: 'Ik leidde de herziening van de hoofdinstrumentmodule. Voor de overgangstentamens stem ik af met het studiesecretariaat.',
    },
    {
      id: 'voorlichting',
      label: 'Voorlichting',
      briefAnker: 'alinea-6',
      briefLink: 'Lees de passage over de open dag',
      titel: 'Helder vertellen. Goed organiseren.',
      tekst: 'Voor de ODM-open dag maakte ik het draaiboek en het presentatiemateriaal, in afstemming met Communicatie, en presenteerde ik zelf. Ingewikkelde informatie begrijpelijk maken doe ik dagelijks.',
    },
  ],
};

export const contact = {
  knop: 'Mail mij',
  titel: 'Wat kan ik nog toelichten?',
  tekst: 'Over de brief, de voorbeelden of hoe ik de taken in de vacaturetekst zou aanpakken. Ik ben viereneenhalve dag per week op het CvA; 0,1 fte voor AMMA past naast mijn aanstelling.',
  email: 'stephanus.harsono@ahk.nl',
  telefoon: '+31 (0)6 36 48 70 53',
  telefoonHref: '+31636487053',
};

export const briefPagina = {
  titel: 'Motivatiebrief',
  soort: 'Interne interessepeiling',
  onderwerp: 'Motivatiebrief Coördinator AMMA',
  ondertitel: 'Interne interessepeiling Coördinator AMMA',
  printKnop: 'Print de brief',
  pdfKnop: 'Download de brief (pdf)',
  beschrijving: 'Mijn motivatiebrief voor de interne interessepeiling Coördinator AMMA, met per voorbeeld de weg terug naar het overzicht.',
  terug: 'Terug naar het overzicht',
  printKop: 'Motivatiebrief Coördinator AMMA — Stephanus Harsono',
};

export const dateline = { plaats: 'Amsterdam', datum: 'September 2026' };

export const voet = { naam: 'Stephanus Harsono', plaats: 'Amsterdam · September 2026' };
