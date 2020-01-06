function shopping_cart() {

    // ---------------- ADD TO SHOPPING CART ----------------- //

    // Send IDs to server and get back all info (product names, toppings names, prices, total price, etc.)
    var items = JSON.parse(localStorage.getItem('items'))
    var label = "Your item #" + item.id +" contains product #" + items.product +" with toppings:\n"
    items.toppings.forEach(element => {
        label = label + "-> #\n" + element
    });
    

    // Create list of items in shopping cart
    $("#shopping_cart").html($("#shopping_cart").html + "<li>" + label + "</li>")
}