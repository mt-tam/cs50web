function buy_item() {

    // Get highest item id currently in shopping cart
    let item_id
    keys = Object.keys(localStorage)
    keys = keys.map(n => parseInt(n))
    if (keys.length == 0) {
        item_id = 0;
    } else {
        item_id = Math.max(...keys)
    }
    
    console.log(item_id)

    // ----------- WHEN ANY BUY BUTTON IS CLICKED ----------- //

    $('.buy-btn').each((index, element) => {
        $(element).on('click', (event) => {

            item_id++;

            // Get product ID
            let product_id = $(element).attr('id')
            console.log(">>> Product selected: #", product_id)

            // Get available toppings
            get_available_toppings(product_id)
                .then(response => {
                    const available_toppings = response.toppings;
                    const max_toppings = response.max_toppings;
                    const topping_included = response.topping_included;
                    console.log(">>> Max toppings: ", max_toppings)

                    // If no toppings allowed, add directly to cart
                    if (max_toppings == 0) {
                        add_to_cart(item_id, product_id, available_toppings)
                    }

                    // If toppings allowed, let the user select them
                    else {
                        // Show toppings view
                        $('#toppings-modal').modal('toggle')

                        // Reset error messagee
                        $('#error-toppings').html("")

                        // Add toppings options
                        display_available_toppings(product_id, max_toppings, available_toppings, topping_included)
                       
                        // Track toppings selected
                        selected_toppings(item_id, product_id, max_toppings);

                    }
                })
        })
    })
}


function selected_toppings(item_id, product_id, max_toppings) {
    
    // IMPORTANT DUDE,
    $('#available_toppings').off('changed.bs.select');

    $('#available_toppings').on('changed.bs.select', function (e, clickedIndex, isSelected, newValue) {

        // Get IDs of toppings selected & convert them to Integers
        let topping_ids = $(this).val();
        topping_ids = topping_ids.map(n => parseInt(n))

        // Check number of toppings selected
        const nr_selections = $('li.selected').length
        console.log(">>> You selected : " + nr_selections + "/" + max_toppings + " allowed toppings.")

        // Show error message if too many are selected
        if (nr_selections > max_toppings) {
            console.log("↑↑ Too many selections ↑↑")

            $('#error-toppings').html('You have selected more than ' + max_toppings + ' toppings.')

            // Disable saving
            $('#add_to_cart').attr("disabled", true);
        }
        else {

            // Reset error messagee
            $('#error-toppings').html("")

            // Allow saving
            $('#add_to_cart').attr("disabled", false);

            // If Add To Cart is pressed, then save item
            $('#add_to_cart').on('click', (event) => add_to_cart(item_id, product_id, topping_ids))
        }

    });
}
