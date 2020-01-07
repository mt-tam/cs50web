
# ------------------------------------ REQUIREMENTS ------------------------------------ #

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password
import datetime

# Import USERS table
from django.contrib.auth.models import User

# Helper Function: Log
def log(message):
    now = datetime.datetime.now().strftime("%b %d %Y %H:%M:%S")
    print(" <<!>> {0} ({1})".format(message, now))


# ------------------------------------ LOGIN ------------------------------------ #

def mylogin(request):
    if request.method == "POST":

        # Log
        log("Login form was submitted.")

        # Get form data
        username = request.POST["username"]
        password = request.POST["password"]

        # Check if user already exists in system
        user = authenticate(username=username, password=password)

        if user is not None:
            # A backend authenticated the credentials
            login(request, user)

            # Log
            log("User was logged in: " + username)

            # Redirect to menu
            return redirect(reverse("menu"))
        else:

            # Log
            log("Username or password are incorrect.")

            # Show Error Message to User
            context = {
                "message": "Username or password are incorrect.. Please try again."
            }
            return render(request, "accounts/login.html", context)

    else:
        # If GET request, show login page to user
        log("Login page was accessed.")
        return render(request, "accounts/login.html")


# ------------------------------------ SIGN-UP ------------------------------------ #

def signup(request):
    if request.method == "POST":

        # Log
        log("Signup form was submitted.")

        # Get form data
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        email = request.POST["email"]
        username = request.POST["username"]

        # Hash password before saving it
        password = make_password(request.POST["password"])

        # Check if user already exists in system
        email_exists = User.objects.filter(email=email)
        username_exists = User.objects.filter(username=username)

        if email_exists or username_exists:
            # Log
            log("Email or username is already taken.")

            # Show Error Message to User
            context = {
                "message": "Email or username is already taken. Please try again."
            }
            return render(request, "accounts/signup.html", context)

        # Else create user in database
        u = User(first_name=first_name, last_name=last_name,
                 email=email, username=username, password=password)
        u.save()

        # Log user in
        login(request, u)

        # Log
        log("User was logged in: " + username)

        # Redirect to menu
        return redirect(reverse("menu"))

    else:
        # If GET request, show signup page to user
        log("Signup page was accessed.")
        return render(request, "accounts/signup.html")
