const CONTACT_EMAIL = 'somoscreatecperiodico@gmail.com';

function initContacto() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const submitBtn = form.querySelector('[type="submit"]');

    submitBtn.disabled = true;
    alertBox.innerHTML = '<div class="alert alert-info">Enviando mensaje...</div>';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          _subject: `[El Audiovisual] ${subject}`,
          message,
          _replyto: email
        })
      });

      if (!response.ok) throw new Error('send failed');

      alertBox.innerHTML = '<div class="alert alert-success">✓ Mensaje enviado correctamente. Te responderemos pronto.</div>';
      form.reset();
    } catch {
      alertBox.innerHTML = `<div class="alert alert-error">No se pudo enviar el mensaje. Escríbenos a <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</div>`;
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => {
        alertBox.innerHTML = '';
      }, 6000);
    }
  });
}

document.addEventListener('pageReady', (e) => {
  if (e.detail.page === 'contacto') initContacto();
});
