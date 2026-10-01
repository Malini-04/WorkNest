// shared helpers used across pages: confirm modal, AJAX post, inline alerts, undo toast

function nestConfirm(message, onConfirm, options) {
    options = options || {};
    const modalEl = document.getElementById('confirmModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById('confirmModalTitle').textContent = options.title || 'Please Confirm';
    document.getElementById('confirmModalBody').textContent = message;

    const isDanger = (options.confirmClass || '').includes('danger');
    const iconEl = document.getElementById('confirmModalIcon');
    iconEl.classList.toggle('icon-danger', isDanger);
    iconEl.innerHTML = isDanger
        ? '<i class="bi bi-exclamation-triangle"></i>'
        : '<i class="bi bi-check-circle"></i>';

    const oldBtn = document.getElementById('confirmModalYesBtn');
    oldBtn.className = 'btn px-4 ' + (options.confirmClass || 'btn-primary');
    oldBtn.textContent = options.confirmText || 'Yes';

    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    newBtn.addEventListener('click', function () {
        modal.hide();
        onConfirm();
    });

    modal.show();
}

function nestPostForm(url, formData, onSuccess, onError) {
    fetch(url, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) { onSuccess(data); } else { onError(data); }
    })
    .catch(function () {
        onError({ message: 'Something went wrong. Please try again.' });
    });
}

function showInlineAlert(type, message) {
    const wrap = document.createElement('div');
    wrap.className = 'alert alert-' + type + ' alert-dismissible fade show';
    wrap.setAttribute('role', 'alert');
    wrap.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';

    let container = document.querySelector('.messages-wrap');
    if (!container) {
        container = document.createElement('div');
        container.className = 'messages-wrap';
        document.body.appendChild(container);
    }
    container.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 4000);
}

function showUndoToast(message, onUndo, onExpire, duration) {
    duration = duration || 5000;
    let remaining = Math.ceil(duration / 1000);

    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.innerHTML =
        '<span class="undo-toast-msg">' + message + ' <span class="undo-toast-count">(' + remaining + ')</span></span>' +
        '<button type="button" class="btn btn-sm btn-outline-light undo-toast-btn">Undo</button>';

    let container = document.querySelector('.messages-wrap');
    if (!container) {
        container = document.createElement('div');
        container.className = 'messages-wrap';
        document.body.appendChild(container);
    }
    container.appendChild(toast);

    const countEl = toast.querySelector('.undo-toast-count');
    const intervalId = setInterval(function () {
        remaining -= 1;
        if (countEl) countEl.textContent = '(' + Math.max(remaining, 0) + ')';
    }, 1000);

    const expireTimer = setTimeout(function () {
        clearInterval(intervalId);
        toast.remove();
        onExpire();
    }, duration);

    toast.querySelector('.undo-toast-btn').addEventListener('click', function () {
        clearTimeout(expireTimer);
        clearInterval(intervalId);
        toast.remove();
        onUndo();
    });
}
