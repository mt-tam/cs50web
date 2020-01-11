/* __________________________________  ↓↓ FUNCTIONS ↓↓  __________________________________ */



/*  → Get Product Types
-------------------------------------------------------- */

function get_product_types() {
    return fetch('/get_product_types').then(response => response.json())
}



/*  → Get Products
-------------------------------------------------------- */

function get_products() {
    return fetch('/get_products').then(response => response.json())
}



/*  → Get Toppings
-------------------------------------------------------- */

function get_toppings() {
    return fetch('/get_toppings').then(response => response.json())
}



/*  → Get Available Toppings
-------------------------------------------------------- */

function get_available_toppings(product_id) {
    return fetch('/get_available_toppings/' + product_id).then(response => response.json())

}


/*  → Get Orders
-------------------------------------------------------- */
function get_orders() {
    return fetch('/get_orders').then(response => response.json())
}
    