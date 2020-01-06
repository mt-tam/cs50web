from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import datetime
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
    products = list(Product.objects.values(
        "id", "name", "type", "size", "price", "max_toppings"))

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
        'id', 'name', 'price').filter(products_available__id=product_id))

    # Get number of toppings allowed for selected product
    product_requested = Product.objects.get(id=product_id)
    max_toppings = product_requested.max_toppings
    topping_included = product_requested.topping_included

    # Return list of toppings and max number of toppings
    context = {
        "toppings": toppings_available,
        "max_toppings": max_toppings,
        "topping_included": topping_included,
    }

    # Log
    log("Available Toppings were retrieved.")

    # Return to web page as JSON
    return HttpResponse(json.dumps(context))


# ------------------------------ GET SUMMARY PRODUCT ------------------------------ #

def get_summary_product(request):

    data = json.loads(request.body)
    product_id = data["product_id"]
    toppings_ids = data["toppings"]

    print("Your product is #", product_id, "with toppings: ", toppings_ids)

    # Get product information
    product = Product.objects.get(id=product_id)
    product_label = product.type + " - " + product.name
    topping_included = product.topping_included

    # Get topping information
    toppings = []
    for topping_id in toppings_ids:
        
        if topping_id != ",":
            topping = Topping.objects.get(id=topping_id)
            price = topping.price
            if topping_included :
                price = 0

            topping_info = {
                "topping_name": topping.name,
                "topping_price": price,
            }
            toppings.append(topping_info)

    # Compute total price
    
    

    # Package information and send it back
    response = {
        "product_label" : product_label, 
        "product_price" : product.price,
        "product_size": product.size,
        "topping_included" : topping_included,
        "toppings" : toppings,
    }

    print(response)

    return HttpResponse(json.dumps(response))


# Check product id & toppings exist in database
    # Check that selected toppings are allowed with selected product

    # Calculate the total price

    # Send back information (id, names, price)
