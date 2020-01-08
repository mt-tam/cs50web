from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Product(models.Model): 
    type = models.CharField(max_length=64, choices=[("Regular Pizza", "Regular Pizza"),("Sicilian Pizza", "Sicilian Pizza"), ("Subs", "Subs"), ("Pasta", "Pasta"),("Salad", "Salad"),("Dinner Platters", "Dinner Platters")])    
    name = models.CharField(max_length=64)    
    size = models.CharField(max_length=21, choices = [("undefined","---"),("small","small"), ("large", "large")])  
    price = models.DecimalField(max_digits=5, decimal_places=2)
    max_toppings = models.IntegerField(default=0, choices = [(0, "0"), (1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")])
    topping_included = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.type} - {self.name} ({self.size}) (${self.price})"

class Topping(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    products_available = models.ManyToManyField(Product, related_name="products")
    def __str__(self):
        return f"{self.name} (${self.price})"


class Order(models.Model):
    order_id = models.IntegerField()
    item_id = models.IntegerField()
    product_id = models.ForeignKey(Product, related_name="products_orders", on_delete=models.SET("Product was not found"))
    toppings_selected = models.ManyToManyField(Topping, related_name="toppings")
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    created_on = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(User, related_name="users", on_delete=models.SET("User was not found"))

    def __str__(self):
        return f"Order #{self.order_id} by {self.user_id.email} for ${self.total_cost}."