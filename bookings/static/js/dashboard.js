document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('roomSearchInput');
    const capacityFilter = document.getElementById('capacityFilter');
    const cards = document.querySelectorAll('#roomGrid .room-card');
    const noMatch = document.getElementById('noRoomsMatch');

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        const minCapacity = parseInt(capacityFilter.value, 10);
        let visibleCount = 0;

        cards.forEach(function (card) {
            const name = card.dataset.name || '';
            const capacity = parseInt(card.dataset.capacity, 10) || 0;
            const show = name.includes(query) && capacity >= minCapacity;
            card.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        noMatch.style.display = visibleCount === 0 ? '' : 'none';
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (capacityFilter) capacityFilter.addEventListener('change', applyFilters);
});
