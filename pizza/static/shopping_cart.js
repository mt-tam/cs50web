function shopping_cart() {

    // ---------------- DISPLAY SHOPPING CART ----------------- //

    $('#cart-button').on('click', () => {

        // Log 
        console.log(">>> Shopping cart was opened")

        // Reset Order button (to enabled)
        $('#make_order').attr("disabled", false);

        // Reset total price
        $('#cart_price').html("")

        // Reset shopping cart
        $('#shopping_cart').html("")

        // Check if there is anything in shopping cart (local storage)
        keys = Object.keys(localStorage)

        // If empty, disable Order button & show message
        if (keys.length == 0) {
            $('#cart_text').html("Your shopping cart is empty.")
            $('#make_order').attr("disabled", true);
        }
        else {
            // Get items (i.e. combos of product & topping IDs) from Local Storage
            let items = []
            keys.forEach(key => items.push(JSON.parse(localStorage.getItem(key))))
            items.sort();

            // Keep track of total price of shopping cart
            let cart_price = 0;

            // For each item
            items.forEach(item => {

                // Get cookie to bypass Cross Site Request Forgery protection // VERY IMPORTANT
                let csrftoken = Cookies.get('csrftoken');

                // Define request's body
                const data = {
                    product_id: item.product_id,
                    toppings: item.toppings,
                }

                // Define request's options
                const options = {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data),
                }

                // Send request to server and get back all info
                fetch('/get_summary_product', options)
                    .then(response => response.json())
                    .then(data => {

                        // Add item price to total price of cart
                        cart_price += data.total_price

                        // Show total price
                        $('#cart_price').html("<br>$" + cart_price.toFixed(2))

                        // Create the product label
                        let item_label = $("<div id='" + item.item_id + "'>" + "<hr>" + "<button class='btn remove-cart' style='background-color:transparent; border: none' data-id ='" + item.item_id + "'><small> ❌ </small>    </button>" + "<strong> Item </strong> - $" + data.total_price.toFixed(2) + "<br>" + data.product_label + " (" + data.product_size + ") - $" + data.product_price.toFixed(2) + "<br></div>")

                        // If there are toppings, start a unordered list
                        if (data.toppings.length != 0) {
                            let toppings_list = $("<ul>")

                            // Go through each topping
                            data.toppings.forEach(element => {

                                // Show price or if topping is included
                                price_included = data.topping_included ? " (included)" : " ($" + element.topping_price + ")"
                                
                                let topping_label = "<li> " + element.topping_name + price_included + "</li>"
                                toppings_list.append(topping_label)
                            });
                            item_label.append(toppings_list)
                        }

                        // Add item to shopping cart view
                        $('#shopping_cart').append(item_label)


                        // ---------------- REMOVE FROM SHOPPING CART ----------------- //

                        $('.remove-cart').each(function () {
                            $(this).on('click', function () {

                                // Get id to remove from button
                                const item_to_remove = parseInt($(this).attr('data-id'));

                                // Remove from storage
                                localStorage.removeItem(item_to_remove)

                                // Remove from view
                                $('div#' + item_to_remove).remove()
                                $('#cart_price').html("<br> $0.00")

                                // Check if there is anything left in shopping cart
                                keys = Object.keys(localStorage)

                                // If empty, disable Order button
                                if (keys.length == 0) {
                                    $('#cart_text').html("Your shopping cart is empty.")
                                    $('#shopping_cart').html("")
                                    $('#make_order').attr("disabled", true);
                                }
                            })
                        })
                    })
            })

        }


    })

}
