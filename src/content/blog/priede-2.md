---
author: Mārcis
pubDatetime: 2024-05-26
title: "Priedes koda izpilde"
featured: true
tags:
  - priede
description: "Kā priede nonāk no abstraktā sintakses koka līdz izpildītai programmai"
---

## Satura rādītājs

## Abstraktā sintakses koka lasīšana

Lūk, priedes kods, kas saskaita 2+2 un izvada rezultātu:

```
izvade(2+2)
```

Un šādi izskatās ASK šim kodam:

```
block
+-> func_call
    +-> ID = izvade
    +-> funcargs
        +-> plus
            +-> NUMBER = 2
            +-> NUMBER = 2
```

Koka sakne ir bloks. Tas ir saraksts ar vienu, vai vairākām izteiksmēm.
Šajā gadījumā, blokā atrodas viena izteiksme - funkcijas izsaukšana `func_call`.

`func_call` ir divas apakšsekcijas. Pirmā norāda uz funkcijas nosaukumu `ID = izvade`. Tālāk seko saraksts ar funkcijas argumentiem `funcargs`. Šajā gadījumā ir tikai viens arguments `plus`.

`plus` apzīmē saskaitīšanas darbību un tam ir divas apakšsekcijas, kas ir saskaitāmie.

Pievienojam reizināšanas darbību:

```
izvade(2+2*3)
```

ASK izskatās šādi:

```
block
+-> func_call
    +-> ID = izvade
    +-> funcargs
        +-> plus
            +-> NUMBER = 2
            +-> reiz
                +-> NUMBER = 2
                +-> NUMBER = 3
```

Vienīgā atšķirība no iepriekšējās situācijas ir tāda, ka saskaitāmie nav vienkārši skaitļi, bet viens no tiem ir reizināšanas darbības rezultāts. Tādā veidā parādās matemātisko darbību secība. Reizināšanas darbības rezultāts ir saskaitāmais.

Tā arī ASK tiek izpildīts - sākot no beigām. Šajā piemērā vispirms jāizpilda reizināšana, tad tās rezultāts jāizmanto saskaitīšanas darbībā. Un tad tās rezultāts jāpadod `izvade` funkcijai.

### Rekursīva lēkāšana pa koku

Tam var izmantot rekursiju. Ejam cauri ASK, kamēr atrodam kaut ko ar reālu vērtību.

Šādi varētu izskatīties vienkārša ASK apstrādes funkcija Rust valodā.
Vienkāršības labad, strādājam tikai ar `i32` skaitļiem.

```rust
fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        return node.value;
    }
    else if node.title() == "plus"{
        let a = parse_ast(node.child(0));
        let b = parse_ast(node.child(1));
        return a + b;
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            let value_to_print = parse_ast(node.child(1).child(0));
            println!(value_to_print); //izvadam vērtību uz ekrāna.
        }
        //Šeit būtu jānorāda vērtība, ko atgriež funkcija, bet izliksimies, ka tas nenotiek un atgriežam nulli.
        return 0;
    }
}
```

Šis būs ASK, ko tā apstrādās:
```
func_call
+-> ID = izvade
+-> funcargs
    +-> plus
        +-> NUMBER = 2
        +-> NUMBER = 2
```

Šī funkcija pirmo reizi tiek izsaukta ar `func_call` sekciju no ASK koka. Pārbaudām vai pirmā apakšsekcija (funkcijas nosaukums) ir vienāda ar `izvade`. Tādā gadījumā cenšamies noteikt pirmo funkcijas argumentu. Rekursīvi izsaucam to pašu `parse_ast` funkciju, bet tagad padodam tai ASK sekciju, kas norāda funkcijas pirmo argumentu. Tālāk ceram, ka šī funkcija apstrādās visu, kas atrodas tālāk - dotajā ASK koka daļā un atgriezīs skaitli.

