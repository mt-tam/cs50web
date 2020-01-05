function shopping_cart() {

    // ---------------- ADD TO SHOPPING CART ----------------- //

    // Send IDs to server and get back all info (product names, toppings names, prices, total price, etc.)

    // Create list of items in shopping cart
    list_cart = document.querySelector("#shopping_cart")
    list_cart.innerHTML = list_cart.innerHTML + "<li>" + label + " " + size + " (" + price + ")</li>"
}