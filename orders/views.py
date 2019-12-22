from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

# Database Models Used
from .models import Product, Topping, Order


### |------------------------------ 1. HOME PAGE ------------------------------|

def index(request):
    return render(request, "orders/index.html")


### |------------------------------ 2.1 SIGNUP ------------------------------|

# Taken care by Django's built-in authentication views. BUT CANNOT FIND A WAY TO INCLUDE FIRST NAME; LAST NAME ; EMAIL IN THE REQUEST
# Lives at /accounts/signup

### |------------------------------ 2.2 LOGIN ------------------------------|

# Taken care by Django's built-in authentication views.
# Lives at /accounts/login

### |------------------------------ 3.1 LOGOUT ------------------------------|

# Taken care by Django's built-in authentication views.
# Lives at /accounts/logout


### |------------------------------ 3. MENU ------------------------------|
@login_required
def menu(request):
    
    # Get list of all products
    products = Product.objects.all()
    print(products)
    
    # Get list of all product types
    product_types_all = Product.objects.values('type')
    product_types_unique = []

    for type in product_types_all:
        for key, value in type.items():
            if value in product_types_unique:
                continue
            else:
                product_types_unique.append(value)

    print (product_types_unique)

    # Get list of all toppings
    toppings = Topping.objects.all()

    context = {
        "products": products,
        "product_types" : product_types_unique,
        "toppings": toppings,
    }
    print(context)
    return render(request, "orders/menu.html", context)


### |------------------------------ 3.2.1 TOPPINGS ------------------------------|

@login_required
def toppings(request, product_id):

    # Get the list of all allowed toppings for the selected product
    toppings_available = Topping.objects.all().filter(products_available__id=product_id)

    # Get the number of toppings allowed for the selected product
    max_toppings = Product.objects.get(id=product_id).max_toppings

    # Return list of toppings and max number of toppings to user
    context = {
        "toppings": toppings_available,
        "max_toppings": max_toppings,
    }
    
    return render(request, "orders/toppings.html", context)