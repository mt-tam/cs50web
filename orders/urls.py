from django.urls import path
from . import views

urlpatterns = [
    # See home page
    path('', views.index, name='index'),  

    # See the menu (with shopping cart)
    path('menu', views.menu, name='menu'),  

    # Get data for front-end
    path('get_product_types', views.get_product_types, name='get_product_types'),
    path('get_products', views.get_products, name='get_products'),
    path('get_toppings', views.get_toppings, name='get_toppings'),
    path('get_available_toppings/<int:product_id>', views.get_available_toppings, name='get_available_toppings'),
    path('get_summary_product', views.get_summary_product, name="get_summary_product"),
    path('make_order', views.make_order, name="make_order"),
    path('orders', views.orders, name="orders"),
    path('get_orders', views.get_orders, name="get_orders"),
]