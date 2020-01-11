function add_toppings() {

    let topping_ids;
    let product_id;

    // ----------- ON 'CLICKING' ANY BUY BUTTON----------- //

    $('.buy-btn').each((index, element) => {
        $(element).on('click', (event) => {

            // Reset Topping IDs
            topping_ids = "";

            // Get Product ID
            product_id = parseInt($(event.currentTarget).attr('id'));

            // Show *Toppings* View
            $('#toppings-modal').modal('toggle');

            // Keep track of toppings header text and list of toppings
            const toppings_text = $("#toppings-text");
            const toppings_options = $("#available_toppings");

            // Reset list of options
            toppings_options.html("")

            // Refresh multiple select list to remove all values
            $('.selectpicker').selectpicker('refresh');

            // ---------------- SHOW AVAILABLE TOPPINGS ----------------- //

            // Get Available Toppings from server
            get_available_toppings(product_id)
                .then(response => {

                    // Extract data
                    const available_toppings = response.toppings; // list of toppings
                    const max_toppings = response.max_toppings; // max number of toppings
                    const topping_included = response.topping_included; // boolean (yes/no)

                    // If no toppings allowed, don't even bother
                    if (max_toppings == 0) {
                        toppings_text.html("No toppings allowed.")


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
                        console.log(topping_ids)

                        // Check number of toppings selected
                        const nr_selections = $('li.selected').length
                        console.log("You selected : " + nr_selections + "/" + response.max_toppings + " allowed toppings.")

                        // Show error message if too many are selected
                        if (nr_selections > max_toppings) {
                            console.log("Too many selections")

                            $('#error-toppings').html('You have selected more than ' + max_toppings + ' toppings.')

                            // Disable saving
                            $('#add_to_cart').attr("disabled", true);
                        }
                        else {
                            // Allow saving
                            $('#add_to_cart').attr("disabled", false);
                        }
                        return (product_id, topping_ids)
                    });
                })
        })
    })
}