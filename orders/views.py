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

    item = json.loads(request.body)
    product_id = item["product_id"]
    toppings_ids = item["toppings"]

    # Log
    log("You requested info on product #" + str(product_id) +
        " with toppings: " + str(toppings_ids))

    # Get product information
    product = Product.objects.get(id=product_id)
    product_label = product.type + " - " + product.name
    topping_included = product.topping_included

    # Keep track of total price
    total_price = product.price

    # Get topping information
    toppings = []
    for topping_id in toppings_ids:

        if topping_id != ",":
            topping = Topping.objects.get(id=topping_id)
            price = topping.price
            if topping_included:
                price = 0

            # Compute total price
            total_price += price

            topping_info = {
                "topping_name": topping.name,
                "topping_price": price,
            }
            toppings.append(topping_info)

    # Package information and send it back
    response = {
        "product_label": product_label,
        "product_price": product.price,
        "product_size": product.size,
        "topping_included": topping_included,
        "toppings": toppings,
        "total_price": total_price,
    }

    return HttpResponse(json.dumps(response))


# ------------------------------ MAKE ORDER ------------------------------ #
def make_order(request):

    # Log
    log("Make order was accessed.")

    # Get current user
    current_user = request.user
    print("User ID: " + str(current_user))

    # Find past orders
    past_orders = list(Order.objects.values(
        'order_id').filter(user_id=current_user))

    # Find last order id
    order_ids = []
    for order in past_orders:
        order_ids.append(order["order_id"])

    # Compute next order id
    order_id = max(order_ids) + 1
    print("Order ID: " + str(order_id))

    # Get list of items in order
    items = json.loads(request.body)
    print("-------------")

    for item in items:
        # Extract item id
        item_id = item["item_id"]
        print("Item ID: ", item_id)
        # Extract product id
        product_id = item["product_id"]
        print("Product ID: ", product_id)
        # Extract toppings id
        toppings = item["toppings"]
        print("Topping IDs: " + str(toppings))

        # Get product information
        product = Product.objects.get(id=product_id)
        topping_included = product.topping_included

        # Write in database
        new_order = Order(order_id=order_id, item_id=item_id, product_id=Product.objects.get(
            id=product_id), user_id=current_user, total_cost=0)
        new_order.save()
        print(new_order)

        # Compute item price
        item_price = 0
        # Add product price
        item_price += product.price
        # Add toppings price
        for topping_id in toppings:

            # Get topping information
            t = Topping.objects.get(id=topping_id)
            price = t.price

            new_order.toppings_selected.add(t)

            # If toppings are included, cancel price
            if topping_included:
                price = 0

            # Compute total price
            item_price += price

        print("Item Price: ", item_price)
        print("-------------")
        new_order.total_cost = item_price
        new_order.save()

    return HttpResponse(json.dumps(order_id))
