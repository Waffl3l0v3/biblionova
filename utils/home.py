from app import get_db

def allBooks():
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT b.bookID,a.authorID,b.publisherID,b.title,b.genre,b.publicationYear,b.price,a.firstName,a.lastName
        FROM Books AS b
        JOIN Authors AS a ON b.authorID = a.authorID
        ORDER BY b.bookID
    """)
    data = cur.fetchall()
    cur.close()
    return list(data)

def allGenre():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT DISTINCT genre FROM Books")
    data = cur.fetchall()
    cur.close()
    return list(data)
