---
author: Mārcis
pubDatetime: 2024-04-21
title: "Meklējot īsākos ceļus starp Vikipēdijas lapām"
featured: true
tags:
  - vikipēdija
  - rust
description: "Kā nonākt no vienas Vikipēdijas lapas, uz citu, ar mazāko skaitu klikšķu uz saitēm"
---

## Satura rādītājs

## Ceļošana Vikipēdijā

Vikipēdijas lapas savā starpā ir savienotas ar saitēm. Ideālā gadījumā, no jebkuras Vikipēdijas lapas varētu nokļūt uz jebkuru citu, tikai klikšķinot uz saitēm.

[The Wikipedia Game](https://www.thewikipediagame.com) ir spēle, kuras mērķis ir to izdarīt zemāko klikšķu skaitu angļu valodas Vikipēdijā.

Šī lapa pārbauda vai konkrētais ceļš ir iespējams un nosaka mazāko iespējamo klikšķu skaitu. Angļu valodas Vikipēdijā ir gandrīz 7 milijoni rakstu. Latviskajā Vikipēdijā ir tikai 513 tūkstoši, bet satura lapas ir tika 120 tūkstoši. Pārējās lapas ir: diskusijas, pāradresācijas un citas palīglapas.
Es gribēju pārbaudīt vai arī latviskajā vikipēdijā ir iespējams aizceļot uz jebkuru lapu, tikai ar saitēm.

## Lieli dati

Visa latviešu valoas Vikipēdija, bez attēliem, aizņem 800 MB un to lejupielādēju no kāda [spoguļojuma](https://mirror.accum.se/mirror/wikimedia.org/dumps/lvwiki/20240401/).

Šo failu sauc par 'MediaWiki XML dump'.

MediaWiki ir programmatūra, ar kuru darbojās Vikipēdija un arī citas, līdzīga tipa lapas, kā [MuseWiki](musewiki.org).

Fails ir XML formātā un, kā izrādās, XML failu apstrāde nav īpaši jautra. Tomēr atradu [Rust bibliotēku](https://crates.io/crates/wikidump), kas var nolasīt tieši MediaWiki XML failus. Ar to, mēs varam izveidot ciklu, kas iet cauri visiem rakstiem latviešu valodas Vikipēdijā. Pēc noklusējuma, šī bibliotēka tekstu apstrādā un izņem saites, atstājot tīru tekstu, tāpēc vajadzēja speciāli norādīt, ka vēlos jēlo MediaWiki formatēto tekstu.

## Saites, saitēm galā

MediaWiki formātā saite tiek apzīmēta ar kvadrātiekavām, kurās tiek norādīts mērķa lapas nosaukums un rādāmais nosaukums, ja tāds ir.

`Zīmotne sastāv no dzeltena, trīsstūrveida [[Normaņi|Normaņu]] [[vairogs|vairoga]] ar noapaļotiem stūriem 133 mm augstumā.`

Funkciju, kas, izmantojot regex'u, atrod saites, uzrakstīja MI, kas, manuprāt, ir neslikts pielietojums tam. Protams, pārbaudīju vai tas darbojās pareizi.

### Neīstas saites

Vikipēdijā reizēm atrodamas saites sarkanā krāsā. Uz tām uzklikšķinot, Vikipēdija piedāvā izveidot šo rakstu. Tās ir saites uz rakstiem, kuri pašlaik neeksistē, bet kuriem vajadzētu eksistēt, tāpēc, kā pagaidu risinājums, tiek pievienota saite, kas nekur neved.

Neīstas saites nevarētu uzskatīt par saitēm, šajā gadījumā, tāpēc tās filtrējam ārā.

Filtrēt nepieciešams arī saites uz kategoriju lapām, jo tas ir nedaudz negodīgi.

## Datu urbšana

Atrast saites lapā mans Rust kods varējā ar ātrumu 1000 raksti sekundē. Ar neīsto saišu filtrēšanu negāja tik ātri. Tur ātrums bija ļoti mainīgs, bet vidēji - ap 100 rakstiem sekundē. Šajā procesā gan lapu nosaukumi, gan saites, tika pārvērsti uz mazajiem burtiem. [MediaWiki dokumentācija](https://www.mediawiki.org/wiki/Manual:Page_title) šajā jautājumā stāsta, ka lapu nosaukumi ir reģistrjūtīgi, izņemot pirmo simbolu. Cerēsim, ka šis vienkāršojums strādās.

Sākumā netīšām palaidu kodu  `debug` versijā, bet tad atjēdzos un palaidu `release` versijā, kurai bija ievērojami ātrāka.

"7 soļi svaiga gaisa" un mums ir JSON fails ar apstrādātiem datiem.

## Grafi

Grafu datu struktūra dara tieši to, kas nepieciešams. Grafs sastāv no punktiem un līnijām starp tiem. Sākumā izveidojam visus punktus - Vikipēdijas rakstus, pēc tam līnijas starp tiem - saites. Līnija ir vienvirziena, jo rakstam, uz kuru ved saite, vienmēr nebūs saite atpakaļ uz sākotnējo rakstu.

Tālāk, izmantojam "A*" algoritmu, lai atrastu īsāko ceļu starp diviem rakstiem. Tas ir tas pats algoritms, kas meklē labāko ceļu navigācijas lietotnēs. Ir iespējams katrai saitei iestatīt vērtību - garumu, lai "A*" algoritms atrastu īsāko ceļu, bet šajā gadījumā visiem ceļiem ir vienāds garums.

## WebAssembly

Rakstīt šo JavaScript'ā priekš WEB lietotnes būtu diezgan neefektīvi, tāpēc izmantoju WebAssembly, lai rust kodu darbinātu pārlūkā, bez servera. WebAssembly pakotnes izveide nepavisam nebija traka, lai gan es gandrīz visu kopēju no [Priedes](https://github.com/MarcisAn/priede) kodbāzes, kur pavadīju labu laiciņu, lai saprastu, kā savienot Rust'u ar JavaScript'u. 

Uz mana datora īsākā ceļa meklēšana aizņem ap 5 sekundēm, ko, droši vien, varētu optimizēt.

## Saites

[Rezultāts](https://wiki-path-finder.vercel.app/)

[Kods](https://github.com/MarcisAn/wiki_path_finder)

[Iedvesma](https://www.youtube.com/watch?v=JheGL6uSF-4)