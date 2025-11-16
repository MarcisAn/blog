---
author: Mārcis
pubDatetime: 2025-06-01
title: "Priedes koda automātiska formatēšana"
featured: true
tags:
  - priede
description: "Automātisksā koda formatēšana Priedē"
---


Priedes kodam neesmu pieskāries jau vairākus mēnešus, bet tagad atkal pieķēros pie tā. Kopējā situācija nav spīdoša. Pats Priedes interpretators darbojās, toties pārējā infrastruktūra nav labākajā formā. Tagad vajadzētu atbrīvoties no visa puspabeigtā un sakoncentrēties uz svarīgajām lietām.

... Tāpēc es izdomāju iesākt vēl vienu puspabeigtu projektiņu - automātisko formatētāju.


## Satura rādītājs


## Formatēšana

Automātiskās formatēšanas mērķis ir šādu nesmuku kodu 

```
ja 1+1/5      =   5 {
izvade(2       )
        }
```

padarīt vieglāk lasāmu.

```
ja (1 + 1 / 5 = 5) {
        izvade(2)
}
```

Kā izrādās, automātiskie formatētāji ir diezgan sarežģīti. Toties stipri varam to vienkāršot, ja netiek aplauztas koda līnijas.

<br>
<br>


Šajā kodā
```
ja a + b + c + d + e + f + g + h + i + j + k + l + m {
    izvade("Lai tev jauka diena!")
}
```

garo rindiņu varam aplauzt, lai tā ietilptu šaurākā logā.

```
ja
a + b + c + d + e + f +
g + h + i + j + k + l + m {
    izvade("Lai tev jauka diena!")
}
```

Priedes koda parseris šādu kodu saprot tāpat, kā pirmo variantu, bet tas ir vieglāk lasāms.

Algoritms, lai atrastu vietas, kur aplauzt rindiņu ir diezgan interesants(skat. atsauces) un kādu dienu es gribētu to implementēt Priedei, bet šobrīd pieturēšos pie formatētāja, kas nepalauž rindiņas.

## Abstraktais sintakses koks (atkal)

Plāns šāds: kodu pārveidojam tādā formā, kas parāda koda uzbūvi, bet nesatur atstarpes un jaunas rindiņas. Tad pārveidojam to atpakaļ uz kodu, atbilstoši vēlmēm par formatējumu.

Priedes interpretators to jau dara un šo struktūru sauc par abstraktās sintakses koku. Nosaukums jau pasaka, ka tas nesatur informāciju par koda sintaksi un formatējumu. Tomēr Priedes ASK satur pietiekoši daudz informācijas, lai nonāktu atpakaļ pie koda. Vairāk par Priedes darbu ar ASK var palasīt iepriekšējos rakstos par Priedi, bet te kopsavilkums:

<br>

Šo kodu parsojam
```
sk a : 3 - 2
print(1+2*a)
```
un iegūstam abstrakto sintakses koku.
![Priedes ASK](/assets/priede-1/ast-2.jpg)

Rekursīvi izpildot darbības varam izpildīt kodu. To dara Priedes interpretators.

Un rekursīvi ejot cauri šim kokam varam arī sadrukāt kodu.

### Bloki

Te arī sākās visas problēmas.

Bloks ir Priedes koda sakne. Bloks var saturēt mainīgo deklarācijas, funkciju izsaukums, sazarojumus, ciklus utt.

Kodam

```
izvade(a)
izvade(a)

```

ASK izskatās šādi.

```
block
+-> func_call
|   +-> ID = izvade
|   +-> funcargs
|       +-> ID = a
+-> func_call
    +-> ID = izvade
    +-> funcargs
        +-> ID = a
```

Bloks ir iekšā arī sazarojumos vai ciklos.

```
block
+-> if
    +-> NUMBER = 1
    +-> block
        +-> func_call
            +-> ID = izvade
            +-> funcargs
                +-> NUMBER = 1
```

Pirmais posms ir vienkāršs. Izejam cauri bloka apakšpunktiem un tos izdrukājam - katru savā rindiņā.

