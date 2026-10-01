document.addEventListener('DOMContentLoaded', function () {

    const datePicker = document.getElementById('calendar-datepicker');

    if (datePicker) {
        datePicker.addEventListener('change', function () {
            if (this.value) {
                window.location.href = '?date=' + this.value;
            }
        });
    }

    const scrollBox = document.getElementById('calendar-scroll');
    const roomCol = document.querySelector('.room-col');
    const VISIBLE_SLOTS = 18; // 9am to 6pm = 9 hours * 2 slots/hr

    function applySlotWidth() {
        if (!scrollBox || !roomCol) return;

        const boxWidth = scrollBox.clientWidth;
        const roomColWidth = roomCol.getBoundingClientRect().width;
        const available = boxWidth - roomColWidth;
        const slotWidth = Math.max(available / (VISIBLE_SLOTS + 1), 48); // +1 accounts for boundary col

        document.documentElement.style.setProperty('--slot-width', slotWidth + 'px');
    }

    function scrollToNineAM() {
        const target = document.querySelector('[data-hour="9"]');
        if (target) {
            target.scrollIntoView({ block: 'nearest', inline: 'start' });
        }
    }

    applySlotWidth();
    scrollToNineAM();

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            applySlotWidth();
            scrollToNineAM();
        }, 200);
    });

});