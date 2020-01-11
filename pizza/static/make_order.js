function make_order() {

    // ---------------- WHEN MAKE ORDER IS CLICKED, SEND ORDER TO SERVER ----------------- //

    $('#make_order').on('click', function () {

        console.log(">>> An order was initiated.")

        // Check which items are in local storage (shopping cart)
        keys = Object.keys(localStorage)

        // If empty, don't do much
        if (keys.length == 0) {
            console.log("Shopping cart is empty. We cannot process this order.")
        }
        else {
            // Get items (i.e. combos of product & topping IDs) from Local Storage
            let items = []

            keys.forEach(key => items.push(JSON.parse(localStorage.getItem(key))))
            items.sort();
            console.log("Order items: ", items);

            // Get cookie to bypass Cross Site Request Forgery protection // VERY IMPORTANT
            let csrftoken = Cookies.get('csrftoken');

            // Define request's options
            const options = {
                method: 'post',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(items),
            }

            // Make server request to create order
            fetch('/make_order', options)
            .then(response => response.json())
            .then(response => {

                // Remove all items from shopping cart
                localStorage.clear()

                // Show success notification
                $("#product-added-success").css("display", "none")
                $("#product-added-success").removeClass('alert-success').addClass('alert-primary')
                $("#product-added-success-text").html("<strong>Congrats!</strong><br> You successfully made an order!")
                $("#product-added-success").css("display", "block")

                console.log(">>> An order was completed. ")
            })
        }
    })
}