# Testdatageneratoren Frontend

## Om Testdatageneratoren - overordnet beskrivelse av løsningen

_Testdatageneratoren_ er en webapplikasjon som kan brukes for å generere syntetiske testdata til bruk i utvikling og
testing. Applikasjonen gir brukeren mulighet til å skrive en spesifikasjon av de testdataene som ønskes generert.
Spesifikasjonen blir validert mot forretningsregler og gyldig input, og deretter genereres et xml-dokument med data som
samsvarer med den angitte spesifikasjonen, samt eventuelle felter som har blitt automatisk fylt ut
(f.eks. fødselsnummer, organisasjonsnummer, beløp) i den grad brukeren ikke angir disse feltene selv i spesifikasjonen.

Testdataene som genereres er syntetiske, og er basert på test-personer og -enheter som hentes fra _Tenor_.

Denne aktuelle løsningen som er publisert på Github er en forenklet og nedkortet versjon av den Testdatageneratoren som
brukes internt i Skatteetaten, og denne løsningen er derfor ment å brukes kun som et utgangspunkt og som eksempelkode
for andre som ønsker å lage og videreutvikle en tilsvarende løsning innenfor sitt domene. Denne forenklede versjonen
gir mulighet for å generere dokumenter kun av typen "SaldoRente", som er innrapportering av innskudd, utlån og renter
fra bankene, men koden kan utvides til å generere en rekke andre dokumenttyper.

Testdatageneratoren består av tre komponenter:

