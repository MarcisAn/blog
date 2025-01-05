---
author: Mārcis
pubDatetime: 2025-01-06
title: "Apollo navigācijas datora programmēšana ar Priedi"
featured: true
draft: false
tags:
  - priede
  - AGC
description: "Priedes kompilēšana 60 gadus vecam datoram"
---

Iepazīstieties, Apollo navigācijas dators.

![Apollo navigācijas dators un DSKY](/assets/priede-agc/agc.jpg)

Tā laika tehnoloģiju brīnums; pazīstams ar to, ka nogādāja cilvēkus uz mēnesi Apollo misiju ietvaros.

![Apollo navigācijas dators un Bazs Aldrins](/assets/priede-agc/buzz.jpg)

Šajā attēlā redzams Apollo 11 astronauts Bazs Oldrins un apakšējā stūrī - šī datora kontroles panelis.

Sešdesmitajos gados, kad NASA gatavojās nolaisties uz mēness, viņi juta nepieciešamību datoram uzticēt kuģa navigāciju un vadību. Tā radās Apollo navigācijas dators. Tajā laikā datori bija istabas izmērā, bet šis ietilpa Apollo kosmosa kuģos un bija maza portfeļa izmērā. Katrā misijā bija 2 tādi. Viens atradās komandmodulī un riņķoja ap mēnesi, otrs atradās kuģī, kas nolaidās uz mēness. Šie datori bija vienādi, atšķīrās tikai programmatūra un pievienotās ierīces. Nolaišanās kuģa datoram, piemēram, bija pieslēgts radars, kas noteica attālumu līdz mēness virsmai.

- Radīts 60ajos gados
- Svēra 32 kilogramus
- Portfeļa izmērā
- Tika uzbūvēti 42 tādi un katrs izmaksāja 200 tūkstošus dolāru
- Patērē ap 55 vatus
- Procesors darbojās 1 megaherca frekvencē - 600 reizes lēnāks, kā pirmais iPhone
- Darbojās ar 4kB operatīvo atmiņu - 30 tūkstoš reizes mazāk, kā pirmajam iPhone
- Satur arī 72kB programmas atmiņu, kas sastāv no vara stieplēm, kuras tika ar roku izšūtas. - Salīdzinājumi diezgan absurdi, jo mūsdienās tur varētu ietilpināt tikai īsu teksta dokumentu.
- Procesors darbojās ar 36 iespējamām instrukcijām

Bet tomēr cilvēki nolaidās uz mēness ar šī datora palīdzību un tajā laikā tas bija nopietns tehnoloģiju brīnums.

## Par programmatūru

![Apollo navigācijas datora programmatūra papīra formā](/assets/priede-agc/software.jpg)

Šī čupiņa ir Apollo navigācijas datora (Apollo Guidance Computer; AGC) programmatūra papīra formā. Dators tika programmēts uzreiz mašīnkodā. Vajadzēja maksimālu efektivitāti, tāpēc kompilatoru izmantošana nebija praktiska.

AGC mašīnkods izskatās aptuveni šādi:

![Apollo navigācijas datora kods](/assets/priede-agc/code.jpg)

