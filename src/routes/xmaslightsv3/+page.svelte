<h1>3D animācijas uz eglītes lampiņām</h1>

<p>Jau 3 gadus ziemassvētku tuvošanās man nozīmē lielu ņemšanos ar eglītes lampiņām. Ideju nospēru no angļu matemātikas
    jūtūbera <a href="https://www.youtube.com/watch?v=TvlpIojusBE">Stand up maths</a> un pievienoju šo to jaunu.</p>
<p>Visa būtība slēpjās principā, ka katrai lampiņai uz eglītes tiek noteiktas koordinātas 3D telpā. Tas paver iespēju uz
    lampiņām
    atskaņot 3D animācijas.
    Iedomājamies kubu - ir zināmas kuba virsotņu koordinātas, kā arī katras lampiņas koordinātas,
    tātad varam noteikt, ka lampiņas, kas atrodās iekšā iedomātajā kubā tiek iedegtas kādā krāsā.
    Iedomātais kubs kustās augšā, lejā. Tieši pēc šādas loģikas ir veidota lielākā daļa animāciju.
    Šogad arī pirmo reizi izveidoju sistēmu, kas garāmgājējiem ļauj interaktīvi mainīt lampiņu animācijas.</p>

<h2>Koordinātu noteikšana</h2>
<h3>2021 v1</h3>
<video style="height: 32rem" src="/assets/xmaslights/v0.5.mp4" autoplay loop controls></video>
<p>Šis bija neliels eksperiments klases eglītē, kas koordinātu noteikšanas ziņā būtiski atšķirās no turpmākajiem
    variantiem tādā ziņā, ka koordinātas netika noteiktas, tika noteikta tikai lampiņu secība uz ass. Kārtošanas
    algoritms
    iededz 2 lampiņas atšķirīgās krāsās un tad cilvēks nosaka kura lampiņa ir tālāk uz ass. Neskatoties uz neatbilstību
    virsrakstam,
    šī metode strādāja diezgan labi, lai gan sarežģītām animācijām tas nestrādātu,
    jo eglīte ir daudz augstāka par tās platumu, bet nosakot tikai secību uz ass, mēs to nezinam, un ja šīs
    pseido-koordinātas
    mēģinātu attēlot vizuāli tad iegūtu kubu, kura iekšienē ir vienmērīgi izmētātas koordinātas.</p>

<h3>2021 v2</h3>
<p>Šoreiz tika noteiktas īstas koordinātas, uzņemot fotogrāfijas, kurā katrā ir ieslēga viena lampiņa, un tad par
    lampiņu
    koordinātām pieņemot iedegtās lampiņas atrašanās vietu uz fotogrāfijā, pikseļos. Parādijās problēma, kas sekos vēl
    ilgi - lampiņas
    nevar redzēt, jo priekšā ir egles zari. Daudzām lampiņām tāpēc nevarēja koordinātas, bet pēc tam es tās iebīdīju
    vietā
    'uz aci', balstoties uz blakus esošajām koordinātām.</p>

<h3>2022</h3>
<p>Šoreiz pacēlām mērīšanu 'uz aci' jaunā līmenī. Es noliku datoru starp mani un eglīti. Uz ekrāna kustējās līnija,
    kuru kontrolēju ar potenciometru. Iedegās lampiņa, pabīdu līniju uz ekrāna tā, lai tā sakrīt ar lampiņu un
    piefiksējam
    koordinātu uz ekrāna. Lai gan pats koordinātu iegūšanas process no malas izskatījās amizanti, rezultāti bija ļoti
    pieņemami.
    Turklāt process bija samērā ātrs. Arī šoreiz, protams, dažas lampiņas nevarēja redzēt caur egles zariem, bet te
    palīdzēja
    draugi, kas turēja slotas kātu egles otrā pusē, kur būtu jābūt lampiņai, lai no priekšas varētu vadīties pēc tā.</p>

<h3>2023</h3>
<p>Iespējams precīzākā metode līdz šim... Iepriekšējie mērījumi, visi tika veikti no viena punkta.
    Tāpēc perspektīva var nobīdīt mērījumus.</p>
<img src="/assets/xmaslights/perspective.png"
     alt="3D vizualizācija, kas parāda, ka perspektīva var nobīdīt lampiņu šķietamās koordinātas">
