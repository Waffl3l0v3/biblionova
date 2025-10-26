from flask import Flask, render_template, request, redirect, url_for, session
import MySQLdb
from os import getenv
from dotenv import load_dotenv
import datetime


# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# ------------------ DATABASE ------------------
def get_db():
    if not hasattr(app, 'db'):
        app.db = MySQLdb.connect(
            host=getenv('MYSQL_HOST', 'localhost'),
            user=getenv('MYSQL_USER', 'root'),
            passwd=getenv('MYSQL_PASSWORD', 'Rewa@2005'),
            db=getenv('MYSQL_DB', 'bookstore'),
            charset='utf8'
        )
    return app.db

# ------------------ IMPORT UTILS ------------------
from utils.home import *
from utils.book import *
from utils.loginregister import *
from utils.search import *
from utils.user import *
from utils.orders import *

# ------------------ ROUTES ------------------

@app.route("/")
def homeRoute():
    booksData = allBooks()
    genreData = allGenre()
    return render_template("home.html", booksData=booksData, genreData=genreData)

@app.route("/customerindex")
def customerindexRoute():
    booksData = allBooks()
    genreData = allGenre()
    return render_template("customerindex.html", booksData=booksData, genreData=genreData)

@app.route("/adminindex")
def adminindexRoute():
    booksData = allBooks()
    genreData = allGenre()
    return render_template("adminindex.html", booksData=booksData, genreData=genreData)

@app.route("/register", methods=["POST", "GET"])
def registerRoute():
    if request.method == "POST":
        username = request.form.get("username")
        fname = request.form.get("fname")
        lname = request.form.get("lname")
        email = request.form.get("email")
        password = request.form.get("password")
        phone = request.form.get("phone")
        country = request.form.get("country")
        state = request.form.get("state")
        pincode = request.form.get("pincode")
        address = request.form.get("address")
        result = register(username, fname, lname, email, password, phone, country, state, pincode, address)
        return render_template("register.html", response=result)
    return render_template("register.html")

@app.route("/login", methods=["POST", "GET"])
def loginRoute():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        account = request.form.get("account")
        if account == "customer":
            result = customerLogin(username, password)
            if result == 1:
                session["userID"] = username
                session["accountType"] = account
                return redirect(url_for("customerindexRoute"))
            return render_template("login.html", response=result)
        if account == "admin":
            result = adminLogin(username, password)
            if result == 1:
                session["userID"] = username
                session["accountType"] = account
                return redirect(url_for("adminindexRoute"))
            return render_template("login.html", response=result)
    return render_template("login.html")

@app.route("/logout")
def logoutRoute():
    session.pop("userID", None)
    session.pop("accountType", None)
    booksData = allBooks()
    genreData = allGenre()
    return render_template("home.html", booksData=booksData, genreData=genreData)

@app.route("/contact", methods=["POST"])
def contactUsRoute():
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    email = request.form.get("email")
    message = request.form.get("message")
    status = contactUs(fname, lname, email, message)
    if status:
        return redirect(url_for("homeRoute"))  # back to home after success
    else:
        return "Failed to send message", 500

# ------------------ Books CRUD (Admin) ------------------

@app.route("/books", methods=["GET"])
def booksRoute():
    booksData = allBooks()
    return render_template("books.html", booksData=booksData)

@app.route("/addbook", methods=["POST"])
def addBookRoute():
    bookID = request.form.get("bookID")
    title = request.form.get("title")
    genre = request.form.get("genre")
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    year = request.form.get("year")
    price = request.form.get("price")
    country = request.form.get("country")
    stock = request.form.get("stock")
    result = addBook(bookID, title, genre, fname, lname, year, price, country, stock)
    booksData = allBooks()
    response = 1 if result else 0
    return render_template("books.html", booksData=booksData, response=response)

@app.route("/updatebook", methods=["POST"])
def updateBookRoute():
    bookID = request.form.get("bookID")
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    country = request.form.get("country")
    price1 = request.form.get("price1")  # old price
    price2 = request.form.get("price2")  # new price
    result = updateBook(bookID, fname, lname, country, price1, price2)
    booksData = allBooks()
    response = 1 if result else 0
    return render_template("books.html", booksData=booksData, response=response)

