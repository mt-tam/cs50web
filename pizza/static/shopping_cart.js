function shopping_cart() {

    // ---------------- ADD TO SHOPPING CART ----------------- //
    $('#cart-button').on('click', function () {
        // Log 
        console.log(">>>Shopping cart was opened")

        // Reset shopping cart
        const s_cart = $('#shopping_cart')
        s_cart.html("")

        // Get items (i.e. combos of product & topping IDs) from Local Storage
        const items = JSON.parse(localStorage.getItem('items'))
        items.forEach(item => {
            let label = "<li>Your item #" + item.item_id + " contains product #" + item.product_id + " with toppings:<br>"

            item.toppings.forEach(element => {
                label = label + "-> topping #" + element +"<br>"
            });
            label = label + "</li>" + "--------------------------"
            console.log(label)
            
            // Add item to shopping cart
            s_cart.html(s_cart.html() + label) 

        })

        // Send IDs to server and get back all info (product names, toppings names, prices, total price, etc.)

        


    })


}