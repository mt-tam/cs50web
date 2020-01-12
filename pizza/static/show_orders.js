function show_orders(orders) {

    // Sort orders by created date (descending order)
    orders.sort(function(a,b){
        return new Date(b.created_on) - new Date(a.created_on);
      });

    let table = $('#orders > table')

    // Create table headers
    const thead = $("<thead class='thead-dark'><tr><th>ID</th><th>Items</th><th>Cost</th><th>User</th><th>Date</th><th>Completed?</th></tr></thead>")
    table.append(thead)

    // Create table body
    const tbody = $('<tbody>')
    table.append(tbody)

    orders.forEach(order => {

        // Create new row in table body
        const row = $("<tr id='" + order.order_id + "'>")
        tbody.append(row)

        // Format Created On date
        let order_date = new Date(order.created_on)
        let created_on = order_date.getFullYear() + "-" + (order_date.getMonth() + 1) + "-" + order_date.getDate() + " " + order_date.getHours() + ":" + order_date.getMinutes() + ":" + order_date.getSeconds()

        // Add ORDER values in row
        row.html("<td>#" + order.order_id + "</td><td><ul id='" + order.order_id + "'></ul></td><td>$" + order.order_cost + "</td><td>" + order.username + "</td><td>" + created_on + "</td><td><button class='btn btn-success order-complete' id='" + order.order_id + "'> ☑️ Done </button>")

        // Add ITEM values in nested table
        item_list = $("ul#" + CSS.escape(order.order_id))

        order.order_items.forEach(item => {

            // Add product label
            let product_label = ("<li><strong>" + item.product_type + " - " + item.product_name + " (" + item.product_size + ")</strong></li>")
            item_list.append(product_label)

            // Add product toppings

            if (item.toppings.length > 0) {
                item_list.append("with ")
                item.toppings.forEach(topping => {
                    item_list.append(topping.topping_name + " | ")
                })
                item_list.append("<br>")
            }
            item_list.append("<br>")
        })

        $('.order-complete').each((index,element) => {
            $(element).on("click", (event) => {
                
                const button_id = $(element).attr('id')
                console.log("button with id #", button_id," was clicked.")
                $('tr#'+button_id).css("background-color", "#c0ffb3")
                
                $(element).off('click');
            })
        })
    })
}