function initBookingList(csrfToken) {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.cancel-booking-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const card = btn.closest('.booking-card');
                const url = card.dataset.cancelUrl;

                nestConfirm(
                    'Cancel this booking? This cannot be undone once confirmed.',
                    function () {
                        card.style.transition = 'opacity 0.2s ease';
                        card.style.opacity = '0.35';
                        card.style.pointerEvents = 'none';

                        showUndoToast(
                            'Booking cancelled',
                            function () {
                                card.style.opacity = '';
                                card.style.pointerEvents = '';
                            },
                            function () {
                                const formData = new FormData();
                                formData.append('csrfmiddlewaretoken', csrfToken);
                                nestPostForm(url, formData, function () {
                                    card.remove();
                                }, function (data) {
                                    card.style.opacity = '';
                                    card.style.pointerEvents = '';
                                    showInlineAlert('danger', data.message || 'Could not cancel booking.');
                                });
                            },
                            5000
                        );
                    },
                    { title: 'Cancel Booking', confirmText: 'Yes, Cancel', confirmClass: 'btn-danger' }
                );
            });
        });
    });
}