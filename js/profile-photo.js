/**
 * profile-photo.js — Show initials when a profile or team headshot fails to load.
 */

export function initProfilePhotos() {
  document.querySelectorAll('.profile-sidebar__photo, .attorney-card__photo').forEach(img => {
    const showFallback = () => {
      const wrap = img.closest('.profile-sidebar__avatar, .attorney-card__media');
      if (wrap) wrap.classList.add(wrap.classList.contains('attorney-card__media') ? 'attorney-card__media--fallback' : 'profile-sidebar__avatar--fallback');
    };

    img.addEventListener('error', showFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    }
  });
}