Kad rekursīvi tiek izsaukta `parse_ast` funkcija ar `izvade` funkcijas pirmo argumentu, tā uzdurās `plus` sekcijai. Tādā gadījumā `parse_ast` tiek izsaukta vēl divas reizes, lai atrastu labo un kreiso pusi saskaitīšanas darbībā. Kad tas notiek, uzreiz tiek atgriezti skaitļi, jo `plus` sekcijai apakšā stāv vienkārši skaitļi `NUMBER`. Tad tiek veikta saskaitīšanas darbība un atgriezts rezultāts. Rekursijas rezultātā, saskaitīšanas rezultāts nonāk atpakaļ tajā koda daļā, kas nosaka `izvade` funkcijas pirmo argumentu. Tagad, kad esam izceļojuši cauri ASK, tas ir atrasts un varam to izdrukāt.

Šādas, rekursīvas, metodes skaistums ir tajā, ka varam rakstīt kodu tam, kas notiek ar atsevišķām, sīkām, programmas daļām, bet visu pārējo kopā savīs lielā rekursijas funkcija.

### Bloki

Iepriekš jau minēju, ka programmas izteiksmes grupējas blokos.

```
izvade(2+2)
izvade(2+3)
```

Šajā kodā ir divas izteiksmes programmas saknē - blokā, tāpēc ASK izskatās šādi:

```
block
+-> func_call
|   +-> ID = izvade
|   +-> funcargs
|       +-> plus
|           +-> NUMBER = 2
|           +-> NUMBER = 2
+-> func_call
    +-> ID = izvade
    +-> funcargs
        +-> plus
            +-> NUMBER = 2
            +-> NUMBER = 3
```

`block` sekcijai šoreiz ir divas apakšsekcijas - divi funkcijas izsaukumi. Papildinām ASK apstrādes kodu, lai varētu tikt galā ar koda blokiem:

```rust
fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        return node.value;
    }
    else if node.title() == "plus"{
        let a = parse_ast(node.child(0));
        let b = parse_ast(node.child(1));
        return a + b;
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            let value_to_print = parse_ast(node.child(1).child(0));
            println!(value_to_print); //izvadam vērtību uz ekrāna.
        }
        //Šeit būtu jānorāda vērtība, ko atgriež funkcija, bet izliksimies, ka tas nenotiek un atgriežam nulli.
        return 0;
    }
    else if node.title() == "block" {
        for child in node.children() {
            parse_ast(child);
        }
        //Bloks vērtību neatgriež, tāpēc atkal atgriežam vienkārši nulli.
        return 0;
    }
}
```

Pievienojām vēl vienu `else if` sadaļu, kas strādā ar blokiem. Tā ciklā ir cauri visām bloka apakšsekcijām un izsauc `parse_ast` funkciju tām.

Ja mēs izpildām augstāk minēto ASK koku ar blokiem, abi funkcijas izsaukumi tiks apstrādāti pēc kārtas.

Bet bloki pilda arī interesantāku funkciju. Pievienojam `ja` blokus.

```
ja 1 {
    izvade(2+2)
}

```

Lūk šī koda ASK:

```
block
+-> if
    +-> NUMBER = 1
    +-> block
        +-> func_call
            +-> ID = izvade
            +-> funcargs
                +-> plus
                    +-> NUMBER = 2
                    +-> NUMBER = 2
```

`ja` kods sastāv no divām daļām: izteiksmes un koda bloka, kas izpildās ja izteiksme ir patiesa. To arī redzam šajā ASK. Pirmā `ja` apakšsadaļa ir `NUMBER = 1`, bet otrā apakšsadaļa ir koda bloks, kas satur funkcijas izsaukumu.

Papildinām apstrādes kodu tā, lai tas tiktu galā ar `ja` izsaukumiem.

