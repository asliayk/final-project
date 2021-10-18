To setup your development environment:

1. Create virtual environment `virtualenv venv`

2. Activate your virtual environment with `venv\Scripts\activate`

3. `cd project` and install requirements with `pip install -r requirements.txt`

4. Place `.env` file under this path: `final\project`

5. Create migration files `python manage.py makemigrations`

6. Handle database migrations if any `python manage.py migrate`

7. Run the server with `python manage.py runserver`

8. Open another terminal for frontend and run `cd project/frontend`

9. Install node modules with `npm install`

10. Run with `npm run dev`
