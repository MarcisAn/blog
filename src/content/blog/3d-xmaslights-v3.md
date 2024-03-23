---
author: Mārcis
pubDatetime: 2024-01-04
title: "3D eglītes lampiņas"
slug: "3d-xmaslights-v3"
featured: true
tags:
  - lampinas
description: "Eglītes lampiņas, kurām noteiktas 3D koordinātas"
---

Jau 3 gadus ziemassvētku tuvošanās man nozīmē lielu ņemšanos ar eglītes lampiņām. Sākotnējā ideja nāk no angļu matemātikas jūtūbera [Stand up maths](https://www.youtube.com/watch?v=TvlpIojusBE) un pievienoju šo to jaunu.

Visa būtība slēpjās principā, ka katrai lampiņai uz eglītes tiek noteiktas koordinātas 3D telpā. Tas paver iespēju uz lampiņām atskaņot 3D animācijas. Iedomājamies kubu - ir zināmas kuba virsotņu koordinātas, kā arī katras lampiņas koordinātas, tātad varam noteikt, ka lampiņas, kas atrodās iekšā iedomātajā kubā tiek iedegtas kādā krāsā. Iedomātais kubs kustās augšā, lejā. Tieši pēc šādas loģikas ir veidota lielākā daļa animāciju. Šogad arī pirmo reizi izveidoju sistēmu, kas garāmgājējiem ļauj interaktīvi mainīt lampiņu animācijas.

## Satura rādītājs

## Koordinātu noteikšana

### 2021 v1

<video loop muted="muted"  controls plays-inline="true" class="border border-skin-line"
src="/assets/xmaslights/v0.5.mp4">
</video>

Šis bija neliels eksperiments klases eglītē, kas koordinātu noteikšanas ziņā būtiski atšķirās no turpmākajiem
variantiem tādā ziņā, ka koordinātas netika noteiktas, tika noteikta tikai lampiņu secība uz ass. Kārtošanas
algoritms
iededz 2 lampiņas atšķirīgās krāsās un tad cilvēks nosa, kakura lampiņa ir tālāk uz ass. Neskatoties uz neatbilstību
virsrakstam,
šī metode strādāja diezgan labi, lai gan sarežģītām animācijām tas nestrādātu,
jo eglīte ir daudz augstāka par tās platumu, bet nosakot tikai secību uz ass, mēs to nezinam, un ja šīs
pseido-koordinātas
mēģinātu attēlot vizuāli tad iegūtu kubu, kura iekšienē ir vienmērīgi izmētātas koordinātas.

### 2021 v2

Šoreiz tika noteiktas īstas koordinātas, uzņemot fotogrāfijas, kurā katrā ir ieslēga viena lampiņa, un tad par
lampiņu
koordinātām pieņemot iedegtās lampiņas atrašanās vietu fotogrāfijā, pikseļos. Parādijās problēma, kas sekos vēl
ilgi - lampiņas
nevar redzēt, jo priekšā ir egles zari. Daudzām lampiņām tāpēc nevarēja koordinātas, bet pēc tam es tās iebīdīju
vietā
'uz aci', balstoties uz blakus esošajām koordinātām.

### 2022

Šoreiz pacēlām mērīšanu 'uz aci' jaunā līmenī. Es noliku datoru starp mani un eglīti. Uz ekrāna kustējās līnija,
kuru kontrolēju ar potenciometru. Iedegās lampiņa, pabīdu līniju uz ekrāna tā, lai tā sakrīt ar lampiņu un
piefiksējam
koordinātu uz ekrāna. Lai gan pats koordinātu iegūšanas process no malas izskatījās amizanti, rezultāti bija ļoti
pieņemami.
Turklāt process bija samērā ātrs. Arī šoreiz, protams, dažas lampiņas nevarēja redzēt caur egles zariem, bet te
palīdzēja
draugi, kas turēja slotas kātu egles otrā pusē, kur būtu jābūt lampiņai, lai no priekšas varētu vadīties pēc tā.

### 2023

Iespējams precīzākā metode līdz šim... Iepriekšējie mērījumi, visi tika veikti no viena punkta.
Tāpēc perspektīva var nobīdīt mērījumus.

![Perspektīvas nobīde](/assets/xmaslights/perspective.png)

Divas lampiņas, kas atrodās vienādā augstumā virs zemes var izskatīties dažādos augstumos no vidēja skatu punkta.

Tāpēc šogad kustināsim pašu kameru.
<video src="/assets/xmaslights/slide.mp4" loop controls alt="Kameras kustība"></video>

Pa koka brusu slīd kamera, kuras signāls iet uz ekrānu. Tiek iedegta viena
lampiņa, kamera tiek bīdīta pa brusu līdz lampiņa atrodās kameras kadra centrā. Tad var apgalvot, ka kamera atrodās
vienā punktā uz konkrētās ass un pierakstīt kameras atrašanās vietu uz brusas. Tā ar 200 lampiņām, pa 3 asīm un
gatavs! Cilvēciskās kļūdas rezultātā, pāris lampiņu koordinātas bija nobīdītas, bet tās iebīdīju vietā, balstoties
uz blakus esošajām.

![Kameras uzparikte](/assets/xmaslights/camerasetup.jpg)
![](/assets/xmaslights/slider.jpg)
Tāda bija kameras uzparikte, kas slīd pa koka brusu. Sākotnēji priekšējā plakne bija vienā gabalā, bet,
ejot uz skolu, paslīdēju uz ielas un nolauzu kameru, tad skolā meklēju karsto līmi.

![Kameras uzparikte](/assets/xmaslights/calibration.jpg)
Koordinātu noteikšanas process vienai no horizontālajām asīm.
![](/assets/xmaslights/screen.jpg)
Kamera atrodās vienā punkā ar lampiņu, kad tā atrodās kameras kadra centrā. Šīs līnijas uzzīmēt
programmatūrā būtu smukāk, bet ir citas prioritātes.

## Lampiņu vadība

### 2021 v2

<video loop muted="muted"  controls plays-inline="true" class="border border-skin-line"
src="/assets/xmaslights/unity.mp4">
</video>

Lampiņu 3D reprezentāciju uzbūvēju Unity'ā. Tad katra lampiņa pārbauda, vai sadurās ar kādu objektu, krāsu paņemot no
attiecīgā objekta materiāla.
![Unity](/assets/xmaslights/unity.png)

Dati par animāciju no Unity'a reāllaikā tiek nosūtīti Raspberry Pi minidatoram caur SocketIO

### 2023

Lielākais iemesls sarežģījumiem šī gada programmatūrā bija vēlme pēc vizualizācijas, kas sinhronizējās ar īsto
eglīti. Šim
nolūkam nepieciešams animācijas darbināt divās vietās vienlaicīgi - uz lampiņu kontroliera un vizualizācijā.
Sākotnējais plāns bija rakstīt animācijas rust'ā un tad kompilēt tās priekš raspberry'a un WebAssembly, kas darbotos
vizualizētājā, bet beigās sanāca vēl elegantāk.

Jaunais plāns ir animācijas kadrus ģenerēt vienreiz, uz servera, un tad atskaņot vienlaicīgi uz kontroliera un
JavaScript'ā. Tādejādi katra animācija nav jāpārraksta divreiz, kā arī nav jāsūta milzīgs datu apjoms starp
abiem. Animācijas kadrs satur informāciju par to, kādām lampiņām būtu jāspīd kādā krāsā. Kadru daudzumu sekundē var noteikt kontroles lietotnē.

![Programmatūras shēma](/assets/xmaslights/scheme.png)

Programmatūras shēma

Kontroles web lapa nosūta pieprasījumu serverim ģenerēt animāciju. Ja šāds pieprasījums jau nav kešā, tad
pieprasījums tiek nodots rust serverim, kas atgriež animācijas kadrus. Tad Node serveris šos datus, caur Socket.io
nosūta vizualizācijai un lampiņu kontrolierim.

Katra animācija definē krāsas, ko izmanto ģenerators. Šīs krāsas var mainīt kontroles web lapā. Krāsas var izteikt
arī kā matemātisku izteiksmi. RGB un HSV sistēmā izteiktas krāsas sastāv no 3 skaitliskām vērtībām, kuras var
izteikt ar matemātisku izteiksmi. Katra izteiksme izvada skaitli intervālā 0-100. Labākais, iespējams vienīgais,
pielietojums
ir iekrāsot lampiņas atkarībā no to koordinātām. Šajās izteiksmēs, kā mainīgos var ierakstīt lampiņas koordinātu uz
konkrētas ass, kas arī ir intervālā 0-100. Šo izteiksmju parsošanai sākotnēji gribēju izmantot [priedi](https://github.com/MarcisAn/priede)</a>,
bet tā bija stipri par lēnu.

Bija kaudze ar problēmām, kad īsto versiju centos palaist skolā. Pirmkārt, tāpēc, ka sākumā Raspberry's nevarēja
noķert stabilu WiFi tīklu. Tad vēl Python skripts, kas kontrolē lampiņas nestrādāja īsti pareizi, tāpēc pēdējā brīdī
pārrakstīju kontrolieri ar NodeJs un nokopēju kodu, kas vizualizētājā saņem un apstrādā animācijas datus no
servera.

![Kontroles lietotne](/assets/xmaslights/app.jpg)

Kontroles lietotne

Nakamajā gadā jāizdomā kaut kas radikāli atšķirīgs
