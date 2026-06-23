Add one headshot per lawyer (square JPG, at least 400×400 px):

  rajpal-singh.jpg
  vishnu-kumar.jpg
  siti-anis.jpg
  tiew-poh-nee.jpg

Used on profile pages, Open Graph previews, Twitter cards, and JSON-LD.

Until photos are added, profiles show initials as a fallback.

After adding photos, no code changes are needed.

SEO data is maintained in data/people.json.
Regenerate meta tags and llms.txt with:

  node scripts/generate-people-seo.mjs
  node scripts/generate-people-seo.mjs --llms-only
