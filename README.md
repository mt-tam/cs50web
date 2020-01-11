# Project 3

Web Programming with Python and JavaScript

# Description

>>> Standard User
This project allows users to browse and order pizzas, sandwiches among others. 

-> They can browse the menu, sign up or login and order products. 
-> If applicable, they can select one or more toppings for each product. 
-> They can view their shopping cart, see the total cost, and remove excess items if needed. 
-> Finally they can go ahead and send their order in. 

>>> Staff/Admin User

-> They can access Django's Admin module to add, edit, or delete products & toppings in the menu, as well as view signed up users and orders.
-> They can view all incoming orders directly in the Pizza Web App.



# Components

*** DJANGO APPS ***

1. orders ( /orders/views.py)
Manages menu and orders.

2. account ( /accounts/views.py)
Manages login & signup.

3. pizza
Manages general project settings & holds static files.



*** HTML files ***

>>> /project3/pizza/accounts/templates/accounts

1. signup.html
This page allows the user to sign up for an account.

2. login.html
This page allows the user to login into an existing account.


>>> /project3/pizza/orders/templates/orders

3. index.html
This page show the full menu, as well as the options to login or sign up.

** base.html
This page contains layout and common code for the upcoming two pages.

4. menu.html
This page shows the full menu with the option to buy items, select toppings, see shopping cart and make an order. 

5. orders.html
This page shows all incoming orders to Staff users.



*** CSS files ***
/project3/pizza/pizza/static 

1. styles.css
Adds a tiny bit of styling.



*** JS files *** 
/project3/pizza/pizza/static 

1. (f) get_data.js
Contains functions that interact with the server to retrieve specific data.

2. (f) display_data.js
Contains functions that can take specific data and turn into a visual component (table, list etc.) to display products, toppings, orders etc.

3. buy_item.js
Allows user to select and item and toppings if applicable.

4. add_to_cart.js
Allows user to add items to shopping cart. 

5. shopping_cart.js
Allows user to see all items fully displayed in shopping cart and see the total price. Also allows to remove items from shopping cart.

6. make_order.js
Allows user to make an order with the items present in the shopping cart.

7. show_orders.js
Allows STAFF/ADMIN users to see all incoming orders.

