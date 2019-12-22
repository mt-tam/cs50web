from django.urls import path
from . import views

urlpatterns = [
    # See home page
    path('', views.index, name='index'),  

    # See the menu (with shopping cart)
    path('menu', views.menu, name='menu'),  

    # See applicable toppings for each product
    path('<int:product_id>/toppings', views.toppings, name="toppings"),
]