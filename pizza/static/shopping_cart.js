function shopping_cart() {

    // ---------------- DISPLAY SHOPPING CART ----------------- //

    $('#cart-button').on('click', () => {

        // Enable Order button
        $('#make_order').attr("disabled", false);

        // Log 
        console.log(">>> Shopping cart was opened")

        // Reset shopping cart
        const s_cart = $('#shopping_cart')
        s_cart.html("")

        // Check if there is anything left in shopping cart
        keys = Object.keys(localStorage)

        // If empty, disable Order button
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
                        $('#cart_price').html("<br>$" + cart_price.toFixed(2))

                        // Create the right html
                        let label = "<div id='" + item.item_id + "'>" + "<hr>" + "<button class='btn remove-cart' style='background-color:transparent; border: none' data-id ='" + item.item_id + "'><small> ❌ </small>    </button>" + "<strong> Item </strong> - $" + data.total_price.toFixed(2) + "<br>" + data.product_label + " (" + data.product_size + ") - $" + data.product_price.toFixed(2) + "<br>"

                        if (data.toppings.length != 0) {
                            label = label + "<ul>"
                            // Go through each topping
                            data.toppings.forEach(element => {

                                // If topping included then write "included"
                                if (element.topping_price == 0) {
                                    label = label + "<li> " + element.topping_name + " - included </li>"
                                }
                                else {
                                    label = label + "<li> " + element.topping_name + " - $" + element.topping_price + "</li>"
                                }
                            });
                            label = label + "</ul>"
                        }

                        // Add item to shopping cart view
                        s_cart.html(s_cart.html() + label + "</div>")


                        // ---------------- REMOVE FROM SHOPPING CART ----------------- //

                        $('.remove-cart').each(function () {
                            $(this).on('click', function () {

                                // Get id to remove from button
                                const item_to_remove = parseInt($(this).attr('data-id'));

                                // Remove from storage
                                localStorage.removeItem(item_to_remove)

                                // Remove from view
                                $('#' + item_to_remove).remove()
                                $('#cart_price').html("<br> $0.00")

                                // Check if there is anything left in shopping cart
                                keys = Object.keys(localStorage)

                                // If empty, disable Order button
                                if (keys.length == 0) {
                                    $('#cart_text').html("Your shopping cart is empty.")
                                    $('#make_order').attr("disabled", true);
                                }
                            })
                        })
                    })
            })

        }


    })

}
