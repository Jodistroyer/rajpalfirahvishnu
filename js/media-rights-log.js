/**
 * Media image rights log — press thumbnails and newspaper clippings.
 * Regenerate: node scripts/generate-rights-log.mjs
 */

export const MEDIA_RIGHTS_META = {
  lastUpdated: '2026-06-23',
  maintainer: 'Rajpal Firah & Vishnu',
  pressDisclaimer:
    'Press thumbnails are shown for reference only. Images and articles remain the property of their respective publishers and platforms. Each card links to the original source where available.',
  clippingsDisclaimer:
    'Newspaper clippings are archived scans shown for reference only. Layout, photographs, and text remain the property of the respective publishers. Captions identify the source publication and date where known.',
};

/** @typedef {'publisher-og-preview' | 'youtube-thumbnail' | 'tiktok-oembed-preview' | 'firm-created-fallback' | 'firm-archive-scan'} ImageSource */

/**
 * @typedef {Object} PressRightsEntry
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} sourceUrl
 * @property {string} imageAsset
 * @property {ImageSource} imageSource
 * @property {string} rightsHolder
 * @property {string} use
 * @property {string} added ISO date
 */

/** @type {PressRightsEntry[]} */
export const PRESS_IMAGE_RIGHTS = [
  {
    "id": "star-organised-crime-2026",
    "title": "11 men charged with being members of organised crime group",
    "publisher": "The Star",
    "sourceUrl": "https://www.thestar.com.my/news/nation/2026/05/25/11-men-charged-with-being-members-of-organised-crime-group",
    "imageAsset": "assets/media/press/star-organised-crime-2026.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "The Star",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "malaysia-gazette-harmoni-2025",
    "title": "Hidup harmoni, perpaduan penting — Datuk Rajpal Singh",
    "publisher": "Malaysia Gazette",
    "sourceUrl": "https://malaysiagazette.com/2025/04/12/hidup-harmoni-perpaduan-penting-rajpal/",
    "imageAsset": "assets/media/press/malaysia-gazette-harmoni-2025.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Malaysia Gazette",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "star-paul-yong-appeal-2024",
    "title": "Apex court to hear Paul Yong\\",
    "publisher": "The Star",
    "sourceUrl": "https://www.thestar.com.my/news/nation/2024/09/05/apex-court-to-hear-paul-yong039s-rape-conviction-appeal-on-oct-23",
    "imageAsset": "assets/media/press/star-paul-yong-appeal-2024.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "The Star",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "bh-kk-mart-family-2024",
    "title": "124 hari penuh sengsara — Pengasas KK Mart",
    "publisher": "Berita Harian",
    "sourceUrl": "https://www.bharian.com.my/berita/nasional/2024/07/1271686/124-hari-penuh-sengsara-dalam-hidup-saya-keluarga-pengasas-kk-mart",
    "imageAsset": "assets/media/press/bh-kk-mart.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Berita Harian",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "utusan-kk-mart-verdict-2024",
    "title": "Keputusan mahkamah diharap tamatkan isu KK Mart",
    "publisher": "Utusan Malaysia",
    "sourceUrl": "https://www.utusan.com.my/nasional/2024/07/keputusan-mahkamah-diharap-tamatkan-isu-kk-mart/",
    "imageAsset": "assets/media/press/utusan-kk-mart.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Utusan Malaysia",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "harapan-daily-kk-mart-2024",
    "title": "Justice will prevail for KK Mart",
    "publisher": "Harapan Daily",
    "sourceUrl": "https://harapandaily.com/2024/03/27/justice-will-prevail-for-kk-mart/",
    "imageAsset": "assets/media/press/harapan-daily-kk-mart-2024.png",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Harapan Daily",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "scoop-kk-mart-overview",
    "title": "Overview of key players in KK Mart\\",
    "publisher": "Scoop",
    "sourceUrl": "https://www.scoop.my/news/182986/an-overview-of-key-players-embroiled-in-kk-marts-legal-battles-boycotts/",
    "imageAsset": "assets/media/press/scoop-kk-mart-overview.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Scoop",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "ktemoc-allah-socks-2024",
    "title": "Allah printed socks controversy — legal commentary",
    "publisher": "Ktemoc",
    "sourceUrl": "http://ktemoc.blogspot.com/2024/03/allah-printed-socks-controversy-there.html",
    "imageAsset": "assets/media/press/ktemoc-allah-socks-2024.png",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Ktemoc",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "nst-kk-mart-justice-2024",
    "title": "KK Mart lawyers: Let justice take its course",
    "publisher": "New Straits Times",
    "sourceUrl": "https://www.nst.com.my/news/crime-courts/2024/03/1030912/kk-mart-lawyers-let-justice-take-its-course-nsttv",
    "imageAsset": "assets/media/press/nst-kk-mart.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "New Straits Times",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "edge-kk-mart-charges-2024",
    "title": "KK Mart founder, wife and supplier charged; plead not guilty",
    "publisher": "The Edge Malaysia",
    "sourceUrl": "https://theedgemalaysia.com/node/705937",
    "imageAsset": "assets/media/press/edge-kk-mart.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "The Edge Malaysia",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-star-kk-mart-2024",
    "title": "Allow justice to take its course, say lawyers representing KK Mart",
    "publisher": "The Star (YouTube)",
    "sourceUrl": "https://www.youtube.com/watch?v=9lAQSmj59_k",
    "imageAsset": "https://img.youtube.com/vi/9lAQSmj59_k/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-utusan-kk-chai-2024",
    "title": "Sidang media peguam mewakili Datuk Seri Dr KK Chai",
    "publisher": "Utusan Malaysia (YouTube)",
    "sourceUrl": "https://www.youtube.com/watch?v=Jw1B5p4WGxA",
    "imageAsset": "https://img.youtube.com/vi/Jw1B5p4WGxA/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-kk-mart-0VKhcAhZzIs",
    "title": "KK Mart legal coverage (video)",
    "publisher": "YouTube",
    "sourceUrl": "https://www.youtube.com/watch?v=0VKhcAhZzIs",
    "imageAsset": "https://img.youtube.com/vi/0VKhcAhZzIs/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "astro-nicky-gang-2021",
    "title": "14 individuals linked to Nicky Gang freed of charges",
    "publisher": "Astro Awani",
    "sourceUrl": "https://international.astroawani.com/malaysia-news/14-individuals-linked-nicky-gang-freed-charges-370049",
    "imageAsset": "assets/media/press/astro-nicky-gang-2021.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Astro Awani",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "asiaone-cosplay-killer-2019",
    "title": "Cosplay killer gets 22 years\\",
    "publisher": "AsiaOne",
    "sourceUrl": "https://www.asiaone.com/malaysia/malaysian-man-dubbed-cosplay-killer-gets-22-years-jail-instead-death-upon-appeal",
    "imageAsset": "assets/media/press/asiaone-cosplay-killer-2019.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "AsiaOne",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "yahoo-paul-yong-exco",
    "title": "Ex-Perak exco Paul Yong — legal proceedings",
    "publisher": "Yahoo News Malaysia",
    "sourceUrl": "https://malaysia.news.yahoo.com/ex-perak-exco-paul-yong-025421673.html",
    "imageAsset": "assets/media/press/fallback-yahoo.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "yahoo-paul-yong-trial-postponed",
    "title": "Rape trial postponed for Paul Yong",
    "publisher": "Yahoo News Malaysia",
    "sourceUrl": "https://malaysia.news.yahoo.com/rape-trial-postponed-paul-yong-031801403.html",
    "imageAsset": "assets/media/press/fallback-yahoo.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "sabahkini-spanco",
    "title": "SPanco case — Tan Sri Robert Tan charged",
    "publisher": "Sabahkini",
    "sourceUrl": "https://www.sabahkini2.co/en/news/6066/tan-sri-robert-tan-bos-spanco-didakwa-tipu-mof-rm39-bilion/view",
    "imageAsset": "assets/media/press/sabahkini-spanco.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Sabahkini",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "bh-rela-compensation-2018",
    "title": "Anggota RELA tolak bayaran pampasan",
    "publisher": "Berita Harian",
    "sourceUrl": "https://www.bharian.com.my/berita/kes/2018/08/461749/anggota-rela-tolak-bayaran-pampasan",
    "imageAsset": "assets/media/press/bh-rela-compensation-2018.png",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Berita Harian",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "malaymail-najib-lawyers-2018",
    "title": "After Najib\\",
    "publisher": "Malay Mail",
    "sourceUrl": "https://www.malaymail.com/news/malaysia/2018/07/03/after-najibs-arrest-lawyers-say-fine-for-suspects-to-be-held-before-being-c/1648403",
    "imageAsset": "assets/media/press/malaymail-najib-lawyers-2018.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Malay Mail",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "malaymail-igp-twitter-2015",
    "title": "IGP\\",
    "publisher": "Malay Mail",
    "sourceUrl": "https://www.malaymail.com/news/malaysia/2015/03/19/igps-twitter-policing-leaves-lawyers-conflicted/862241",
    "imageAsset": "assets/media/press/malaymail-igp-twitter-2015.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Malay Mail",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "malaysianbar-protect-lawyers",
    "title": "Bar Council to set up committee to protect lawyers",
    "publisher": "Malaysian Bar",
    "sourceUrl": "https://www.malaysianbar.org.my/bar_news/berita_badan_peguam/bar_council_to_set_up_special_committee_to_protect_lawyers.html",
    "imageAsset": "assets/media/press/fallback-malaysian-bar.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "malaysianbar-sentencing-guidelines",
    "title": "The case for sentencing guidelines",
    "publisher": "Malaysian Bar",
    "sourceUrl": "https://www.malaysianbar.org.my/article/news/legal-and-general-news/legal-news/case-for-sentencing-guidelines",
    "imageAsset": "assets/media/press/fallback-malaysian-bar.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "selangorbar-content-93803",
    "title": "Selangor Bar — official news",
    "publisher": "Selangor Bar",
    "sourceUrl": "https://www.selangorbar.org/content_dtl.php?id=93803",
    "imageAsset": "assets/media/press/fallback-selangor-bar.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "selangorbar-photo-1839",
    "title": "Selangor Bar official photograph",
    "publisher": "Selangor Bar",
    "sourceUrl": "https://selangorbar.org/photographs_photo.php?album=3&photo=1839",
    "imageAsset": "assets/media/press/fallback-selangor-bar.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "bar-representative-pdf-2012",
    "title": "Bar representative document (2012)",
    "publisher": "Selangor Bar",
    "sourceUrl": "https://gizwizstudio.sgp1.cdn.digitaloceanspaces.com/sgorbar-wp20181123/home2/sgorbarg/public_html/_beta/www/2012/02/20-bar-representative.pdf",
    "imageAsset": "assets/media/press/fallback-document.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "nst-mukhtiar-2022",
    "title": "Capt Mukhtiar, 90, and still battling",
    "publisher": "New Straits Times",
    "sourceUrl": "https://www.nst.com.my/news/nation/2022/06/805147/capt-mukhtiar-90-and-still-battling",
    "imageAsset": "assets/media/press/nst-mukhtiar-2022.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "New Straits Times",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "keehuachee-philanthropist-2020",
    "title": "Malaysia\\",
    "publisher": "Kee Huat Chee",
    "sourceUrl": "http://keehuachee.blogspot.com/2020/08/malaysias-youngest-philanthropist-dato.html",
    "imageAsset": "assets/media/press/keehuachee-philanthropist-2020.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Kee Huat Chee",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "facebook-vasakhi",
    "title": "Vasakhi message — Datuk Rajpal Singh, Gurdwara Sahib",
    "publisher": "Facebook",
    "sourceUrl": "https://www.facebook.com/100076608946392/videos/on-this-joyous-occasion-of-vasakhi-dato-rajpal-singh-president-of-gurdwara-sahib/1334592824466502/",
    "imageAsset": "assets/media/press/facebook-vasakhi.jpg",
    "imageSource": "publisher-og-preview",
    "rightsHolder": "Facebook / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "facebook-high-court-kl",
    "title": "At the High Court Criminal Division, Kuala Lumpur",
    "publisher": "Facebook",
    "sourceUrl": "https://www.facebook.com/manoharan.malayalam.1/posts/1062026at-the-high-court-criminal-division-at-jalan-dutakuala-lumpur-todaymy-son/36788038037461243/",
    "imageAsset": "assets/media/press/fallback-facebook.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "tiktok-utusan-kk",
    "title": "Utusan Malaysia — KK Mart coverage",
    "publisher": "TikTok (Utusan Malaysia)",
    "sourceUrl": "https://www.tiktok.com/@utusanonline/video/7350574657910721800",
    "imageAsset": "assets/media/press/tiktok-utusan-kk.jpg",
    "imageSource": "tiktok-oembed-preview",
    "rightsHolder": "TikTok / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "tiktok-hmetromy",
    "title": "Court coverage — Datuk Rajpal Singh",
    "publisher": "TikTok",
    "sourceUrl": "https://www.tiktok.com/@hmetromy/video/7520509764229532944",
    "imageAsset": "assets/media/press/tiktok-hmetromy.jpg",
    "imageSource": "tiktok-oembed-preview",
    "rightsHolder": "TikTok / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "instagram-reel",
    "title": "Instagram reel — legal coverage",
    "publisher": "Instagram",
    "sourceUrl": "https://www.instagram.com/reels/DLW1lq5pSmq/",
    "imageAsset": "assets/media/press/fallback-instagram.svg",
    "imageSource": "firm-created-fallback",
    "rightsHolder": "Rajpal Firah & Vishnu",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-XzaT9wGXDmc",
    "title": "Court proceedings coverage",
    "publisher": "YouTube",
    "sourceUrl": "https://www.youtube.com/watch?v=XzaT9wGXDmc",
    "imageAsset": "https://img.youtube.com/vi/XzaT9wGXDmc/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-KbWK4lspxo4",
    "title": "Legal commentary — Datuk Rajpal Singh",
    "publisher": "YouTube",
    "sourceUrl": "https://youtu.be/KbWK4lspxo4",
    "imageAsset": "https://img.youtube.com/vi/KbWK4lspxo4/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  },
  {
    "id": "youtube-rajpal-bhTq-L5jtf8",
    "title": "Datuk Rajpal Singh — media appearance",
    "publisher": "YouTube",
    "sourceUrl": "https://www.youtube.com/watch?v=bhTq-L5jtf8",
    "imageAsset": "https://img.youtube.com/vi/bhTq-L5jtf8/hqdefault.jpg",
    "imageSource": "youtube-thumbnail",
    "rightsHolder": "YouTube / original uploader",
    "use": "Press index thumbnail; link-out to original source",
    "added": "2026-06-23"
  }
];

/**
 * @typedef {Object} ClippingRightsEntry
 * @property {string} id
 * @property {string} file
 * @property {string} imageAsset
 * @property {string} publisher
 * @property {string} dateLabel
 * @property {ImageSource} imageSource
 * @property {string} rightsHolder
 * @property {string} use
 * @property {string} added
 */

/** @type {ClippingRightsEntry[]} */
export const CLIPPINGS_IMAGE_RIGHTS = [
  {
    "id": "malay-mail-2004-murder-suspects-police-brutality-allegation-rajpal-singh",
    "file": "malay-mail-2004-murder-suspects-police-brutality-allegation-rajpal-singh.png",
    "imageAsset": "assets/media/newspaper-clippings/malay-mail-2004-murder-suspects-police-brutality-allegation-rajpal-singh.png",
    "publisher": "Malay Mail",
    "dateLabel": "2004",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Malay Mail",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-straits-times-murder-trial-selayang-court-2004-rajpal-singh",
    "file": "new-straits-times-murder-trial-selayang-court-2004-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-straits-times-murder-trial-selayang-court-2004-rajpal-singh.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "25 February 2004",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "selayang-magistrate-court-murder-case-2004-rajpal-singh",
    "file": "selayang-magistrate-court-murder-case-2004-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/selayang-magistrate-court-murder-case-2004-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "25 February 2004",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-gk-ganesan-hindraf-court-case-sinar-harian-2007",
    "file": "rajpal-singh-gk-ganesan-hindraf-court-case-sinar-harian-2007.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-gk-ganesan-hindraf-court-case-sinar-harian-2007.png",
    "publisher": "Sinar Harian",
    "dateLabel": "30 November 2007",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Sinar Harian",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-straits-times-murder-acquittal-2007-rajpal-singh",
    "file": "new-straits-times-murder-acquittal-2007-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-straits-times-murder-acquittal-2007-rajpal-singh.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "1 September 2007",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "batu-caves-illegal-assembly-court-case-2007-rajpal-singh",
    "file": "batu-caves-illegal-assembly-court-case-2007-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/batu-caves-illegal-assembly-court-case-2007-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "2007",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "the-star-newspaper-front-page-december-5-2007-hindraf-trial-rajpal-singh",
    "file": "the-star-newspaper-front-page-december-5-2007-hindraf-trial-rajpal-singh.png",
    "imageAsset": "assets/media/newspaper-clippings/the-star-newspaper-front-page-december-5-2007-hindraf-trial-rajpal-singh.png",
    "publisher": "The Star",
    "dateLabel": "5 December 2007",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-uthayakumar-malay-mail-hindraf-rally-trial-2007",
    "file": "rajpal-singh-uthayakumar-malay-mail-hindraf-rally-trial-2007.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-uthayakumar-malay-mail-hindraf-rally-trial-2007.png",
    "publisher": "Malay Mail",
    "dateLabel": "5 December 2007",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Malay Mail",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-anwar-ibrahim-sodomy-trial-not-guilty-the-sun-newspaper-2008",
    "file": "rajpal-singh-anwar-ibrahim-sodomy-trial-not-guilty-the-sun-newspaper-2008.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-anwar-ibrahim-sodomy-trial-not-guilty-the-sun-newspaper-2008.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2008",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "batu-caves-election-campaign-datuk-muniandy-mohan-rajpal-singh-2008",
    "file": "batu-caves-election-campaign-datuk-muniandy-mohan-rajpal-singh-2008.JPG",
    "imageAsset": "assets/media/newspaper-clippings/batu-caves-election-campaign-datuk-muniandy-mohan-rajpal-singh-2008.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "c. 2008",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-lim-yee-lan-anbuchelvan-sangker-alagendran-drug-acquittal-2009",
    "file": "rajpal-singh-lim-yee-lan-anbuchelvan-sangker-alagendran-drug-acquittal-2009.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-lim-yee-lan-anbuchelvan-sangker-alagendran-drug-acquittal-2009.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "the-star-newspaper-drug-trafficking-acquittal-weight-discrepancy-rajpal-singh-2009",
    "file": "the-star-newspaper-drug-trafficking-acquittal-weight-discrepancy-rajpal-singh-2009.JPG",
    "imageAsset": "assets/media/newspaper-clippings/the-star-newspaper-drug-trafficking-acquittal-weight-discrepancy-rajpal-singh-2009.JPG",
    "publisher": "The Star",
    "dateLabel": "24 July 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "teoh-beng-hock-inquest-rajpal-singh-sin-chew-daily-2009",
    "file": "teoh-beng-hock-inquest-rajpal-singh-sin-chew-daily-2009.png",
    "imageAsset": "assets/media/newspaper-clippings/teoh-beng-hock-inquest-rajpal-singh-sin-chew-daily-2009.png",
    "publisher": "Sin Chew Daily",
    "dateLabel": "11 August 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Sin Chew Daily",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "teoh-beng-hock-inquest-rajpal-singh-nanyang-siang-pau-2009",
    "file": "teoh-beng-hock-inquest-rajpal-singh-nanyang-siang-pau-2009.png",
    "imageAsset": "assets/media/newspaper-clippings/teoh-beng-hock-inquest-rajpal-singh-nanyang-siang-pau-2009.png",
    "publisher": "Nanyang Siang Pau",
    "dateLabel": "11 August 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Nanyang Siang Pau",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "teoh-beng-hock-inquest-forensic-report-august-2009-rajpal-singh",
    "file": "teoh-beng-hock-inquest-forensic-report-august-2009-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/teoh-beng-hock-inquest-forensic-report-august-2009-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "11 August 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "teoh-beng-hock-inquest-dna-findings-august-2009-rajpal-singh",
    "file": "teoh-beng-hock-inquest-dna-findings-august-2009-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/teoh-beng-hock-inquest-dna-findings-august-2009-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "August 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "selvam-murder-case-court-trial-2009-rajpal-singh",
    "file": "selvam-murder-case-court-trial-2009-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/selvam-murder-case-court-trial-2009-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-sunday-times-penal-code-review-december-2009-rajpal-singh",
    "file": "new-sunday-times-penal-code-review-december-2009-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-sunday-times-penal-code-review-december-2009-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "6 December 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "malaysian-penal-code-reform-advocacy-2009-rajpal-singh",
    "file": "malaysian-penal-code-reform-advocacy-2009-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/malaysian-penal-code-reform-advocacy-2009-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "6 December 2009",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-new-straits-times-2010-court-assigned-lawyers-capital-punishment",
    "file": "rajpal-singh-new-straits-times-2010-court-assigned-lawyers-capital-punishment.JPG",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-new-straits-times-2010-court-assigned-lawyers-capital-punishment.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "July 2010",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-selangor-bar-chairman-2010-official-documents",
    "file": "rajpal-singh-selangor-bar-chairman-2010-official-documents.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-selangor-bar-chairman-2010-official-documents.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "July 2010",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-selangor-bar-hockey-league-sinar-harian-2010",
    "file": "rajpal-singh-selangor-bar-hockey-league-sinar-harian-2010.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-selangor-bar-hockey-league-sinar-harian-2010.png",
    "publisher": "Sinar Harian",
    "dateLabel": "10 November 2010",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Sinar Harian",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-m-seldas-edwinmaranda-kosmo-murder-trial-2011",
    "file": "rajpal-singh-m-seldas-edwinmaranda-kosmo-murder-trial-2011.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-m-seldas-edwinmaranda-kosmo-murder-trial-2011.png",
    "publisher": "Kosmo",
    "dateLabel": "2011",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Kosmo",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-straits-times-drug-trafficking-acquittal-2011-rajpal-singh",
    "file": "new-straits-times-drug-trafficking-acquittal-2011-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-straits-times-drug-trafficking-acquittal-2011-rajpal-singh.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "27 May 2011",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-ewe-peng-lip-rape-case-ruling-new-straits-times-2012",
    "file": "rajpal-singh-ewe-peng-lip-rape-case-ruling-new-straits-times-2012.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-ewe-peng-lip-rape-case-ruling-new-straits-times-2012.png",
    "publisher": "New Straits Times",
    "dateLabel": "September 2012",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "chinese-press-murder-acquittal-selayang-court-2015-rajpal-singh",
    "file": "chinese-press-murder-acquittal-selayang-court-2015-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/chinese-press-murder-acquittal-selayang-court-2015-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2015",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-lawyer-muar-high-court-kidnapping-case-2016",
    "file": "rajpal-singh-lawyer-muar-high-court-kidnapping-case-2016.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-lawyer-muar-high-court-kidnapping-case-2016.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-lawyer-acquittal-court-case-2016",
    "file": "rajpal-singh-lawyer-acquittal-court-case-2016.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-lawyer-acquittal-court-case-2016.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-cheh-chun-nam-kosmo-murder-acquittal-2016",
    "file": "rajpal-singh-cheh-chun-nam-kosmo-murder-acquittal-2016.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-cheh-chun-nam-kosmo-murder-acquittal-2016.png",
    "publisher": "Kosmo",
    "dateLabel": "2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Kosmo",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "ng-yuk-tim-murder-trial-2016-poon-wai-hong-rajpal-singh",
    "file": "ng-yuk-tim-murder-trial-2016-poon-wai-hong-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/ng-yuk-tim-murder-trial-2016-poon-wai-hong-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-court-acquittal-the-star-2016",
    "file": "rajpal-singh-court-acquittal-the-star-2016.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-court-acquittal-the-star-2016.png",
    "publisher": "The Star",
    "dateLabel": "20 January 2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "the-star-murder-acquittal-cheras-2016-rajpal-singh",
    "file": "the-star-murder-acquittal-cheras-2016-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/the-star-murder-acquittal-cheras-2016-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "20 January 2016",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-court-case-charge-withdrawal-2018-rajpal-singh",
    "file": "nicky-liow-court-case-charge-withdrawal-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-court-case-charge-withdrawal-2018-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "8 September 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-court-charges-withdrawn-2018-rajpal-singh",
    "file": "nicky-liow-court-charges-withdrawn-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-court-charges-withdrawn-2018-rajpal-singh.JPG",
    "publisher": "China Press",
    "dateLabel": "8 September 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "China Press",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-rela-assault-charges-dropped-2018-rajpal-singh",
    "file": "nicky-liow-rela-assault-charges-dropped-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-rela-assault-charges-dropped-2018-rajpal-singh.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "8 September 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rela-assault-case-dnaa-2018-nicky-liow-rajpal-singh",
    "file": "rela-assault-case-dnaa-2018-nicky-liow-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/rela-assault-case-dnaa-2018-nicky-liow-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "8 September 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "RELA-assault-case-compensation-rejection-2018-rajpal-singh",
    "file": "RELA-assault-case-compensation-rejection-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/RELA-assault-case-compensation-rejection-2018-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "15 August 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rela-members-reject-compensation-nicky-liow-case-2018-rajpal-singh",
    "file": "rela-members-reject-compensation-nicky-liow-case-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/rela-members-reject-compensation-nicky-liow-case-2018-rajpal-singh.JPG",
    "publisher": "Harian Metro",
    "dateLabel": "2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Harian Metro",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-rela-assault-trial-2018-rajpal-singh",
    "file": "nicky-liow-rela-assault-trial-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-rela-assault-trial-2018-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "September 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "chinese-press-nicky-liow-rela-trial-update-rajpal-singh-2018",
    "file": "chinese-press-nicky-liow-rela-trial-update-rajpal-singh-2018.JPG",
    "imageAsset": "assets/media/newspaper-clippings/chinese-press-nicky-liow-rela-trial-update-rajpal-singh-2018.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rela-assault-case-report-withdrawal-2018-rajpal-singh",
    "file": "rela-assault-case-report-withdrawal-2018-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/rela-assault-case-report-withdrawal-2018-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "November 2018",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-rela-assault-settlement-2019-rajpal-singh",
    "file": "nicky-liow-rela-assault-settlement-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-rela-assault-settlement-2019-rajpal-singh.JPG",
    "publisher": "China Press",
    "dateLabel": "10 May 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "China Press",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-liow-rela-assault-acquittal-2019-rajpal-singh",
    "file": "nicky-liow-rela-assault-acquittal-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-liow-rela-assault-acquittal-2019-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "11 May 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "tamil-press-nicky-liow-rela-case-settlement-2019-rajpal-singh",
    "file": "tamil-press-nicky-liow-rela-case-settlement-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/tamil-press-nicky-liow-rela-case-settlement-2019-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "May 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-choo-kiong-exco-duty-status-2019-rajpal-singh",
    "file": "paul-yong-choo-kiong-exco-duty-status-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-choo-kiong-exco-duty-status-2019-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "November 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "poon-wai-hong-cosplay-killer-appeal-2019-rajpal-singh",
    "file": "poon-wai-hong-cosplay-killer-appeal-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/poon-wai-hong-cosplay-killer-appeal-2019-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "12 September 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "poon-wai-hong-culpable-homicide-appeal-ruling-2019-rajpal-singh",
    "file": "poon-wai-hong-culpable-homicide-appeal-ruling-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/poon-wai-hong-culpable-homicide-appeal-ruling-2019-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "September 2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "poon-wai-hong-appeal-ruling-2019-rajpal-singh",
    "file": "poon-wai-hong-appeal-ruling-2019-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/poon-wai-hong-appeal-ruling-2019-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2019",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-rape-trial-date-setting-rajpal-singh-2020",
    "file": "paul-yong-rape-trial-date-setting-rajpal-singh-2020.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-rape-trial-date-setting-rajpal-singh-2020.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "16 July 2020",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-rape-trial-transfer-appeal-rajpal-singh-2020",
    "file": "paul-yong-rape-trial-transfer-appeal-rajpal-singh-2020.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-rape-trial-transfer-appeal-rajpal-singh-2020.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "2020",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-gang-14-men-dnaa-shah-alam-2021-rajpal-singh",
    "file": "nicky-gang-14-men-dnaa-shah-alam-2021-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-gang-14-men-dnaa-shah-alam-2021-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "2021",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-rape-trial-defense-ruling-2021-rajpal-singh",
    "file": "paul-yong-rape-trial-defense-ruling-2021-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-rape-trial-defense-ruling-2021-rajpal-singh.JPG",
    "publisher": "Malay Mail",
    "dateLabel": "7 December 2021",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Malay Mail",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-rape-trial-prima-facie-ruling-rajpal-singh-2021",
    "file": "paul-yong-rape-trial-prima-facie-ruling-rajpal-singh-2021.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-rape-trial-prima-facie-ruling-rajpal-singh-2021.JPG",
    "publisher": "The Star",
    "dateLabel": "8 December 2021",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "nicky-gang-acquittal-court-of-appeal-2022-rajpal-singh",
    "file": "nicky-gang-acquittal-court-of-appeal-2022-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/nicky-gang-acquittal-court-of-appeal-2022-rajpal-singh.JPG",
    "publisher": "Kosmo",
    "dateLabel": "7 July 2022",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Kosmo",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "china-press-kk-mart-court-appearance-2024-march",
    "file": "china-press-kk-mart-court-appearance-2024-march.JPG",
    "imageAsset": "assets/media/newspaper-clippings/china-press-kk-mart-court-appearance-2024-march.JPG",
    "publisher": "China Press",
    "dateLabel": "27 March 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "China Press",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "the-star-kk-mart-directors-claim-trial-2024",
    "file": "the-star-kk-mart-directors-claim-trial-2024.JPG",
    "imageAsset": "assets/media/newspaper-clippings/the-star-kk-mart-directors-claim-trial-2024.JPG",
    "publisher": "The Star",
    "dateLabel": "27 March 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kk-mart-legal-controversy-and-security-incidents-2024-march",
    "file": "kk-mart-legal-controversy-and-security-incidents-2024-march.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kk-mart-legal-controversy-and-security-incidents-2024-march.JPG",
    "publisher": "The Star",
    "dateLabel": "27 March 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "sin-chew-daily-kk-mart-sock-controversy-acquittal-rajpal-singh",
    "file": "sin-chew-daily-kk-mart-sock-controversy-acquittal-rajpal-singh.png",
    "imageAsset": "assets/media/newspaper-clippings/sin-chew-daily-kk-mart-sock-controversy-acquittal-rajpal-singh.png",
    "publisher": "Sin Chew Daily",
    "dateLabel": "16 July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Sin Chew Daily",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "china-press-kk-mart-founder-acquittal-2024-rajpal-singh",
    "file": "china-press-kk-mart-founder-acquittal-2024-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/china-press-kk-mart-founder-acquittal-2024-rajpal-singh.JPG",
    "publisher": "China Press",
    "dateLabel": "16 July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "China Press",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-straits-times-kk-mart-acquittal-2024-rajpal-singh-report",
    "file": "new-straits-times-kk-mart-acquittal-2024-rajpal-singh-report.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-straits-times-kk-mart-acquittal-2024-rajpal-singh-report.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "16 July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kk-mart-founder-chai-kee-kan-acquittal-2024-rajpal-singh",
    "file": "kk-mart-founder-chai-kee-kan-acquittal-2024-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kk-mart-founder-chai-kee-kan-acquittal-2024-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kk-mart-legal-victory-2024-analysis-rajpal-singh",
    "file": "kk-mart-legal-victory-2024-analysis-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kk-mart-legal-victory-2024-analysis-rajpal-singh.JPG",
    "publisher": "China Press",
    "dateLabel": "July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "China Press",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kk-mart-founder-chai-kee-kan-124-days-acquittal-rajpal-singh",
    "file": "kk-mart-founder-chai-kee-kan-124-days-acquittal-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kk-mart-founder-chai-kee-kan-124-days-acquittal-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kk-mart-founder-acquittal-statement-tamil-press-2024",
    "file": "kk-mart-founder-acquittal-statement-tamil-press-2024.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kk-mart-founder-acquittal-statement-tamil-press-2024.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "July 2024",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "kosmo-fake-lawyer-scam-alert-michael-chong-shafee-rajpal-singh-2025",
    "file": "kosmo-fake-lawyer-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "imageAsset": "assets/media/newspaper-clippings/kosmo-fake-lawyer-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "publisher": "Kosmo",
    "dateLabel": "15 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Kosmo",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "8tv-news-fake-lawyer-scam-alert-michael-chong-rajpal-singh-2025",
    "file": "8tv-news-fake-lawyer-scam-alert-michael-chong-rajpal-singh-2025.JPG",
    "imageAsset": "assets/media/newspaper-clippings/8tv-news-fake-lawyer-scam-alert-michael-chong-rajpal-singh-2025.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "15 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "berita-harian-fake-law-firm-scam-alert-michael-chong-shafee-rajpal-singh-2025",
    "file": "berita-harian-fake-law-firm-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "imageAsset": "assets/media/newspaper-clippings/berita-harian-fake-law-firm-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "publisher": "Berita Harian",
    "dateLabel": "15 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Berita Harian",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "berita-harian-law-firm-scam-alert-michael-chong-rajpal-singh-2025",
    "file": "berita-harian-law-firm-scam-alert-michael-chong-rajpal-singh-2025.JPG",
    "imageAsset": "assets/media/newspaper-clippings/berita-harian-law-firm-scam-alert-michael-chong-rajpal-singh-2025.JPG",
    "publisher": "Berita Harian",
    "dateLabel": "16 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Berita Harian",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "new-straits-times-legal-scam-alert-michael-chong-shafee-rajpal-singh-2025",
    "file": "new-straits-times-legal-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "imageAsset": "assets/media/newspaper-clippings/new-straits-times-legal-scam-alert-michael-chong-shafee-rajpal-singh-2025.JPG",
    "publisher": "New Straits Times",
    "dateLabel": "16 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "New Straits Times",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "the-star-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh",
    "file": "the-star-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/the-star-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh.JPG",
    "publisher": "The Star",
    "dateLabel": "17 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "The Star",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "mothership-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh",
    "file": "mothership-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/mothership-fake-law-firm-scam-alert-2025-michael-chong-shafee-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "17 December 2025",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-ka-ramu-shah-alam-high-court-murder-case",
    "file": "rajpal-singh-ka-ramu-shah-alam-high-court-murder-case.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-ka-ramu-shah-alam-high-court-murder-case.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "Archive",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-harian-metro-junaidi-ibrahim-drug-trafficking-acquittal",
    "file": "rajpal-singh-harian-metro-junaidi-ibrahim-drug-trafficking-acquittal.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-harian-metro-junaidi-ibrahim-drug-trafficking-acquittal.png",
    "publisher": "Harian Metro",
    "dateLabel": "Archive",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Harian Metro",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "rajpal-singh-dhanasekaran-drug-trafficking-acquittal-malaysia-tamil-news",
    "file": "rajpal-singh-dhanasekaran-drug-trafficking-acquittal-malaysia-tamil-news.png",
    "imageAsset": "assets/media/newspaper-clippings/rajpal-singh-dhanasekaran-drug-trafficking-acquittal-malaysia-tamil-news.png",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "Archive",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  },
  {
    "id": "paul-yong-rape-trial-court-testimony-analysis-rajpal-singh",
    "file": "paul-yong-rape-trial-court-testimony-analysis-rajpal-singh.JPG",
    "imageAsset": "assets/media/newspaper-clippings/paul-yong-rape-trial-court-testimony-analysis-rajpal-singh.JPG",
    "publisher": "Respective newspaper publisher",
    "dateLabel": "Paul Yong trial",
    "imageSource": "firm-archive-scan",
    "rightsHolder": "Respective newspaper publisher",
    "use": "Reference archive of press coverage featuring Datuk Rajpal Singh",
    "added": "2026-06-23"
  }
];
