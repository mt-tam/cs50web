function shopping_cart() {

    // ---------------- ADD TO SHOPPING CART ----------------- //
    $('#cart-button').on('click', function () {
        // Log 
        console.log(">>> Shopping cart was opened")

        // Reset shopping cart
        const s_cart = $('#shopping_cart')
        s_cart.html("")

        // Get items (i.e. combos of product & topping IDs) from Local Storage
        const items = JSON.parse(localStorage.getItem('items'))

        // Keep track of total price of shopping cart
        let cart_price = 0;

        // For each item
        items.forEach(item => {

            // Get cookie to bypass Cross Site Request Forgery protection // VERY IMPORTANT
            let csrftoken = Cookies.get('csrftoken');

            const data = {
                "product_id": item.product_id,
                "toppings": item.toppings,
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
                .then((response) => response.json())
                .then((data) => {

                    // Add item price to total price of cart
                    cart_price += data.total_price
                    $('#cart_price').html("<br>$" + Math.round(cart_price))

                    // Create the right html
                    let label = "<strong> Item #" + item.item_id + "</strong> - $" + data.total_price + "<br>" + data.product_label + " (" + data.product_size + ") - $" + data.product_price + "<br> + toppings:<br><ul>"

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
                    label = label + "</ul><hr>"

                    // Add item to shopping cart view
                    s_cart.html(s_cart.html() + label)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
    })
}