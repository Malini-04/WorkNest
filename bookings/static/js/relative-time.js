document.addEventListener('DOMContentLoaded', function () {
    function formatRelative(dateStr, timeStr) {
        const target = new Date(dateStr + 'T' + timeStr);
        const now = new Date();
        const diffMs = target - now;
        if (diffMs <= 0) return 'now';

        const diffMinutes = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMinutes < 60) return 'in ' + diffMinutes + ' min' + (diffMinutes === 1 ? '' : 's');
        if (diffHours < 24) return 'in ' + diffHours + ' hour' + (diffHours === 1 ? '' : 's');
        if (diffDays === 1) return 'tomorrow';
        return 'in ' + diffDays + ' days';
    }

    // relative labels on booking cards
    document.querySelectorAll('[data-relative-date][data-relative-time]').forEach(function (el) {
        el.textContent = formatRelative(el.dataset.relativeDate, el.dataset.relativeTime);
    });

    // live countdown on the "Next Up" hero widget
    const countdownEl = document.getElementById('nextUpCountdown');
    if (countdownEl) {
        function updateCountdown() {
            const target = new Date(countdownEl.dataset.date + 'T' + countdownEl.dataset.time);
            let diffMs = target - new Date();

            if (diffMs <= 0) {
                countdownEl.querySelector('.next-up-countdown-value').textContent = 'Now';
                countdownEl.querySelector('.next-up-countdown-label').textContent = '';
                return;
            }

            const hours = Math.floor(diffMs / 3600000);
            diffMs -= hours * 3600000;
            const minutes = Math.floor(diffMs / 60000);
            const valueText = hours > 0 ? (hours + 'h ' + minutes + 'm') : (minutes + 'm');

            countdownEl.querySelector('.next-up-countdown-value').textContent = valueText;
            countdownEl.querySelector('.next-up-countdown-label').textContent = 'until start';
        }

        updateCountdown();
        setInterval(updateCountdown, 30000);
    }
});