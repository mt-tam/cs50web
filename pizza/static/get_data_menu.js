function get_data_menu(callback) {

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

        const get_products = new XMLHttpRequest();
        get_products.open('GET', '/get_products');

        // Callback function for when request completes
        get_products.onload = () => {

            // Extract JSON data from request
            products = JSON.parse(get_products.responseText);

            // Iterate through each product
            products.forEach(element => {

                // Find the html table body based on product type
                product_table = document.querySelector("table" + "[id=" + CSS.escape(element.type) + "]" + ">tbody")

                // Transform data
                price = "$" + element.price.toFixed(2);
                label = element.type + " - " + element.name
                id = element.id

                // ------------------ ADD PRODUCTS IN TABLE ------------------ //

                // If size is undefined (one size only) or small, then create new row
                if (element.size == "undefined" || element.size == "small") {
                    product_table.innerHTML = product_table.innerHTML + "<tr id='" + label + "'><td>" + element.name + "</td><td>" + price + "<button data-id='" + id + "' class = 'btn buy-btn'>Buy</button></td></tr>";
                }

                // If size is large, then don't create a new row, add a new field on the same row instead
                else {

                    // Exception for Subs - Sausage, Peppers & Onions to create a new row (since it only has Large value)
                    if (element.name == "Sausage, Peppers & Onions") {
                        product_table.innerHTML = product_table.innerHTML + "<tr id='" + label + "'><td>" + element.name + "</td><td></td><td>" + price + "<button data-id='" + id + "'class = 'btn buy-btn'>Buy</button></td></tr>";
                    }
                    else {
                        product_row = document.querySelector("tr" + "[id=" + CSS.escape(label) + "]")
                        product_row.innerHTML = product_row.innerHTML + "<td>" + price + "<button data-id='" + id + "' class = 'btn buy-btn'>Buy</button></td></tr>";
                    }
                }
            })
            // Callback
            callback();
        }


        // Send request
        get_products.send();
    }
    // Send request
    get_product_types.send();


}




