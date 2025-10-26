from app import get_db

def searchTitle(query):
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT b.bookID,a.authorID,b.publisherID,b.title,b.genre,b.publicationYear,b.price,a.firstName,a.lastName
        FROM Books AS b
        JOIN Authors AS a ON b.authorID = a.authorID
        WHERE b.title LIKE %s
    """, ('%' + query + '%',))
    data = list(cur.fetchall())
    cur.close()
    return data

def searchGenre(query):
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT b.bookID,a.authorID,b.publisherID,b.title,b.genre,b.publicationYear,b.price,a.firstName,a.lastName
        FROM Books AS b
        JOIN Authors AS a ON b.authorID = a.authorID
        WHERE b.genre LIKE %s
    """, ('%' + query + '%',))
    data = list(cur.fetchall())
    cur.close()
    return data

def searchAuthor(query):
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT b.bookID,a.authorID,b.publisherID,b.title,b.genre,b.publicationYear,b.price,a.firstName,a.lastName
        FROM Books AS b
        JOIN Authors AS a ON b.authorID = a.authorID
        WHERE a.firstName LIKE %s
    """, ('%' + query + '%',))
    list1 = list(cur.fetchall())

    cur.execute("""
        SELECT b.bookID,a.authorID,b.publisherID,b.title,b.genre,b.publicationYear,b.price,a.firstName,a.lastName
        FROM Books AS b
        JOIN Authors AS a ON b.authorID = a.authorID
        WHERE a.lastName LIKE %s
    """, ('%' + query + '%',))
    list2 = list(cur.fetchall())

    data = list({*list1, *list2})  # Remove duplicates
    cur.close()
    return data