Tagad tas ir digitalizēts un atrodams ([GitHub](https://github.com/chrislgarry/Apollo-11))

Turpmāk lasāms izklāsts manam ziemas brīvlaika projektiņam: Uzrakstīt kompilatoru, kas ļautu Apollo navigācijas datoru programmēt ar manu programmēšanas valodu - [Priedi](https://github.com/MarcisAn/priede).

Protams, izmantojot simulētu Apollo datoru.

---

## Satura rādītājs

# Priede

[Priede](https://github.com/MarcisAn/priede) ir programmēšanas valoda, kuru es uztapināju jautrības pēc, lai pamācītos par interpretatoru darbību.

Nosacīti būtiski ir tas, ka Priedes sintakse ir latviešu valodā, bet citādi tas ir vienkāršs interpretators ar baitkoda kompilatoru.

Šeit mērķis ir kompilēt Priedes kodu uz Apollo navigācijas datora mašīnkodu...


# Apollo navigācijas datora programmēšana

Rakstīt kodu priekš šī aparāta nav tik vienkārši, kā atvērt failu un rakstīt procesora instrukcijas. Ir pāris lietas, kas jāņem vērā:

## Interupti

Šim datoram ir 11 iespējami interupti (pārtraukuma signāli). Tie ir gadījumi, kad aparatūra datoram paziņo, ka ir noticis kaut kas tāds, kam vajag tūlītēju datora uzmanību. Tad dators pārtrauc pašreizējo darbību, saglabā tās stāvokli, apstrādā interuptu, tad atgriežas sākotnējā vietā.

Ir nepieciešama [interuptu vekotoru tabula](https://en.wikipedia.org/wiki/Interrupt_vector_table) (vai kā arī to tulkotu...). Tā pasaka ko dators darīs, kad notiks kāds interupts. Citādi intrupta gadījumā dators sāks izpildīt kodu, kas nejauši patrāpīsies tajās atmiņas adresēs. Šī tabula nepeciešama `4000` prgrammas atmiņas adresē ([oktālajā skaitīšanas sistēmā](https://en.wikipedia.org/wiki/Octal)) un izskatās aptuveni tā:

Te ir tikai 5 interupti, bet pārējie izskatās tāpat. Es saīsināju.

```
  SETLOC    4000

  TCF       STARTUP
  NOOP
  NOOP
  NOOP

  RESUME    # T6RUPT
  NOOP
  NOOP
  NOOP

  RESUME    # T5RUPT
  NOOP
  NOOP
  NOOP

  RESUME    # T3RUPT
  NOOP
  NOOP
  NOOP

  RESUME    # T4RUPT
  NOOP
  NOOP
  NOOP

STARTUP     # Programmas kods
```

Pirmā instrukcija norāda asemblerim, ka turpmākais kods sākās adresē 4000 (oktālajā sistēmā).

Tālāk seko interuptu apstrādātāji. Katram ir atvēlēti 4 vārdi programmas atmiņā. `STARTUP` interupts notiek tad, kad dators ieslēdzās. Te var redzēt, ka šis kods izsauc `STARTUP` rutīnu (funkciju), bet pārējie 3 vārdi ir tukši ar `NOOP` instrukciju.

Visi pārēji interupti ar `RESUME` norāda, ka jāturpina izpildīt iepriekšējais kods tā, it kā nekas nebūtu noticis. Interupti tiek ignorēti. Un tad arī nākamie 3 vārdi ir tukši.

Bet tālāk seko vēl jautrība:

## GOJAMs

Drošības nolūkos, AGC ir iebūvēts mehānisms, kas restartē datoru, ja gadās kāda šmuce ar programmatūru. Šo restartu sauc `GOJAM`. Piemēram:

- Dators ir iestrēdzis bezgalīgā cilpā.

Tādas tāpat ir iespējamas, bet ar speciāliem nosacījumiem.

- Interupti ir izslēgti pārāk ilgu laiku

Jebkurā brīdī ir iespējams pilnībā izslēgt interuptus, bet tas, protams, nav vēlams ilgtermiņā. Interupti izslēdzās paši tad, kad akumulatora reģistrs procesorā ir pārplūdis pāri 15 bitu maksimālajai vērībai aritmētisko darbību rezultātā.

- Ja konkrēta adrese atmiņā nav rakstīta/lasīta ilgu laiku

AGC saturēja primitīvu multi-taskinga sistēmu. 67 (oktālā) atmiņas adrese satur datus jaunu uzdevumu ielādēšanai. Ja šī adrese netiek aiztikta ilgu laiku, tad dators padomā, ka šī sistēma nedarbojās un restartējās.

Ja netiek izmantota multi-taskinga sistēma, tad nepieciešams šo mehānismu apmānīt, lai dators regulāri nerestartētos. Redz kā to izdarīt:

Ir procesora reģistrs, kas tiek inkrementēts katras 10 milisekundes. Kad tas ir pārplūdis 15 bitu maksimālo vērtību, notiek interupts. Kad interupts notiek, varam pabakstīt šo adresi, lai novērstu restartu. Problēma, gan ka tas nenotiek pārāk bieži. Tāpēc šajā reģistrā ieliekam tādu vērtību, lai tas pārplūstu ātrāk. Tagad, katras 40 milisekundes notiks interupts, kas pabakstīs 67 adresi un novērsīs restartus.

## Perifērijas ierīces

Datoriem tagad aktuālās ierīces būtu:

- Ekrāns
- Tastatūra
- Pele
- Printeris
- ...

Lai lidotu uz mēnesi vairāk jāsatraucas par:

- Ekrānu
- Tastatūru
- Žiroskopu
- Akselerometru
- Radaru
- Antenām
- Raķešdzinējiem
- ...

Pagaidām pieturēsimies tikai pie ekrāna un tastatūras, kas atradās Apollo kuģos. To sauc par DSKY - Display and Keyboard unit. (Izrunā "Diskij")

Papildus galvenajai atmiņai, AGC bija 512 datu adreses - kanāli, kas paredzēti saziņai ar ārējām ierīcēm. No tiem var nolasīt datus, un tajos var ierakstīt datus. Tāpat kā galvenajā atmiņā, katrs ievades/izvades (IO) kanāls ir 15 bitus garš. Patiesībā ir 16 biti, bet viens no tiem ir paritātes bits, kas pārbauda vai dati nav aizgājuši neceļos, tāpēc reāli izmantojami ir 15 biti.

## Skaitļu izvade uz DSKY

![DSKY](/assets/priede-agc/dsky.jpg)

Desmitais izvades kanāls atbild par 7 segmentu displejiem uz DSKY'a. Lai manipulētu tos, datoram ir šajā kanālā jāieraksta 15 biti. Vienlaicīgi var manipulēt divus ciparus.

Šie 15 biti izskatās šādi:

![Desmitā kanāla vērtības uzbūve](/assets/priede-agc/dsky-patt.jpg)

- Pirmie 4 biti atbild par to, kurš ciparu pāris tiek islēgts:
  - `1011` norāda uz abiem cipariem "prog" sadaļā
  - `1010` norāda uz abiem cipariem "verb" sadaļā
  - `1001` norāda uz abiem cipariem "noun" sadaļā
  - ...
- Nākamais bits nosaka `+` vai `-` zīmi, ja tāda ir
- Nākamie 5 biti nosaka pirmo ciparu no pāra:
  - `00000` - tukšs
  - `10101` - 0
  - `00011` - 1
  - `11001` - 2
  - ...
- Nākamie 5 biti nosaka otro ciparu tādā pašā veidā

Lai izveidotu šos 15 bitus priekš izvadīšanas uz DSKY'u vispirms vajag skaitli sadalīt ciparos. Te darbojās vecā metode - dalīšana ar 10 un atlikuma saglabāšana.

Tad ņemam pirmo skaitlisko vērtību (ciparu pāra norādi) un pārējos bitos ieliekam nulles.

`101100000000000`

Tālāk jāpieliek nākamais bits, kas norāda zīmi. Pieņemsim, ka gribam ielikt bināro vieninieku. Sākotnēji skaitlis `1` izskatās šādi.

`000000000000001`

Tāpēc tagad jāpabīda biti pa kreisi. Varētu padomāt, ka ir mašīnkoda instrukcija, lai to izdarītu, bet nē. Ir adrese operatīvajā atmiņā, kas pabīda bitus, tad, kad tā tiek rakstīta.

`000010000000000`

Un saskaitot šos skaitļus varam pievienot bitus kreisajā pusē.

`101110000000000`

Jāpievieno vēl divi skaitļi. Bitu pievienošana notiek tāpat, bet interesants ir veids kā no cipara tikt pie šiem maģiskajiem 5 bitiem, kas vajadzīgi priekš šī cipara parādīšanas uz DISY'a.

AGC mašīnkodā ir instrukcija, kas manipulē tai sekojošo instrukciju.

```
INDEX A
CA ADD1


ADD1 OCT 1
     OCT 2
     OCT 3
     OCT 4
     OCT 5
     OCT 6
```

Šis ir fragments no AGC mašīnkoda. Apakšā ir definētas 6 adreses atmiņā. `OCT` norāda, ka tas ir skaitlis [oktālajā skaitīšanas sistēmā](https://en.wikipedia.org/wiki/Octal).

Otrā instrukcija nolasa vērtību no `ADD1` adreses un ielādē to procesora `A` reģistrā.

Te jāpiebilst, ka tādu atsevišķu procesora reģistru īsti nav. Tie atrodas operatīvās atmiņas sākumā.

Bet interesanta ir pirmā instrukcija, jo tā maina otro instrukciju izpildlaikā. `INDEX` instrukcija nolasa `A` reģistru un tā vērtību pieskaita pie nākamās instrukcijas argumenta.

Ja `A` reģistrā būs skaitlis `2`, tad otrā instrukcija nolasīs skaitli `3`, jo tas atrodas divas adreses tālāk atmiņā.

# Kompilēšanaaaaaaaaaa

Sākumā uzreiz būtu jāpasaka, ka turpmākais variants nav efektīvs vai ātrs. Tas ir skaidrs jau paskatoties uz ģenerēto mašīnkodu. Pagaidām man vēl ir pārliecība, ka to varēs optimizēt vēlāk.

## Konstantes

Ar konstantēm būtu saprotami dati, kas ir ierakstīti kodā ar roku un ir zināmi kompilācijas laikā.

`izvade(2 + 2)` Te konstantes ir abi divnieki, bet gala rezultāts tiek aprēķināts izpildlaikā. (Ko, protams, arī varētu izdarīt kompilācijas laikā)

Iepriekšējās Priedes implementācijās konstantes atradās baitkodā pa taisno. AGC mašīnkodam nepieciešams visus datus definēt iepriekš. Te nekā pārāk interesanta nav. Kompilācijas laikā, sastopot konstanti, saglabājam to un beigās visas sadrukājam mašīnkodā.

## HAHA Reģistru mašīna

Oriģinālā [Priede](https://github.com/MarcisAn/priede) izmanto steku, lai darbotos ar datiem.
Mans [Priedes kompilators priekš grandMA komandrindiņas](https://blog.andersons-m.lv/posts/ma-macro-compiler) izmanto virtuāla procesora "reģistrus". Tas ir stipri vienkāršāk. Izpildlaikā jāstrādā tikai ar datu masīvu - čupu ar mainīgajiem.

Par reģistru baitkodu var palasīt citos rakstos tepat.

Šeit steku izmantot būtu neefektīvi. Reģistru dizains arī nav ideāls, jo Apollo navigācijas dators ir [akumulatora mašīna](<https://en.wikipedia.org/wiki/Accumulator_(computing)>). Lielākā daļa procesora
instrukciju izmanto vienu procesora reģistru - akumulatoru, lai darbotos ar matemātiskām un citām darbībām. Protams, nekas neliedz šos "reģistrus" vienkārši glabāt atmiņā. Tad katra Priedes baitkoda instrukcija
pārtaps par vairākām AGC instrukcijām. Šāds apgalvojums neizklausās ļoti pārsteidzošs, ņemot vērā, ka Priede ir virspusēja līmeņa valoda, kas darbojās uz virtuālās mašīnas.

Tātad kopumā Priede strādā ar "reģistriem" (Es neuzdrošinos to vārdu nelikt pēdiņās), bet katra baitkoda instrukcija taisa, reizēm neefektīvas, manipulācijas ar akumulatoru un atmiņu. Nekas no šī nav efektīvi.

Lūk piemērs:

`program(9 + 10)`

```
PC0 DEC 9
PC1 DEC 10

PR0 ERASE
PR1 ERASE

CA PC0
TS PR0

CA PC1
TS PR1

CA PR1
AD PR0
TS PR1

CA PR1
TC DSPPROG
```

Īsumā par AGC procesora instrukcijām:

- `CA` instrukcija ielādē datus no atmiņas akumulatorā
- `TS` instrukcija ielādē datus no akumulatora atmiņā
- `AD` instrukcija saskaita akumulatoru un norādīto atmiņas lokāciju; rezultāts tiek ielādēts akumulatorā
- `TC` palaiž rutīnu (funkciju) - šajā gadījumā izvada datus uz DSKY'a

Ir divas konstantes. Tās definējam augšā.

Vajadzēs divus reģistrus. Definējam tos - pagaidām tukšus. Vajadzīgo reģistru skaitu var zināt jau kompilācijas laikā.

Un tālāk seko neefektivitātes demonstrējums: Ielādējam akumulatorā 1. konstanti un ieliekam 1. reģistrā. Tāpat ar otro konstanti

Kā arī, te mēs ierakstam akumulatoru reģistrā, bet pēc tam atkal lasām reģistru, lai ielādētu akumulatorā.

## Dubult-vārdu vērtības

AGC atmiņā katra atmiņas vienība - vārds ir 15 bitus garš. Tomēr, ja ir vajadzība pēc lielākiem skaitļiem vai precizitātes, tad var izmantot divus blakus esošus vārdus atmiņā. Reizināšanas instrukcija, piemēram,
var saņemt divas vien-vārdīgas vērtības un izvadīt vienu div-vārdīgu vērtību. Ar dalīšanu ir otrādi.

## Koda sazarojumi

```
ja 0 {
  program(1)
}
program(2)
```

Lai sazarotu kodu, ir jāpārlec pāri tam kodam, ko nevajadzētu izpildīt.

Īstajā Priedē baitkoda kompilators saskaita par cik baitkoda vienībām jāpārlec. Šeit arī ir procesora reģistrs, kas norāda uz pašreizējo izpildāmo procesora instrukciju, bet to nav vajadzības aiztikt un var izmantot rutīnas.

```
	CA PC0
	EXTEND
	BZF JUMT0

	CA PC1
	TC DSPPROG

JUMT0
	CA PC2
	TC DSPPROG
```

`BZF` instrukcija pārlec uz norādīto programmas lokāciju, ja akumulators ir 0. Pirms tam akumulatorā ieliekam reģistru, kas satur norādi jālec, vai nē.

Ar 'if else' sazarojumiem nav daudz savādāk, bet ja pirmais lēciens nenotiek un tie izpildīts 'if' bloks, tad tam beigās jāpievieno beznosacījumu lēciens, lai izlaistu 'else' bloku.

```
	CA PC0
	EXTEND
	BZF JUMT0

	CA PC1
	TC DSPPROG

	TC JUMT1

JUMT0
	CA PC2
	TC DSPPROG

JUMT1
```

## Salīdzinājumi


Ir divas instrukcijas, kas dara to, ko vajag salīdzinājumiem. Ir `BZF`, kas var pārlēkt, ja akumulators ir 0. Un ir `BZMF`, kas pārlec ja akumulators ir 0 vai negatīvs.

Vienādība būs vienkāršākā. Ja vienu pusi atņem no otras, tad rezultāts ir 0. `BZM` instrukcija to pārbauda.

```
  # PR0 un PR1 ir salīdzināmie skaitļi

  CA PR1
  EXTEND
  SU PR0 # No akumulatora atņemam PR0
  TS L # Atņemšasnas rezultātu ieliekam L reģistrā
  CA ONE
  TS PR1 # Gala rezultātā ieliekam 1
  CA L
  EXTEND
  BZF COMPJ0 # Ja atņemšanas rezultāts ir 0, tad pārlecam uz beigām
  CS ZERO
  TS PR1 # Gala rezultātā ieliekam 0.
         # Ja Skaitļi ir vienādi, tad šis kods netiks palaists

COMPJ0
```

Salīdzinājumiem var izmantot `BZMF` instrukciju. Ja labā puse būs lielāka, tad atņemšanas rezultāts būs negatīvs un instrukcija pārlēks.
Ar to sanāk `>=` un `<=` operatori. Lai tiktu pie vienkāršajiem `>` un `<` operatoriem, vajag atņemšanas rezultātam pieskaitīt `1`. Ja abas puses bija vienādas, tad rezultāts no `0` pārtaps par `1` un `BZMF` instrukcija neiedarbosies.

```
  CA PR0
  EXTEND
  SU PR1
  TS L
  INCR L

  CA ONE
  TS PR1

  CA L
  EXTEND
  BZMF COMPJ0

  CS ZERO
  TS PR1

COMPJ0
```


Tā izskatās mašīnkods `<` operatoram.

## Priedes mainīgie

Būtībā jau reģistri, ko pašlaik izmantojam, neatšķirās no mainīgajiem. Kompilators varētu saglabāt katram mainīgajam piesaistīto reģistru. Kad vajag piekļūt mainīgajam, tad atgriežam tā reģistru.

Tomēr, ir cerība vēlāk optimizēt reģistru sistēmu, tāpēc pagaidām izmantošu neefektīvo variantu. Kad vajag piekļūt mainīgajam, tad to ielādējam jaunā reģistrā.
Tas nodrošina, ka mainīgo saturošais reģistrs netiek pārrakstīts.

Priedes mainīgie ir mašīnkodā atdalīti no reģistriem un visi iespējamie mainīgie sākumā tiek definēti kā tukši - AGC rezervē operatīvo atmiņu tiem.

## Cikli

Cikli ir īstenoti ļoti līdzīgi sazarojumiem, bet katru reizi, kad sazarojums ir izpildīts, kods pārlec uz sākumu atkal, līdz brīdim, kad tas vairs neizpildās un kods aizlec uz pašām beigām.

Cikls izskatās aptuveni šādi:

- Lēkšanas mērķis 0
- Cikla nosacījuma pārbaude; ja cikls nav jāizpilda, tad jālec uz beigām (lēkšanas mērķi 1)
- Pats cikls
- Beznosacījumu lēciens uz 0to mērķi
- Lēkšanas mērķis 1


# Noslēgumā

Te vēl ir ko darīt (DSKY pogu ievade, interuptu apstrāde, funkcijas). Un, protams, vēl ir ko optimizēt mašīnkoda ģenerācijā.

Kaut kur ir jāliek punkts, lai gan varbūt nākotnē gribētos kaut ko uzlabot un attīstīt. Šis, protams, bija projekts jautrības pēc, tomēr ir cilvēki,
 kuri nopērk AGC un DSKY replikas un, varbūt, nevēlās iedziļināties AGC mašīnkoda programmēšanā. Te šis varētu noderēt.

Un noslēgumā neliels testiņš. Fibonači skaitļu izvade.

```
sk num1 : 0
sk num2 : 1
sk nakamais : num2

sk tmp : 0

sk i : 1
kamēr i < 20 {
    izvade(nakamais)
    num1 : num2
    num2 : nakamais
    nakamais : num1 + num2

    i +: 1
}
```

Šis ir Priedes kods, kas var palaisties gan Priedes virtuālajā mašīnā, gan uz Apollo navigācijas datora. Šis kompilators izpilda Tūringa pārbaudi, tātad tas ir nosacīti pilnīgs.

```
1
2
3
5
8
13
21
34
...
```

# Atsauces un saites

- [Kods](https://github.com/MarcisAn/priede-agc)
- [Priede](https://priede.andersons-m.lv)

Informācijas avoti:

- [Lieliska prezentācija par datoru un tā programmēšanu](https://www.youtube.com/watch?v=xx7Lfh5SKUQ)
- [Dokuments par datora darbību](https://arxiv.org/pdf/2201.08230)
- [Padziļināts skaidrojums par AGC instrukciju setu un procesora darbību](https://www.ibiblio.org/apollo/assembly_language_manual.html#gsc.tab=0)
- [http://www.ibiblio.org/apollo/#gsc.tab=0](http://www.ibiblio.org/apollo/#gsc.tab=0)
Šī lapa un tās autori ir iemesls, kāpēc šis vispār ir iespējams. Te var atrast arī AGC simulatoru.

- [Īsta AGC fiziska atjaunošana](https://www.youtube.com/playlist?list=PL-_93BVApb59FWrLZfdlisi_x7-Ut_-w7)


Attēlu avoti:

- By Project Apollo Archive - AS11-36-5391, Public Domain, https://commons.wikimedia.org/w/index.php?curid=43988989
- https://www.sothebys.com/en/buy/auction/2021/space-exploration/apollo-guidance-computer
- Steve Jurvetson from Los Altos, USA, CC BY 2.0 <https://creativecommons.org/licenses/by/2.0>, via Wikimedia Commons
