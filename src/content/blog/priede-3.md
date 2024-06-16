---
author: Mārcis
pubDatetime: 2024-06-12
title: "Datu glabāšana Priedē"
featured: true
tags:
  - priede
description: "Mainīgo un funkciju definēšana Priedē, lokālie mainīgie un vēl šis tas."
---

## Satura rādītājs

## Sākotnējā sistēma

Iepriekšējā rakstā par Priedi jau rakstīts kā mainīgo definēšana parādās baitkodā.

```
LOAD_CONST 0
DEFINE_VAR a
```

Šajā piemērā, mēs uzliekam uz steka skaitli `0`, tad definējam mainīgo ar nosaukumu `a`.

Kad Priedes virtuālā mašīna izpilda šo baitkodu, tai nepieciešams uzglabāt mainīgos ar nosaukumu un vērtību. Priede kompilācijas laikā uzglabā arī mainīgā datu tipu, lai veiktu tipu pārbaudi, bet par to vēlāk.

Nevar būt divi mainīgie ar vienu nosaukumu (pagaidām), tātad izmantojam hešmapu.

Hešmaps sastāv no datu vērtības un atslēgas, pēc kuras var atrast vērtību, kas tai piesaistīta. Atslēgas nevar atkārtoties. Mainīgo gadījumā, nosaukums būs atslēga.

```
--------------------------------
| atslēga(nosaukums) | vērtība |
--------------------------------
| a                  | 0       |
--------------------------------
```

Kad mainīgais tiek definēts, ievietojam mainīgo hešmapā jaunu vērtību. Ja tāda atslēga jau pastāv, tad izskatās, ka lietotājs cenšas definēt mainīgo ar nosaukumu, kas jau eksistē. Tad metam erroru.

Kad mainīgo nepieciešams nolasīt, atrodam vērtību pēc nosaukuma hešmapā un uzliekam to uz steka.

Šī sistēma darbojās neslikti, ja visi mainīgie ir globāli, bet Priedē tomēr gribētos mainīgos ar ierobežotu darbības zonu.

## Izpildlaika vienkāršošana

Pirms sākt strādāt pie lokālajiem mainīgajiem un citām izklaidēm, varētu vienkāršot to procesu, kas notiek izpildot baitkodu un sarežģīt to procesu, kas notiek, ģenerējot baitkodu. Protams, ar domu, ka baitkoda kompilācija var būt lēnāka, jo tā notiek tikai vienreiz. Lietotājam nav tik būtiski, cik ātri programma sāk darboties, bet vairāk - cik ātri tā darbojās. Tāpēc varam sarežģītākus procesus veikt kompilācijas laikā, ja tas nozīmē ātrāku izpildi.

Visas mahinācijas ar lokālajiem mainīgajiem vajadzētu veikt kompilācijas laikā, bet izpildlaikā mainīgie var palikt globāli, ar nosacījumu, ka baitkoda kompilators nodrošina to, ka tie ir lokāli. Pašlaik mainīgie izpildlaikā ir atpazīstami ar nosaukumu, bet, ja Priede strādā ar lokālajiem mainīgajiem, tad var pastāvēt vairāki mainīgie ar vienu nosaukumu, bet atšķirīgām darbības zonām. Varētu nosaukumiem pievienot kaut kādu tekstu, kas to parāda, bet varētu arī visu vienkāršot vēl vairāk un izmantot skaitļus.

Tagad ir nepieciešams kompilācijas laikā uzglabāt visus definētos mainīgos, to nosaukumus un ID skaitli.

## Mainīgo darbības zonas

Rakstot lielas programmas gadās izmantot mainīgos ar vienu nosaukumu, tāpēc tiek ierobežotas zonas kodā, kur katrs mainīgais ir aktīvs.

```
funkc aa() {
    sk mainigaisA : 2
    izvade(mainigaisA)
}

aa()
izvade(mainigaisA)
```

Šis kods metīs kompilācijas kļūdu, jo `mainigaisA` ir definēts funkcijas blokā, bet tālāk seko mēģinājums nolasīt šo mainīgo ārpus tā bloka, kurā tas ir definēts.

Kompilācijas laikā vajag saprast vai mainīgais ir sasniedzams. Pārsera bibliotēka, ko izmanto Priede piešķir skaitlisku ID katrai nodei no sintakses koka. Definējot mainīgo saglabājam tā nosaukumu un ID tam blokam, kurā tas ir definēts.

```
----------------------------------------
| ID | nosaukums | kurā blokā definēts |
----------------------------------------
| 0  | a         | 1                   |
----------------------------------------
```

Kad mainīgais tiek meklēts, tad pārbaudām vai tas tiek darīts no tā paša bloka, kurā tas ir definēts. Tādējādi var pastāvēt vairāki mainīgie ar vienu nosaukumu, bet atšķirīgām darbības zonām.

Problēma gan tāda, ka mēs vēlamies piekļūt arī mainīgajiem, kas ir definēti augstāk stāvošos blokos.

```
sk a : 0

ja 2=2 {
    izvade(a)
}
```

Tāpēc, meklējot mainīgo, nepieciešams pārbaudīt ne tikai esošo koda bloku, bet arī visus tam augstāk esošos. Ja esam uzkāpuši līdz saknes blokam, tad var saprast, ka mainīgais nav definēts.
