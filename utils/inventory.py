from app import get_db

def getInventory():
    db = get_db()
    cursor = db.cursor()
    query = """
    SELECT b.bookID, b.title, i.totalStock, i.soldStock
    FROM books b
    JOIN inventory i ON b.bookID = i.bookID;
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    return result
