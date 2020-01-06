function add_toppings() {

    // Get all 'BUY' buttons
    const buy_buttons = document.querySelectorAll('.buy-btn')
    console.log(">>> Toppings function was triggered.")

    // Keep track of selected items (& increment item_id)
    let items = []
    let item_id = 0


    // Trigger if any one of them is clicked
    buy_buttons.forEach(item => {
        item.addEventListener('click', event => {

            // Log
            console.log(">>> BUY button was clicked.")

            // Get product ID from clicked button
            const product_id = item.getAttribute('data-id');
            
            // Increment item id
            ++item_id

            // LOGS TO FIND THE CRAZY ERROR
            console.log("You clicked on product #", product_id)
            console.log("You are now at item #", item_id)

            // Open up toppings modal view
            $('#toppings-modal').modal('toggle');

            // Keep track of toppings header text and list of toppings
            const toppings_text = $("#toppings-text");
            const toppings_options = $("#available_toppings");

            // Reset list of toppings & error message
            toppings_options.html("")
            $('#error-toppings').html("")


            // ---------------- GET AVAILABLE TOPPINGS ----------------- //

            // Initialize new request
            fetch('/get_available_toppings/' + product_id)
                .then(response => response.json())
                .then(response => {

                    // Extract data from server response
                    const available_toppings = response.toppings; // list of toppings
                    const max_toppings = response.max_toppings; // max number of toppings
                    const topping_included = response.topping_included; // boolean (yes/no)

                    // Create toppings view

                    if (max_toppings == 0) {

                        // If no topping allowed then tell the user
                        toppings_text.html("No toppings allowed.")
                    }
                    else {

                        // Show user max number of toppings
                        toppings_text.html("You can select up to " + max_toppings + " toppings,")

                        // Show user if toppings are included in the price
                        const included = topping_included ? " included in the price" : " not included in the price"
                        toppings_text.html(toppings_text.html() + included)

                        // Generate available toppings
                        available_toppings.forEach(topping => {

                            // Show price only if toppings are not included
                            price_included = topping_included ? "" : " ($" + topping.price + ")"

                            // Add options to multiple select list
                            toppings_options.html(toppings_options.html() + "<option value='" + topping.id + "'>" + topping.name + price_included + "</option>")

                            // Refresh multiple select list to contain all newly added values
                            $('.selectpicker').selectpicker('refresh');
                        })

                    }
                    // Log
                    console.log(">>> Successfully loaded toppings.");

                    // Check when topping selections are updated [ ERROR IS SOMEWHERE BELOW !!! ]
                    $('#available_toppings').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {

                        // Get ids of toppings selected
                        const topping_ids = $(this).val();

                        // Save product & topping IDs to local storage
                        const item_order = {
                            'item_id': item_id,
                            'toppings': topping_ids,
                            'product_id': product_id,
                        }
                        
                        // LOGGING TO FIND OUT THE ERROR
                        console.log("--------------------")
                        console.log("-> Current item order:")
                        console.log(item_order)
                        console.log("<>")

                        // Check number of toppings selected
                        const nr_selections = $('li.selected').length

                        // LOGGING TO FIND OUT THE ERROR
                        console.log("<>")
                        console.log("-> Number of selections: #", nr_selections)
                        console.log("-> Max nr. of toppings allowed: #", max_toppings)
                        console.log("--------------------")

                        // Show error message if too many are selected
                        if (nr_selections > max_toppings) {
                            console.log("Too many selections")

                            $('#error-toppings').html('You have selected more than ' + max_toppings + ' toppings.')

                            // Disable saving
                            $('#save_button').attr("disabled", true);
                        }
                        else {
                            // Allow saving
                            $('#save_button').attr("disabled", false);
                        }
                    });
                });
            /*
    
            // When user presses "Save", save item to local storage
            $('#save_button').on('click', function () {
    
                // Check
                console.log("Save button was clicked.")
    
                // Reset local storage
                localStorage.clear()
    
                // Add new item to list of items
                items.push(item_order)
    
                // Push new list of items to local storage
                localStorage.setItem('items', JSON.stringify(items))
    
                // Print most updated local storage
                console.log(JSON.parse(localStorage.getItem('items')))
            })*/
        })
    })
}