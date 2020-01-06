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

        // For each item
        items.forEach(item => {

            // Create the right label
            let label = "<li>Your item #" + item.item_id + " contains product #" + item.product_id + " with toppings:<br>"

            item.toppings.forEach(element => { label = label + "-> topping #" + element + "<br>" });
            label = label + "</li>" + "--------------------------"

            // Add item to shopping cart view
            s_cart.html(s_cart.html() + label)

            // Get cookie to bypass Cross Site Request Forgery protection // VERY IMPORTANT
            let csrftoken = Cookies.get('csrftoken');

            const data = {
                "product_id": item.product_id,
                "toppings" : item.toppings,
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
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        })






    })


}