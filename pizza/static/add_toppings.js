function add_toppings() {

    // Keep track of item ID 
    let item_id = 0

    // ----------- ON 'CLICKING' ANY BUY BUTTON----------- //

    $('.buy-btn').each(function () {
        $(this).on('click', function () {

            // Get product ID 
            let product_id = parseInt($(this).attr('data-id'));

            // Open up toppings view
            $('#toppings-modal').modal('toggle');

            // Keep track of toppings header text and list of toppings
            const toppings_text = $("#toppings-text");
            const toppings_options = $("#available_toppings");

            // Reset list of options
            toppings_options.html("")
            // Refresh multiple select list to remove all values
            $('.selectpicker').selectpicker('refresh');

            // ---------------- GET AVAILABLE TOPPINGS ----------------- //

            fetch('/get_available_toppings/' + product_id)
                .then(response => response.json())
                .then(response => {

                    // Extract data
                    const available_toppings = response.toppings; // list of toppings
                    const max_toppings = response.max_toppings; // max number of toppings
                    const topping_included = response.topping_included; // boolean (yes/no)

                    // Keep track of selected toppings, if any
                    let topping_ids;

                    // If no toppings allowed, don't even bother
                    if (max_toppings == 0) {
                        toppings_text.html("No toppings allowed.")
                        topping_ids = "";

                    } else {
                        // Show max number of toppings & if toppings are included or not
                        toppings_text.html("You can select up to " + max_toppings + " toppings,")
                        const included = topping_included ? " included in the price" : " not included in the price"
                        toppings_text.html(toppings_text.html() + included)

                        // Generate list of available toppings
                        available_toppings.forEach(topping => {

                            // Show price only if toppings are not included
                            price_included = topping_included ? "" : " ($" + topping.price + ")"

                            // Add options to multiple select list
                            toppings_options.html(toppings_options.html() + "<option value='" + topping.id + "'>" + topping.name + price_included + "</option>")

                            // Refresh multiple select list to contain all newly added values
                            $('.selectpicker').selectpicker('refresh');
                        })
                    }
                    // ----------- ON "CHANGING" TOPPING OPTIONS ----------- //

                    $('#available_toppings').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {

                        // Get IDs of toppings selected & convert them to Integers
                        topping_ids = $(this).val();
                        topping_ids = topping_ids.map(n => parseInt(n))

                        // Check number of toppings selected
                        const nr_selections = $('li.selected').length
                        console.log("You selected : " + nr_selections + "/" + response.max_toppings + " allowed toppings.")

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

                    let count = 0

                    // ------------- ON 'CLICKING' SAVE (TOPPINGS) BUTTON ------------- //

                    $('#save_button').on('click', function () {

                        // Increment item ID
                        ++item_id

                        // Log // Error when save is clicked with two products it simulates two clicks instead of one
                        count++
                        console.log(">>> ERROR: Save button was clicked " + count + " times. [" + Date(Date.now()).toString() + "]")

                        // -------------- SAVE IN LOCAL STORAGE -------------//

                        // Create the new item
                        let item_order = {
                            item_id: item_id,
                            toppings: topping_ids,
                            product_id: product_id,
                        }
                        console.log("New item saved is: ", item_order)

                        // Push new list of items to local storage
                        localStorage.setItem(item_id, JSON.stringify(item_order))

                        // -------------- NOTIFICATION FOR USER ------------- //

                        let success_message = "<strong> Success ! </strong> <br>" + "You have added a new product to your shopping cart"
                        
                        // If there are toppings involved, show them too
                        if (topping_ids) {
                            success_message += " with some toppings."
                        }
                        $("#product-added-success-text").html(success_message)
                        $("#product-added-success").css("display", "block")
                    })
                })
        })
    })
}