function shopping_cart() {

    // ---------------- ADD TO SHOPPING CART ----------------- //
    $('#cart-button').on('click', () => {
        // Log 
        console.log(">>> Shopping cart was opened")

        // Reset shopping cart
        const s_cart = $('#shopping_cart')
        s_cart.html("")

        // Get items (i.e. combos of product & topping IDs) from Local Storage
        let items = []

        // Check for up to 100 items in the local storage
        for (var i = 1; i < 100; i++) {
            if (localStorage.getItem(i) == null) {
                continue
            }
            else {
                items.push(JSON.parse(localStorage.getItem(i)))
            }
        }
        items.sort();

        console.log(items)

        // If no items were found, show empty message
        if (items == null) {
            $('#cart_text').html("Your shopping cart is empty.")
        } else {

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
                        let label = "<div id='" + item.item_id + "'>" + "<hr>" + "<button class='btn remove-cart' style='background-color:transparent; border: none' data-id ='" + item.item_id + "'><small> ❌ </small>    </button>" + "<strong> Item </strong> - $" + data.total_price + "<br>" + data.product_label + " (" + data.product_size + ") - $" + data.product_price + "<br>"

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
                            })
                        })
                    })
            })
        }
    })
    
}