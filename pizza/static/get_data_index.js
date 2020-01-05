document.addEventListener('DOMContentLoaded', () => {


    // -------------------- GET PRODUCT TYPES -------------------- //


    // Initialize new request
    const get_product_types = new XMLHttpRequest();
    get_product_types.open('GET', '/get_product_types');

    // Callback function for when request completes
    get_product_types.onload = () => {

        // Extract JSON data from request
        product_types = JSON.parse(get_product_types.responseText);


        // -------------------- CREATE MENU STRUCTURE -------------------- //


        var menu = document.querySelector('#menu');
        menu.setAttribute("style", "margin: 50px 300px 50px 300px")

        // Iterate through product types
        product_types.forEach(element => {

            // ------ DIV ------ //

            // Create div for each product type
            type_div = document.createElement('div')
            // Set ID value for each div
            type_div.setAttribute("id", element);
            // Add type div to menu div
            menu.appendChild(type_div);

            // ------ HEADER ------ //

            // Create header for each product type
            var header = document.createElement('h3');
            // Add text for each header
            header.innerHTML = element;
            // Add header to type div
            type_div.appendChild(header);

            // ------ TABLE ------ //

            // Create table for each product type
            var table = document.createElement('table');
            // Add class to table
            table.classList.add("table", "table-sm");
            // Add table headers
            if (element == "Pasta" || element == "Salad") {
                table.innerHTML = "<thead><tr><th style='width:60%'>Item</th><th style='width:40%'>Price</th></tr></thead><tbody></tbody>";
            }
            else {
                table.innerHTML = "<thead><tr><th style='width:60%'>Item</th><th style='width:20%'>Small</th><th style='width:20%'>Large</th></tr></thead><tbody></tbody>";
            }
            // Set ID value for each table
            table.setAttribute("id", element);
            // Add table to type div
            type_div.appendChild(table);
        });


        // --------------------GET PRODUCTS -------------------- //


        // Initialize new request
        const get_products = new XMLHttpRequest();
        get_products.open('GET', '/get_products');

        // Callback function for when request completes
        get_products.onload = () => {

            // Extract JSON data from request
            products = JSON.parse(get_products.responseText);

            // Iterate through each product
            products.forEach(element => {

                // Find the relevant table based on product type
                product_table = document.querySelector("table" + "[id=" + CSS.escape(element.type) + "]" + ">tbody")

                // Transform data
                price = "$" + element.price.toFixed(2);
                label = element.type + " - " + element.name

                // If size is undefined (one size only) or small, then create new row
                if (element.size == "undefined" || element.size == "small") {
                    product_table.innerHTML = product_table.innerHTML + "<tr id='" + label + "'><td>" + element.name + "</td><td>" + price + "</td></tr>";
                }
                // If size is large, then don't create a new row, add a new field on the same row instead
                else {
                    // Manual exception for Subs - Sausage, Peppers & Onions to create a new row (since it only has Large value)
                    if (element.name == "Sausage, Peppers & Onions") {
                        product_table.innerHTML = product_table.innerHTML + "<tr id='" + label + "'><td>" + element.name + "</td><td></td><td>" + price + "</td></tr>";
                    }
                    else {
                        product_row = document.querySelector("tr" + "[id=" + CSS.escape(label) + "]");
                        console.log(product_row)
                        product_row.innerHTML = product_row.innerHTML + "<td>" + price + "</td>";
                    }
                }

            })
        }

        // Send request
        get_products.send();


        // --------------------GET TOPPINGS-------------------- //


        // Initialize new request
        const get_toppings = new XMLHttpRequest();
        get_toppings.open('GET', '/get_toppings');

        // Callback function for when request completes
        get_toppings.onload = () => {

            // Extract JSON data from request
            toppings = JSON.parse(get_toppings.responseText);

            // Add Toppings div, header, table
            menu.innerHTML = menu.innerHTML + "<div id='Toppings'><h3>Toppings</h3><table class ='table table-sm' id='Toppings'><thead><tr><th style='width:60%'></th><th style='width:40%'>Price</th></tr></thead><tbody></tbody></table></div>"
            toppings_table = document.querySelector("table#Toppings > tbody")

            // Add Topping values inside table
            toppings.forEach(element => {
                price = "$" + element.price.toFixed(2);
                toppings_table.innerHTML = toppings_table.innerHTML + "<tr><td>" + element.name + "</td>" + "<td>" + price + "</td></tr>";
            })
        }

        // Send request
        get_toppings.send();
    }

    // Send request
    get_product_types.send();
});


