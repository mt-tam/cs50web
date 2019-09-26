# --------------- IMPORT MODULES --------------- #

import os
import requests
from datetime import datetime
from flask import Flask, url_for, session, render_template, request, jsonify, redirect
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


# --------------- LANDING PAGE --------------- #

@app.route("/")
def landing():
    return render_template("landing.html")


# --------------- REGISTER --------------- #

@app.route("/register", methods=["GET", "POST"])
def register():

    # Show the Register page
    if request.method == "GET":
        return render_template("register.html")
    
    # Send back the Register form data
    else:
        # Save email and password
        email = request.form.get("email")
        password = request.form.get("password")

        # Hash password
        hash_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

        # Check if user already exists (if yes show warning)
        user_exists = db.execute("SELECT * FROM users WHERE email = :email", {"email":email}).fetchone()
        
        # Give error message back to user
        if user_exists:
            error_message = "Error: User is already in database. Please try again."
            return render_template("register.html", error=error_message)
        
        # Create user in database, create new session and re-direct user to list
        else:
            new_user = db.execute("INSERT INTO users (email, password) VALUES (:email, :password)", {"email": email, "password": password})
            print(new_user)
            #session["user_id"] = new_user["id"]
            return redirect("/list")


# --------------- LOGIN --------------- #

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    else:
        # Save email and password from Login form
        email = request.form.get("email")
        password = request.form.get("password")
        
        # Check if credentials are correct
        user_exists = db.execute("SELECT * FROM users WHERE email = :email;", {"email": email}).fetchone()
        
        if not user_exists:
            # If wrong email, show warning to user
            error_message = "Error: Email or password are not correct. Please try again."
            return render_template("login.html", error=error_message)

        else:
            # REMOVE THIS LINE when bug on REGISTER is fixed
            hash_password = generate_password_hash(user_exists["password"])

            # Check if password is correct
            password_correct = check_password_hash(hash_password, password)
            
            # If wrong password, show warning to user
            if not password_correct:
                error_message = "Error: Email or password are not correct. Please try again."
                return render_template("login.html", error=error_message)
            
            # If correct password, create new session and redirect to list
            else:
                session["user_id"] = user_exists["id"]
                return redirect("/list")


# --------------- LOGOUT --------------- #

@app.route("/logout")
def logout():
    session["user_id"] = None
    return redirect ("/")


# --------------- SHOW BOOK LIST --------------- #

@app.route("/list")
def list():

    # If user is not logged in, redirect to login page
    if not session["user_id"]:
        error_message = "You must be logged in to access that page."
        return render_template("login.html", error=error_message)

    # Retrieve all books (limit = 20 books)
    books = db.execute("SELECT isbn, title, author, year FROM books LIMIT 20").fetchall()

    # Render a list of all books
    return render_template("list.html", books=books, user_id=session["user_id"], search_true=False)


# --------------- SUBMIT REVIEW --------------- #

@app.route("/add_review", methods=["POST"])
def add_review():

    # If user is not logged in, redirect to login page
    if not session["user_id"]: 
        error_message = "You must be logged in to access that page."
        return render_template("login.html", error=error_message)
    
    # Else, save user's rating and review
    rating = request.form.get("rating")
    review = request.form.get("review")

    # Get book-id
    isbn = request.form.get("isbn")
    book_id = db.execute("SELECT id FROM books WHERE isbn=:isbn", {"isbn": isbn}).fetchone()
    
    # Get current date and time
    now = datetime.now()

    print(f"Your rating was created on {now} for book #{book_id['id']} with ISBN:{isbn} is {rating} and your review is // {review} //")
    
    # Add rating & review to database
    db.execute("INSERT INTO reviews (book_id, user_id, rating, review, created_on) VALUES (:book_id, :user_id, :rating, :review, :created_on)", {"book_id" : book_id["id"], "user_id" : session["user_id"], "rating" : rating, "review" : review, "created_on": now})
    
    # Reload page with review
    return redirect(url_for('book') + "?isbn=" + isbn)


# --------------- SEARCH BOOKS --------------- #

@app.route("/search")
def search():
    # Search based on title, isbn or author
    keyword = request.args.get("keyword")
    
    # Format the search keyword (except if numeric)
    if not keyword.isnumeric():
        keyword = "%" + keyword + "%"

    # Find similar books in database
    books = db.execute("SELECT * FROM books WHERE LOWER(title) LIKE :keyword OR LOWER(author) LIKE :keyword OR isbn=:keyword",
                       {"keyword": keyword.lower()}).fetchall()

    return render_template("list.html", books=books, search_true=True, user_id=session["user_id"])


# --------------- BOOK DETAILS --------------- #

# Display book page
@app.route("/book")
def book():
    isbn = request.args.get("isbn")

    # Find book in database
    book = db.execute("SELECT id, isbn, title, author, year FROM books WHERE isbn = :isbn", {
                      "isbn": isbn}).fetchone()

    # Get book reviews from database
    book_reviews = db.execute("SELECT user_id, review, rating, created_on FROM reviews WHERE book_id = :book_id", {"book_id": book["id"]}).fetchall()
    print(book_reviews)

    # Check whether user already has submitted a review
    user_id = session["user_id"]
    review_exists = False
    for review in book_reviews:
        if user_id == review["user_id"]:
            review_exists = True

    # Retrieve ratings count and average rating from Goodreads API
    res = requests.get("https://www.goodreads.com/book/review_counts.json",
                       params={"key": "lWS8cyNZMHofTipApJbzw", "isbns": isbn})

    # Parse JSON response
    ratings_count = res.json()["books"][0]["work_ratings_count"]
    average_rating = float(res.json()["books"][0]["average_rating"])

    # Group all information for display
    book = {
        "title": book.title,
        "author": book.author,
        "year": book.year,
        "isbn": book.isbn,
        "review_count": ratings_count,
        "average_score": average_rating,
    }

    # Display book information on website
    return render_template("book.html", book=book, reviews=book_reviews, review_exists=review_exists, user_id=user_id)


# --------------- API: BOOK INFO --------------- #

# API to send book info
@app.route("/api/<string:isbn>")
def get_book(isbn):

    # Find book in database
    book = db.execute("SELECT isbn, title, author, year FROM books WHERE isbn = :isbn", {
                      "isbn": isbn}).fetchone()

    if not book: 
        return jsonify(404)

    # Retrieve ratings count and average rating from Goodreads API
    res = requests.get("https://www.goodreads.com/book/review_counts.json",
                       params={"key": "lWS8cyNZMHofTipApJbzw", "isbns": isbn})

    # Parse JSON response
    ratings_count = res.json()["books"][0]["work_ratings_count"]
    average_rating = float(res.json()["books"][0]["average_rating"])

    # Return book values as JSON
    return jsonify({
        "title": book.title,
        "author": book.author,
        "year": book.year,
        "isbn": book.isbn,
        "review_count": ratings_count,
        "average_score": average_rating,
    })
