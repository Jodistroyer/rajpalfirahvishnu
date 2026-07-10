/**
 * generate-ms-locale.mjs — Build press-data-ms.js and clippings-data-ms.js from English source.
 * Run: node scripts/generate-ms-locale.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PRESS_ITEMS, PRESS_CATEGORIES } from '../js/press-data.js';
import { CLIPPINGS } from '../js/clippings-data.js';
import { CLIPPINGS_MS_DESCRIPTIONS } from './clippings-descriptions-ms.js';
import { PRESS_MS_CONTENT } from './press-content-ms.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const MONTHS = {
  January: 'Januari', February: 'Februari', March: 'Mac', April: 'April',
  May: 'Mei', June: 'Jun', July: 'Julai', August: 'Ogos', September: 'September',
  October: 'Oktober', November: 'November', December: 'Disember',
};

/** @param {string} label */
function translateDateLabel(label) {
  if (!label || label === 'Archive') return label === 'Archive' ? 'Arkib' : label;
  if (label === 'Paul Yong trial') return 'Perbicaraan Paul Yong';
  let out = label;
  for (const [en, ms] of Object.entries(MONTHS)) {
    out = out.replace(new RegExp(`\\b${en}\\b`, 'g'), ms);
  }
  out = out.replace(/\bc\.\s*/g, 'k. ');
  return out;
}

/** @param {string} s */
function translatePressExcerpt(s) {
  return s
    .replace(/^Coverage of /i, 'Liputan ')
    .replace(/^Press report on /i, 'Laporan media tentang ')
    .replace(/^Report on /i, 'Laporan tentang ')
    .replace(/^Analysis of /i, 'Analisis ')
    .replace(/^Blog /i, 'Blog ')
    .replace(/featuring criminal defence lawyer /gi, 'memaparkan peguam pembelaan jenayah ')
    .replace(/featuring defence counsel /gi, 'memaparkan peguam pembelaan ')
    .replace(/featuring counsel /gi, 'memaparkan peguam ')
    .replace(/featuring criminal lawyer /gi, 'memaparkan peguam jenayah ')
    .replace(/featuring lawyer /gi, 'memaparkan peguam ')
    .replace(/featuring defense lawyer /gi, 'memaparkan peguam pembelaan ')
    .replace(/involving counsel /gi, 'melibatkan peguam ')
    .replace(/involving defence counsel /gi, 'melibatkan peguam pembelaan ')
    .replace(/involving defense counsel /gi, 'melibatkan peguam pembelaan ')
    .replace(/with counsel /gi, 'bersama peguam ')
    .replace(/with defence counsel /gi, 'bersama peguam pembelaan ')
    .replace(/with defense counsel /gi, 'bersama peguam pembelaan ')
    .replace(/criminal defence lawyer /gi, 'peguam pembelaan jenayah ')
    .replace(/criminal defense lawyer /gi, 'peguam pembelaan jenayah ')
    .replace(/criminal lawyer /gi, 'peguam jenayah ')
    .replace(/in Malaysia\.?$/i, 'di Malaysia.')
    .replace(/in Malaysia,/gi, 'di Malaysia,')
    .replace(/Datuk Rajpal Singh/g, 'Datuk Rajpal Singh')
    .replace(/naming criminal lawyer /gi, 'menyebut peguam jenayah ')
    .replace(/referencing counsel /gi, 'merujuk peguam ')
    .replace(/Legal commentary by /gi, 'Ulasan guaman oleh ')
    .replace(/Malaysian Bar announcement featuring /gi, 'Pengumuman Badan Peguam Malaysia memaparkan ')
    .replace(/Archive photograph from /gi, 'Foto arkib daripada ')
    .replace(/Social post from /gi, 'Catatan media sosial daripada ')
    .replace(/Facebook video of /gi, 'Video Facebook ')
    .replace(/speaking on /gi, 'berucap pada ')
    .replace(/speaks to media /gi, 'berbicara kepada media ')
    .replace(/speak to media /gi, 'berbicara kepada media ')
    .replace(/urges the public /gi, 'menasihatkan orang awam ')
    .replace(/discusses /gi, 'membincangkan ')
    .replace(/questions the lack of /gi, 'mempersoalkan kekurangan ')
    .replace(/interview with /gi, 'temubual dengan ')
    .replace(/on why /gi, 'mengenai mengapa ')
    .replace(/Clip: /gi, 'Klip: ')
    .replace(/reel: /gi, 'reel: ')
    .replace(/Podcast: /gi, 'Podcast: ');
}

