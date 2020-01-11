# Requirements
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import datetime
import simplejson as json

# Database Models
from .models import Product, Topping, Order
from django.contrib.auth.models import User

# import the smtplib module. It should be included in Python by default
import smtplib
from email.message import EmailMessage
from email.headerregistry import Address


def email(request):

    # set up the SMTP server
    s = smtplib.SMTP(host='smtp.zoho.eu', port=587)
    s.starttls()
    s.login('hello@marius.pm', '<#7T["})qB>f')

    # Create a text/plain message
    msg = EmailMessage()

    # setup the parameters of the message
    msg['From']= Address("Marius' Pizza Place", 'hello', 'marius.pm')
    msg['To']= 'mata14ac@student.cbs.dk'
    msg['Subject']="This is TEST"

    # add in the message body
    msg.set_content("Whatsupp!!=!))=!#")
    s.send_message(msg)
    
    del msg
    s.quit

    return HttpResponse("Email was sent!")

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
        "product_id": product_id,
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

    # Find past orders
    past_orders = list(Order.objects.values(
        'order_id').filter(user_id=current_user))

    # Find last order id
    order_ids = []
    for order in past_orders:
        order_ids.append(order["order_id"])

    # Compute next order id
    if order_ids:
        order_id = max(order_ids) + 1
    else:
        order_id = 0

    # Get list of items in order
    items = json.loads(request.body)

    for item in items:
        # Extract item id
        item_id = item["item_id"]
        
        # Extract product id
        product_id = item["product_id"]

        # Extract toppings id
        toppings = item["toppings"]

        # Get product information
        product = Product.objects.get(id=product_id)
        topping_included = product.topping_included

        # Write in database
        new_order = Order(order_id=order_id, item_id=item_id, product_id=Product.objects.get(
            id=product_id), user_id=current_user, total_cost=0)
        new_order.save()

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

        new_order.total_cost = item_price
        new_order.save()

    return HttpResponse(json.dumps(order_id))



# ------------------------------------ SHOW ORDERS ------------------------------------ #


def orders(request):

    return render(request, 'orders/orders.html')



# ------------------------------------ GET ORDERS ------------------------------------ #


def get_orders(request):

    # Get all items in orders
    orders = list(Order.objects.values('order_id'))

    # Get all order IDs from database
    order_ids = set()

    for item in orders:
        order_ids.add(item['order_id'])

    # Repackage into a new list of orders
    new_orders = []
    
    # For each order, create a order package
    for order_id in order_ids:

        # Get current order
        order = list(Order.objects.values('user_id','created_on').filter(order_id=order_id)[:1])[0]

        # Compute total order cost
        order_cost = 0

        # Get user
        user_id = order["user_id"]

        # Get created date
        created_on = order["created_on"]

        # ------------ GET ITEMS FOR ORDER ------------- #

        # Get all unique item IDs
        items = list(Order.objects.values('item_id').filter(order_id=order_id))
        item_ids = set()

        

        for item in items:
            item_ids.add(item['item_id'])
        
        # Keep track of the order items
        order_items = []

        # For each item, create a new ITEM object (to be included in the ORDER object)
        for item_id in item_ids:

            # Get item
            item = list(Order.objects.values('total_cost', 'product_id', 'toppings_selected').filter(order_id=order_id).filter(item_id=item_id)[:1])[0]

            # Item Cost
            item_cost = item["total_cost"]

            # Get Product Info
            product_id = item["product_id"]
            product = product_info(product_id)

            # Get toppings in item
            toppings = Order.objects.values('toppings_selected').filter(order_id=order_id).filter(item_id=item_id)
            item_toppings = []
            for topping in toppings:
                item_toppings.append(topping["toppings_selected"])

            # Get topping names
            toppings_info = topping_info(item_toppings)
            
            new_item = {
                'item_id': item_id,
                'item_cost': float(item_cost),
                'product_id': product_id,
                'product_name': product["product_name"],
                'product_type': product["product_type"],
                'product_size': product["product_size"],
                'toppings': toppings_info,
            }

            # Add to total order cost
            order_cost += item["total_cost"]

            # Add each item to order items
            order_items.append(new_item)

        # Create new order object
        new_order = {
            "order_id": order_id,
            "user_id": user_id,
            "username": user_info(user_id),
            "created_on": created_on.__str__(),
            "order_cost": float(order_cost),
            "order_items": order_items,
        }

        # Add each order to the list of orders
        new_orders.append(new_order)

    # Log
    log("Orders were retrieved.")

    return HttpResponse(json.dumps(new_orders))


# ------------------------------ FUNCTIONS ------------------------------ #


# System Log
def log(message):
    now = datetime.datetime.now().strftime("%b %d %Y %H:%M:%S")
    print(" <<!>> {0} ({1})\n".format(message, now))


# Get topping information
def topping_info(topping_ids):
    toppings = []

    if topping_ids[0]:
        for topping_id in topping_ids:
            topping = list(Topping.objects.values(
                'name').filter(pk=topping_id))[0]

            output = {
                "topping_id": topping_id,
                "topping_name": topping["name"],
            }
            toppings.append(output)

    return(toppings)

# Get product information
def product_info(product_id):
    product = list(Product.objects.values(
        'name', 'size', 'type').filter(pk=product_id))[0]

    output = {  
        'product_name': product["name"],
        'product_size': product["size"],
        'product_type': product["type"],
    }

    return (output)


# Get username from user id
def user_info(user_id): 
    user = list(User.objects.values('username').filter(pk=user_id))[0]

    return(user["username"])


