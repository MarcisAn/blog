---
author: Mārcis
pubDatetime: 2024-01-04
title: "3D eglītes lampiņas 2025"
slug: "3d-xmaslights-v4"
draft: true
featured: true
tags:
  - lampinas
description: "Eglītes lampiņas, kurām noteiktas 3D koordinātas"
---


## Satura rādītājs

## Koordinātu noteikšana

Iepriekš labi strādāja lampiņu koordinātu noteikšana ar kameru - tiek iededzināta viena lampiņa un tiek piefiksēta tās koordināta uz ekrāna. Tikai tādā gadījumā ir problēmas, kad lampiņa nav redzama no kameras pozīcijas - ja zari ir priekšā lampiņai. Tādā gadījumā kādam vajadzēja stāvēt eglītes otrā pusē un turēt slotas kātu, lai parādītu lampiņas atrašanās vietu. Slotas kāts ir jātur uz vienas taisnes ar kameru un lampiņu. Kamera tad piefiksē slotas kāta attrašanās vietu uz ekrāna.

Šogad ideja ir līdzīga, bet kameras vietā ir projektors, kas projecē šauru līniju uz eglītes. Ar šo līniju vajag "trāpīt" pa ieslēgto lampiņu un tad koordinātu var nolasīt no šīs līnijas pozīcijas uz ekrāna.

<video loop muted="muted"  controls plays-inline="true" class="border border-skin-line"
src="\assets\xmaslights4\calib.mp4">
</video>

<figcaption>Lampiņu koordinātu noteikšana ar projektoru</figcaption>

Brīžos, kad kāda lampiņa nav redzama no projektora atrašanās vietas, var aiziet eglītei otrā pusē un pabīdīt šo līniju pēc konteksta "uz aci". Ar abām horizontālajām asīm šī metode strādāja gandrīz perfekti. Vertikālajai asij bija grūtāk trāpīt pa lampiņu, bet tāpat viss bija kārtībā.

### Perspektīvas iztaisnošana

Tomēr šādi iegūtas koordinātas nebūs perfektas perspektīvas dēļ.


<video loop muted="muted"  controls plays-inline="true" class="border border-skin-line"
src="\assets\xmaslights4\perspective.mp4">
</video>

<figcaption>Šajā klipā ir redzams vizualizētājs lampiņām, kur lampiņas ir izvietotas pēc tām koordinātām, kur ir koriģēta perspektīvā, bet animācija ir ģenerēta pēc neprecīzajām koordinātām</figcaption>


Taisnleņķa projekciju nav iespējams panākt, ja vien projektors neatrodas ļoti lielā attālumā no eglītes.

Tomēr varam novērst perspektīvas radītās kļūdas ar diviem projektora mērījumiem. 

![Divu taišņu krustpunkts](/assets/xmaslights4/cross.png)

Novelkam divas taisnes starp abiem projektoriem un lampiņu. Zinot projektoru koordinātas, varam aprēķināt krustpunktu šīm taisnēm un iegūt lampiņas koordinātu.

Paskatīsimies uz situāciju, kurā ir projektors, projektora ekrāns un punkts (lampiņa), kas atrodas projektora starā.

![Projekcijas zīmējums](/assets/xmaslights4/single.png)


Mums vajag leņķi starp projektora stara centru un taisni, kas iet caur projektoru un lampiņu. Tas ir taisnleņķa trīsstūris, tāpēc varam izmantot tangensu. Ja ignorējam lampiņu, tad meklējamā leņķa tangenss ir dalījums starp ekrāna platuma pusi un tā attālumu no projektora. Sauksim to par projektora metienu (throw ratio). Kad tiek noteikta lampiņas koordināta, tad ir zināms, cik pikseļus no ekrāna centra ir šī līnija, kad tā mērķē pa lampiņu. Aprēķinam relatīvo nobīdi no ekrāna centra un aprēķinam tangensu leņķim starp projektora stara centru un projecēto līniju. Projektora metienu aprēķinam laicīgi - rādām laukumu uz sienas un izmēram vajadzīgo. Tas nemainīsies, ja projektoram netiks mainīts zoom's.



Zinot projektora attālumu no eglītes, iegūstam taisnes vienādojumu taisnei, kas iet caur projektoram un lampiņai. Tad eglīti pagriežam par 90 grādiem un atkārtojam procesu. Kad iegūtas divas taisnes, aprēķinam to krustpunktu un tā arī ir lampiņas koordināta.

Bet paikusi vēl vertikālā ass. Lai aprēķinātu lampiņas vertikālo koordinātu, skatamies uz eglīti sānskatā. Atkal nosakam taisni, kas iet caur projektoru un lampiņu. Uz X ass atliekam vertikālu taisni pēc vienas no jau esošajām koordinātām un aprēķinam kruspunkta y koordinātu.

Šo visu saliku lielā tabulā un sarēķināju pareizās koordinātas, kas ņem vērā to, ka projektors uz eglīti skatās perspektīvā.