/** @param {string} s */
function translatePressTitle(s) {
  if (/[\u0600-\u06FF]/.test(s)) return s;
  if (/\b(hidup|keputusan|sidang|anggota|bebas|penjara|dipenjara|trio|semua)\b/i.test(s) && !/\b(charged|appeal|trial|coverage)\b/i.test(s)) {
    return s;
  }
  return s
    .replace(/^11 men charged with being members of organised crime group$/i,
      '11 lelaki didakwa sebagai ahli kumpulan jenayah terancang')
    .replace(/^Apex court to hear (.+)'s rape conviction appeal$/i,
      'Mahkamah Persekutuan akan dengar rayuan sabitan rogol $1')
    .replace(/^Cosplay killer gets 22 years' jail instead of death upon appeal$/i,
      'Pembunuh cosplay dijatuhi 22 tahun penjara dan bukannya hukuman mati selepas rayuan')
    .replace(/^KK Mart lawyers: Let justice take its course$/i,
      'Peguam KK Mart: Biarkan keadilan berjalan')
    .replace(/^KK Mart founder, wife and supplier charged; plead not guilty$/i,
      'Pengasas KK Mart, isteri dan pembekal didakwa; mohon tidak bersalah')
    .replace(/^Allow justice to take its course, say lawyers representing KK Mart$/i,
      'Biarkan keadilan berjalan, kata peguam mewakili KK Mart')
    .replace(/^14 individuals linked to Nicky Gang freed of charges$/i,
      '14 individu dikaitkan Geng Nicky dibebaskan daripada pertuduhan')
    .replace(/^After Najib's arrest, lawyers comment on holding suspects$/i,
      'Selepas penahanan Najib, peguam ulas peraturan tahanan suspek')
    .replace(/^IGP's Twitter policing leaves lawyers conflicted$/i,
      'Polis Twitter IGP mewujudkan kekeliruan dalam kalangan peguam')
    .replace(/^Bar Council to set up committee to protect lawyers$/i,
      'Majlis Peguam tubuh jawatankuasa khas lindungi peguam')
    .replace(/^The case for sentencing guidelines$/i,
      'Hujah untuk garis panduan penghukuman')
    .replace(/^Separate attorney general, public prosecutor positions$/i,
      'Pisahkan jawatan Peguam Negara dan Pendakwa Raya')
    .replace(/^Datuk Seri in Rela assault case acquitted$/i,
      'Datuk Seri dibebaskan dalam kes pukul RELA')
    .replace(/^Allah printed socks controversy — legal commentary$/i,
      'Kontroversi stokin bercetak Allah — ulasan guaman')
    .replace(/^Overview of key players in KK Mart's legal battles$/i,
      'Gambaran pemain utama dalam pertempuran guaman KK Mart')
    .replace(/^Justice will prevail for KK Mart$/i,
      'Keadilan akan berpihak kepada KK Mart')
    .replace(/^Vasakhi message — Datuk Rajpal Singh, Gurdwara Sahib$/i,
      'Mesej Vasakhi — Datuk Rajpal Singh, Gurdwara Sahib')
    .replace(/^At the High Court Criminal Division, Kuala Lumpur$/i,
      'Di Bahagian Jenayah Mahkamah Tinggi, Kuala Lumpur')
    .replace(/^'Now a life is lost': victim's uncle on missing CCTV at student housing$/i,
      '\'Satu nyawa hilang\': bapa saudara mangsa persoal tiada CCTV di asrama pelajar')
    .replace(/^Rajpal Singh on suspects held in niece's Cyberjaya murder case$/i,
      'Rajpal Singh tentang suspek ditahan dalam kes bunuh anak saudara di Cyberjaya')
    .replace(/^Maniishapriet's case, Punjabi gangs, and movie-inspired murders$/i,
      'Kes Maniishapriet, geng Punjabi, dan bunuhan terinspirasi filem');
}

