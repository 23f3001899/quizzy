from flask import Flask, render_template, request, redirect, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# ---------------- SECURITY CONFIG ----------------
# Secret key from environment variable — never hardcode this!
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(32)

# Session expires after 30 minutes of inactivity
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///quiz.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# CSRF protection (covers all POST forms automatically)
app.config["WTF_CSRF_TIME_LIMIT"] = 3600  # CSRF token valid for 1 hour

db = SQLAlchemy(app)
csrf = CSRFProtect(app)

# Rate limiter — blocks brute-force login attempts
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],          # No global limit
    storage_uri="memory://"
)


# ---------------- USER TABLE ----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


# ---------------- RESULTS TABLE ----------------
class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    topic = db.Column(db.String(50), nullable=False, default="Unknown")
    difficulty = db.Column(db.String(20), nullable=False, default="medium")
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    date_taken = db.Column(db.String(100), nullable=False)


# ---------------- SESSION HELPER ----------------
def make_session_permanent():
    """Mark session as permanent so PERMANENT_SESSION_LIFETIME applies."""
    session.permanent = True


@app.route("/")
def home():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("index.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            flash("Email already registered")
            return redirect("/signup")

        hashed_password = generate_password_hash(password)

        new_user = User(
            name=name,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful! Please log in.")
        return redirect("/login")

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
@limiter.limit("10 per minute")   # Max 10 login attempts per minute per IP
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            session.clear()          # Clear any old session data first
            make_session_permanent()
            session["user_id"] = user.id
            session["user_name"] = user.name
            return redirect("/")

        flash("Invalid email or password")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


@app.route("/submit-score", methods=["POST"])
@csrf.exempt   # This is a JS fetch() API call — uses JSON, not a form
def submit_score():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401

    data = request.get_json()
    if not data or "score" not in data or "total_questions" not in data:
        return {"error": "Invalid data"}, 400

    score = int(data["score"])
    total_questions = int(data["total_questions"])
    topic = str(data.get("topic", "Unknown"))
    difficulty = str(data.get("difficulty", "medium"))

    result = Result(
        user_id=session["user_id"],
        topic=topic,
        difficulty=difficulty,
        score=score,
        total_questions=total_questions,
        date_taken=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    db.session.add(result)
    db.session.commit()

    return {"message": "Score saved successfully"}


@app.route("/history")
def history():
    if "user_id" not in session:
        return redirect("/login")

    user_results = Result.query.filter_by(
        user_id=session["user_id"]
    ).order_by(Result.id.desc()).all()

    return render_template(
        "history.html",
        results=user_results,
        user_name=session["user_name"]
    )


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=False) # Never run debug=True in production!
