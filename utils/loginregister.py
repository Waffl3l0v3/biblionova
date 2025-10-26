from app import get_db

def register(username, fname, lname, email, password, phone, country, state, pincode, address):
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute("""
            INSERT INTO Customers(customerID,firstName,lastName,address,pincode,country,phone,state,emailID,password)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (username,fname,lname,address,pincode,country,phone,state,email,password))
        db.commit()
        return 1
    except:
        db.rollback()
        return 0
    finally:
        cur.close()

def adminLogin(username, password):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Admins WHERE adminID=%s AND password=%s", (username, password))
    data = cur.fetchone()
    cur.close()
    return 1 if data else 0

def customerLogin(username, password):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM Customers WHERE customerID=%s AND password=%s", (username, password))
    data = cur.fetchone()
    cur.close()
    return 1 if data else 0