/** @param {string} s */
function translateClippingDesc(s) {
  let t = s
    .replace(/Newspaper clipping from /gi, 'Keratan akhbar daripada ')
    .replace(/newspaper clipping from /gi, 'keratan akhbar daripada ')
    .replace(/Front page of /gi, 'Muka depan ')
    .replace(/Front page cover of /gi, 'Muka depan ')
    .replace(/News report from /gi, 'Laporan berita daripada ')
    .replace(/News report dated /gi, 'Laporan berita bertarikh ')
    .replace(/Detailed press report from /gi, 'Laporan media terperinci daripada ')
    .replace(/Chinese newspaper clipping from /gi, 'Keratan akhbar Cina daripada ')
    .replace(/Chinese newspaper clipping titled /gi, 'Keratan akhbar Cina bertajuk ')
    .replace(/Chinese newspaper article from /gi, 'Artikel akhbar Cina daripada ')
    .replace(/Chinese news report from /gi, 'Laporan berita Cina daripada ')
    .replace(/Chinese language newspaper clipping from /gi, 'Keratan akhbar bahasa Cina daripada ')
    .replace(/Tamil newspaper clipping from /gi, 'Keratan akhbar Tamil daripada ')
    .replace(/Tamil newspaper clipping titled /gi, 'Keratan akhbar Tamil bertajuk ')
    .replace(/Tamil newspaper article featuring /gi, 'Artikel akhbar Tamil memaparkan ')
    .replace(/Tamil language newspaper article from /gi, 'Artikel akhbar bahasa Tamil daripada ')
    .replace(/Malaysian Tamil newspaper clipping titled /gi, 'Keratan akhbar Tamil Malaysia bertajuk ')
    .replace(/Malay Mail newspaper clipping from /gi, 'Keratan akhbar Malay Mail daripada ')
    .replace(/New Straits Times newspaper clipping dated /gi, 'Keratan akhbar New Straits Times bertarikh ')
    .replace(/New Straits Times newspaper clipping from /gi, 'Keratan akhbar New Straits Times daripada ')
    .replace(/New Straits Times report from /gi, 'Laporan New Straits Times daripada ')
    .replace(/The Star newspaper clipping from /gi, 'Keratan akhbar The Star daripada ')
    .replace(/The Star newspaper clipping dated /gi, 'Keratan akhbar The Star bertarikh ')
    .replace(/The Star newspaper report from /gi, 'Laporan akhbar The Star daripada ')
    .replace(/Sin Chew Daily newspaper clipping dated /gi, 'Keratan akhbar Sin Chew Daily bertarikh ')
    .replace(/Sinar Harian sports newspaper clipping from /gi, 'Keratan akhbar sukan Sinar Harian daripada ')
    .replace(/Kosmo newspaper clipping titled /gi, 'Keratan akhbar Kosmo bertajuk ')
    .replace(/Kosmo newspaper clipping from /gi, 'Keratan akhbar Kosmo daripada ')
    .replace(/Kosmo newspaper report from /gi, 'Laporan Kosmo daripada ')
    .replace(/Berita Harian report from /gi, 'Laporan Berita Harian daripada ')
    .replace(/8TV News report from /gi, 'Laporan 8TV News daripada ')
    .replace(/Mothership news report from /gi, 'Laporan Mothership daripada ')
    .replace(/Malay Mail newspaper report from /gi, 'Laporan Malay Mail daripada ')
    .replace(/Malaysiakini news report from /gi, 'Laporan Malaysiakini daripada ')
    .replace(/Free Malaysia Today newspaper clipping from /gi, 'Keratan akhbar Free Malaysia Today daripada ')
    .replace(/Harian Metro newspaper clipping titled /gi, 'Keratan akhbar Harian Metro bertajuk ')
    .replace(/Harian Metro newspaper clipping from /gi, 'Keratan akhbar Harian Metro daripada ')
    .replace(/Prime News Chinese newspaper clipping from /gi, 'Keratan akhbar Prime News (Cina) daripada ')
    .replace(/China Press \(中国报\) newspaper clipping from /gi, 'Keratan akhbar China Press (中国报) daripada ')
    .replace(/China Press from /gi, 'China Press daripada ')
    .replace(/New Sunday Times newspaper clipping dated /gi, 'Keratan akhbar New Sunday Times bertarikh ')
    .replace(/New Sunday Times newspaper clipping from /gi, 'Keratan akhbar New Sunday Times daripada ')
    .replace(/Nanyang Siang Pau newspaper clipping from /gi, 'Keratan akhbar Nanyang Siang Pau daripada ')
    .replace(/Sin Chew Daily newspaper clipping from /gi, 'Keratan akhbar Sin Chew Daily daripada ')
    .replace(/Newspaper report dated /gi, 'Laporan akhbar bertarikh ')
    .replace(/Newspaper report detailing /gi, 'Laporan akhbar memperincikan ')
    .replace(/Newspaper clipping from /gi, 'Keratan akhbar daripada ')
    .replace(/Newspaper clipping titled /gi, 'Keratan akhbar bertajuk ')
    .replace(/featuring defense lawyer /gi, 'memaparkan peguam pembelaan ')
    .replace(/featuring defence lawyer /gi, 'memaparkan peguam pembelaan ')
    .replace(/featuring defense counsel /gi, 'memaparkan peguam pembelaan ')
    .replace(/featuring defence counsel /gi, 'memaparkan peguam pembelaan ')
    .replace(/featuring legal counsel /gi, 'memaparkan peguam ')
    .replace(/featuring lawyer /gi, 'memaparkan peguam ')
    .replace(/featuring defense legal arguments by lawyer /gi, 'memaparkan hujah pembelaan oleh peguam ')
    .replace(/featuring insights from /gi, 'memaparkan pandangan ')
    .replace(/featuring comments from /gi, 'memaparkan komen ')
    .replace(/featuring an article titled /gi, 'memaparkan artikel bertajuk ')
    .replace(/featuring an article about /gi, 'memaparkan artikel tentang ')
    .replace(/featuring the involvement of lawyer /gi, 'memaparkan penglibatan peguam ')
    .replace(/featuring the headline /gi, 'memaparkan tajuk ')
    .replace(/featuring cross-examination by defense counsel /gi, 'memaparkan soal balas oleh peguam pembelaan ')
    .replace(/featuring Datuk Seri Michael Chong and lawyers including /gi, 'memaparkan Datuk Seri Michael Chong dan peguam termasuk ')
    .replace(/featuring Datuk Seri Michael Chong, Tan Sri Muhammad Shafee Abdullah, and lawyer /gi, 'memaparkan Datuk Seri Michael Chong, Tan Sri Muhammad Shafee Abdullah, dan peguam ')
    .replace(/featuring Datuk Seri Michael Chong and lawyer /gi, 'memaparkan Datuk Seri Michael Chong dan peguam ')
    .replace(/featuring Datuk Seri Michael Chong, Tan Sri Muhammad Shafee Abdullah, and lawyers including /gi, 'memaparkan Datuk Seri Michael Chong, Tan Sri Muhammad Shafee Abdullah, dan peguam termasuk ')
    .replace(/with defense lawyer /gi, 'bersama peguam pembelaan ')
    .replace(/with defence lawyer /gi, 'bersama peguam pembelaan ')
    .replace(/with defense counsel /gi, 'bersama peguam pembelaan ')
    .replace(/with defence counsel /gi, 'bersama peguam pembelaan ')
    .replace(/with his lawyer /gi, 'bersama peguamnya ')
    .replace(/with his defense lawyer /gi, 'bersama peguam pembelaannya ')
    .replace(/with his defence lawyer /gi, 'bersama peguam pembelaannya ')
    .replace(/with legal defense by /gi, 'dengan pembelaan guaman oleh ')
    .replace(/with legal defence by /gi, 'dengan pembelaan guaman oleh ')
    .replace(/with defense attorney /gi, 'bersama peguam pembelaan ')
    .replace(/represented by defense lawyer /gi, 'diwakili oleh peguam pembelaan ')
    .replace(/represented by defence lawyer /gi, 'diwakili oleh peguam pembelaan ')
    .replace(/represented by lawyer /gi, 'diwakili oleh peguam ')
    .replace(/represented by defense counsel /gi, 'diwakili oleh peguam pembelaan ')
    .replace(/represented by defence counsel /gi, 'diwakili oleh peguam pembelaan ')
    .replace(/defended by Rajpal Singh/gi, 'dipertahankan oleh Rajpal Singh')
    .replace(/defended by lawyer /gi, 'dipertahankan oleh peguam ')
    .replace(/defended by Datuk Rajpal Singh/gi, 'dipertahankan oleh Datuk Rajpal Singh')
    .replace(/defense lawyer /gi, 'peguam pembelaan ')
    .replace(/defence lawyer /gi, 'peguam pembelaan ')
    .replace(/defense counsel /gi, 'peguam pembelaan ')
    .replace(/defence counsel /gi, 'peguam pembelaan ')
    .replace(/defense mitigation by lawyer /gi, 'mitigasi pembelaan oleh peguam ')
    .replace(/defense team during /gi, 'pasukan pembelaan semasa ')
    .replace(/Malaysian criminal defense lawyer /gi, 'peguam pembelaan jenayah Malaysia ')
    .replace(/Malaysian criminal defence lawyer /gi, 'peguam pembelaan jenayah Malaysia ')
    .replace(/criminal law expert /gi, 'pakar undang-undang jenayah ')
    .replace(/criminal defense lawyer /gi, 'peguam pembelaan jenayah ')
    .replace(/criminal defence lawyer /gi, 'peguam pembelaan jenayah ')
    .replace(/reporting on /gi, 'melaporkan tentang ')
    .replace(/reporting on the /gi, 'melaporkan tentang ')
    .replace(/covering the /gi, 'meliputi ')
    .replace(/covering court trial proceedings regarding /gi, 'meliputi prosiding perbicaraan mahkamah mengenai ')
    .replace(/covering the court proceedings for /gi, 'meliputi prosiding mahkamah untuk ')
    .replace(/covering the Teoh Beng Hock inquest/gi, 'meliputi inkues Teoh Beng Hock')
    .replace(/covering the withdrawal of /gi, 'meliputi penarikan balik ')
    .replace(/covering the acquittal of /gi, 'meliputi pembebasan ')
    .replace(/covering the reaction of /gi, 'meliputi reaksi ')
    .replace(/covering the status of /gi, 'meliputi status ')
    .replace(/covering the court charges against /gi, 'meliputi pertuduhan mahkamah terhadap ')
    .replace(/covering the High Court's order for /gi, 'meliputi perintah Mahkamah Tinggi untuk ')
    .replace(/covering the High Court's ruling that /gi, 'meliputi keputusan Mahkamah Tinggi bahawa ')
    .replace(/documenting the Court of Appeal's decision to /gi, 'mendokumentasikan keputusan Mahkamah Rayuan untuk ')
    .replace(/documenting the reaction of /gi, 'mendokumentasikan reaksi ')
    .replace(/detailing the Court of Appeal's decision to dismiss /gi, 'memperincikan keputusan Mahkamah Rayuan menolak ')
    .replace(/detailing how scammers /gi, 'memperincikan bagaimana penipu ')
    .replace(/detailing how fake law firms /gi, 'memperincikan bagaimana firma guaman palsu ')
    .replace(/detailing the defense strategy led by /gi, 'memperincikan strategi pembelaan dipimpin oleh ')
    .replace(/detailing lawyer /gi, 'memperincikan peguam ')
    .replace(/summarizing the court charges against /gi, 'merumuskan pertuduhan mahkamah terhadap ')
    .replace(/summarizing the court charges against /gi, 'merumuskan pertuduhan mahkamah terhadap ')
    .replace(/warning about syndicates impersonating lawyers /gi, 'memberi amaran tentang sindiket menyamar sebagai peguam ')
    .replace(/warning the public against fake 'lawyers' /gi, 'memberi amaran kepada orang awam tentang \'peguam\' palsu ')
    .replace(/warning against online scams impersonating law firms/gi, 'memberi amaran tentang penipuan dalam talian menyamar sebagai firma guaman')
    .replace(/showing defense lawyer /gi, 'memaparkan peguam pembelaan ')
    .replace(/showing defence lawyer /gi, 'memaparkan peguam pembelaan ')
    .replace(/showing lawyer /gi, 'memaparkan peguam ')
    .replace(/showing chicken rice seller /gi, 'memaparkan penjual nasi ayam ')
    .replace(/showing Barisan Nasional candidate /gi, 'memaparkan calon Barisan Nasional ')
    .replace(/showing the Selangor Bar hockey team /gi, 'memaparkan pasukan hoki Selangor Bar ')
    .replace(/showing defense lawyers /gi, 'memaparkan peguam pembelaan ')
    .replace(/showing defence lawyers /gi, 'memaparkan peguam pembelaan ')
    .replace(/p pictured in /gi, ' digambar dalam ')
    .replace(/walking outside court with /gi, 'berjalan keluar mahkamah bersama ')
    .replace(/walking outside court with his clients/gi, 'berjalan keluar mahkamah bersama pelanggannya')
    .replace(/shaking hands with acquitted client /gi, 'berjabat tangan dengan pelanggan yang dibebaskan ')
    .replace(/shaking hands with his defense lawyer /gi, 'berjabat tangan dengan peguam pembelaannya ')
    .replace(/shaking hands with his defence lawyer /gi, 'berjabat tangan dengan peguam pembelaannya ')
    .replace(/speaking to the media outside /gi, 'berbicara kepada media di luar ')
    .replace(/speaking about /gi, 'berbicara tentang ')
    .replace(/during a murder trial at /gi, 'semasa perbicaraan bunuh di ')
    .replace(/during the /gi, 'semasa ')
    .replace(/during a /gi, 'semasa ')
    .replace(/at the Selayang Magistrate's Court/gi, 'di Mahkamah Majistret Selayang')
    .replace(/at the Selayang Sessions Court/gi, 'di Mahkamah Sesyen Selayang')
    .replace(/at the Shah Alam Sessions Court/gi, 'di Mahkamah Sesyen Shah Alam')
    .replace(/at the Shah Alam High Court/gi, 'di Mahkamah Tinggi Shah Alam')
    .replace(/at the Kuala Lumpur High Court/gi, 'di Mahkamah Tinggi Kuala Lumpur')
    .replace(/at the Ipoh Sessions Court/gi, 'di Mahkamah Sesyen Ipoh')
    .replace(/at the Muar High Court/gi, 'di Mahkamah Tinggi Muar')
    .replace(/at the Ampang court/gi, 'di mahkamah Ampang')
    .replace(/in a high-profile murder case/gi, 'dalam kes bunuh berprofil tinggi')
    .replace(/in a drug trafficking case/gi, 'dalam kes pengedaran dadah')
    .replace(/in a murder trial/gi, 'dalam perbicaraan bunuh')
    .replace(/in the RELA assault case/gi, 'dalam kes pukul RELA')
    .replace(/in the 'Allah' socks case/gi, 'dalam kes stokin \'Allah\'')
    .replace(/in the 2024 'Allah' socks case/gi, 'dalam kes stokin \'Allah\' 2024')
    .replace(/in his rape trial/gi, 'dalam perbicaraan rogolnya')
    .replace(/in the rape trial of /gi, 'dalam perbicaraan rogol ')
    .replace(/in the murder trial of /gi, 'dalam perbicaraan bunuh ')
    .replace(/in the murder of /gi, 'dalam kes bunuh ')
    .replace(/in the acquittal of /gi, 'dalam pembebasan ')
    .replace(/in the withdrawal of /gi, 'dalam penarikan balik ')
    .replace(/in the settlement of /gi, 'dalam penyelesaian ')
    .replace(/in the assault of /gi, 'dalam serangan terhadap ')
    .replace(/in the KK Mart sock controversy/gi, 'dalam kontroversi stokin KK Mart')
    .replace(/in the 'Nicky Gang' organised crime group/gi, 'dalam kumpulan jenayah terancang \'Geng Nicky\'')
    .replace(/in the Nicky Liow 'Nicky Gang' being granted /gi, 'dalam kes Geng Nicky Nicky Liow yang diberikan ')
    .replace(/in the 2008 Sessions Court arraignment/gi, 'dalam pengakuan salah Mahkamah Sesyen 2008')
    .replace(/in the 2008 Malaysian general election campaign/gi, 'dalam kempen pilihan raya umum Malaysia 2008')
    .replace(/in a 2016 kidnapping trial sentencing/gi, 'dalam penghukuman perbicaraan penculikan 2016')
    .replace(/after a verdict/gi, 'selepas keputusan')
    .replace(/after his drug trafficking acquittal/gi, 'selepas pembebasannya dalam kes pengedaran dadah')
    .replace(/after his high-profile drug trafficking acquittal/gi, 'selepas pembebasannya dalam kes pengedaran dadah berprofil tinggi')
    .replace(/after a High Court acquittal/gi, 'selepas pembebasan Mahkamah Tinggi')
    .replace(/after three suspects were detained in /gi, 'selepas tiga suspek ditahan dalam ')
    .replace(/after 124 difficult days during /gi, 'selepas 124 hari sukar semasa ')
    .replace(/following his acquittal in /gi, 'selepas pembebasannya dalam ')
    .replace(/following the 'Allah' socks controversy/gi, 'selepas kontroversi stokin \'Allah\'')
    .replace(/following the 'Allah' socks legal controversy/gi, 'selepas kontroversi guaman stokin \'Allah\'')
    .replace(/regarding the /gi, 'mengenai ')
    .replace(/regarding the status of /gi, 'mengenai status ')
    .replace(/regarding the trial dates set for /gi, 'mengenai tarikh perbicaraan ditetapkan untuk ')
    .replace(/regarding the Teoh Beng Hock inquest/gi, 'mengenai inkues Teoh Beng Hock')
    .replace(/regarding the withdrawal of police reports/gi, 'mengenai penarikan balik laporan polis')
    .replace(/regarding the assault of RELA personnel/gi, 'mengenai serangan terhadap anggota RELA')
    .replace(/regarding unidentified male DNA findings/gi, 'mengenai penemuan DNA lelaki tidak dikenali')
    .replace(/regarding forensic evidence/gi, 'mengenai bukti forensik')
    .replace(/regarding the court appearance of /gi, 'mengenai kehadiran mahkamah ')
    .replace(/regarding the 'Allah' socks controversy/gi, 'mengenai kontroversi stokin \'Allah\'')
    .replace(/titled Murder suspects claim police beat them up/gi, 'bertajuk Suspek bunuh dakwa polis pukul mereka')
    .replace(/titled Trio walk out of rally trial/gi, 'bertajuk Trio keluar dari perbicaraan perarakan')
    .replace(/titled Anwar pleads not guilty/gi, 'bertajuk Anwar mohon tidak bersalah')
    .replace(/titled Ganja Case: Anbuselvan, Shankar, Alagendran Acquitted/gi, 'bertajuk Kes Ganja: Anbuselvan, Shankar, Alagendran Dibebaskan')
    .replace(/titled Escaped from the hanging rope/gi, 'bertajuk Lolos dari tali gantung')
    .replace(/titled Bebas hukuman gantung/gi, 'bertajuk Bebas hukuman gantung')
    .replace(/titled Dipenjara kerana bunuh jiran/gi, 'bertajuk Dipenjara kerana bunuh jiran')
    .replace(/titled Penjual nasi ayam bebas tuduhan bunuh teman wanita/gi, 'bertajuk Penjual nasi ayam bebas tuduhan bunuh teman wanita')
    .replace(/titled Council Ruling in rape case fair/gi, 'bertajuk Keputusan Majlis dalam kes rogol adil')
    .replace(/titled Review code, urge criminal lawyers/gi, 'bertajuk Semak kod, desak peguam jenayah')
    .replace(/titled 3-year rule for these lawyers/gi, 'bertajuk Peraturan 3 tahun untuk peguam ini')
    .replace(/titled 'Court drama'/gi, 'bertajuk \'Drama mahkamah\'')
    .replace(/titled /gi, 'bertajuk ')
    .replace(/allegations of police brutality/gi, 'dakwaan keganasan polis')
    .replace(/alleged offence/gi, 'kesalahan yang didakwa')
    .replace(/acquittal of /gi, 'pembebasan ')
    .replace(/acquittal /gi, 'pembebasan ')
    .replace(/charged with murder/gi, 'didakwa bunuh')
    .replace(/four men charged with murder/gi, 'empat lelaki didakwa bunuh')
    .replace(/pleading not guilty/gi, 'mohon tidak bersalah')
    .replace(/plead not guilty/gi, 'mohon tidak bersalah')
    .replace(/withdrawal of charges/gi, 'penarikan balik pertuduhan')
    .replace(/withdrawal of two charges/gi, 'penarikan balik dua pertuduhan')
    .replace(/withdrawal of police reports/gi, 'penarikan balik laporan polis')
    .replace(/discharge not amounting to an acquittal \(DNAA\)/gi, 'pelepasan tidak setara pembebasan (DNAA)')
    .replace(/discharging himself from /gi, 'menarik diri daripada ')
    .replace(/due to weight discrepancies/gi, 'kerana percanggahan berat')
    .replace(/due to weight discrepancy/gi, 'kerana percanggahan berat')
    .replace(/reduced culpable homicide conviction/gi, 'sabitan homisid culpa dikurangkan')
    .replace(/reducing the death sentence of /gi, 'mengurangkan hukuman mati ')
    .replace(/commute the death sentence of /gi, 'menukar hukuman mati ')
    .replace(/to 22 years' imprisonment/gi, 'kepada 22 tahun penjara')
    .replace(/to 22 years' jail/gi, 'kepada 22 tahun penjara')
    .replace(/known as the 'cosplay killer'/gi, 'dikenali sebagai \'pembunuh cosplay\'')
    .replace(/known as the \'cosplay killer\'/gi, 'dikenali sebagai \'pembunuh cosplay\'')
    .replace(/organised crime group/gi, 'kumpulan jenayah terancang')
    .replace(/Bar Council volunteer/gi, 'sukarelawan Majlis Peguam')
    .replace(/Bar Council Criminal Law Committee chairman /gi, 'pengerusi Jawatankuasa Undang-Undang Jenayah Majlis Peguam ')
    .replace(/Chairman of the Selangor Bar Committee/gi, 'Pengerusi Jawatankuasa Selangor Bar')
    .replace(/and co-counsel outside /gi, 'dan peguam bersama di luar ')
    .replace(/and his legal team/gi, 'dan pasukan guamannya')
    .replace(/and his father\'s legacy/gi, 'dan warisan bapanya')
    .replace(/and the involvement of lawyer /gi, 'dan penglibatan peguam ')
    .replace(/and allegations of /gi, 'dan dakwaan ')
    .replace(/and forensic teams at /gi, 'dan pasukan forensik di ')
    .replace(/and forensic site investigations involving /gi, 'dan siasatan tapak forensik melibatkan ')
    .replace(/and forensic investigations into /gi, 'dan siasatan forensik ke atas ')
    .replace(/and the legal representation including /gi, 'dan perwakilan guaman termasuk ')
    .replace(/and the legal team/gi, 'dan pasukan guaman')
    .replace(/and his wife regarding /gi, 'dan isterinya mengenai ')
    .replace(/and his wife/gi, 'dan isterinya')
    .replace(/and wife /gi, 'dan isteri ')
    .replace(/and Edmund Bon on /gi, 'dan Edmund Bon mengenai ')
    .replace(/and Edmund Bon calling for /gi, 'dan Edmund Bon menyeru ')
    .replace(/and G\.K\. Ganesan during /gi, 'dan G.K. Ganesan semasa ')
    .replace(/and N\. Sivananthan questioning /gi, 'dan N. Sivananthan mempersoalkan ')
    .replace(/and Datuk David Gurupatham/gi, 'dan Datuk David Gurupatham')
    .replace(/and Tan Sri Muhammad Shafee Abdullah/gi, 'dan Tan Sri Muhammad Shafee Abdullah')
    .replace(/and Tan Sri Muhammad Shafee Abdullah, and lawyer /gi, 'dan Tan Sri Muhammad Shafee Abdullah, dan peguam ')
    .replace(/and lawyers including /gi, 'dan peguam termasuk ')
    .replace(/and lawyer /gi, 'dan peguam ')
    .replace(/and counsel /gi, 'dan peguam ')
    .replace(/and the Selangor Bar hockey team celebrating /gi, 'dan pasukan hoki Selangor Bar meraikan ')
    .replace(/where known/gi, 'jika diketahui')
    .replace(/if you believe any image is used incorrectly/gi, 'jika anda percaya sebarang imej digunakan secara tidak betul');

  if (!/\b(peguam|keratan|laporan|memaparkan|melaporkan|meliputi)\b/i.test(t.slice(0, 40))) {
    t = `Keratan akhbar memaparkan peguam Rajpal Singh: ${t}`;
  }
  return t;
}

const PRESS_CATEGORIES_MS = PRESS_CATEGORIES.map(c => ({
  ...c,
  label: {
    all: 'Semua',
    'criminal-trials': 'Perbicaraan jenayah',
    'kk-mart': 'KK Mart',
    'bar-profession': 'Majlis peguam & profesion',
    'video-social': 'Video & media sosial',
    community: 'Komuniti',
  }[c.id] || c.label,
}));

const PRESS_ITEMS_MS = PRESS_ITEMS.map(item => ({
  ...item,
  title: PRESS_MS_CONTENT[item.id]?.title ?? translatePressTitle(item.title),
  excerpt: PRESS_MS_CONTENT[item.id]?.excerpt ?? translatePressExcerpt(item.excerpt),
  dateLabel: translateDateLabel(item.dateLabel),
}));

const CLIPPINGS_MS = CLIPPINGS.map(c => ({
  ...c,
  description: CLIPPINGS_MS_DESCRIPTIONS[c.file] ?? translateClippingDesc(c.description),
  dateLabel: translateDateLabel(c.dateLabel),
  headline: c.headline ? translatePressTitle(c.headline) : undefined,
}));

function serialize(name, exports) {
  return `/**
 * ${name} — Auto-generated Bahasa Malaysia locale. Run: node scripts/generate-ms-locale.mjs
 */

${exports}
`;
}

const pressOut = serialize('press-data-ms.js', `/** @type {{ id: string, label: string }[]} */
export const PRESS_CATEGORIES_MS = ${JSON.stringify(PRESS_CATEGORIES_MS, null, 2)};

/** @type {import('./press-data.js').PressItem[]} */
export const PRESS_ITEMS_MS = ${JSON.stringify(PRESS_ITEMS_MS, null, 2)};
`);

const clippingsOut = serialize('clippings-data-ms.js', `/** @type {import('./clippings-data.js').Clipping[]} */
export const CLIPPINGS_MS = ${JSON.stringify(CLIPPINGS_MS, null, 2)};
`);

writeFileSync(join(root, 'js', 'press-data-ms.js'), pressOut);
writeFileSync(join(root, 'js', 'clippings-data-ms.js'), clippingsOut);

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPressNoscript(items, heading) {
  const sorted = [...items].sort((a, b) => b.sort.localeCompare(a.sort));
  const links = sorted.map(item => `
      <li>
        <a href="${escHtml(item.url)}">${escHtml(item.title)}</a>
        <span> — ${escHtml(item.publisher)}, ${escHtml(item.sort.slice(0, 10))}. ${escHtml(item.excerpt)}</span>
      </li>`).join('');

  return `<noscript class="press-grid__noscript">
          <h4 class="press-grid__noscript-title">${escHtml(heading)}</h4>
          <ul class="press-grid__noscript-list">${links}
          </ul>
        </noscript>`;
}

function replaceBetweenMarkers(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Markers not found: ${startMarker}`);
  }
  return html.slice(0, start + startMarker.length) + replacement + html.slice(end);
}

const featuredPress = PRESS_ITEMS_MS.filter(item => item.featured);
const msMediaPath = join(root, 'ms', 'media', 'index.html');
const msMediaHtml = replaceBetweenMarkers(
  readFileSync(msMediaPath, 'utf8'),
  '<!-- press-noscript:start -->',
  '<!-- press-noscript:end -->',
  buildPressNoscript(PRESS_ITEMS_MS, 'Arkib liputan media — Datuk Rajpal Singh, peguam jenayah Malaysia'),
);
writeFileSync(msMediaPath, msMediaHtml);

const msIndexPath = join(root, 'ms', 'index.html');
let msIndexHtml = readFileSync(msIndexPath, 'utf8');
if (!msIndexHtml.includes('<!-- press-noscript:start -->')) {
  msIndexHtml = msIndexHtml.replace(
    '<meta itemprop="description" content="Liputan akhbar dan siaran memaparkan peguam pembelaan jenayah Datuk Rajpal Singh di Kuala Lumpur dan Selangor, Malaysia.">',
    '<meta itemprop="description" content="Liputan akhbar dan siaran memaparkan peguam pembelaan jenayah Datuk Rajpal Singh di Kuala Lumpur dan Selangor, Malaysia.">\n          <!-- press-noscript:start --><!-- press-noscript:end -->',
  );
}
msIndexHtml = replaceBetweenMarkers(
  msIndexHtml,
  '<!-- press-noscript:start -->',
  '<!-- press-noscript:end -->',
  buildPressNoscript(featuredPress, 'Liputan media terpilih — Datuk Rajpal Singh, peguam jenayah Malaysia'),
);
writeFileSync(msIndexPath, msIndexHtml);

console.log(`Generated ${PRESS_ITEMS_MS.length} press items, ${CLIPPINGS_MS.length} clippings (MS).`);
console.log(`Updated BM press noscript: ${featuredPress.length} featured, ${PRESS_ITEMS_MS.length} full archive.`);
