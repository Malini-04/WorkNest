document.addEventListener('DOMContentLoaded', function () {
    const SLOT_MINUTES = 30;
    const TOTAL_SLOTS = 48;
    const VISIBLE_START_HOUR = 9;
    const VISIBLE_HOURS = 9; // 9 AM to 6 PM

    const timeHeader = document.getElementById('timeHeader');
    const timeGrid = document.getElementById('timeGrid');
    const wrapper = document.getElementById('timelineWrapper');
    const bookingDetails = document.getElementById('bookingDetails');
    const bookButton = document.getElementById('bookButton');
    const startInput = document.getElementById('id_start_time');
    const endInput = document.getElementById('id_end_time');
    const dateInput = document.getElementById('id_date');

    if (!timeGrid) return;

    const SLOT_WIDTH = Math.floor(wrapper.parentElement.clientWidth / (VISIBLE_HOURS * 2));
    document.documentElement.style.setProperty('--slot-width', SLOT_WIDTH + 'px');

    for (let h = 0; h < 24; h++) {
        const label = document.createElement('div');
        label.className = 'time-label';
        const ampm = h < 12 ? 'AM' : 'PM';
        let displayHour = h % 12; if (displayHour === 0) displayHour = 12;
        label.textContent = displayHour + ' ' + ampm;
        timeHeader.appendChild(label);
    }

    const slotEls = [];
    for (let s = 0; s < TOTAL_SLOTS; s++) {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        timeGrid.appendChild(slot);
        slotEls.push(slot);
    }

    /* =========================================================
       DETERMINE WHICH SLOTS ARE "PAST" (only relevant if the
       page's date is today)
       ========================================================= */
    function getPageDateStr() {
        if (dateInput && dateInput.value) return dateInput.value;
        if (wrapper.dataset.date) return wrapper.dataset.date;
        return null;
    }

    function todayStr() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    let currentBlockedUpTo = -1; // slot index; slots with index < this are blocked
    const pageDate = getPageDateStr();

    if (pageDate && pageDate === todayStr()) {
        const now = new Date();
        currentBlockedUpTo = now.getHours() * 2 + (now.getMinutes() >= 30 ? 1 : 0);
        // if we're partway through a slot, block that slot too (round up)
        if (now.getMinutes() % 30 !== 0) {
            currentBlockedUpTo += 1;
        }
    }

    if (currentBlockedUpTo > 0) {
        for (let s = 0; s < Math.min(currentBlockedUpTo, TOTAL_SLOTS); s++) {
            slotEls[s].classList.add('slot-blocked');
        }
    }

    function isSlotPast(slot) {
        return currentBlockedUpTo > 0 && slot < currentBlockedUpTo;
    }

    function slotToTime(slot) {
        const totalMinutes = slot * SLOT_MINUTES;
        let hour = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour % 12; if (displayHour === 0) displayHour = 12;
        return displayHour + ':' + String(minutes).padStart(2, '0') + ' ' + ampm;
    }
    function slotToTimeValue(slot) {
        const totalMinutes = slot * SLOT_MINUTES;
        const hour = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return String(hour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    }
    function getOtherBookings() {
        return Array.from(document.querySelectorAll('.existing-booking')).map(function (el) {
            return { start: parseInt(el.dataset.start, 10), end: parseInt(el.dataset.end, 10) };
        });
    }

    document.querySelectorAll('.existing-booking').forEach(function (el) {
        const start = parseInt(el.dataset.start, 10);
        const end = parseInt(el.dataset.end, 10);
        el.style.left = (start * SLOT_WIDTH) + 'px';
        el.style.width = ((end - start) * SLOT_WIDTH) + 'px';
    });

    function overlapsOthers(first, last) {
        return getOtherBookings().some(function (b) {
            return first < b.end && last >= b.start;
        });
    }
    function overlapsPast(first, last) {
        return currentBlockedUpTo > 0 && first < currentBlockedUpTo;
    }

    const isEditMode = wrapper.dataset.initialStart !== undefined && wrapper.dataset.initialStart !== '';

    /* =========================================================
       EDIT MODE — draggable / resizable GREEN block
       ========================================================= */
    if (isEditMode) {
        let first = parseInt(wrapper.dataset.initialStart, 10);
        let last = parseInt(wrapper.dataset.initialEnd, 10) - 1;

        const block = document.createElement('div');
        block.className = 'my-booking';
        block.innerHTML =
            '<div class="resize-handle resize-handle-left"></div>' +
            '<div class="my-booking-label"></div>' +
            '<div class="resize-handle resize-handle-right"></div>';
        timeGrid.appendChild(block);

        const label = block.querySelector('.my-booking-label');
        const leftHandle = block.querySelector('.resize-handle-left');
        const rightHandle = block.querySelector('.resize-handle-right');

        function clamp(v) { return Math.max(0, Math.min(TOTAL_SLOTS - 1, v)); }

        function render() {
            block.style.left = (first * SLOT_WIDTH) + 'px';
            block.style.width = ((last - first + 1) * SLOT_WIDTH) + 'px';
            const startTime = slotToTime(first);
            const endTime = slotToTime(last + 1);
            label.textContent = startTime + ' - ' + endTime;
            bookingDetails.innerHTML = '<strong>Your booking:</strong> ' + startTime + ' - ' + endTime;
            startInput.value = slotToTimeValue(first);
            endInput.value = slotToTimeValue(last + 1);
        }

        render();
        wrapper.scrollLeft = Math.max(0, (first - 2) * SLOT_WIDTH);

        let dragType = null;
        let dragStartX = 0;
        let dragFirst = 0, dragLast = 0;

        function startDrag(type) {
            return function (e) {
                e.preventDefault();
                dragType = type;
                dragStartX = e.clientX;
                dragFirst = first;
                dragLast = last;
            };
        }

        block.addEventListener('mousedown', function (e) {
            if (e.target === leftHandle || e.target === rightHandle) return;
            startDrag('move')(e);
        });
        leftHandle.addEventListener('mousedown', startDrag('left'));
        rightHandle.addEventListener('mousedown', startDrag('right'));

        document.addEventListener('mousemove', function (e) {
            if (!dragType) return;
            const deltaSlots = Math.round((e.clientX - dragStartX) / SLOT_WIDTH);

            if (dragType === 'move') {
                const duration = dragLast - dragFirst;
                let newFirst = clamp(dragFirst + deltaSlots);
                let newLast = newFirst + duration;
                if (newLast > TOTAL_SLOTS - 1) {
                    newLast = TOTAL_SLOTS - 1;
                    newFirst = newLast - duration;
                }
                if (!overlapsOthers(newFirst, newLast) && !overlapsPast(newFirst, newLast)) {
                    first = newFirst; last = newLast; render();
                }
            } else if (dragType === 'left') {
                let newFirst = clamp(dragFirst + deltaSlots);
                if (newFirst > last) newFirst = last;
                if (!overlapsOthers(newFirst, last) && !overlapsPast(newFirst, last)) { first = newFirst; render(); }
            } else if (dragType === 'right') {
                let newLast = clamp(dragLast + deltaSlots);
                if (newLast < first) newLast = first;
                if (!overlapsOthers(first, newLast)) { last = newLast; render(); }
            }
        });

        document.addEventListener('mouseup', function () { dragType = null; });

        return;
    }

    /* =========================================================
       CREATE MODE — drag-to-select TEAL selection
       ========================================================= */
    const selection = document.getElementById('selection');
    const selectionText = document.getElementById('selectionText');

    function isSlotBooked(slot) {
        return getOtherBookings().some(function (b) {
            return slot >= b.start && slot < b.end;
        }) || isSlotPast(slot);
    }

    let isDragging = false, startSlot = null, endSlot = null;

    function getSlotFromMouse(event) {
        const rect = timeGrid.getBoundingClientRect();
        const x = event.clientX - rect.left;
        let slot = Math.floor(x / SLOT_WIDTH);
        return Math.max(0, Math.min(TOTAL_SLOTS - 1, slot));
    }

    function updateSelection() {
        if (startSlot === null || endSlot === null) return;
        const first = Math.min(startSlot, endSlot);
        const last = Math.max(startSlot, endSlot);

        for (let s = first; s <= last; s++) {
            if (isSlotBooked(s)) {
                const reason = isSlotPast(s)
                    ? '<span class="text-danger">That time has already passed. Pick a future slot.</span>'
                    : '<span class="text-danger">That range overlaps an existing booking. Pick a free slot.</span>';
                bookingDetails.innerHTML = reason;
                if (bookButton) bookButton.disabled = true;
                selection.style.display = 'none';
                return;
            }
        }

        selection.style.left = (first * SLOT_WIDTH) + 'px';
        selection.style.width = ((last - first + 1) * SLOT_WIDTH) + 'px';
        selection.style.display = 'block';

        const startTime = slotToTime(first);
        const endTime = slotToTime(last + 1);
        selectionText.textContent = startTime + ' - ' + endTime;
        bookingDetails.innerHTML = '<strong>Selected:</strong> ' + startTime + ' - ' + endTime;

        startInput.value = slotToTimeValue(first);
        endInput.value = slotToTimeValue(last + 1);
        if (bookButton) bookButton.disabled = false;
    }

    if (currentBlockedUpTo >= VISIBLE_START_HOUR * 2) {
        wrapper.scrollLeft = Math.max(0, (currentBlockedUpTo - 1) * SLOT_WIDTH);
    } else {
        wrapper.scrollLeft = VISIBLE_START_HOUR * 2 * SLOT_WIDTH;
    }
    wrapper.style.maxWidth = (9 * 2 * SLOT_WIDTH) + 'px';

    timeGrid.addEventListener('mousedown', function (e) {
        const slot = getSlotFromMouse(e);
        if (isSlotPast(slot)) return; // can't start a drag on a past slot
        isDragging = true;
        startSlot = slot;
        endSlot = startSlot;
        updateSelection();
    });
    timeGrid.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        endSlot = getSlotFromMouse(e);
        updateSelection();
    });
    document.addEventListener('mouseup', function () { isDragging = false; });
});