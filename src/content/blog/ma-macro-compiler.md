---
author: Mārcis
pubDatetime: 2024-09-22
title: "Priedes kompilēšana uz grandMA2 makro funkcijām"
featured: true
tags:
  - priede
  - gaismas
  - grandMA
description: "Priedes virtuālās mašīnas emulācija skatuves gaismu vadības pults komandrindiņā" 
---

## Satura rādītājs

## Priekšvārds

### grandMA (izrunā grand-em-ā)
`grandMA`, jeb vienkārši `MA` ir skatuves gaismu vadības programmatūra. Tai ir primitīva komandrindiņa, ar kuru var veikt lielu daļu darbību, ko varētu veikt grafiski.

Līdz ar to, ir iespēja rakstīt automatizācijas makro skriptus, kas ir saraksts ar komandrindiņas komandām. 

![MA3 makro piemērs](/assets/ma-macro/a.jpg)

Lūk `MA3` makro skrips ar 4 rindiņām.

- Iezīmējam pirmo prožektoru grupu.
- Ieliekam iezīmētos prožektorus 4.1 presetā. 4 nozīmē, ka tas ir krāsas presets.
- Ieliekam iezīmētos prožektorus 1.1 presetā. 1 nozīmē, ka tas ir dimmera(spilgtuma) presets.
- Šos datus saglabājam 1.404 playbackā tālākai atskaņošanai.

Vēl spējīgākām automatizācijām var izmantot `LUA` skriptus, kas būtu labāks variants, ja šiem skriptiem ir vajadzība būt sarežģītākiem par pāris komandu palaišanu pēc kārtas.

Šim eksperimentam izmantošu `MA2` versiju, jo tai ir koda sazarojumi bez `LUA` iesaistes.

### Priede

