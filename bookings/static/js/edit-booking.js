function initEditBooking(bookingsUrl) {
    document.addEventListener('DOMContentLoaded', function () {
        const editForm = document.getElementById('editBookingForm');
        if (!editForm) return;

        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const startVal = document.getElementById('id_start_time').value;
            const endVal = document.getElementById('id_end_time').value;

            nestConfirm(
                'Save changes to this booking? New time: ' + startVal + ' - ' + endVal,
                function () {
                    const formData = new FormData(editForm);
                    nestPostForm(window.location.href, formData, function (data) {
                        showInlineAlert('success', data.message);
                        setTimeout(function () { window.location.href = bookingsUrl; }, 900);
                    }, function (data) {
                        showInlineAlert('danger', data.message || 'Could not update booking.');
                    });
                },
                { title: 'Confirm Changes', confirmText: 'Yes, Save', confirmClass: 'btn-primary' }
            );
        });
    });
}