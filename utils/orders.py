from app import get_db
import datetime

def orders(isbn, quantity, total, pay, userID):
    db = get_db()
    cur = db.cursor()
    timestamp = datetime.datetime.now()
    commitStatus = 0

    try:
        db.autocommit(False)
        cur.execute("""
            INSERT INTO Orders(customerID, bookID, quantity, total, timestamp)
            VALUES (%s,%s,%s,%s,%s)
        """, (userID, isbn, quantity, total, timestamp))

        cur.execute("UPDATE Inventory SET soldStock = soldStock + %s WHERE bookID = %s", (quantity, isbn))
        cur.execute("UPDATE Inventory SET totalStock = totalStock - %s WHERE bookID = %s", (quantity, isbn))

        try:
            cur.execute("INSERT INTO Payment(customerID,paymentInfo) VALUES (%s,%s)", (userID, pay))
            commitStatus = 1
        except:
            db.rollback()
    except:
        db.rollback()
    finally:
        db.commit()
        cur.close()
    return commitStatus


def allorders():
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT o.orderID,o.customerID,o.bookID,o.quantity,o.total,o.timestamp,b.title
        FROM Orders AS o
        JOIN Books AS b ON o.bookID = b.bookID
        ORDER BY o.orderID
    """)
    data = list(cur.fetchall())
    cur.close()
    return data


def myorder(userID):
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        SELECT o.bookID,o.quantity,o.total,o.timestamp,b.title
        FROM Orders AS o
        JOIN Books AS b ON o.bookID = b.bookID
        WHERE o.customerID=%s
    """, (userID,))
    data = list(cur.fetchall())
    cur.close()
    return data