```rust
fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        return node.value;
    }
    else if node.title() == "plus"{
        let a = parse_ast(node.child(0));
        let b = parse_ast(node.child(1));
        return a + b;
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            let value_to_print = parse_ast(node.child(1).child(0));
            println!(value_to_print); //izvadam vērtību uz ekrāna.
        }
        //Šeit būtu jānorāda vērtība, ko atgriež funkcija, bet izliksimies, ka tas nenotiek un atgriežam nulli.
        return 0;
    }
    else if node.title() == "block" {
        for child in node.children() {
            parse_ast(child);
        }
        //Bloks vērtību neatgriež, tāpēc atkal atgriežam vienkārši nulli.
        return 0;
    }
    else if node.title() == "ja" {
        let condition = parse_ast(node.child(0));//'ja' sekcijas pirmā apakšsekcija
        if condition >= 1 {
            parse_ast(node.child(1));//'ja' sekcijas otrā apakšsekcija - bloks
        }
        //'ja' bloki var atgriest vērtību. Rust valodā tā notiek, bet pagaidām to ignorēsim.
    }
    
}
```


Ar 'ja' sekcijas pirmo apakšsekciju (izteiksmi, kas nosaka vai bloks tiks izpildīts) izsaucam 'parse_ast' funkciju, lai noteiktu tās skaitlisko vērtību.
Ja vērtība ir lielāka vai vienāda ar 1, tad izpildām koda bloku. Tas nozīmē - izsaucam `pase_ast` funkciju, kas apstrādās šo bloku.

### Cikli

Pievienojam ciklus

```
atkārtot 4 {
    drukāt(1)
}
```

Mērķis ir 4 reizes izvadīt skaili `1`;

ASK šim kodam varētu izskatīties šādi:

```
block
+-> loop
    +-> NUMBER = 4
    +-> block
        +-> func_call
            +-> ID = drukāt
            +-> funcargs
                +-> NUMBER = 1
```

`loop` sekcijas pirmā apakšsekcija norāda cik reizes cikls tiks izpildīts. Šajā gadījumā tas ir vienkāršs skaitlis, bet tā varētu būt arī sarežģītāka izteiksme.
Otrā apakšsekcija ir bloks, kas jāatkārto.

Papildinām kodu:

```rust
fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        return node.value;
    }
    else if node.title() == "plus"{
        let a = parse_ast(node.child(0));
        let b = parse_ast(node.child(1));
        return a + b;
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            let value_to_print = parse_ast(node.child(1).child(0));
            println!(value_to_print); //izvadam vērtību uz ekrāna.
        }
        //Šeit būtu jānorāda vērtība, ko atgriež funkcija, bet izliksimies, ka tas nenotiek un atgriežam nulli.
        return 0;
    }
    else if node.title() == "block" {
        for child in node.children() {
            parse_ast(child);
        }
        //Bloks vērtību neatgriež, tāpēc atkal atgriežam vienkārši nulli.
        return 0;
    }
    else if node.title() == "ja" {
        let condition = parse_ast(node.child(0));//'ja' sekcijas pirmā apakšsekcija
        if condition >= 1 {
            parse_ast(node.child(1));//'ja' sekcijas otrā apakšsekcija - bloks
        }
        //'ja' bloki var atgriest vērtību. Rust valodā tā notiek, bet pagaidām to ignorēsim.
    }
    else if node.title() == "loop" {
        let times_to_loop = parse_ast(node.child(0));//'loop' sekcijas pirmā apakšsekcija
        for 0..times_to_loop {
            parse_ast(node.child(1));//'loop' sekcijas otrā apakšsekcija - bloks
        }
        //'loop' bloki var atgriest vērtību. Rust valodā tā notiek, bet pagaidām to ignorēsim.
    }
}
```

Nav būtiskas atšķirības no `ja` bloku apstrādes. Nosakām cik reizes cikls jāatkārto, tad apstrādājam cikla bloku tik reizes.

Ja cikla izpildes reižu skaits tiktu norādīts ar saskaitīšanas darbību, viss tāpat darbotos.

```
atkārtot 2+2 {
    drukāt(1)
}
```

## Taisnāks ceļš ir īsāks ceļš

Šo metodi mēdz dēvēt par "pa koku staigātāju". Tas ir labs veids kā analizēt ASK, bet ļoti lēns veids kā to izpildīt, jo lēkājot pa tādu sarežģītu datu struktūru kā koks, datoram ir arī jālēkā pa atmiņu, kas notiek lēnu.