@app.route("/deletebook", methods=["POST"])
def deleteBookRoute():
    bookID = request.form.get("bookID")
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    country = request.form.get("country")
    result = deleteBook(bookID, fname, lname, country)
    booksData = allBooks()
    response = 1 if result else 0
    return render_template("books.html", booksData=booksData, response=response)

# ------------------ Book Details (Customer + Admin) ------------------

@app.route("/bookdetail/<int:book_id>")
def bookDetailRoute(book_id):
    bookData = getBookDetail(book_id)
    return render_template("bookdetail.html", bookData=bookData)

@app.route("/bookDetailsAdmin<int:book_id>")
def bookDetailsAdminRoute(book_id):
    bookData = getBookDetail(book_id)
    return render_template("bookDetailAdmin.html", bookData=bookData)

@app.route("/bookdetail2/<int:book_id>")
def bookDetail2Route(book_id):
    bookData = getBookDetail2(book_id)
    return render_template("bookdetail2.html", bookData=bookData)

# ------------------ Buy Book (Customer) ------------------

@app.route("/buybook/<int:bookID>", methods=["POST"])
def buyBookRoute(bookID):
    quantity = int(request.form.get("quantity"))
    userID = session.get("userID")
    bookData = getBookDetail(bookID)
    price = bookData[3]
    total = price * quantity
    pay = "COD"  # or collect payment details elsewhere
    result = orders(bookID, quantity, total, pay, userID)
    response = 1 if result else 0
    return redirect(url_for("orderconfirmationRoute", response=response))

# ------------------ Inventory ------------------

# @app.route("/inventory")
# def inventoryRoute():
#     bookData = getInventory()
#     return render_template("inventory.html", bookData=bookData)

# ------------------ Orders ------------------

# @app.route("/myorders")
# def myordersRoute():
#     userID = session.get("userID")
#     myOrders = myorder(userID) if userID else []
#     return render_template("myorders.html", myOrders=myOrders)

# @app.route("/orderconfirmation")
# def orderconfirmationRoute():
#     response = request.args.get("response", None)
#     return render_template("orderconfirmation.html", response=response)

# @app.route("/payment/<isbn>/<int:quantity>/<int:total>", methods=["GET", "POST"])
# def paymentRoute(isbn, quantity, total):
#     return render_template("payment.html", isbn=isbn, quantity=quantity, total=total)

# ------------------ Search ------------------

@app.route("/search", methods=["GET", "POST"])
def searchRoute():
    if request.method == "POST":
        query = request.form.get("query")
        searchType = request.form.get("search")
        if searchType == "title":
            booksData = searchTitle(query)
        elif searchType == "genre":
            booksData = searchGenre(query)
        elif searchType == "author":
            booksData = searchAuthor(query)
        else:
            booksData = []
        return render_template("search.html", booksData=booksData, search=searchType)
    return render_template("search.html", booksData=None, search=None)

@app.route("/customersearch", methods=["GET", "POST"])
def customersearchRoute():
    booksData = None
    search = None
    if request.method == "POST":
        query = request.form.get("query")
        search = request.form.get("search")
        if search == "title":
            booksData = searchTitle(query)
        elif search == "genre":
            booksData = searchGenre(query)
        elif search == "author":
            booksData = searchAuthor(query)
    return render_template("customersearch.html", booksData=booksData, search=search)

# ------------------ Account/Users ------------------

@app.route("/myaccount")
def myaccountRoute():
    userID = session.get("userID")
    Data = customerAccount(userID) if userID else None
    accountType = session.get("accountType")
    return render_template("myaccount.html", Data=Data, accountType=accountType)

@app.route("/users")
def usersRoute():
    adminData = admin()
    customerData = customers()
    return render_template("users.html", adminData=adminData, customerData=customerData)

if __name__ == "__main__":
    app.run(debug=True)