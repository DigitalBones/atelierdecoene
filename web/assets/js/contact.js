// Bind once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const button = document.querySelector('#contact-form-submit');
    const spinner = button ? button.querySelector('.fa-spinner') : null;
    const icon = button ? button.querySelector('.fa-paper-plane') : null;
    const status = document.querySelector('#form-status');

    form.addEventListener('submit', async function (ev) {
        ev.preventDefault();

        if (icon) icon.classList.add('d-none');
        if (spinner) spinner.classList.remove('d-none');

        try {
            const formData = new FormData(form);

            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw { responseJSON: data };
            }

            if (icon) icon.classList.remove('d-none');
            if (spinner) spinner.classList.add('d-none');

            if (status) {
                status.innerHTML = `<div class="alert alert-success bg-white text-secondary">
					<strong><i class="fa fa-check" style="color: green;"></i>&nbsp;&nbsp;${data.message ?? 'Bericht verzonden'}</strong>
				</div>`;
            }

            // Clear all relevant fields from the contact form
            const clearSelectors = [
                'input[name="fromName"]',
                'input[name="fromEmail"]',
                'input[name="message[Subject]"]',
                'textarea[name="message[body]"]',
                'input[name="message[Adres]"]',
                'input[name="message[Postcode]"]',
                'input[name="message[Gemeente]"]',
                'input[name="message[Telefoon]"]'
            ];
            clearSelectors.forEach((sel) => {
                const el = form.querySelector(sel);
                if (el) el.value = '';
            });

            // Change button state
            if (button) {
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');
                button.innerHTML = '<i class="fa fa-check"></i>&nbsp;&nbsp;Bericht verzonden';
            }

            // Revert button after 5 seconds and clear status
            setTimeout(function () {
                if (button) {
                    button.classList.remove('btn-success');
                    button.classList.add('btn-primary');
                    button.innerHTML = '<i class="fa fa-paper-plane"></i> <i class="fa fa-spinner fa-spin d-none"></i>&nbsp;&nbsp;Bericht versturen';
                }
                if (status) status.innerHTML = '';
            }, 5000);
        } catch (err) {
            if (icon) icon.classList.remove('d-none');
            if (spinner) spinner.classList.add('d-none');

            const message =
                (err && err.responseJSON && err.responseJSON.message) ||
                'Er is een fout opgetreden. Probeer het later opnieuw.';

            if (status) {
                status.innerHTML = `<div class="alert alert-danger">
					<strong>${message}</strong>
				</div>`;
            }
        }
    });
});