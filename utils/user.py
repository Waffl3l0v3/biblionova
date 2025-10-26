from app import get_db
import datetime

def admin():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Admins")
    data = list(cur.fetchall())
    cur.close()
    return data

def customers():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Customers")
    data = list(cur.fetchall())
    cur.close()
    return data

def adminAccount(userID):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Admins WHERE adminID=%s", (userID,))
    data = cur.fetchone()
    cur.close()
    return list(data) if data else None

def customerAccount(userID):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Customers WHERE customerID=%s", (userID,))
    data = cur.fetchone()
    cur.close()
    return list(data) if data else None

def contactUs(fname, lname, email, message):
    db = get_db()
    cur = db.cursor()
    timestamp = datetime.datetime.now()
    try:
        cur.execute("""
            INSERT INTO ContactUs(firstName,lastName,emailID,message,timestamp)
            VALUES (%s,%s,%s,%s,%s)
        """, (fname,lname,email,message,timestamp))
        db.commit()
        return 1
    except:
        db.rollback()
        return 0
    finally:
        cur.close()