<p class="img-caption">Perspektīva var likt divām lampiņām parādīties atšķirīgos augstumos, lai gan tās ir vienādā
    augstumā</p>
<p>Tāpēc šogad kustināsim pašu kameru.</p>
<video src="/assets/xmaslights/slide.mp4" autoplay loop controls alt=""></video>

<p> Pa koka brusu slīd kamera, kuras signāls iet uz ekrānu. Tiek iedegta viena
    lampiņa, kamera tiek bīdīta pa brusu līdz lampiņa atrodās kameras kadra centrā. Tad var apgalvot, ka kamera atrodās
    vienā punktā uz konkrētās ass un pierakstīt kameras atrašanās vietu uz brusas. Tā ar 200 lampiņām, pa 3 asīm un
    gatavs! Cilvēciskās kļūdas rezultātā, pāris lampiņu koordinātas bija nobīdītas, bet tās iebīdīju vietā, balstoties
    uz blakus esošajām.</p>
<img src="/assets/xmaslights/camerasetup.jpg" alt="">
<img src="/assets/xmaslights/slider.jpg" alt="">
<p class="img-caption">Kameras uzparikte, kas slīd pa koka brusu. Sākotnēji priekšējā plakne bija vienā gabalā, bet,
    ejot uz skolu, paslīdēju uz ielas un nolauzu kameru, tad pa visu skolu meklēju karsto līmi.</p>
<img src="/assets/xmaslights/calibration.jpg" alt="">
<p class="img-caption">Koordinātu noteikšanas process vienai no horizontālajām asīm.</p>
<img src="/assets/xmaslights/screen.jpg" alt="">
<p class="img-caption">Kamera atrodās vienā punkā ar lampiņu, kad tā atrodās kameras kadra centrā. Šīs līnijas uzzīmēt programmatūrā būtu smukāk, bet ir citas prioritātes</p>

<h2>Lampiņu vadība</h2>
<p>Par iepriekšējām versijām nav naudz ko stāstīt. Lampiņas bija pieslēgtas pie raspberry pi minidatora, kur python
    skripti atskaņoja animācijas.</p>

<p>Lielākais iemesls sarežģījumiem programmatūrā bija vēlme pēc vizualizācijas, kas sinhronizējās ar īsto eglīti. Šim
    nolūkam nepieciešams animācijas darbināt divās vietās vienlaicīgi - uz lampiņu kontroliera un vizualizācijā.
    Sākotnējais plāns bija rakstīt animācijas rust'ā un tad kompilēt priekš raspberry'a un WebAssembly, kas darbotos
    vizualizētājā. Šis plāns atcēlās, nu jau neatceros, kāpēc.</p>
<p>Jaunais plāns ir animācijas kadrus ģenerēt vienreiz, uz servera, un tad atskaņot vienlaicīgi uz kontroliera un
    JavaScript'ā. Tādejādi katra animācija nav jāpārraksta divreiz, kā arī nav jāsūta milzīgs datu apjoms starp
    abiem.</p>

<img src="/assets/xmaslights/scheme.png" alt="">
<p class="img-caption">Kopējās programmatūras shēma</p>

<p>Kontroles web lapa nosūta pieprasījumu serverim ģenerēt animāciju. Ja šāds pieprasījums jau nav kešā, tad
    peiprasījums tiek nodots rust programmai, kas atgriež animācijas kadrus. Tad Node serveris šos datus, caur Socket.io
    nosūta vizualizācijai un lampiņu kontrolierim.</p>

<p>Katra animācija definē krāsas, ko izmanto ģenerators. Šīs krāsas var mainīt kontroles web lapā. Krāsas var izteikt
    arī kā matemātisku izteiksmi. RGB un HSV sistēmā izteiktas krāsas sastāv no 3 skaitliskām vērtībām, kuras var
    izteikt ar matemātisku izteiksmi. Katra izteiksme izvada skaitli intervālā 0-100. Labākais, iespējams vienīgais,
    pielietojums
    ir iekrāsot lampiņas atkarībā no to koordinātām. Šajās izteiksmēs, kā mainīgos var ierakstīt lampiņas koordinātu uz
    konkrētas ass, kas arī ir intervālā 0-100. Šo izteiksmju parsošanai sākotnēji gribēju izmantot <a href="">priedi</a>,
    bet tā bija stipri par lēnu.</p>