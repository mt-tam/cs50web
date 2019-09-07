import csv
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def main():

    # Read CSV file
    f = open("books.csv")
    reader = csv.reader(f)

    # Skip file's header line
    [next(f) for _ in range(1)]

    number = 0;
    for isbn, title, author, year in reader:

        number += 1;
        # Import each book into the database
        db.execute("INSERT INTO books (isbn, title, author, year) VALUES (:isbn, :title, :author, :year)", {"isbn":isbn, "title":title, "author":author, "year":year})
        print(f"{number} books")

    # Commit database import
    db.commit()
    print (f"You successfully imported {number} books into the database.")

if __name__ == "__main__":
    main()