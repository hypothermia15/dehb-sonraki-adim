"use strict";
/* DEHB'de Bir Sonraki Adım — ebeveynler için durum rehberi.
   Özgün eser: How to ADHD (Parent Pilot), Danya Dotan (2026), MIT lisansı.
   Türkçe uyarlama: Doç. Dr. Miraç Barış Usta. Değişiklikler UYARLAMA.md dosyasında.
   Kaydedilen adımlar yalnızca bu tarayıcıda durur; hiçbir veri gönderilmez. */

const DEPO = "dehb-adimlar-v1";
const durum = { gorunum: "ana", yas: "hepsi", arama: "", senaryo: null, kip: "adim", secim: null, prova: 0, provaSecim: null };
let kayitli = [];

function kac(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function kayitOku() {
  try {
    const v = JSON.parse(localStorage.getItem(DEPO) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && typeof x.id === "string" && typeof x.senaryo === "string").slice(0, 100) : [];
  } catch {
    return [];
  }
}
function kayitYaz() {
  try {
    localStorage.setItem(DEPO, JSON.stringify(kayitli));
    return true;
  } catch {
    bildir("Bu tarayıcıda kaydedilemiyor");
    return false;
  }
}

/* ───────────── Durumlar ─────────────
   adim: denenecek tek şey · kucuk: daha küçük hâli · baska: başka bir yol · cumle: kullanılabilecek söz
   soru/yanit: adımı kişiselleştiren tek soru · uyari: ne zaman başka yardım gerekir */
const senaryolar = [
  {
    id: "sabah", yas: "5-9", simge: "☀️",
    baslik: "Sabahlar kavgayla başlıyor",
    ozet: "Vakit daralınca her küçük geçiş bir çekişmeye dönüyor.",
    neden: "Geçişler ve art arda gelen yönergeler, başlamayı gözünde büyütebilir. Sabah, bu ikisinin en yoğun olduğu saattir.",
    adim: "Tek bir iş seçin: ayakkabıyı giymek. Yanına oturun ve birlikte başlamayı önerin.",
    kucuk: "Bir ayakkabıyı kapının yanına koyun. Şimdilik bu kadarı yeter.",
    baska: "İki seçenek sunun: önce sağ ayakkabı mı, sol mu?",
    cumle: "“Başlamak zor görünüyor. Yalnızca bir ayakkabıyı giyelim, ben buradayım.”",
    soru: ["Vakit dar", "Acelemiz olmayan günlerde de oluyor"],
    yanit: [
      "Bu sabahlık beklentilerden birini bırakın ve sesinizi sakin tutun. Geç kalınan bir sabah, öğretme zamanı değildir.",
      "Sakin bir saatte “tek iş seçme”yi birlikte prova edin. Sabah düzenini resimli bir sıraya dökmek yardımcı olabilir.",
    ],
    uyari: "Sıkıntı çok yoğunsa ya da okula gitmeme haftalardır sürüyorsa okulun rehberlik servisiyle ve çocuğu izleyen uzmanla görüşün.",
  },
  {
    id: "odev", yas: "10-13", simge: "✏️",
    baslik: "Ödev bir türlü başlamıyor",
    ozet: "Defter açık, zaman geçiyor, ilk adım gelmiyor.",
    neden: "Bir işe başlamak, işi sürdürmekten daha çok destek isteyebilir. “Yapamıyor” ile “başlayamıyor” aynı şey değildir.",
    adim: "Masaya tek bir sayfa koyun ve başlanacak tek bir soruyu birlikte seçin.",
    kucuk: "Defterin doğru sayfasını açın. Henüz yanıtlamak gerekmiyor.",
    baska: "Sorun: “Soruyu birlikte mi okuyalım, yoksa ben mi sesli okuyayım?”",
    cumle: "“Hepsini şimdi bitirmek zorunda değiliz. Yalnızca nereden başlayacağımızı seçiyoruz.”",
    soru: ["Başlamak zor", "Sürdürmek zor"],
    yanit: [
      "Sonuç beklemeden 90 saniyelik sabit bir başlangıç düzeni deneyin: masa, kalem, tek soru.",
      "Kısa bir çalışma aralığı ve önceden kararlaştırılmış bir mola kullanın. Molanın ne zaman biteceği baştan belli olsun.",
    ],
    uyari: "Ödev kavgası haftalardır her akşam sürüyorsa ya da okul başarısı belirgin düşüyorsa sınıf öğretmeniyle ve çocuğu izleyen hekimle görüşün.",
  },
  {
    id: "ekran", yas: "14-18", simge: "📱",
    baslik: "Ekran kapanınca tartışma başlıyor",
    ozet: "Telefondan başka bir işe geçiş herkesi geriyor.",
    neden: "Keyif veren bir etkinlik birden kesilince direnç güçlü olabilir. Tartışmayı çoğu zaman kesilme biçimi çıkarır.",
    adim: "Sakin bir anda, bir sonraki geçiş için ortak bir işaret kararlaştırın.",
    kucuk: "Bitirmeden önce nasıl bir uyarının işine yarayacağını sorun. Önce dinleyin.",
    baska: "Doğal bir durma noktasında anlaşın: videonun, bölümün ya da şarkının sonu.",
    cumle: "“Kapatmanın seni hazırlıksız yakalamasını istemiyorum. Nasıl bitireceğimizi birlikte kararlaştıralım.”",
    soru: ["Zaten bir anlaşmamız var", "Hiç anlaşmamız yok"],
    yanit: [
      "Anlaşmayı tartışma bittikten sonra, sakin bir zamanda yeniden konuşun. İşlemeyen maddeyi birlikte değiştirin.",
      "Sınır koymadan önce ihtiyaçları ve beklentileri konuşun: o neye ihtiyaç duyuyor, siz neye?",
    ],
  },
  {
    id: "tasma", yas: "hepsi", simge: "🌧️",
    baslik: "Duygusal taşma",
    ozet: "Sesler yükseliyor, an herkese fazla geliyor.",
    neden: "Taşma sırasında açıklamaları ve istekleri işlemek zorlaşır. O anda öğretilen şey akılda kalmaz.",
    adim: "Sözü ve gürültüyü azaltın. Herkesin güvende olduğundan emin olun ve sakin biçimde yanında kalın.",
    kucuk: "On saniye boyunca açıklamayı bırakın. Nefes alın ve güvenliği gözden geçirin.",
    baska: "Soru sormadan sessiz bir yer ya da sakin bir eşlik önerin.",
    cumle: "“Buradayım. Biraz kolaylaşınca konuşuruz.”",
    soru: ["Herkes güvende", "Yaralanma tehlikesi var"],
    yanit: [
      "Şimdi az söz kullanın. Olanları sakinleşince konuşup onarın.",
      "Biri o anda tehlikedeyse 112’yi arayın. Bu sayfaya güvenerek beklemeyin.",
    ],
    uyari: "Çocuğun kendine ya da başkasına zarar verme tehlikesi varsa 112 Acil Çağrı Merkezi’ni arayın.",
  },
  {
    id: "ogretmen", yas: "hepsi", simge: "🏫",
    baslik: "Öğretmenle konuşmak",
    ozet: "Suçlamaya dönüşmeyen bir görüşmeyle iş birliği kurmak.",
    neden: "Tek ve açık bir istek, birlikte çalışmayı ve gidişatı gözden geçirmeyi kolaylaştırır. Uzun bir şikâyet listesi iki tarafı da savunmaya iter.",
    adim: "Suçlamadan tek bir gözlem paylaşın ve bir haftalık bir deneme isteyin.",
    kucuk: "Olguya dayanan tek bir açılış cümlesi yazın.",
    baska: "Uzun yazışmalar yerine kısa bir telefon görüşmesi ya da yüz yüze on dakika isteyin.",
    cumle: "“Son zamanlarda işe başlamak zorlaşıyor. Bir hafta boyunca aynı başlangıç işaretini deneyip neyin işe yaradığına bakabilir miyiz?”",
    soru: ["İlişkimiz iyi", "İletişim gergin"],
    yanit: [
      "Gelecek hafta birlikte bakacağınız küçük bir gösterge belirleyin: örneğin dersin ilk beş dakikasında işe başlama.",
      "Yansız bir gözlemle başlayın ve öğretmenin kendi gözlemini sorun. Görüşmeye okulun rehberlik servisini de katabilirsiniz.",
    ],
    okul: true,
  },
  {
    id: "arkadas", yas: "10-13", simge: "🫂",
    baslik: "Arkadaşlıklar karışık",
    ozet: "Kırgınlık, dışlanma ya da durumu okumakta zorlanma.",
    neden: "Öğüt vermeden önce duyguyu tanımak çoğu zaman daha çok işe yarar. Hemen çözüm sunmak, çocuğa anlatmayı bıraktırabilir.",
    adim: "Tek bir açık uçlu soru sorun ve düzeltmeye çalışmadan dinleyin.",
    kucuk: "“Bu can sıkıcı olmalı” deyin. Sonra durun ve dinleyin.",
    baska: "Hemen konuşmak yerine olanı çizmeyi önerin.",
    cumle: "“Seni dinlememi mi istersin, yoksa ne yapılabileceğini birlikte mi düşünelim?”",
    soru: ["Konuşmak istiyor", "Konuşmak istemiyor"],
    yanit: [
      "En zor gelen kısmın hangisi olduğunu sorun.",
      "Alan tanıyın ve kapıyı açık bırakın: “İstediğinde buradayım.”",
    ],
    uyari: "Zorbalık ya da sürekli dışlanma kuşkusu varsa okul yönetimi ve rehberlik servisiyle gecikmeden görüşün.",
  },
  {
    id: "okul", yas: "5-9", simge: "🎒",
    baslik: "Okula gitmek istemiyor",
    ozet: "“Gitmiyorum” diyor ve evden çıkmak olanaksız görünüyor.",
    neden: "Kaçınmanın pek çok nedeni olabilir. Tek bir açıklama varsaymayın: ayrılma, sınıftaki bir güçlük, bir arkadaş ya da bedensel bir yakınma.",
    adim: "Sakin bir zamanda hangi kısmın en zor olduğunu sorun: evden çıkmak mı, ayrılmak mı, sınıfta olmak mı?",
    kucuk: "Yalnızca şunu sorun: “Sabahın en zor kısmı hangisi?” Düzeltmeden dinleyin.",
    baska: "Okul gününü birlikte çizin ve zor gelen tek bir bölümü işaretleyin.",
    cumle: "“Bunun zor olduğuna inanıyorum. Anlamak istiyorum. Destek için okulla birlikte çalışabiliriz.”",
    soru: ["Ayrılmak zor", "Okul günü zor"],
    yanit: [
      "Okulla birlikte kısa ve hep aynı olan bir vedalaşma düzeni kurmayı konuşun.",
      "Güçlüğün tam olarak ne olduğunu bulmak için sınıf öğretmeninden ve rehberlik servisinden yardım isteyin.",
    ],
    uyari: "Zorbalık, istismar ya da belirgin kaygı kuşkusu varsa okulla ve bir çocuk ve ergen ruh sağlığı uzmanıyla gecikmeden görüşün. Okula gitmeme uzadıkça dönüş zorlaşır.",
    okul: true,
  },
  {
    id: "ergen", yas: "14-18", simge: "💬",
    baslik: "Ergen çocuğum kendini kapatıyor",
    ozet: "“Beni rahat bırak” tek yanıt gibi geliyor.",
    neden: "Ergenlerle konuşurken özerklik, mahremiyet ve zamanlama belirleyicidir. Ne zaman konuşulacağını o seçerse konuşma olasılığı artar.",
    adim: "Kısa bir konuşma için izin isteyin ve zamanını onun seçmesine bırakın.",
    kucuk: "Açık bir cümle bırakın: “İstediğinde buradayım.”",
    baska: "Karşı karşıya oturmak yerine kısa bir araba yolculuğu ya da yürüyüş deneyin.",
    cumle: "“Şimdi yanıt vermek zorunda değilsin. Ulaşabileceğin bir yerde olduğumu bilmeni istiyorum.”",
    soru: ["Bu yeni başladı", "Bir süredir böyle"],
    yanit: [
      "Neyin değiştiğini ve nasıl hissettiğini üstelemeden, merakla sorun.",
      "Anlatması için baskı yapmadan bağ kurun. Kaygınız sürüyorsa bir uzmandan destek alın.",
    ],
    uyari: "İçe kapanmaya uyku ve iştah değişikliği, okuldan kopma, umutsuzluk ya da kendine zarar verme sözleri eşlik ediyorsa beklemeden bir çocuk ve ergen ruh sağlığı uzmanına başvurun.",
  },
];

const KIP_AD = { adim: "adim", kucuk: "kucuk", baska: "baska" };
function adimMetni(s, kip) {
  return s[KIP_AD[kip] || "adim"];
}

/* ───────────── Kaynaklar ───────────── */
const KAYNAK = {
  daley2014: 'Daley D, van der Oord S, Ferrin M, ve ark. Behavioral interventions in attention-deficit/hyperactivity disorder: a meta-analysis of randomized controlled trials across multiple outcome domains. J Am Acad Child Adolesc Psychiatry. 2014;53(8):835-47. <a href="https://doi.org/10.1016/j.jaac.2014.05.013" target="_blank" rel="noopener">doi:10.1016/j.jaac.2014.05.013</a>',
  daley2018: 'Daley D, Van Der Oord S, Ferrin M, ve ark. Practitioner Review: Current best practice in the use of parent training and other behavioural interventions in the treatment of children and adolescents with attention deficit hyperactivity disorder. J Child Psychol Psychiatry. 2018;59(9):932-947. <a href="https://doi.org/10.1111/jcpp.12825" target="_blank" rel="noopener">doi:10.1111/jcpp.12825</a>',
  evans2018: 'Evans SW, Owens JS, Wymbs BT, Ray AR. Evidence-Based Psychosocial Treatments for Children and Adolescents With Attention Deficit/Hyperactivity Disorder. J Clin Child Adolesc Psychol. 2018;47(2):157-198. <a href="https://doi.org/10.1080/15374416.2017.1390757" target="_blank" rel="noopener">doi:10.1080/15374416.2017.1390757</a>',
  faraone2021: 'Faraone SV, Banaschewski T, Coghill D, ve ark. The World Federation of ADHD International Consensus Statement: 208 Evidence-based conclusions about the disorder. Neurosci Biobehav Rev. 2021;128:789-818. <a href="https://doi.org/10.1016/j.neubiorev.2021.01.022" target="_blank" rel="noopener">doi:10.1016/j.neubiorev.2021.01.022</a>',
  wolraich2019: 'Wolraich ML, Hagan JF, Allan C, ve ark. Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of Attention-Deficit/Hyperactivity Disorder in Children and Adolescents. Pediatrics. 2019;144(4):e20192528. <a href="https://doi.org/10.1542/peds.2019-2528" target="_blank" rel="noopener">doi:10.1542/peds.2019-2528</a>',
  nice: 'National Institute for Health and Care Excellence. Attention deficit hyperactivity disorder: diagnosis and management (NG87). <a href="https://www.nice.org.uk/guidance/ng87" target="_blank" rel="noopener">nice.org.uk/guidance/ng87</a>',
  yonetmelik: 'Özel Eğitim Hizmetleri Yönetmeliği. Resmî Gazete, 7.7.2018, sayı 30471. Metin: <a href="https://aile.gov.tr/eyhgm/mevzuat/ulusal-mevzuat/yonetmelikler/ozel-egitim-hizmetleri-yonetmeligi/" target="_blank" rel="noopener">aile.gov.tr</a> (güncel hâli için mevzuat.gov.tr’ye bakın).',
  alo183: 'T.C. Aile ve Sosyal Hizmetler Bakanlığı. ALO 183 Çağrı Merkezi. <a href="https://www.aile.gov.tr/alo-183/alo183pages/hakkinda/" target="_blank" rel="noopener">aile.gov.tr/alo-183</a>',
};

/* ───────────── Görünümler ───────────── */
function kart(s) {
  return `<button type="button" class="kart" data-senaryo="${s.id}"><span class="simge" aria-hidden="true">${s.simge}</span><span class="kart-govde"><strong>${kac(s.baslik)}</strong><span>${kac(s.ozet)}</span></span><span class="yas-rozet">${s.yas === "hepsi" ? "her yaş" : s.yas + " yaş"}</span></button>`;
}

function acilKutu() {
  return `<aside class="acil" aria-label="Acil durum"><strong>Acil bir durum mu?</strong><ul><li>Can güvenliği tehlikesi ya da acil tıbbi durum: <a href="tel:112">112 Acil Çağrı Merkezi</a></li><li>İhmal, istismar ve şiddet bildirimi, aileye yönelik rehberlik: <a href="tel:183">ALO 183</a> (7 gün 24 saat, yurt içinden ücretsiz)</li></ul><p>Bu sayfa acil durumlar için tasarlanmamıştır.</p></aside>`;
}

function gorAna() {
  return `<section class="giris"><p class="ust">Ebeveynler için · DEHB</p><h1>Bir sonraki küçük adım</h1><p class="lead">Dikkatin, duyguların ve gündelik hayatın çarpıştığı anlar için. Yargı yok, uzun liste yok: yaşadığınız duruma yakın olanı seçin, denenecek tek bir şey bulun.</p><div class="dugme-sira"><button class="btn ana" data-git="durumlar">Durumumu seç</button><button class="btn" data-eylem="prova">Önce bir konuşmayı prova et</button></div><p class="not">Hesap yok · Çocuğa ait bilgi istenmez · Hiçbir veri gönderilmez</p></section>
  <div class="uyari-kutu" role="note"><strong>Bu sayfa tanı koymaz, tedavi önermez.</strong> Buradaki adımlar genel ebeveynlik önerileridir; çocuğunuzu izleyen hekimin ve öğretmenin yerini tutmaz. İlaç konusundaki her karar hekimle verilir.</div>
  <h2 class="bolum-bas">Tanıdık geliyor mu?</h2><div class="kartlar">${senaryolar.slice(0, 4).map(kart).join("")}</div><p><button class="metin-bag" data-git="durumlar">Sekiz durumun hepsini gör →</button></p>
  <section class="uc-adim"><div><strong>1</strong>Anı anlayın</div><div><strong>2</strong>Tek bir adım seçin</div><div><strong>3</strong>Deneyin, bakın, sürdürün</div></section>
  ${acilKutu()}`;
}

function gorDurumlar() {
  const yaslar = [["hepsi", "Her yaş"], ["5-9", "5-9"], ["10-13", "10-13"], ["14-18", "14-18"]];
  const terim = durum.arama.toLocaleLowerCase("tr");
  const liste = senaryolar.filter((s) => (durum.yas === "hepsi" || s.yas === durum.yas || s.yas === "hepsi") && (!terim || (s.baslik + " " + s.ozet).toLocaleLowerCase("tr").includes(terim)));
  return `<section class="sayfa-bas"><h1>Şu anda ne oluyor?</h1><p>Kusursuz bir etiket gerekmez. En yakın geleni seçin.</p><input id="ara" class="ara" type="search" placeholder="Ara: sabah, ekran, okul…" value="${kac(durum.arama)}" aria-label="Durumlarda ara"><div class="cipler" role="group" aria-label="Yaş">${yaslar.map(([v, l]) => `<button type="button" class="cip${durum.yas === v ? " acik" : ""}" data-yas="${v}" aria-pressed="${durum.yas === v}">${l}</button>`).join("")}</div></section><div class="kartlar" id="kart-liste">${liste.map(kart).join("") || '<p class="bos">Eşleşen durum yok. Başka bir sözcük deneyin ya da “Her yaş”ı seçin.</p>'}</div>`;
}

function gorDetay() {
  const s = senaryolar.find((x) => x.id === durum.senaryo);
  if (!s) {
    durum.gorunum = "durumlar";
    return gorDurumlar();
  }
  const kipEtiket = { adim: "Denenecek adım", kucuk: "Daha küçük hâli", baska: "Başka bir yol" };
  const yanit = durum.secim === null ? "" : `<p class="yanit">${kac(s.yanit[durum.secim])}</p>`;
  return `<div class="detay"><button class="geri" data-git="durumlar">← Durumlar</button><article><h1><span aria-hidden="true">${s.simge}</span> ${kac(s.baslik)}</h1><p class="ozet">${kac(s.ozet)}</p><p class="neden"><strong>Neden olabilir:</strong> ${kac(s.neden)}</p>
  <section class="adim-kutu" aria-live="polite"><p class="etiket">${kipEtiket[durum.kip]}</p><h2>${kac(adimMetni(s, durum.kip))}</h2><p class="cumle"><strong>Kullanabileceğiniz söz:</strong><br>${kac(s.cumle)}</p><div class="dugme-sira"><button class="btn${durum.kip === "kucuk" ? " secili" : ""}" data-kip="kucuk">Daha küçük yap</button><button class="btn${durum.kip === "baska" ? " secili" : ""}" data-kip="baska">Başka bir yol</button>${durum.kip !== "adim" ? '<button class="btn" data-kip="adim">İlk öneri</button>' : ""}<button class="btn ana" data-eylem="kaydet">Denemek üzere kaydet</button></div></section>
  ${s.uyari ? `<p class="uyari-kutu"><strong>Ne zaman başka yardım:</strong> ${kac(s.uyari)}</p>` : ""}
  <section class="soru-kutu"><h3>Adımı size uyarlamak için tek soru</h3><div class="secenekler"><button type="button" class="secenek${durum.secim === 0 ? " acik" : ""}" data-secim="0" aria-pressed="${durum.secim === 0}">${kac(s.soru[0])}</button><button type="button" class="secenek${durum.secim === 1 ? " acik" : ""}" data-secim="1" aria-pressed="${durum.secim === 1}">${kac(s.soru[1])}</button></div>${yanit}</section>
  ${s.okul ? '<p class="kopru">Okulla birlikte çalışmanın Türkiye’deki yolları: <button class="metin-bag" data-git="okul">Okul ve RAM →</button></p>' : ""}
  <div class="dugme-sira"><button class="btn" data-eylem="kopyala">Sözü kopyala</button><button class="btn" data-eylem="ozet">Bakım veren için özet hazırla</button></div>
  <p class="dipnot">Bu adımlar davranışsal ebeveyn eğitimi programlarında kullanılan genel ilkelere dayanır (tek ve açık yönerge, işi küçültme, seçenek sunma, sakin anda planlama). Tek tek adımlar ayrı ayrı sınanmış tedaviler değildir. Ayrıntı: <button class="metin-bag" data-git="anla">Kanıt ne diyor?</button></p></article></div>`;
}

function gorAnla() {
  const konular = [
    ["🧭", "Kanıt ne diyor: ebeveyn eğitimi neyi değiştirir?", `<p>Davranışsal ebeveyn eğitimi, DEHB’de önerilen ilaç dışı yaklaşımların başında gelir. 32 randomize çalışmayı birleştiren bir meta-analizde, değerlendiricinin hangi grupta olduğunu büyük olasılıkla bilmediği ölçümlerde ebeveynlik uygulamaları düzeldi ve davranım sorunları azaldı. DEHB’nin çekirdek belirtilerindeki azalma bu kör ölçümlerde gösterilemedi (Daley ve ark. 2014).</p><p>Ebeveyn için anlamı: bu sayfadaki türden adımlar evdeki çatışmayı azaltmayı ve gündelik işleri daha az sürtünmeyle yürütmeyi hedefler. Dikkat süresinin uzaması beklenmez. Uzman derlemesi ebeveyn eğitimini çok bileşenli tedavinin önemli bir parçası sayar, ama çekirdek belirtiler için tek başına birinci basamak tedavi olarak desteklemez (Daley ve ark. 2018).</p>`],
    ["🧠", "DEHB hakkında yanlış bilinenler", `<p>Dünya DEHB Federasyonu’nun uluslararası uzlaşı bildirisi, bozukluk hakkındaki yanlış inanışların damgalamaya yol açtığını ve tedaviyi geciktirdiğini belirtir. Bildiri, 27 ülkeden 80 yazarın onayladığı 208 kanıta dayalı sonucu bir araya getirir (Faraone ve ark. 2021).</p><p>Gündelik dille: başlayamamak, unutmak, yerinde duramamak çoğu zaman “o anda yapamıyor” demektir. Bu ayrım davranışı mazur göstermez. Hangi desteğin işe yarayacağını gösterir.</p>`],
    ["🩺", "Tedavi ve ilaç", `<p>Tedavi planını çocuğu değerlendiren hekim, aileyle birlikte yapar. Amerikan Pediatri Akademisi’nin kılavuzu yaşa göre farklı öneriler verir: okul öncesi çocuklarda (4 yaşından 6. yaş gününe kadar) ilk seçenek davranış yönetimine yönelik ebeveyn eğitimi ve sınıf içi davranışsal düzenlemelerdir. İlaç ancak bunlar yeterli iyileşme sağlamazsa ve işlevsellikteki bozulma orta ya da ağır düzeyde sürüyorsa düşünülür. Okul çağında (6 yaşından 12. yaş gününe kadar) ilaç tedavisi, ebeveyn eğitimi ve sınıf içi davranışsal düzenlemelerle birlikte önerilir. Ergenlerde (12 yaşından 18. yaş gününe kadar) ilaç gencin onayıyla önerilir, davranışsal yaklaşımlar da teşvik edilir (Wolraich ve ark. 2019). İngiltere’nin NICE kılavuzu da tanı ve tedavi için kapsamlı öneriler sunar (NICE NG87).</p><p>Bu kılavuzlar başka ülkelerin sağlık sistemleri için yazılmıştır. Çocuğunuz için doğru olan, onu tanıyan hekimin kararıdır. İlaca başlamak, dozu değiştirmek ya da ilacı kesmek için hekime danışmadan adım atmayın.</p>`],
    ["🏫", "Okulda ne işe yarar?", `<p>Psikososyal tedavileri kanıt düzeyine göre sınıflayan sistematik derleme, bulguların çocuğun yaşına ve yaklaşımın özelliklerine göre değiştiğini ve çalışmalara katılan ailelerde eğitim düzeyi yüksek ebeveynlerin fazla temsil edildiğini belirtir (Evans ve ark. 2018). Sınıf içi davranış yönetimi ve organizasyon becerilerine yönelik eğitim, bu alanda en çok çalışılan yaklaşımlar arasındadır.</p><p>Uygulamadaki karşılığı sadedir: öğretmenle tek bir hedefte anlaşmak, o hedefi her gün kısaca izlemek ve bir hafta sonra birlikte bakmak. Türkiye’deki resmî yollar için <button class="metin-bag" data-git="okul">Okul ve RAM</button> sayfasına bakın.</p>`],
    ["🧩", "Yanında başka bir şey olabilir mi?", `<p>DEHB’ye kaygı, öğrenme güçlüğü, uyku sorunu ya da duygudurum belirtileri eşlik edebilir. Amerikan Pediatri Akademisi kılavuzunun son güncellemesi, eşlik eden durumların tanınması ve tedavisi için ayrı bir öneri eklemiştir (Wolraich ve ark. 2019).</p><p>Okul reddi, belirgin içe kapanma, yeni başlayan öfke patlamaları ya da derslerde ani düşüş, “DEHB’dendir” denip geçilmemesi gereken durumlardır. Bunları çocuğu izleyen hekime anlatın.</p>`],
    ["🚩", "Ne zaman beklemeden başvurmalı?", `<ul><li>Kendine ya da başkasına zarar verme sözü ya da davranışı</li><li>Haftalardır süren okula gitmeme</li><li>Uyku, iştah ya da enerjide belirgin ve süren değişiklik</li><li>İstismar, ihmal ya da zorbalık kuşkusu</li><li>İlaç kullanan çocukta yeni ve rahatsız edici bir belirti</li></ul><p>Bu durumlarda bir çocuk ve ergen ruh sağlığı uzmanına başvurun. Can güvenliği tehlikesi varsa 112’yi arayın.</p>`],
  ];
  return `<section class="sayfa-bas"><h1>Anla</h1><p>Kısa, kaynaklı altı başlık. İhtiyacınız olanı açın.</p></section><div class="konular">${konular.map(([ik, b, g], i) => `<details class="konu"${i === 0 ? " open" : ""}><summary><span aria-hidden="true">${ik}</span> ${b}</summary>${g}</details>`).join("")}</div>
  <details class="konu kaynaklar"><summary>Kaynaklar</summary><ul>${["daley2014", "daley2018", "evans2018", "faraone2021", "nice", "wolraich2019"].map((k) => `<li>${KAYNAK[k]}</li>`).join("")}</ul><p>Dergi makalelerinin künyeleri PubMed kayıtlarıyla doğrulanmıştır.</p></details>`;
}

function gorOkul() {
  return `<section class="sayfa-bas"><h1>Okul ve RAM</h1><p>Türkiye’de okulla birlikte çalışmanın resmî yolları. Aşağıdaki bilgiler Özel Eğitim Hizmetleri Yönetmeliği’ne dayanır; uygulama ilden ile ve okuldan okula değişebilir.</p></section>
  <div class="konular">
  <details class="konu" open><summary>1. Önce sınıf öğretmeni ve rehberlik servisi</summary><p>Çoğu güçlük resmî bir sürece gerek kalmadan, öğretmenle tek bir hedefte anlaşarak ele alınabilir. Görüşmeye tek bir gözlem ve tek bir istekle gidin; bir hafta sonra birlikte bakmayı önerin. Okulun rehberlik servisi bu görüşmeye katılabilir ve sınıf içi düzenlemeler konusunda öğretmene destek olabilir.</p></details>
  <details class="konu"><summary>2. Rehberlik ve Araştırma Merkezi (RAM)</summary><p>Çocuğun eğitsel değerlendirmesi RAM’da yapılır. Yönetmeliğe göre ilk başvuruyu okul yönetimi, veli ya da 18 yaşından büyük bireyin kendisi RAM’a yapar (Madde 7); başvuru belgeleri arasında bireyin, velisinin ya da okul yönetiminin yazılı talebi sayılır (Madde 8) ve değerlendirme sürecinde velinin görüşü alınır (Madde 7).</p><p>DEHB tanısı tek başına belirli bir eğitim hizmetini kendiliğinden getirmez. Hangi desteğin uygun olduğuna RAM’daki eğitsel değerlendirme sonunda karar verilir. Başvurudan önce çocuğu izleyen hekimle ve okulun rehberlik servisiyle konuşmak, sürecin gerekli olup olmadığını anlamanıza yardım eder.</p></details>
  <details class="konu"><summary>3. Bireyselleştirilmiş Eğitim Programı (BEP)</summary><p>BEP, özel eğitim ihtiyacı olan öğrencinin gelişim özelliklerine, eğitim ihtiyaçlarına ve performansına göre hazırlanan, destek eğitim hizmetlerini de içeren programdır (Madde 4). İçeriğinde yıllık ve kısa dönemli amaçlar, destek eğitimin türü ve süresi, kullanılacak yöntemler ve ortam düzenlemeleri yer alır (Madde 20). Kaynaştırma ya da bütünleştirme yoluyla eğitim yapılan okullarda BEP geliştirme birimi kurulması zorunludur (Madde 22).</p><p>Yönetmelik, ailelerin özel eğitim sürecinin her aşamasına etkin katılımını temel ilkeler arasında sayar (Madde 5). BEP toplantısına katılmayı ve programın bir örneğini istemeyi çekinmeden dile getirin.</p></details>
  <details class="konu"><summary>4. Destek eğitim odası</summary><p>Destek eğitim odası, tam zamanlı kaynaştırma ya da bütünleştirme yoluyla eğitim gören öğrencilere ve özel yetenekli öğrencilere ihtiyaç duydukları alanlarda destek eğitim verilmesi için düzenlenen ortamdır (Madde 4). Çocuğunuz için uygun olup olmadığı BEP geliştirme biriminde konuşulur.</p></details>
  <details class="konu"><summary>Öğretmen görüşmesi için tek sayfalık hazırlık</summary><ol><li><strong>Bir güçlü yan:</strong> çocuğunuzun iyi yaptığı tek bir şey.</li><li><strong>Bir gözlem:</strong> yorum katmadan, ne zaman ve ne oluyor.</li><li><strong>Bir istek:</strong> bir hafta denenecek tek bir düzenleme.</li><li><strong>Bir gösterge:</strong> işe yarayıp yaramadığını neye bakarak anlayacaksınız.</li><li><strong>Bir tarih:</strong> yeniden ne zaman konuşacaksınız.</li></ol><div class="dugme-sira"><button class="btn" data-eylem="hazirlik">Bu listeyi kopyala</button></div></details>
  </div>
  <details class="konu kaynaklar"><summary>Kaynak</summary><ul><li>${KAYNAK.yonetmelik}</li></ul><p>Madde numaraları yönetmeliğin Aile ve Sosyal Hizmetler Bakanlığı sitesindeki metninden alınmıştır (Kasım 2026). Yönetmelik sonradan değişmiş olabilir; işlem yapmadan önce güncel metne ve RAM’a danışın.</p></details>`;
}

function gorAdimlarim() {
  if (!kayitli.length) {
    return `<section class="sayfa-bas"><h1>Adımlarım</h1><p>Yalnızca bu tarayıcıda saklanır. Hesap, bulut eşitlemesi ya da bildirim yoktur.</p></section><div class="bos-kutu"><p class="buyuk" aria-hidden="true">🌱</p><h2>Henüz kaydedilmiş adım yok</h2><p>Bir durum seçin, küçük bir adım bulun, isterseniz kaydedin.</p><button class="btn ana" data-git="durumlar">İlk adımı seç</button></div>`;
  }
  return `<section class="sayfa-bas"><h1>Adımlarım</h1><p>Yalnızca bu tarayıcıda saklanır. Bu tarayıcıya erişen herkes görebilir. Çocuğun adını ya da sağlık bilgisini yazmanız gerekmez.</p></section><div class="adim-liste">${kayitli.map((k) => {
    const s = senaryolar.find((x) => x.id === k.senaryo);
    if (!s) return "";
    return `<article class="adim-satir"><span class="rozet${k.durum === "denendi" ? " tamam" : ""}">${k.durum === "denendi" ? "Denendi ✓" : "Denenecek"}</span><h3>${kac(s.baslik)}</h3><p>${kac(adimMetni(s, k.kip))}</p><p class="tarih">${kac(new Date(k.tarih).toLocaleDateString("tr-TR"))}</p><div class="dugme-sira kucuk"><button class="btn" data-eylem="degistir" data-id="${kac(k.id)}">${k.durum === "denendi" ? "Yeniden denenecek" : "Denedik ✓"}</button><button class="btn" data-senaryo="${s.id}">Duruma dön</button><button class="btn" data-eylem="sil" data-id="${kac(k.id)}">Kaldır</button></div></article>`;
  }).join("")}</div><div class="dugme-sira"><button class="btn" data-eylem="disa">Adımlarımı kopyala</button><button class="btn" data-eylem="temizle">Hepsini sil</button></div>`;
}

/* ───────────── Prova: kısa, dallanan alıştırma ───────────── */
function provaGovde() {
  let g = '<p>Kısa prova: ödev başlamıyor. Bir yanıt seçin, sonra ne olabileceğine bakın. Puan yok, doğru yanıt sınavı değil.</p>';
  if (durum.prova === 0) {
    g += '<div class="replik"><span aria-hidden="true">🧑‍🎓</span><p><strong>Çocuk:</strong> “Yapmayacağım! Çok fazla.”</p></div><div class="secenekler dik"><button type="button" class="secenek" data-prova="1">“Tartışmayı bırak ve hemen başla.”</button><button type="button" class="secenek" data-prova="2">“Yalnızca defteri birlikte açsak olur mu?”</button></div>';
  } else if (durum.prova === 1) {
    g += `<div class="replik"><span aria-hidden="true">🧑‍🎓</span><p>${durum.provaSecim === 1 ? "“Ne kadar zor olduğunu anlamıyorsun!”" : "“Tamam, ama yalnızca açacağım.”"}</p></div><p class="yanit">${durum.provaSecim === 1 ? "Gerginlik yükseldiğinde isteği küçültmeyi ve ilişkiyi onarmayı deneyin. Bu olası bir yanıttır, bir öngörü değildir." : "Küçük bir istek bir başlangıç noktası sunar. İş birliğini garanti etmez."}</p><div class="dugme-sira"><button class="btn ana" data-eylem="provaSon">Sonra ne olur?</button><button class="btn" data-eylem="provaBas">Öteki yanıtı dene</button></div>`;
  } else {
    g += `<p class="yanit">${durum.provaSecim === 1 ? "Onarmak için bir cümle yeter: “Az önce sert konuştum. Yeniden deneyelim: yalnızca defteri açalım.” Ebeveynin geri adım atması otoriteyi zayıflatmaz. Çocuğa onarmanın nasıl yapıldığını gösterir." : "Defter açıldıysa durun ve bunu görün: “Açtın, başladık.” Sonraki adımı ondan isteyin: “Hangi sorudan başlayalım?” Bugün tek soruyla bitse de başlangıç kurulmuştur."}</p><div class="dugme-sira"><button class="btn" data-eylem="provaBas">Baştan dene</button><button class="btn ana" data-senaryo="odev">“Ödev başlamıyor” durumuna git</button></div>`;
  }
  return g;
}

function gizlilikGovde() {
  return `<h3>Denetim sizde</h3><p>Hesap gerekmez. Kaydettiğiniz adımlar yalnızca bu tarayıcıda (localStorage) durur. Hiçbir içerik bir sunucuya, yapay zekâ modeline, e-postaya ya da istatistik hizmetine gönderilmez. Paylaşım yalnızca siz genel bir özeti kopyalamayı seçtiğinizde olur.</p><p>Çocuğun adını, kimliğini belli edecek bilgileri ya da sağlık ayrıntılarını yazmanız gerekmez. Bu tarayıcıya erişen herkes kaydedilen adımları görebilir. Site verilerini temizlemek onları siler.</p><h3>Ne zaman başka yerden yardım</h3><p>Bu sayfa eğitim amaçlı, uygulamaya dönük bir içeriktir. Tanı, terapi ya da hekim muayenesi yerine geçmez. Buradaki bilgilerden tanı çıkarmayın. Can güvenliği tehlikesinde 112’yi arayın. İhmal, istismar ya da şiddet kuşkusunda ALO 183’e başvurabilirsiniz. Süren ve ağır bir sıkıntıda bir çocuk ve ergen ruh sağlığı uzmanına başvurun.</p>`;
}

/* ───────────── Çizim ve gezinme ───────────── */
const GORUNUM = { ana: gorAna, durumlar: gorDurumlar, detay: gorDetay, anla: gorAnla, okul: gorOkul, adimlarim: gorAdimlarim };
const BASLIK = { ana: "DEHB’de Bir Sonraki Adım", durumlar: "Durumlar", detay: "Durum", anla: "Anla", okul: "Okul ve RAM", adimlarim: "Adımlarım" };

function ciz(odakla) {
  const ana = document.getElementById("ana");
  ana.innerHTML = (GORUNUM[durum.gorunum] || gorAna)();
  for (const b of document.querySelectorAll("[data-gez]")) {
    const acik = b.dataset.gez === durum.gorunum || (durum.gorunum === "detay" && b.dataset.gez === "durumlar");
    b.classList.toggle("acik", acik);
    if (acik) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  }
  document.title = (durum.gorunum === "ana" ? "" : BASLIK[durum.gorunum] + " · ") + "DEHB’de Bir Sonraki Adım";
  if (odakla) {
    window.scrollTo(0, 0);
    ana.focus({ preventScroll: true });
  }
}

function git(gorunum, itme = true) {
  durum.gorunum = GORUNUM[gorunum] ? gorunum : "ana";
  if (durum.gorunum !== "detay") durum.senaryo = null;
  if (itme) {
    try {
      history.pushState(null, "", "#" + (durum.gorunum === "detay" ? "durum-" + durum.senaryo : durum.gorunum));
    } catch {}
  }
  ciz(true);
}

function senaryoAc(id, itme = true) {
  if (!senaryolar.some((s) => s.id === id)) return git("durumlar", itme);
  durum.senaryo = id;
  durum.kip = "adim";
  durum.secim = null;
  kapat();
  durum.gorunum = "detay";
  if (itme) {
    try {
      history.pushState(null, "", "#durum-" + id);
    } catch {}
  }
  ciz(true);
}

function adrestenOku() {
  const h = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (h.startsWith("durum-")) senaryoAc(h.slice(6), false);
  else git(h || "ana", false);
}

/* ───────────── Bildirim, pano, pencere ───────────── */
let bildirimZaman = null;
function bildir(metin) {
  const el = document.getElementById("bildirim");
  el.textContent = metin;
  el.classList.add("gorunur");
  clearTimeout(bildirimZaman);
  bildirimZaman = setTimeout(() => el.classList.remove("gorunur"), 2600);
}

async function kopyala(metin, tamam) {
  try {
    await navigator.clipboard.writeText(metin);
    bildir(tamam);
  } catch {
    const alan = document.createElement("textarea");
    alan.value = metin;
    alan.setAttribute("readonly", "");
    alan.className = "gizli-alan";
    document.body.append(alan);
    alan.select();
    let oldu = false;
    try {
      oldu = document.execCommand("copy");
    } catch {}
    alan.remove();
    bildir(oldu ? tamam : "Kopyalanamadı; metni elle seçip kopyalayın");
  }
}

let oncekiOdak = null;
function pencere(baslik, govde) {
  oncekiOdak = document.activeElement;
  const kok = document.getElementById("pencere-kok");
  kok.innerHTML = `<div class="perde" data-eylem="kapat"></div><div class="pencere" role="dialog" aria-modal="true" aria-labelledby="pencere-bas"><div class="pencere-ust"><h2 id="pencere-bas">${kac(baslik)}</h2><button class="kapat" data-eylem="kapat" aria-label="Kapat">×</button></div><div class="pencere-govde" id="pencere-govde">${govde}</div></div>`;
  kok.querySelector(".kapat").focus();
}
function kapat() {
  const kok = document.getElementById("pencere-kok");
  if (!kok.innerHTML) return;
  kok.innerHTML = "";
  if (oncekiOdak && document.contains(oncekiOdak)) oncekiOdak.focus();
}
function provaCiz() {
  const govde = document.getElementById("pencere-govde");
  if (govde) govde.innerHTML = provaGovde();
  else pencere("Konuşma provası", provaGovde());
}

function ozetMetni(s) {
  return `Bakım veren için genel not\nDurum: ${s.baslik}\nDenenecek tek şey: ${s.adim}\nKullanılabilecek söz: ${s.cumle}\nGenel eğitim içeriğidir; çocuğa özgü bilgi içermez. Paylaşmadan önce düzenleyin.`;
}

const HAZIRLIK = "Öğretmen görüşmesi hazırlığı\n1. Bir güçlü yan:\n2. Bir gözlem (yorumsuz, ne zaman ve ne oluyor):\n3. Bir istek (bir hafta denenecek tek düzenleme):\n4. Bir gösterge (işe yaradığını neye bakarak anlayacağız):\n5. Yeniden konuşma tarihi:";

/* ───────────── Olaylar ───────────── */
function tikla(e) {
  const h = e.target.closest("[data-git],[data-gez],[data-senaryo],[data-yas],[data-kip],[data-secim],[data-prova],[data-eylem]");
  if (!h) return;
  const d = h.dataset;
  if (d.senaryo) return senaryoAc(d.senaryo);
  if (d.git || d.gez) {
    kapat();
    return git(d.git || d.gez);
  }
  if (d.yas) {
    durum.yas = d.yas;
    return ciz(false);
  }
  if (d.kip) {
    durum.kip = d.kip;
    return ciz(false);
  }
  if (d.secim !== undefined) {
    durum.secim = Number(d.secim);
    return ciz(false);
  }
  if (d.prova) {
    durum.provaSecim = Number(d.prova);
    durum.prova = 1;
    return provaCiz();
  }
  const s = senaryolar.find((x) => x.id === durum.senaryo);
  switch (d.eylem) {
    case "prova":
      durum.prova = 0;
      durum.provaSecim = null;
      return provaCiz();
    case "provaSon":
      durum.prova = 2;
      return provaCiz();
    case "provaBas":
      durum.prova = 0;
      durum.provaSecim = null;
      return provaCiz();
    case "kapat":
      return kapat();
    case "gizlilik":
      return pencere("Gizlilik ve güvenlik", gizlilikGovde());
    case "kaydet":
      if (!s) return;
      kayitli.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), senaryo: s.id, kip: durum.kip, durum: "denenecek", tarih: new Date().toISOString() });
      kayitli = kayitli.slice(0, 100);
      if (kayitYaz()) bildir("Adımlarım’a kaydedildi");
      return;
    case "kopyala":
      return s && kopyala(s.cumle, "Söz kopyalandı");
    case "ozet":
      return s && kopyala(ozetMetni(s), "Özet kopyalandı; paylaşmadan önce düzenleyin");
    case "hazirlik":
      return kopyala(HAZIRLIK, "Liste kopyalandı");
    case "degistir": {
      const k = kayitli.find((x) => x.id === d.id);
      if (k) k.durum = k.durum === "denendi" ? "denenecek" : "denendi";
      kayitYaz();
      return ciz(false);
    }
    case "sil":
      kayitli = kayitli.filter((x) => x.id !== d.id);
      kayitYaz();
      return ciz(false);
    case "temizle":
      if (h.dataset.onay !== "1") {
        h.dataset.onay = "1";
        h.textContent = "Emin misiniz? Silmek için yeniden basın";
        return;
      }
      kayitli = [];
      kayitYaz();
      return ciz(false);
    case "disa": {
      const satirlar = kayitli.map((k) => {
        const sn = senaryolar.find((x) => x.id === k.senaryo);
        return sn ? `- [${k.durum === "denendi" ? "x" : " "}] ${sn.baslik}: ${adimMetni(sn, k.kip)}` : "";
      }).filter(Boolean);
      return kopyala("Adımlarım\n" + satirlar.join("\n"), "Adımlar kopyalandı");
    }
  }
}

function baslat() {
  kayitli = kayitOku();
  document.addEventListener("click", tikla);
  document.addEventListener("input", (e) => {
    if (e.target.id !== "ara") return;
    durum.arama = e.target.value;
    const yer = e.target.selectionStart;
    ciz(false);
    const yeni = document.getElementById("ara");
    yeni.focus();
    try {
      yeni.setSelectionRange(yer, yer);
    } catch {}
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") kapat();
  });
  window.addEventListener("popstate", adrestenOku);
  adrestenOku();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat);
  else baslat();
}
if (typeof module !== "undefined") module.exports = { senaryolar, KAYNAK };