Tomēr gribam saglabāt tukšās rindiņas, ja lietotājs tās ir ielicis.

```
izvade(1)


izvade("Lai tev jauka diena!")
```

negribam pārtaisīt par

```
izvade(1)
izvade("Lai tev jauka diena!")
```

Bibliotēka, ko izmantoju ASK ģenerēšanai piedāvā atgūt teksta rindiņu nummurus no ASK elementiem. Precīzāk sakot tiem elementiem, kuri pastāv tekstā, jo vairāku teksta elementu grupai nepiemīt reāla atrašanās vieta tekstā. Tāpēc izveidoju rekursīvu funkciju, kas atrod augstāko apakšelementu no ASK zara, kam ir pozīcija tekstā.

Ja vēlamies ievērot tukšās rindiņas, tad varam pārbaudīt vai starp diviem blakus esošiem elementiem blokā ir vairāk kā viena rindiņa starpā

```
izvade(1)                          //1. rindiņa
                                   //2. rindiņa
izvade("Lai tev jauka diena!")     //3. rindiņa
```

Kad nonākam pie otrā bloka elementa, tad varam redzēt, ka iepriekšējais elements bija 2 rindiņu attālumā, tāpēc vispirms izdrukājam tukšu rindiņu, pirms jaunā elementa.

<br>

Ziepes sākās, kad bloka elementi ir vairāku rindiņu platumā.

```
izvade(1)

ja 2=2 {
    izvade("Lai tev jauka diena!")
}

izvade(2)
```


Šis `ja` sazarojums ir viens bloka elements. Ja izmantojam iepriekšējo metodi, tad starp apakšbloku un trešo izvades funkciju sanāktu 4 tukšas rindiņas, bet vispār ir tikai 1.

Iepriekš minēto rekursīvo funkciju rindiņas noteikšanai var pārveidot, lai tā atrastu tālāko elementu, kas arī būtu viszemāk kodā (rindiņas nummura ziņā). Tomēr šajā gadījumā tas nestrādās, jo aizverošā figūriekava neietilps ASK. Tā parādās tikai tad, kad sazarojums ir jau formatēts.

To arī izmantosim. Rekursīvā funkcija formatēšanai tagad atgriež ne tikai formatēto kodu, bet arī rindiņu skaitu, kurās šis kods ietilpst. Šīs funkcijas daļa, kas apstrādā `ja` elementu aprēķina cik rindiņas tas aizņem.

Pieskaitām apakšbloka rindiņu skaitu pie nosacījuma rindiņu skaita (šajā gadījumā 1) un Pieskaitām 1, kas norāda aizverošo figūriekavu.

Tātad
- atrodam bloka elementa augšējo rindiņu
- pieskaitām pie tās elementa platumu rindiņās
- aprēķinām tukšās rindiņas ar nākamo elementu

## Indentācija
(atkāpju pievienošana)

Šajā sakarā mūs atkal interesē bloki. Katram nākamajam blokam palielinām indentācijas līmeni.

```
// 0 platuma atkāpe
ja 2=2 {
    // 1 platuma atkāpe
    drukāt(2)
// 0 platuma atkāpe
}
ja 1 {
    // 1 platuma atkāpe
    drukāt(1)
    ja 2=2 {
        // 2 platuma atkāpe
        drukāt("Lai tev jauka diena!")
    // 1 platuma atkāpe    
    }
// 0 platuma atkāpe
}
```

Tātad ir nepieciešams palielināt atkāpi tad, kad sākam drukāt jaunu bloku, bet samazināt, kad šis bloks ir cauri. Izņēmums ir programmas pamata bloks.

Rekursīvajā funkcijā nēsājam līdzi arī uzstādījumus, piemēram:

- Vai atverošās figūriekavas blokiem atrodas tajā pašā rindiņa vai rindiņu zemāk
- Vai atkāpei tiek izmantoti `TABi` vai atstarpes
- utt.

## Atsauces
[The Hardest Program I’ve Ever Written - Bob Nystrom](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/#1-note)