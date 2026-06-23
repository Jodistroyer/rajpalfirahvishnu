/**
 * profile-photo.js — Show initials when a profile headshot fails to load.
 */

export function initProfilePhotos() {
  document.querySelectorAll('.profile-sidebar__photo').forEach(img => {
    const showFallback = () => {
      const wrap = img.closest('.profile-sidebar__avatar');
      if (wrap) wrap.classList.add('profile-sidebar__avatar--fallback');
    };

    img.addEventListener('error', showFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    }
  });
}
