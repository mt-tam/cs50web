import os, requests

from flask import Flask, session, render_template, request, jsonify
from flask_session import Session
from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker

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


@app.route("/")
def index():
    # Retrieve all books
    books = db.execute("SELECT isbn, title, author, year FROM books LIMIT 20").fetchall()

    # Render a list of all books
    return render_template("index.html", books=books)


@app.route("/add_review", methods=["POST"])
def add_review():
    rating = request.form.get("rating")
    review = request.form.get("review")

    # Get book-id
    isbn = request.form.get("isbn")
    book_id = db.execute("SELECT book_id FROM books WHERE isbn=:isbn", {"isbn":isbn})

    print(f"Your rating for book #{book_id} with ISBN:{isbn} is {rating} and your review is \n {review}")

    # Get user-id from session

    # Get current date and time

    # Add rating & review to database


    return render_template("index.html")


@app.route("/search")
def search():
    keyword = int(request.args.get("keyword"))

    """
    # Find books in database (currently: by YEAR, should be: TITLE, IBSN, AUTHOR)
    books = db.execute("SELECT * FROM books WHERE year= :keyword ", {"keyword":keyword}).fetchall()
    return render_template("index.html", books=books)
    """

    # Based on title
    keyword = request.args.get("keyword")
    keyword = "%" + keyword + "%"
    print(keyword)
    books = db.execute("SELECT * FROM books WHERE LOWER(title) LIKE :keyword", {"keyword":keyword.lower()}).fetchall()
    return render_template("index.html", books=books)


# Display book page
@app.route("/book")
def book():
    isbn = request.args.get("isbn")

    # Find book in database
    book = db.execute("SELECT isbn, title, author, year FROM books WHERE isbn = :isbn", {"isbn":isbn}).fetchone()

    # Retrieve ratings count and average rating from Goodreads API
    res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": "lWS8cyNZMHofTipApJbzw", "isbns": isbn})

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
    return render_template("book.html", book=book)


# API to send book info
@app.route("/api/<string:isbn>")
def get_book(isbn):

    # Find book in database
    book = db.execute("SELECT isbn, title, author, year FROM books WHERE isbn = :isbn", {"isbn":isbn}).fetchone()

    # Retrieve ratings count and average rating from Goodreads API
    res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": "lWS8cyNZMHofTipApJbzw", "isbns": isbn})

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
