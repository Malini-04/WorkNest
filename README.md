# WorkNest — Workplace Meeting & Room Management

A Django + MySQL web app for booking internal conference/meeting rooms. Built as a final assessment project.

## Features

- Login-protected dashboard listing all meeting rooms
- Book a room for a specific date and time slot
- Calendar view showing all rooms' bookings in 30-minute slots
- Per-room detail page with its own booking timeline
- Validation: no past-date bookings, no double-booking a room, booking cap per user, bookings limited to 90 days ahead
- Email notifications on booking creation, edit, and cancellation
- Room images and amenities (Wifi, Projector, Whiteboard, LED/Smart TV Display, Video Conferencing System)

## Tech Stack

- Python / Django 4.2
- MySQL
- Bootstrap, vanilla JS, CSS

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Malini-04/WorkNest.git
cd WorkNest
```

### 2. Create a virtual environment
```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
pip install python-dotenv
```

### 4. Create your `.env` file
In the same folder as `manage.py`, create a `.env` file with:
```
SECRET_KEY=your-django-secret-key
DB_PASSWORD=your-mysql-password
EMAIL_HOST_PASSWORD=your-gmail-app-password
```

### 5. Create the MySQL database
```sql
CREATE DATABASE worknest_db CHARACTER SET utf8mb4;
```

### 6. Load the database
Either run migrations for a fresh/empty database:
```bash
python manage.py migrate
```
Or restore the included data dump:
```bash
mysql -u root -p worknest_db < worknest_db.sql
```

### 7. Create a superuser (only needed if you used `migrate`, not the dump)
```bash
python manage.py createsuperuser
```

### 8. Run the server
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000/`

## Notes

- `room_images/` contains the images referenced by seeded rooms.
- `.env` is required and is not included in this repo — see Setup step 4.
