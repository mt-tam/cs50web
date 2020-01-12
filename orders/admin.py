from django.contrib import admin
from django.db import models
from .models import Product, Topping, Order

# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    radio_fields = {"size": admin.VERTICAL}
    list_display = ('id','type', 'name', 'size', 'price', 'max_toppings', 'topping_included')
    list_editable = ('type','name', 'size', 'price', 'max_toppings', 'topping_included')
    list_filter = ('type', 'size','max_toppings')
    
class ProductInline(admin.TabularInline):
    model = Topping.products_available.through

class ToppingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price')
    list_editable = ('name','price')
    inlines = [
        ProductInline, 
    ]

class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ['created_on',]
    list_display = ['id', 'order_id', 'item_id', 'product_id', 'total_cost','completed', 'user_id', 'created_on']
    list_editable = ['completed']
    
    

admin.site.register(Product, ProductAdmin)
admin.site.register(Topping, ToppingAdmin)
admin.site.register(Order, OrderAdmin)