Tāpēc liela daļa interpretatoru pasaulē sadala programmas izpildi divos posmos: kompilācijas laiks un izpildlaiks. Lietotājam vairāk interesē tas cik ātri programma var tik izpildīta, tāpēc mēs varam izmantot kompilācijas laiku, lai apstrādātu programmu tā, ka to var ātri izpildīt.

### Baitkods

Kompilācijas laikā mums ir iespēja pārveidot ASK par kādu citu datu struktūru, ko var vieglāk apstrādāt.

Baitkods ir masīvs(saraksts) ar primitīvām instrukcijām, kas tiek izpildītas izpildlaikā. Tas tiek ģenerēts kompilācijas laikā.

Priedei es rakstu interpretatoru, bet šajā posmā nav būtiskas atšķirības no kompilatora. Kompilators pārveido programmas kodu uz pocesora instrukciju masīvu. Priedes interpretators dara tāpat, tikai tas veido instrukcijas nevis reālam datora procesoram, bet gan tādam, ko es izdomāju no zila gaisa. Tad, protams, ir nepieciešams šī izdomātā procesora simulators (virtuālā mašīna), kas var izpildīt šīs instrukcijas.

Sākam no sākuma ar vienkāršu kodu.

```
izvade(2+1)
```

Baitkods šim kodam varētu izskatīties šādi:

```
LOAD_CONST 2 
LOAD_CONST 1 
ADD
CALL_PRINT_FUNCTION
```

Šis baitkods pieņem, ka tiek izmantots steks datu uzglabāšanai izpildlaikā. Par steku vairāk iepriekšējā rakstā, bet īsumā, izpilde notiek šādi:

- Uz steka tiek uzlikts skaitlis `2`
- Uz steka tiek uzlikts skaitlis `1`
- No steka tiek noņemtas divas augšējās vērtības, ar tām tiek izpildīta saskaitīšana un rezultāts tiek uzlikts atpakaļ uz steka.
- No steka tiek noņemta augšējā vērtība un tā tiek padota, kā arguments, `izvade` funkcijai.

### Baitkoda ģenerācija

Pie baitkoda nonākam ar to pašu kokā lēkājošo funkciju, bet nevis izpildām darbības pa tiešo, bet gan veidojam baitkodu.

```rust
fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        println!("LOAD_CONST {}", node.value);
    }
    else if node.title() == "plus"{
        parse_ast(node.child(0));
        parse_ast(node.child(1));
        println!("ADD");
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            parse_ast(node.child(1).child(0));
            println!("CALL_PRINT_FUNCTION");
        }
    }
}
```

Kad šī funkcija būs izpildīta, mums būs baitkods.

### Lēkāšana pa baitkodu

Iepriekš rakstīju, ka lēkāšana pa datu struktūrām nav laba, bet dažreiz neiztikt, piemēram, strādājot ar `ja` izteiksmēm.

```
ja 1 {
    drukāt(2+1)
}
```

Un baitkods...

```
LOAD_CONST 1
JUMP_IF_FALSE 4
LOAD_CONST 2
LOAD_CONST 1
ADD
CALL_PRINT_FUNCTION
```

Baitkods, kam būtu jāizpildās, tad ja `ja` izteiksme ir patiesa tagad atrodas kopējā baitkoda sarakstā, tāpēc nepieciešams tam lekt pāri, gadījumā, ja nevēlamies to izpildīt.

Te parādās baitkoda instrukcija `JUMP_IF_FALSE`. Ja vērtība steka augšpusē ir nepatiesa, tad šī instrukcija pārlēks baitkodā uz priekšu 4 posmus, kas šajā gadījumā ir baitkoda beigas, jo kodā nekas nenotiek pēc `ja` izteiksmes.

### Ciklošanās

Sarežģītāks gadījums ar 'kamēr' cikliem.

```
sk a : 0

kamēr a < 4 {
    izvade(1)
    a++
}
```

