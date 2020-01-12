function add_to_cart(item_id, product_id, topping_ids) {

    // -------------- SAVE IN LOCAL STORAGE -------------//

    // Create the new item
    let item_order = {
        item_id: item_id,
        toppings: topping_ids,
        product_id: product_id,
    }
    console.log(">>> New item was added to cart: ", item_order)

    // Push new list of items to local storage
    localStorage.setItem(item_id, JSON.stringify(item_order))


    // -------------- NOTIFICATION FOR USER ------------- //

    let success_message = "<strong> Success ! </strong> <br>" + "You have added a new product to your shopping cart"

    // If there are toppings involved, show them too
    console.log(topping_ids.length)
    if (topping_ids.length != 0) {
        success_message += " with some toppings."
    }
    $("#product-added-success-text").html(success_message)
    $("#product-added-success").removeClass('alert-primary').addClass('alert-success')
    $("#product-added-success").css("display", "block")
}