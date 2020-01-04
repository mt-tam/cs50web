function shopping_cart() {
    
    // Get all buy buttons
    buy_buttons = document.querySelectorAll('.buy-btn')
    console.log(buy_buttons);

   
    // Trigger if any one of them is clicked
    buy_buttons.forEach(item => {
        item.addEventListener('click', event => {

        // Get product ID from clicked button
        var product_id = item.getAttribute('data-id');
        
        // ---------------- GET AVAILABLE TOPPINGS ----------------- //
        
        // Reset toppings list
        toppings_list = document.querySelector("#available_toppings");

        // Initialize new request
        const get_available_toppings = new XMLHttpRequest();   
        get_available_toppings.open('GET', '/get_available_toppings/'+ product_id);

        // Callback function for when request completes
        get_available_toppings.onload = () => { 
        
            // Extract JSON data from request
            var response = JSON.parse(get_available_toppings.responseText);
            var available_toppings = response.toppings;
            var max_toppings = response.max_toppings;
            var topping_included = response.topping_included;
            
            // Show to user no. of toppings allowed and if they're included in the price
            toppings_list.innerHTML = "You can select up to " + max_toppings +  " toppings."
            
            included = topping_included ? "Toppings are included in the price" : "Toppings are not included in the price"
            toppings_list.innerHTML = toppings_list.innerHTML + included

            // Show user the available toppings if any
            available_toppings.forEach(topping => {
                toppings_list.innerHTML = toppings_list.innerHTML + "<li>" + topping.name + " ($" + topping.price + ")</li>"
            })
        }

        // Send request
        get_available_toppings.send();
       
    
            // ---------------- ADD TO SHOPPING CART ----------------- //

            // Get product ID and toppings ID selected (match them together)

            // Save IDs in local storage

            // Send IDs to server and get back all info (product names, toppings names, prices, total price, etc.)
            
            // 

            // Get product based on product ID [JAVASCRIPT]
            product_added = products.filter(element => element.id == product_id)
            label = product_added[0].type + " - " + product_added[0].name
            price = "$" + product_added[0].price
            size = product_added[0].size

            // Create list of items in shopping cart
            list_cart = document.querySelector("#shopping_cart")
            list_cart.innerHTML = list_cart.innerHTML + "<li>" + label + " " + size + " (" + price + ")</li>"
            
            console.log("You clicked on product #", product_id);
        })
    })
}