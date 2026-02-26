# PostNest

Social Media webapp using React (Vite) and Django (DRF).

This is my second full-stack web application, It was developed as a learning project.

## Features
- Sign in, Signup, Logout.
- Cookies-based Authentication.
- Public Profile view.
- Create and Delete Posts with text and pictures.
- Edit Bio, Profile Picture, and the visibility of your posts.
- Like, Save posts.
- Follow, unFollow users.

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/5674e509-1d95-478b-b3ee-348acad09413" width="800">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4e97ee3b-8c8b-45b8-a22d-a3438f3ec8d6" width="800">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c9a0d7c0-1162-4696-b09b-164245ed1479" width="800">
</p>


## **Installation**

- git clone https://github.com/cmdKun/PostNest.git
- cd PostNest

### Backend

```
cd backend
py -m venv env

# Windows
env/Scripts/Activate

# Linux / Mac
source env/bin/activate

cd postnest
(venv) pip install -r requirements.txt
(venv) python manage.py makemigrations
(venv) python manage.py migrate
(venv) python manage.py createsuperuser
```

Add env variables to “.env.example’ then rename it to “.env”

then run the server 

```
(venv) python manage.py runserver 0.0.0.0:8000
```

### Frontend

```
cd frontend
npm install
npm run dev
```