Baitkods...

```
LOAD_CONST 0
DEFINE_VAR a
LOAD_VAR a
LOAD_CONST 4
LESS_THAN
JUMP_IF_FALSE 7
LOAD_CONST 1
CALL_PRINT_FUNCTION
LOAD_VAR a
LOAD_CONST 1
ADD
ASSIGN_VAR a
JUMP_BACK 11
```

Sadalām šo vairākās daļās:

Izveidojam mainīgo `a` ar nulli kā sākuma vērtību.

```
LOAD_CONST 0
DEFINE_VAR a
```

Pārbaudām vai mainīgais `a` ir mazāks par `4`. Ja tā nav, tad pārlecam pāri cikla blokam, uz koda beigām, jo aiz cikla nekā nav.
```
LOAD_VAR a
LOAD_CONST 4
LESS_THAN
JUMP_IF_FALSE 7
```

Cikla bloks
```
LOAD_CONST 1
CALL_PRINT_FUNCTION
```

Pieskaitām skaitli `1` mainīgajam `a`.
```
LOAD_VAR a
LOAD_CONST 1
ADD
ASSIGN_VAR a
```

Lecam atpakaļ uz cikla sākumu, kur atkal tiks pārbaudīts vai mainīgais `a` ir mazāks par `4`.
```
JUMP_BACK 11
```

## Celsium

