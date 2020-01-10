document.addEventListener('DOMContentLoaded', () => {

    // -------------------- GET PRODUCT TYPES -------------------- //
    fetch('/get_product_types')
        .then(response => response.json())
        .then(product_types => {

            // -------------------- CREATE MENU STRUCTURE -------------------- //
            const menu = $('#menu');

            // Iterate through product types
            product_types.forEach(element => {

                // ------ CREATE ELEMENTS ------ //

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

                // ------ APPEND ELEMENTS ------ //

                // Add type div to menu div
                menu.append(div);

                // Add header to type div
                div.append(header); 

                // Add table to type div
                div.append(table);

            });

            // --------------------GET PRODUCTS -------------------- //

            fetch('/get_products')
                .then(response => response.json())
                .then(products => {

                    // Iterate through each product
                    products.forEach(element => {

                        // Find the html table body based on product type
                        product_table = $("table" + "[id=" + CSS.escape(element.type) + "]" + ">tbody")

                        // Transform data
                        const price = "$" + element.price.toFixed(2);
                        const label = element.type + " - " + element.name
                        const id = element.id

                        // ------------------ ADD PRODUCTS IN TABLE ------------------ //

                        // If size is undefined (one size only) or small, then create new row
                        if (element.size == "undefined" || element.size == "small") {
                            product_table.html(product_table.html() + "<tr id='" + label + "'><td>" + element.name + "</td><td>" + price + "</td></tr>");
                        }

                        // If size is large, then don't create a new row, add a new field on the same row instead
                        else {

                            // Exception for Subs - Sausage, Peppers & Onions to create a new row (since it only has Large value)
                            if (element.name == "Sausage, Peppers & Onions") {
                                product_table.html(product_table.html() + "<tr id='" + label + "'><td>" + element.name + "</td><td></td><td>" + price + "</td></tr>");
                            }
                            else {
                                product_row = $("tr" + "[id=" + CSS.escape(label) + "]")
                                product_row.html(product_row.html() + "<td>" + price + "</td></tr>");
                            }
                        }
                    })

                    // --------------------GET TOPPINGS-------------------- //
                    fetch('/get_toppings')
                        .then(response => response.json())
                        .then(toppings => {

                            // Add Toppings div, header, table
                            menu.html(menu.html() + "<div id='Toppings'><h3>Toppings</h3><table class ='table table-sm' id='Toppings'><thead><tr><th style='width:60%'></th><th style='width:40%'>Price</th></tr></thead><tbody></tbody></table></div>");
                            const toppings_table = $("table#Toppings > tbody")

                            // Add Topping values inside table
                            toppings.forEach(element => {
                                const price = "$" + element.price.toFixed(2);
                                toppings_table.html(toppings_table.html() + "<tr><td>" + element.name + "</td>" + "<td>" + price + "</td></tr>");
                            })
                        })
                })
        })
})









