### Peldēšana laikā

Lūgtum JavaScript kods no pagājušajiem diviem gadiem, kas atskaņo lampiņu animācijas:

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
Kad atkal mēģināju šo darbināt, pamanīju, ka lampiņu animācijas iet atsķirīgos ātrumos uz telefona (WebKit) un datora (Firefox). Pārbaudīju Chrome uz datora un tas gāja sinhroni ar telefonu. Firefox šajā gadījumā bija "problēma". Firefox lietotāju skaits nav liels un šāda dīvainība būtu piedodama, bet man tomēr nepatika, ka ir neprecizitātes animāciju atskaņošanā, ja "uz papīra" būtu jābūt konkrētam ātrumam. Svarīgākais ir tas, ka lampiņu kontrolieris iet sinhroni ar vizualizāciju. Tāpēc papētīju, kas vainas JavaScript taimeriem.

Izskatās, ka Firefox un pārlūki kopumā attiecās pret `setInterval` un `setTimeout` funkcijām diezgan nevīžīgi. Šīm funkcijām vajadzētu izpildīt kodu pēc noteikta laika, bet realitātē sanāk tā, ka aizkave ir lielāka par norādīto, jo pārlūks izpilda šo funckiju "kad sanāk laiks". Firefox ātrdarbības problēma tā, visticamāk, nav, jo tā pati problēma ir dažādos animāciju ātrumos. Meklējam citu risinājumu.

JavaScript ir funkcija `requestAnimationFrame()`, kas darbojas līdzīgi `setTimeout()` funkcijai, bet tai netiek norādīts laiks un tā tiek izpildīta katru reizi, kad tiek atsvaidzināts ekrāns. Liela daļa ekrānu darbojas 60 hercos, tātad šī funkcija izpildīsies 60 reizes sekundē. Tālāk tikai vajag skaitīt laiku, reķināt laiku starp iepriekšējo kadru un saprast, vai jārenderē jauns kadrs.

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