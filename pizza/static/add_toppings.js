function add_toppings() {

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
            toppings_list = document.querySelector("#toppings-text");
            toppings_options = document.querySelector("#available_toppings");
            toppings_options.innerHTML = ""
            $('#error-toppings').html(" ")

            // Initialize new request
            const get_available_toppings = new XMLHttpRequest();
            get_available_toppings.open('GET', '/get_available_toppings/' + product_id);

            // Callback function for when request completes
            get_available_toppings.onload = () => {

                // Extract JSON data from request
                var response = JSON.parse(get_available_toppings.responseText);
                var available_toppings = response.toppings;
                var max_toppings = response.max_toppings;
                console.log("max_toppings v1: ", max_toppings)
                var topping_included = response.topping_included;

                // If no topping allowed then tell the user
                if (max_toppings == 0) {
                    toppings_list.innerHTML = "No toppings allowed."
                }
                else {
                    // Show user no. of toppings that can be selected
                    toppings_list.innerHTML = "You can select up to " + max_toppings + " toppings,"

                    // Show user if toppings are included in the price
                    included = topping_included ? " included in the price" : " not included in the price"
                    toppings_list.innerHTML = toppings_list.innerHTML + included

                    // Show user the available toppings
                    available_toppings.forEach(topping => {
                        price_included = topping_included ? "" : " ($" + topping.price + ")"
                        toppings_options.innerHTML = toppings_options.innerHTML + "<option value='" + topping.id + "'>" + topping.name + price_included + "</option>"
                        $('.selectpicker').selectpicker('refresh');
                    })
                }
                // Check when topping selections are updated
                $('#available_toppings').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                    localStorage.clear()

                    // Get ids of toppings selected
                    topping_ids = $(this).val();
                    console.log(topping_ids);

                    // Save product & topping IDs to local storage
                    var item_order = {
                        'toppings': topping_ids,
                        'product': product_id,
                    }
                    localStorage.setItem('item_order', JSON.stringify(item_order))
                    console.log(JSON.parse(localStorage.getItem('item_order')))

                    // Check number of toppings selected
                    var nr_selections = $('li.selected').length
                    console.log(nr_selections, " toppings selected.")

                    console.log("max_toppingsv2: ", max_toppings)

                    if (max_toppings < nr_selections) {
                        $('#error-toppings').html('You have selected more than ' + max_toppings + ' toppings.')
                        console.log("Too many selections")
                        $('#save_button').attr("disabled", true);
                    }
                });
            }
            // Send request
            get_available_toppings.send();


        })
    })
}