from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import datetime
from itertools import chain
from django.core import serializers
import simplejson as json

# Database Models Used
from .models import Product, Topping, Order

# ------------------------------ FUNCTIONS ------------------------------ #

# Log system
def log(message):
    now = datetime.datetime.now().strftime("%b %d %Y %H:%M:%S")
    print(" <<!>> {0} ({1})\n".format(message, now))


# ------------------------------ HOME PAGE ------------------------------ #


def index(request):

    # Log
    log("Front page was accessed.")

    # Load page
    return render(request, "orders/index.html")


# ------------------------------ MENU ------------------------------ #


@login_required
def menu(request):

    # Log
    log("Menu was accessed after login.")

    # Load page
    return render(request, "orders/menu.html", {"user": request.user})


# ------------------------------ GET PRODUCT TYPES ------------------------------ #


def get_product_types(request):

    # Get list of all product types (list of dicts)
    product_types_all = list(Product.objects.values('type'))

    # Transform list of dicts into simple list with unique values
    product_types_unique = []
    for dict in product_types_all:
        if dict["type"] in product_types_unique:
            continue
        else:
            product_types_unique.append(dict["type"])

    # Log
    log("Product types were retrieved.")

    # Return to page as JSON
    return HttpResponse(json.dumps(product_types_unique))


# ------------------------------ GET ALL PRODUCTS ------------------------------ #


def get_products(request):

    # Get list of all products
    products = list(Product.objects.values("id", "name", "type", "size", "price"))

    # Log
    log("All Products were retrieved.")

    # Return to web page as JSON
    return HttpResponse(json.dumps(products))


# ------------------------------ GET ALL TOPPINGS ------------------------------ #


def get_toppings(request):

    # Get list of all toppings
    toppings = list(Topping.objects.values("name", "price"))

    # Log
    log("All Toppings were retrieved.")

    # Return to web page as JSON
    return HttpResponse(json.dumps(toppings))


# ------------------------------ GET AVAILABLE TOPPINGS ------------------------------ #


def get_available_toppings(request, product_id):

    # Get list of allowed toppings for selected product
    toppings_available = list(Topping.objects.values(
        'name', 'price').filter(products_available__id=product_id))

    # Get number of toppings allowed for selected product
    max_toppings = Product.objects.get(id=product_id).max_toppings

    # Return list of toppings and max number of toppings
    context = {
        "toppings": toppings_available,
        "max_toppings": max_toppings,
    }

    # Log
    log("Available Toppings were retrieved.")

    # Return to web page as JSON
    return HttpResponse(json.dumps(context))
