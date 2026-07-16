/** Cross-links between team profile pages (Our People / Pasukan Kami). */

const PEOPLE = [
  { slug: 'rajpal-singh', name: "Dato' Rajpal Singh" },
  { slug: 'vishnu-kumar', name: 'Vishnu Kumar' },
  { slug: 'tiew-poh-nee', name: 'Tiew Poh Nee' },
  { slug: 'siti-anis', name: 'Siti Anis' },
  { slug: 'mariappan-manikam', name: 'Mariappan' },
];

export function initProfilePeopleNav() {
  const nav = document.querySelector('[data-people-nav]');
  if (!nav) return;

  const match = window.location.pathname.match(/\/people\/([^/]+)/);
  const currentSlug = match?.[1];

  const links = PEOPLE.map(({ slug, name }) => {
    if (slug === currentSlug) {
      return `<span aria-current="page">${name}</span>`;
    }
    return `<a href="../${slug}/">${name}</a>`;
  }).join(' · ');

  nav.innerHTML = `<p class="profile-page__people-links">${links}</p>`;
}