[Priede](https://github.com/MarcisAn/priede) ir latviski rakstāma programmēšanas valoda, pie kuras es strādāju jau kādu laiciņu.

Šī Priedes implementācija ir interpretēta ar virtuālo mašīnu, rakstītu Rustā. Bet tagad mērķis ir šo virtuālo mašīnu aizstāt ar MA makro skriptiem.

## Makro importēšana MA

MA makro var tikt importēti no XML faila, kurus vajadzēs ģenerēt un ielikt specifiskā vietā diskā, kur to var importēt kā iebūvēto makro.

```xml
<?xml version="1.0" encoding="utf-8"?>
<MA xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<Info datetime="2015-05-22T14:08:42" showfile="new show 2015-05-22" />
	<Macro index="0'" name="macrotest">
    <Macroline index="0" delay="0">
			<text>SetVar $reg_0 = 1</text>
		</Macroline>
    <Macroline index="1" delay="0">
			<text>SetVar $priedevar_a = $reg_0</text>
		</Macroline>
    <Macroline index="2" delay="0">
			<text>SetVar $reg_1 = $priedevar_a</text>
		</Macroline>
	</Macro>

</MA>
    
```

## Priedes virtuālās mašīnas pārnešana uz MA komandrindiņu

Pašreizējā Priedes virtuālā mašīna ir pietiekoši izvērsta. Daudzas darbības notiek izpildlaikā, darbības ar masīviem un objektiem, piemēram. Šeit nekā tāda nav.

### Kas ir pieejams

- Mainīgie ar nosaukumu

`SetVar $mainiganosaukums = 1`.

- Mainīgo saskaitīšana

`AddVar $a = $b` Mainīgais `b` tiek pieskaitīts pie `a`.

- Aizlēkšana uz rindiņu

`Macro 1.1.3` Pārlec uz šo rindiņu un pārtrauc pašreizējo izpildi.

- Salīdzinājumi

`[$reg_5 == $reg_4]  SetVar $reg_6 = 1` Ja 5. un 4. reģistrs ir vienādi, tad 6. reģistram piešķiram vērtību `1`

Kad pārbaudīju, strādāja tikai `>` un `>=` operatori, bet lai tiktu pie pretējā virziena, vērtības tikai jāsamaina pusēm. 

Un tas arī viss. Pārējās funkcijas ir jāsapiņķerē kopā no šīm.

### Priedes virtuālās mašīnas replicēšana

Vairāk par Priedi ir rakstīts citos rakstos, bet īsumā, Priede sastāv no divām daļām: baitkoda kompilatora un virtuālās mašīnas, kas šo baitkodu izpilda. Batkods ir starpposms starp Priedes kodu un mašīnkodu. Par virtuālo mašīnu to sauc tāpēc kā tā "emulē" šķietamu procesoru, kas izmanto Priedes baitkodu kā mašīnkodu.

Priedes virtuālās mašīnas pamatā ir steks, ko varētu tulkot kā 'kaudze'. Tā ir datu struktūra, kurai vērtības var uzlikt augšā un noņemt no augšas.

Aptuveni šādi izskatās Priedes baitkods:

```
LOAD_CONST 2 
LOAD_CONST 1 
ADD
CALL_PRINT_FUNCTION
```

Un tas izpildās aptuveni šādi:


- Uz steka tiek uzlikts skaitlis 2
- Uz steka tiek uzlikts skaitlis 1
- No steka tiek noņemtas divas augšējās vērtības, ar tām tiek izpildīta saskaitīšana un rezultāts tiek uzlikts atpakaļ uz steka.
- No steka tiek noņemta augšējā vērtība un tā tiek padota, kā arguments, izvades funkcijai.

Šeit, protams, nav pieejama tik sarežģīta datu struktūra. Vienīgais, ko piedāvā MA komandrindiņa ir mainīgie. (Neizmantojot citas MA programmatūras funkcijas Piemēram, sekvences, kas satur gaismu datus varētu tikt izmantotas līdzīgam nolūkam.)

Būtiska alternatīva steka mašīnai ir reģistru mašīna. Steka vietā ir masīvs ar reģistriem, kas satur datus. Procesori darbojās līdzīgi, bet tajos ir fiziskas limitācijas reģistriem. Šeit tādu nav.

Reģistru baitkodu gan ir sarežģītāk ģenerēt. Steka baitkods divus skaitļus saskaita šādi:
```
UZLIKT_UZ_STEKA skaitlis1
UZLIKT_UZ_STEKA skaitlis2
SASKAITĪT
```
Reģistru baitkods turpretī
```
REĢISTRĀ 1 IELIKT skaitlis1
REĢISTRĀ 2 IELIKT skaitlis2
SASKAITĪT 1.reģistru ar 2.reģistru REĢISTRĀ 3
```

Visām šīm darbībām ar reģistriem nepieciešams zināt reģistra nummurus kompilācijas laikā. Steka mašīnā visas darbības notiek ar tiem datiem, kas ir steka augšpusē, bet te jāsaprot kādos reģistros ir šie dati.

Priedes kompilators kompilācijas laikā simulē steku ar datu tipiem. Nekādas darbības netiek veiktas, bet tikai tiek pārbaudīts vai datu tipi ir pareizi, ja šādas darbības tiktu veiktas izpildlaikā.

Un te varētu darīt līdzīgi. Kompilācijas laikā simulējam steku, kas satur reģistru numurus. Tad kad būtu nepieciešams uz steka uzlikt jaunu vērtību (ja tāds būtu), tad šai vērtībai piešķiram jaunu reģistra numuru un uzliekam to uz simulētā kompilācijas steka. Tad, kad nepieciešams noņemt vērtību no steka (ja tāds būtu), tad noņemam augšu no simulētā steka un skatamies kāds tur ir reģistra numurs. Ar šo reģistru arī veicam darbību.

Iespējams vajadzēs arī kaut kā attīrīt vecos reģistrus, lai neieietu milzīgos skaitļos, bet par to pašlaik var neuztraukties. Operatīvā atmiņa jau netrūkst...

Ar to nonākam pie šāda hibrīd baitkoda:

```
UZLIKT_UZ_STEKA reg_1
UZLIKT_UZ_STEKA reg_2
SASKAITĪT reg_3 = reg_1 + reg_2
```


## Priedes funkciju implementācija

### Matemātiskās darbības

#### Saskaitīšana

MA2 komandrindiņa piedāvā tikai pieskaitīt vērtību pie jau esoša mainīgā. Priedē tas izskatās pēc `+:` operatora. Ir garantēts, ka kreisās puses saskaitāmā reģistrs vairs netiks izmantots tāpēc pieskaitām labo pusi pie kreisās un ietaupām vienu reģistru.

Baitkods beigās izskatās šādi.

```
UZLIKT_UZ_STEKA reg_1
UZLIKT_UZ_STEKA reg_2
SASKAITĪT reg_1 =+ reg_2
```

#### Atņemšana

Atņemšanas darbības MA komandrindiņā nav. Tātad ir nepieciešams labās puses saskaitāmo padarīt negatīvu un tad veikt tādu pašu saskaitīšanu. Mainīgo padarīt negatīvu var tam pieskaitot "-" tekstu. Un tad, tālāk, tas darbosies kā skaitlis. JavaScript datu tipu dīvainības nobāl šī priekšā, bet nu nevar sūdzēties. Citādi tas būtu daudz sarežģītāk.

#### Reizināšana

Ha ha

Reizināšana, teorētiski ir saskaitīšana vairākas reizes. Ņemot vērā negatīvus skaitļus tas izskatās aptuveni šādi:

```python
def multiply(a, b):
    result = 0
    is_negative = False
    if b < 0:
        b = -b
        is_negative = True

    for _ in range(b):
        result += a

    if is_negative:
        result = -result

    return result
```

jeb Priedē

```
sk res: 0

sk negativs: 0

ja multB < 0{
    multB: 0 - multB
    negativs: 1
}

sk skaititajs: 0
kamēr skaititajs < multB {
    res +: multA
    skaititajs +: 1
}

ja negativs = 1 {
    res: 0 - res
}
```

Visi prieki no šī koda darbības apsīka, kad es mēģināju reizināt decimālskaitļus. Ja vismaz viens no tiem ir vesels skaitlis, tad nav problēmu, jo veselu skaitli var ielikt kā cikla skaitītāju un tad saskaitīt decimālskaitli tik reizes, cik norāda veselais skaitlis.

Reizināšana ar diviem decimālskaitļiem tā nevar notikt.

Vienīgais jēdzīgais risinājums ir abus skaitļus reizināt ar palielu skaitļa 10 kāpinājumu, tad reizināt šos skaitļus ar ciklu un tad reizināt rezultātu ar 10 negatīvā pakāpē, kas atgriež abus skaitļus atpakaļ decimālskaitļu reģionā.

Viss lieliski, bet šis risinājums ir ārkārtīgi lēns. Es nevienā brīdī necerēju, ka jebkas no šī būs ātrdarbīgs, bet vairākas sekundes vai pat minūtes lai sareizinātu divus skaitļus ir nedaudz par traku.

Reizināšanas funkcija atrodas atsevišķā MA makro skriptā, lai to varētu izmantot atkārtoti, gluži kā funkciju. Bet, kad šī funkcija tiek izsaukta, pamata skripts negaida, kad tā pabeigs izpildi, kā tas notiktu parastā sinhronā programmas izpildē, tāpēc ir jāieliek aizkaves, kas sagaida reizināšanas rezultātu. Protams varētu izveidot kaut kādu gaidīšanas ciklu, bet pagaidām nesarežģīsim.

Un tāpēc ka reizināšanas darbības izpildes laiks nav zināms, vajag gaidīt uz sliktāko gadījumu, kas visu padara ārkārtīgi lēnu.

Risinājums vienkāršs - neatbalstām decimālskaitļus.

### Koda sazarojumi

Priede sazarojumus implementē ar lēkāšanu pa baitkodu. Ja blokam nav jāizpildās, tad aizlecam uz šī bloka beigām. Ja ir jāizpildās, tad turpinām.

MA2 piedāvā komandu, kas var palaist konkrētu rindiņu no konkrēta makro skripta. Interesanti tas, ka brīdī, kad tiek izsaukta šī komanda, makro tajā vietā apstājās un turpina strādāt tikai tā rindiņa, kas ir izsaukta. Bet tieši tas tagad ir vajadzīgs.

Sazarojumu baitkods aptuveni izskatās šādi.

```
LoadNumber { value: 1, register: 0 }
JumpIfZero { register_to_check: 0, line_to_jump_to: 7 }
LoadNumber { value: 2, register: 3 }
LoadNumber { value: 1, register: 4 }
Add { target_register: 4, value_register: 3 }
SelectFixture { id_register: 4 }
EmptyLine
```

Ar if-elsiem ir tas pats, kas Priedē. `if` bloka beigās ir vēl viena lēcēja rindiņa, kas pārlec pāri `else` blokam.

Ar lēkājamo nobīžu aprēķināšanu bija jautri. Vienā brīdi bija situācija, ka `ja` bloks nestrādāja iekšā ciklā, jo tas mēģināja aprēķināt baitkoda absolūto nobīdi no tukša bloka, kas tika padots AST parsošanas funkcijai. Gala variantā batikods tiek ģenerēts ar relatīvām nobīdēm un tad tās tiek pārvērstas par absolūtām tad, kad tiek rakstīts XML fails, balstoties uz makro rindiņu.

Ciklu nobīdes strādā tāpat.

### Mainīgie

Nekā interesanta, MA jau piedāvā saglabāt mainīgos ar nosaukumu, tikai nosaukumam priekšā tiek pielikts `priedevar_` prefikss, lai nekonfliktētu ar mainīgajiem ko izmanto Priede.

## Piemēri:

Rakstīti Priedē, protams. [Priedes dokumentācija](https://priede.andersons-m.lv)

### Mainīgā definēšana un izmantošana

```
sk a: 1

fixture(a)
```

![Mainīgā definēšana un izmantošana](/assets/ma-macro/variable.jpg)

- Nultajā reģistrā tiek ielikts skaitlis 1.
- Tiek definēts mainīgais ar vērtību, kas atrodas nultajā reģistrā.
- Mainīgā vērtība tiek ielikta 1. reģistrā.
- Tiek iezīmēts prožektors ar ID, kas atrodas 1. reģistrā.

Diezgan izšķērdīgi un šo varētu pamatīgi optimizēt, bet šī sistēma darbojas arī ar sarežģītākiem gadījumiem, kad dati reģistros tiek apstrādāti un izmantoti.

### Saskaitīšana

```
fixture(1 + 2)
```

![Saskaitīšana](/assets/ma-macro/add.jpg)


### Atņemšana

```
fixture(2 - 1)
```

![Atņemšana](/assets/ma-macro/subtract.jpg)

### Reizināšana

```
sk res: 0

sk negativs: 0

ja multB < 0{
    multB: 0 - multB
    negativs: 1
}

sk skaititajs: 0
kamēr skaititajs < multB {
    res +: multA
    skaititajs +: 1
}

ja negativs = 1 {
    res: 0 - res
}
```

![Reizināšana](/assets/ma-macro/reiz.png)

Un reizināšanu var izmantot ar funkciju:

```
sk reizinajums: mint(3; 4)

fixture(reizinajums)
```

![Reizināšanas pielietojums](/assets/ma-macro/reizusage.jpg)

### Sazarojums

```
sk i: 0

ja i = 0 {
    fixture(i)
}
```

![Sazarojums](/assets/ma-macro/if.jpg)

Salīdzinot vērtības tiek izveidots jauns reģistrs, kas satur darbības rezultātu. Neatceros kāpēc...

### `Kamēr` cikls

```
sk i: 0

kamēr i < 10 {
    fixture(i)
    i +: 1
}
```

![Kamēr cikls](/assets/ma-macro/while.jpg)

### Tetris

```
sk x_level: 5
sk y_level: 191

kamēr y_level >= 11 {
    fixture(y_level + x_level + 1)
    fixture(y_level - 10 + x_level)
    fixture(y_level - 9 + x_level)
    fixture(y_level - 11 + x_level)
    fulldim()
    color(1)
    wait(1)
    ja y_level > 11 {
        zerodim()
    }
    clear()
    y_level: y_level - 10
}
```

<video loop muted="muted"  controls plays-inline="true" class="border border-skin-line"
src="/assets/ma-macro/tetris.mp4">
</video>

Ja video nedarbojas, var pārlādēt lapu.

![Tetris](/assets/ma-macro/tetris.png)


## Saites

[Kods](https://github.com/MarcisAn/priede-ma)

[Priede](https://github.com/MarcisAn/priede)

[MA2 makro dokumentācija](https://help2.malighting.com/Page/grandMA2/macro/en/3.3)