- [tdg-frontend](https://github.com/Skatteetaten/tdg-frontend)
- [tdg-kotlin-compiler-server](https://github.com/Skatteetaten/tdg-kotlin-compiler-server)
- [tdg-backend](https://github.com/Skatteetaten/tdg-backend)

### Funksjonalitet og flyt mellom komponenter

- **tdg-frontend** er brukergrensesnittet som lar brukeren definere en spesifikasjon for testdata som skal genereres.
  Spesifikasjonen skrives som et internt utviklet DSL (kalt "TestData Spesifikasjonsspråk"/TDSS) basert på Kotlin.
  TDSS'en er definert i _tdg-backend_. Frontenden gjør kall til tdg-kotlin-compiler-server for løpende validering av
  spesifikasjonen, og fra frontenden sendes deretter spesifikasjonen til tdg-backend.
- **tdg-backend** består av to moduler.
  - **_tdss_** definerer domenespråket (TDSS) og bestemmer hva som er lov å spesifisere i frontenden.
  - **_testdatagenerator_** tar imot spesifikasjonen, genererer testdata i xml-format og returnerer denne til
    frontenden.
- **tdg-kotlin-compiler-server** er en tjeneste som gir highlighting, autocomplete og feilmeldinger for spesifikasjonen
  som skrives i frontenden. Valideringen gjøres mot tdss-modulen i _tdg-backend_. _tdg-kotlin-compiler-server_ er en forket
  versjon av [Jetbrains sin Kotlin compiler server](https://github.com/JetBrains/kotlin-compiler-server), som deretter
  har blitt tilpasset Skatteetatens domene.

_testdatagenerator_ og _tdg-kotlin-compiler-server_ bruker _tdss_ som bibliotek. Innsendingene er tekst i TDSS streng-format,
som kan komme fra frontend eller HTTP-klienter. _korrelasjonsId_ brukes for å hente assosierte dokumenter via HTTP.

![Testdata flyt](docs/flytdiagram.png)

### Bygging og kjøring av komponentene

Komponentene må bygges og kjøres **i denne rekkefølgen**:

- tdg-backend
- tdg-kotlin-compiler-server (bygging av denne er avhengig av SNAPSHOT-versjon for tdss fra tdg-backend)
- tdg-frontend

Hver komponents README innholder nærmere beskrivelse av bygging og kjøring av den aktuelle komponenten.

## tdg-frontend

tdg-frontend er brukergrensesnittet for Testdatageneratoren. I GUI'et kan brukeren velge mellom å spesifisere testdata
for en person eller for en enhet. Spesifikasjonen fylles ut i et editor-vindu som er bygget opp med Kotlin
Playground. [Kotlin Playground](https://github.com/JetBrains/kotlin-playground) er en selvstendig komponent fra
Jetbrains, som har integrasjon mot Kotlin Compiler Server. Fra Kotlin Playground gjøres kall mot
tdg-kotlin-compiler-server, som gjør valideringer mot tdss-modulen for hva som er gyldig input. Spesifikasjonen som
sendes inn til testdatagenerator-modulen kommer i retur som ferdig utfylte xml-dokumenter. KorrelasjonsId for
innsendingen, samt en generert dokumentId pr. dokument, vises også.

### Eksempler på bruk av spesifikasjonsspråket i brukergrensesnittet

Bruk av CTRL + SPACE i Playground-editoren trigger autocomplete-funksjonen. Alle tilgjengelige
alternativer for spesifikasjonen vil da vises i en nedtrekksmeny.

Noen eksempler på ulike måter en spesifikasjon kan defineres:

1. Spesifikasjon for en person som skal ha generert et saldorente-dokument. Noen felter er alltid obligatoriske
   å spesifisere, f.eks. gjelder dette inntektsår. Det må også alltid defineres en _hovedtype_ under saldoRente, som er
   enten _innskudd_, _utlån_ eller _renter_.

```
person {
    fødselsnummer = "26890296253"
    saldoRente {
        inntektsår = 2023
        innskudd {
            beløp = 12610
        }
    }
}
```

2. Spesifikasjon for en person som skal ha generert to saldorente-dokumenter. Fødselsnummer og beløp spesifiseres ikke.
   Fødselsnummer hentes da fra en liste med personer definert i en Tenor-mock i backenden, og beløp blir satt til et
   tilfeldig generert tall.

```
person {
    saldoRente {
        inntektsår = 2023
        utlån {}
    }
    saldoRente {
        inntektsår = 2024
        innskudd {}
    }
}
```

3. Spesifikasjon for en enhet med et definert organisasjonsnummer og to ulike typer renter, hvorav en har et definert
   beløp og den andre vil bli tilfeldig generert.

```
enhet {
    organisasjonsnummer = "315403618"
    saldoRente {
        inntektsår = 2024
        påløpteRenter {
            beløp = 2000
        }
        tilbakebetalteMisligholdteRenter {
        }
    }
}
```

### Teknologi og arkitektur

Brukergrensesnittet er bygget med React og Vite, og bruker arkitekturen Backend for Frontend (BFF). Den består
av en React-frontend i `/src` som er tett koblet til en Express-backend i `/src/api`.

Noen sentrale teknologier brukt i prosjektet:

- **React**: UI rammeverk https://reactjs.org
- **Vite**: Bygger/pakker https://vitejs.dev/
- **Express**: Node web rammeverk https://expressjs.com
- **Tanstack Query**: State management https://tanstack.com/query/v5
- **Vitest**: Testrammeverk https://vitest.dev/
- **Testing Library**: Testbibliotek for React komponenter https://testing-library.com
- **ESLint**: Kodekvalitet https://eslint.org
- **Prettier**: Kodeformatering https://prettier.io/

Med unntak av Kotlin Playground-komponenten fra Jetbrains, er alle komponentene i frontenden bygget med utgangspunkt
i [Skatteetatens Designsystem](https://github.com/Skatteetaten/designsystemet).

### Oppsett før første gangs bruk

Innholdet i filen **.env.example** kan med fordel kopieres over i en egen .env fil i rotmappen før applikasjonen
startes, selv om applikasjonen skal kunne fungerere for lokal kjøring også uten denne filen.

### Krav

Applikasjonen krever Node versjon 22 eller høyere.

### Starte prosjektet første gang

Installer avhengigheter og start applikasjonen:

```console
npm ci
npm start
```

### Kodekvalitet

Prosjektet er konfigurert med ESLint for kodekvalitet/kodestil og Prettier for formatering.

Aktuelle kommandoer for å kjøre linting og formatering:

```bash
npm run lint              # Valider kodestil og formatering
npm run lint:eslint       # Valider kodestil
npm run lint:prettier     # Valider formatering
npm run lint:fix          # Fikse kodestil-brudd og formateringsfeil
npm run lint:eslint-fix   # Fikse kodestil-brudd
npm run lint:prettier-fix # Fikse formateringsfeil (formaterer alle filer)
```
