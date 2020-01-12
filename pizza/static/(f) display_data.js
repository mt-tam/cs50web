/* __________________________________  ↓↓ FUNCTIONS ↓↓  __________________________________ */



/*  → Display Product Types
-------------------------------------------------------- */

function display_product_types(product_types) {

    const menu = $('#menu');

    // Iterate through product types
    product_types.forEach(element => {

        // Create div for each product type
        const div = $("<div id='" + element + "'></div")

        // Create header for each product type
        const header = $("<h3>" + element + "</h3")
        header.text(element)

        // Create table for each product type
        const table = $("<table class='table table-sm' id='" + element + "'></table>")

        // Create table headers
        if (element == "Pasta" || element == "Salad") {
            table.html("<thead><tr><th style='width:60%'>Item</th><th style='width:40%'>Price</th></tr></thead><tbody></tbody>");
        }
        else {
            table.html("<thead><tr><th style='width:60%'>Item</th><th style='width:20%'>Small</th><th style='width:20%'>Large</th></tr></thead><tbody></tbody>")
        }

        // Add type div to menu div
        menu.append(div);

        // Add header to type div
        div.append(header);

        // Add table to type div
        div.append(table);

    });
    
}



/*  → Get Products
-------------------------------------------------------- */

function get_products() {
    return fetch('/get_products').then(response => response.json())
}



/*  → Display Products
-------------------------------------------------------- */

function display_products(products) {

    // Iterate through each product
    products.forEach(element => {

        // Find the html table body based on product type
        product_table = $("table" + "[id=" + CSS.escape(element.type) + "]" + ">tbody")

        // Transform data
        const price = "$" + element.price.toFixed(2);
        const label = element.type + " - " + element.name
        const id = element.id

        // If size is undefined (one size only) or small, then create new row
        if (element.size == "undefined" || element.size == "small") {
            product_table.html(product_table.html() + "<tr id='" + label + "'><td>" + element.name + "</td><td class='product' id='" + id + "'>" + price + "</td></tr>");
        }

        // If size is large, then don't create a new row, add a new field on the same row instead
        else {

            // Exception for Subs - Sausage, Peppers & Onions to create a new row (since it only has Large value)
            if (element.name == "Sausage, Peppers & Onions") {
                product_table.html(product_table.html() + "<tr id='" + label + "'><td>" + element.name + "</td><td></td><td class='product' id='" + id + "'>" + price + "</td></tr>");
            }
            else {
                product_row = $("tr" + "[id=" + CSS.escape(label) + "]")
                product_row.html(product_row.html() + "<td class='product' id='" + id + "'>" +  price + "</td></tr>");
            }
        }
    })
}



/*  → Get Toppings
-------------------------------------------------------- */

function get_toppings() {
    return fetch('/get_toppings').then(response => response.json())
}



/*  → Display Toppings
-------------------------------------------------------- */

function display_toppings(toppings) {

    const menu = $('#menu');

    // Add Toppings div, header, tablew
    menu.html(menu.html() + "<div id='Toppings'><h3>Toppings</h3><table class ='table table-sm' id='Toppings'><thead><tr><th style='width:60%'></th><th style='width:40%'>Price</th></tr></thead><tbody></tbody></table></div>");
    const toppings_table = $("table#Toppings > tbody");

    // Add Topping values inside table
    toppings.forEach(element => {
        const price = "$" + element.price.toFixed(2);
        toppings_table.html(toppings_table.html() + "<tr><td>" + element.name + "</td>" + "<td>" + price + "</td></tr>");
    })
}




/*  → Display Buy Buttons
-------------------------------------------------------- */


function display_buy_buttons() {

    $('.product').each( (index, element) => {
        product = $(element)
        product.append("<button class='btn buy-btn' id='" + product.attr('id') + "'>Buy</button>")

    })
}



/*  → Display Available Toppings
-------------------------------------------------------- */


function display_available_toppings(product_id, max_toppings, available_toppings, topping_included) {

    // Show max number of toppings
    $("#toppings-text").html("You can select up to " + max_toppings + " toppings,")

    // Reset available toppings
    $("#available_toppings").html("")

    // Show available toppings
    available_toppings.forEach(topping => {

        // Show price or if topping is included
        price_included = topping_included ? " (included)" : " ($" + topping.price + ")"

        // Add options to multiple select list
        $("#available_toppings").append("<option value='" + topping.id + "'>" + topping.name + price_included + "</option>")

        // Refresh multiple select list to contain all newly added values
        $('.selectpicker').selectpicker('refresh');
    })
}