[Celsium](https://github.com/MarcisAn/celsium) ir Rust bibliotēka interpretatoru būvēšanai, ko es sāku veidot ar mērķi atdalīt no Priedes interpretatora tās daļas, kas var būt vienādas vairākām programmēšanas valodām un to interpretatoriem. 

Ir līdzīgas bibliotēkas kompilatoru būvēšanai: [LLVM](https://llvm.org/) un [Cranelift](https://github.com/bytecodealliance/wasmtime/tree/main/cranelift).

Šādi varam izvadīt `1+2` rezultātu, izmantojot Celsium'u.

```rust
use celsium::block::Block;
use celsium::module::Module;
use celsium::{CelsiumProgram, BINOP, BUILTIN_TYPES};

fn main() {
    let mut celsium = CelsiumProgram::new();
    let mut main_module = Module::new("main", &mut celsium);

    let mut main_block = Block::new();


    {
        main_block.load_const(BUILTIN_TYPES::MAGIC_INT, "1");
        main_block.load_const(BUILTIN_TYPES::MAGIC_INT, "2");
        main_block.binop(BINOP::ADD);
        main_block.call_special_function(SpecialFunctions::PRINT{newline: true});
    }
    //println!("{:?}", main_block.bytecode);
    main_module.add_main_block(main_block);

    celsium.add_module(&main_module);

    celsium.run_program();
}
```

Celsium ir trīs datu struktūras, par ko satraukties.

- Programma: aptver visu kodu, kas tiek palaists.
- Modulis: varētu aptvert vienu koda failu; līdzīga ideja kā Rust moduļiem.
- Bloks: tas pats bloks, par ko šajā rakstā jau plaši aprakstīts.

Izveidojam galveno programmu, galveno moduli un galveno bloku. Tad piepildām šo bloku ar baitkodu, ļoti līdzīgi kā to darījām iepriekš, bet tagad izsaucam funkcijas no Celsium bibliotēkas.

### Koda sazarojumi Celsium'ā:

```rust
let mut celsium = CelsiumProgram::new();
let mut main_module = Module::new("main", &mut celsium);
let mut main_block = Block::new();
{
    //galvenajam blokam pievienojam izteiksmi, kas tiks pārbaudīta, lai noteiktu vai 'if' blokam lēksim pāri.
    main_block.load_const(BUILTIN_TYPES::BOOL, "1");

    //izveidojam jaunu bloku, kas saturēs 'ja' bloka saturu.
    let mut if_block = Block::new();

    {
        //Pievienojam tam 'ja' bloka saturu.
        if_block.load_const(BUILTIN_TYPES::STRING, "executed if block");
        if_block.call_special_function(SpecialFunctions::PRINT{newline: true});
    }

    //Definējam koda sazarojumu. Tā pārbaudes izteiksme jau atrodas galvenajā blokā, bet bloku, kas tiks izpildīts, norādām šeit.
    main_block.define_if_block(if_block);

    main_module.add_main_block(main_block);
    celsium.add_module(&main_module);

    celsium.run_program();
}
```

### Celsium savienošana ar `parse_ast` funkciju:

```rust
let mut celsium = CelsiumProgram::new();
let mut main_module = Module::new("main", &mut celsium);
let mut main_block = Block::new();

fn parse_ast(node: AstNode) -> i32 {
    if node.title() == "NUMBER"{
        main_block.load_const(BUILTIN_TYPES::MAGIC_INT, node.value);
    }
    else if node.title() == "plus"{
        parse_ast(node.child(0));
        parse_ast(node.child(1));
        main_block.binop(BINOP::ADD);
    }
    else if node.title() == "func_call" {
        if node.child(0).value == "izvade" {//Pārbaudām vai funkciju sauc 'izvade'.
            parse_ast(node.child(1).child(0));
            main_block.call_special_function(SpecialFunctions::PRINT{newline: true});

        }
    }
}
```

## Kļūdu ķeršana kompilācijas laikā

Ja Celsium's saskarsies ar kodu, kas nevar tikt izpildīts, tas krašos un cauri, bet glītāk būtu parādīt lietotājam kļūdas paziņojumu vēl pirms kods tiek palaists.

Priedē var atgadīties divu veidu kļūdas:

### Leksera/Pārsera kļūdas

Šajā gadījumā programmas kods vispār nav saprotams un apstrādājams, jo neatbilst Priedes sintaksei.

Šīs kļūdas atrod un apstrādā [Hime](https://cenotelie.fr/projects/hime) parsera ģenerators un Priedei tikai tie glīti jāparāda lietotājam.

Piemēram, Priedes lietotājs mēģina definēt mainīgo ar `=` zīmi.

```
skaitlis a = 2
```

Tajā pozīcijā, kur atrodas `=` zīme, būtu jāatrodas `:` zīmei, tāpēc šeit ir neparedzēta simbola kļūda.

```
Kļūda: 
NEATPAZĪTS SIMBOLS `=`
Faila "E:\Dev\priede\examples\sveika_pasaule.pr"
1. rindiņā
```

### Datu tipu kļūdas

Priede cenšas uztraukties par datu tipiem, piemēram, ja lietotājs mēģina definēt mainīgo ar skaitļa tipu, bet sākotnējā vērtībā piešķir tekstu.

```
skaitlis a : "šis nav skaitlis"
```

Šis kods metīs kļūdas par to ka sākotnējā vērtība nesakrīt ar mainīgā datu tipu.

Šajā gadījumā to noteikt kompilācijas laikā ir diezgan vienkārši, jo `TEXT` ir tieša apakšsekcija zem mainīgā definēšanas. Bet sākotnējās vērtības var būt arī matemātiskas izteiksmes.

```
teksts a : 3+4*2
```

Šeit būtu jāatrod rezultāts no saskaitīšanas darbības un jāsaprot vai tā datu tips sakrīt ar to, kas norādīts definējot datu tipu.

Te nonākam pie vajadzības iet cauri ASK tā, kā to darītu izpildot programmu, pirms tā patiešām tiek izpildīta. Tas, protams, nav reāli, bet ja mērķis ir pārbaudīt datu tipus, tad varam izveidot nelielu interpretatoru, kas strādā tikai ar datu tipiem, nevis reālām vērtībām.

Saskaitīšanas darbība paņem divus datu tipus ka saskaitāmos, pārbauda vai saskaitīšana ir iespējama ar šiem datu tipiem. Ja nav, tad metam kļūdu. Ja ir iespējama, tad tā atgriež rezultāta datu tipu.

Tādējādi sanāk atgriezties pie lēkāšanas pa ASK koku, bet kompilācijas laikā.