![Tabula ar lampiņu koordinātām](/assets/xmaslights4/table.jpg)


## Lampiņu kontrole un animāciju veidošana

Lielā mērā saglabājam sistēmu no iepriekšējā gada. Lampiņas netiek kontrolētas pa tiešo. Uz servera tiek ģenerāti animācijas kadri, kas nosūtīti lampiņu kontrolierim un vizualizētājām, lai vienlaicīgi varētu redzēt animāciju uz eglītes un ekrānā.

![Kontroles sistēma](/assets/xmaslights4/systemarch.png)

<figcaption>Lampiņu vadības sistēma

1. No mājaslapas uz serveri tiek nosūtīts pieprasījums pēc konkrētas animācijas
2. Serveris pārbauda, vai šāda animācija pastāv un palaiž python skriptu uz servera
3. Python skripts ģenerē animācijas kadrus un nosūta tos Node serverim ar HTTP
4. Caur SocketIO savienojumu vienlaicīgi vizualizētājam un lampiņu kontrolierim tiek nosūtīti animācijas kadri
</figcaption>


Sākotnēji to neparedzēju, bet izrādījās ļoti parocīga servera funkcija saņemt animācijas ar HTTPS un tad pārsūtīt eglītei un vizualizētājam. Tas palīdzēja pie uzstādīšanas un programmēšanas, kad es varēju rakstīt un palaist animācijas uz eglītes, bez SSH savienojuma ar pašu eglīti vai serveri.

### Peldēšana laikā

Līdz šim esmu izmantojis sekojošu kodu, lai vizualizētājā (ThreeJS web lapa) atskaņotu animāciju kadrus:

```javascript
let intervalId;
socket.on("animationData", (data) => {
    clearInterval(intervalId);
    intervalId = window.setInterval(function() {
        //...
        // Vizualizētājā renderējam animācijas kadru
        //...
    }, Math.pow(anim_speed, -1) * 400);
});
```
Kad atkal mēģināju šo darbināt, pamanīju, ka lampiņu animācijas iet atsķirīgos ātrumos uz telefona (WebKit) un datora (Firefox). Pārbaudīju Chrome uz datora un tas gāja sinhroni ar telefonu. Es varētu samierināties ar to, ka vizualizētājs darbojas neprecīzi uz Firefox, lai gan es pats esmu liels Firefox fans. Svarīgākais ir tas, ka lampiņu kontrolieris iet sinhroni ar vizualizāciju. Bet man tomēr paskatījos, kas vainas JavaScript taimeriem.

Izskatās, ka Firefox un pārlūki kopumā attiecās pret `setInterval` un `setTimeout` funkcijām diezgan nevīžīgi. Šīm funkcijām vajadzētu izpildīt kodu pēc noteikta laika, bet realitātē sanāk tā, ka aizkave ir lielāka par norādīto, jo pārlūks izpilda šo funckiju "kad sanāk laiks" un nav nekādu citu, svarīgāku uzdevumu. Tīra problēma ar Firefox ātrdarbību tā nav, jo tas darbojas dažādos ātrumos ar tādu pašu nobīdi. Jāmeklē cits risinājums animāciju atskaņošanai JavaScriptā.

JavaScript ir funkcija `requestAnimationFrame()`, kas darbojas līdzīgi `setTimeout()` funkcijai, bet tai netiek norādīts laiks un tā tiek izpildīta katru reizi, kad tiek atsvaidzināts ekrāns, kas lielākajā daļā gadījumu ir 60 reizes sekundē. Tālāk tikai vajag skaitīt laiku, reķināt laiku starp iepriekšējo kadru un saprast, vai jārenderē jauns kadrs.

```javascript
function animation_frame() {
  //...
  // Vizualizētājā renderējam animācijas kadru
  //...
}

let nextTick = performance.now() + TICK_INTERVAL;

function loop() {
  const now = performance.now();
  if (now >= nextTick) {
    animation_frame();
    nextTick += TICK_INTERVAL;
    if (now - nextTick > TICK_INTERVAL) {
      nextTick = now + TICK_INTERVAL;
    }
  }
  requestAnimationFrame(loop);
}
loop();
```

Šī versija darbojās sinhroni starp pārlūkiem, bet šī ir tikai puse no problēmas un animācijām jāiet kopīgi vizualizācijā un uz Raspberry Pi minidatora, kas kontrolēs fiziskās lampiņas.

Vispirms es nokopēju to pašu kodu no vizualizētāja un aizstāju `requestAnimationFrame()` funkciju ar `setImmediate()`, kurai vajadzētu izpildīties nākamajā reizē NodeJS darba ciklā. Nekam nevajadzētu mainīties, ja tas notiek pietiekoši ātri.

Bet mainījās. Tad es šo skriptu pārrakstīju Pythonā, bet tur bija tā pati problēma. 