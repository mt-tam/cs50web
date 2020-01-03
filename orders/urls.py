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
    path('<int:product_id>/get_available_toppings', views.get_available_toppings, name='get_available_toppings'),
]