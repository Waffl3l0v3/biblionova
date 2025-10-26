from app import get_db
import traceback

def addBook(bookID, title, genre, fname, lname, year, price, country, stock):
    db = get_db()
    cur = db.cursor()
    try:
        # Publisher
        cur.execute("SELECT publisherID FROM Publishers WHERE country=%s", (country,))
        publisher = cur.fetchone()
        if not publisher:
            cur.execute("INSERT INTO Publishers(country) VALUES (%s)", (country,))
            cur.execute("SELECT publisherID FROM Publishers WHERE country=%s", (country,))
            publisher = cur.fetchone()

        # Author
        cur.execute("SELECT authorID FROM Authors WHERE firstName=%s AND lastName=%s", (fname,lname))
        author = cur.fetchone()
        if not author:
            cur.execute("INSERT INTO Authors(firstName,lastName) VALUES (%s,%s)", (fname,lname))
            cur.execute("SELECT authorID FROM Authors WHERE firstName=%s AND lastName=%s", (fname,lname))
            author = cur.fetchone()

        # Insert Book
        cur.execute("""
            INSERT INTO Books(bookID,authorID,publisherID,title,genre,publicationYear,price)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (bookID, author[0], publisher[0], title, genre, year, price))

        # Insert Inventory
        cur.execute("INSERT INTO Inventory(bookID,totalStock,soldStock) VALUES (%s,%s,%s)", (bookID, stock, 0))
        db.commit()
        return 1
    except Exception as e:
        db.rollback()
        print("Error adding book:", e)
        traceback.print_exc()
        return 0
    finally:
        cur.close()
