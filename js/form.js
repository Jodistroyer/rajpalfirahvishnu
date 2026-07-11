/**
 * form.js — Contact form validation and async submission.
 *
 * @param {string} selector   CSS selector for the <form> element
 * @param {string} endpoint   Formspree (or any POST) URL.
 *                            Pass '' to use the dev simulation fallback.
 */
export function initForm(selector, endpoint) {

  const form      = /** @type {HTMLFormElement|null} */ (document.querySelector(selector));
  const submitBtn = /** @type {HTMLButtonElement|null} */ (document.getElementById('form-submit'));
  const statusEl  = document.getElementById('form-status');

  if (!form) return;

  // ── Intent radio: "Send a Message" vs "Request a Callback" ───────────

  const radios       = form.querySelectorAll('input[name="intent"]');
  const messageField = document.getElementById('message-field');
  const phoneInput   = /** @type {HTMLInputElement|null} */ (document.getElementById('field-phone'));
  const phoneOptional = document.getElementById('phone-optional');
  const phoneReq      = document.getElementById('phone-req');
  const submitLabel   = submitBtn?.querySelector('.btn__label');
  const messageInput  = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('field-message'));

  function syncIntent() {
    const isCallback = getIntent() === 'callback';

    if (phoneInput)    phoneInput.required = isCallback;
    if (phoneOptional) phoneOptional.hidden = isCallback;
    if (phoneReq)      phoneReq.hidden = !isCallback;
    if (messageInput)  messageInput.required = !isCallback;

    if (submitLabel) {
      submitLabel.textContent = isCallback ? 'Request a Callback' : 'Send Message';
    }
  }

  function getIntent() {
    return form.querySelector('input[name="intent"]:checked')?.value ?? 'message';
  }

  radios.forEach(r => r.addEventListener('change', syncIntent));
  syncIntent(); // Apply initial state

  // ── Validators ────────────────────────────────────────────────────────

  const validators = {
    'field-name': v =>
      v.trim().length >= 2 ? null : 'Please enter your full name.',

    'field-email': v =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? null
        : 'Please enter a valid email address.',

    'field-phone': v => {
      if (!phoneInput?.required) return null;
      return /^[\d\s+\-().]{7,20}$/.test(v.trim())
        ? null
        : 'Please enter a valid phone number.';
    },

    'field-message': v => {
      if (!messageInput?.required) return null;
      return v.trim().length >= 10
        ? null
        : 'Please describe your matter briefly (at least 10 characters).';
    },
  };

  function validateField(input) {
    const fn    = validators[input.id];
    if (!fn) return true;
    const error = fn(input.value);
    const errEl = document.getElementById(`error-${input.id.replace('field-', '')}`);
    input.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (errEl) errEl.textContent = error ?? '';
    return !error;
  }

  // Validate on blur; clear error live once field becomes valid
  Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  // ── Submission ────────────────────────────────────────────────────────

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot
    const honeypot = /** @type {HTMLInputElement|null} */ (form.querySelector('input[name="_gotcha"]'));
    if (honeypot?.value) return;

    // Validate every watched field
    let allValid = true;
    Object.keys(validators).forEach(id => {
      const input = document.getElementById(id);
      if (input && !validateField(input)) allValid = false;
    });

    if (!allValid) {
      const first = /** @type {HTMLElement|null} */ (form.querySelector('[aria-invalid="true"]'));
      first?.focus();
      return;
    }

    setLoading(true);

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // Dev simulation: artificial delay
        await delay(900);
      }

      showStatus('success',
        '✓ Thank you — your message has been received. We will be in touch within 24 hours.');
      form.reset();
      syncIntent();

    } catch {
      showStatus('error',
        'Something went wrong. Please try again or contact us directly at rajpal.associates@gmail.com.');
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ───────────────────────────────────────────────────────────

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    if (submitLabel) {
      submitLabel.textContent = on
        ? 'Sending…'
        : (getIntent() === 'callback' ? 'Request a Callback' : 'Send Message');
    }
  }

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className   = `form__status form__status--${type}`;
    statusEl.hidden      = false;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-dismiss errors after 8 s
    if (type === 'error') setTimeout(() => { statusEl.hidden = true; }, 8000);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
