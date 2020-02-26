var currentOrders = []; // Temp way to see which orders the user currently have in their basket, should be in a DB in the future??

function addItem(itemID) {
  console.log("addItem: " + itemID);
  if (currentOrders.length > 0) {
    for (i = 0; i < currentOrders.length; i++) {
      if (itemID === currentOrders[i].id) {
        // Checks if the added item already exists
        newQuant = currentOrders[i].quantity + 1;
        currentOrders[i].quantity = newQuant; // Then we just increase its quant and doesn't make a new entry
        return 0; // To break out of the function
      }
    }
  }
  // Otherwise we just make a new object to push into the orders
  newOrder = {
    id: itemID,
    quantity: 1
  };
  currentOrders.push(newOrder);
}

function getOrders() {
  // Here we should get order from a specific user/table id etc
  // Right now it's just the one though :(

  return currentOrders;
}

/**
 * This function renders all the orders to the "order-cart"
 */
function renderOrders() {
  var orderItems = $();
  var renderedMenuItems = getMergedRenderedMenuItemsArray(); // Get all the rendered menu items to access information about them
  var orderList = getOrders(); // Gets all the orders to render them. This should in the future be for just one user/table
  for (i = 0; i < orderList.length; i++) {
    for (j = 0; j < renderedMenuItems.length; j++) {
      if (orderList[i].id === renderedMenuItems[j].artikelid) {
        // Finds the item in the orderList in the rendered beverages to get more info about it, i.e. name
        $(".order-item").remove(); // Ugly but removes the previous orders before they're added again with some changes... To avoid duplicates
        var name = "<t>" + renderedMenuItems[j].namn + "</t>";
        var quantity = "<t>" + orderList[i].quantity + "</t>";
        orderItems = orderItems.add(
          "<div class=order-item id=" +
            orderList[i].id +
            ">" +
            name +
            " " +
            quantity +
            "</div>"
        );
      }
    }
  }
  $(".order-list-div").append(orderItems);
}

function addItemAndRenderToScreen(itemID) {
  addItem(itemID);
  renderOrders();
}
