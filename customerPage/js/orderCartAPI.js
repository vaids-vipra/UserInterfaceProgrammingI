var currentOrders = []; // Temp way to see which orders the user currently have in their basket, should be in a DB in the future??
var renderedItems = [];

/**
 * Function to add item to cart
 * @param {string} itemID
 */
function addItem(itemID) {
  $(".order-cart-container").show(); // The cart should be shown now that it's >0 items in it
  // We have orders
  if (currentOrders.length > 0) {
    for (i = 0; i < currentOrders.length; i++) {
      if (itemID === currentOrders[i].id) {
        // Checks if the added item already exists
        newQuant = currentOrders[i].quantity + 1;
        currentOrders[i].quantity = newQuant; // Then we just increase its quant and doesn't make a new entry
        renderOrders();
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
  renderOrders();
}

/**
 * Empties the order cart
 */
function emptyOrderCart() {
  $(".order-item").remove();
  currentOrders = [];
  upDatePrice();
}
/**
 * Removes an item from the cart
 * @param {string} itemID
 */

function removeItem(itemID) {
  for (var i = 0; i < currentOrders.length; i++) {
    if (itemID === currentOrders[i].id) {
      // Found the item in currentOrders
      if (currentOrders[i].quantity > 1) {
        // Just change the quantity
        var newQuant = currentOrders[i].quantity - 1;
        currentOrders[i].quantity = newQuant;
      } else {
        // SHould be removed
        currentOrders.splice(i, 1);
        if (currentOrders.length === 0) {
          emptyOrderCart(); // No orders are left
        }
      }
    }
  }
  renderOrders();
}

/**
 * TODO
 */

function orderButtonClicked() {
  var price = getPriceOfOrder(); // This should be added to a saldo
  var payment = $("input[name='payment']:checked").val(); // in-app or to-bartender + add-credit (for vip)
  console.log(payment); 
  if (payment === undefined) {
    if (getLanguage() === "swedish") {
      alert("Var vänlig välj betalningsmetod!");
    } else {
      alert("Please choose payment method");
    }
  } else {
    var pickup = $("input[name='serving']:checked").val(); //pickup-self or served (only valid for VIP)
    console.log(pickup);
    var str = "";
    for (var i = 0; i < currentOrders.length; i++) {
      // This for loop now just creates a string, but it should add orders for the bartender to see
      str =
        str +
        " " +
        currentOrders[i].quantity +
        " of the artikelid: " +
        currentOrders[i].id;
    }
    emptyOrderCart();
    alert(
      "The customer ordered: " +
        str +
        " to a price of: " +
        price +
        "\n This needs to integrate with the bartender etc"
    );
  }
}

/**
 * Helper function to return the current orders
 */
function getOrders() {
  return currentOrders;
}

/**
 * This function renders all the orders to the "order-cart"
 */
function renderOrders() {
  renderedItems = getCurrentlyRenderedItems();
  var orderList = getOrders();
  var orderItems = $();
  for (var i = 0; i < orderList.length; i++) {
    for (var j = 0; j < renderedItems.length; j++) {
      if (orderList[i].id === renderedItems[j].artikelid) {
        $(".order-item").remove(); // Ugly but removes the previous orders before they're added again with some changes... To avoid duplicates
        var name = "<t>" + renderedItems[j].namn + "</t>";
        var quantity = "<t>" + orderList[i].quantity + "</t>";
        orderItems = orderItems.add(
          "<div class=order-item id=" +
            orderList[i].id +
            ">" +
            name +
            " " +
            "<button class=minus-button onclick=removeItem(event.target.parentElement.id)>-</button>" +
            quantity +
            "<button class=plus-button onclick=addItemAndRenderToScreen(event.target.parentElement.id)>+</button>" +
            "</div>"
        );
      }
    }
  }
  upDatePrice();
  $(".order-list-div").append(orderItems);
}

function upDatePrice() {
  $("#price-box t").remove();
  var price = getPriceOfOrder();
  $("#price-box").append("<t>" + price + " SEK</t>");
}

function getPriceOfOrder() {
  var price = 0;
  for (var i = 0; i < currentOrders.length; i++) {
    for (var j = 0; j < renderedItems.length; j++) {
      if (currentOrders[i].id === renderedItems[j].artikelid) {
        price =
          price +
          parseFloat(renderedItems[j].salePrice) *
            parseFloat(currentOrders[i].quantity);
      }
    }
  }
  price = Math.floor(price * 100) / 100;
  return price;
}

function addItemAndRenderToScreen(itemID) {
  addItem(itemID);
  renderOrders();
}
