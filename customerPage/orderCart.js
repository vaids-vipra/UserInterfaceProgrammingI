var currentOrders = []; // Temp way to see which orders the user currently have in their basket, should be in a DB in the future??
var renderedItems = [];

function addItem(itemID) {
  $("#order-button").show();
  $(".order-cart-container").show();
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

function removeItem(itemID) {
  for (var i = 0; i < currentOrders.length; i++) {
    if (itemID === currentOrders[i].id) {
      if (currentOrders[i].quantity > 1) {
        var newQuant = currentOrders[i].quantity - 1;
        currentOrders[i].quantity = newQuant;
        console.log(currentOrders);
      } else {
        currentOrders.splice(i, 1);
        if (currentOrders.length === 0) {
          emptyOrderCart(); // No orders are left
        }
      }
    }
  }
  renderOrders();
}

function orderButtonClicked() {
  emptyOrderCart();
  alert("This needs to integrate with the bartender etc");
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
  console.log("calleds")
  console.log(currentOrders)
  console.log(renderedItems)
  var price = 0;
  for (var i = 0; i < currentOrders.length; i++) {
    for (var j = 0; j < renderedItems.length; j++) {
      if (currentOrders[i].id === renderedItems[j].artikelid) {
        console.log("match")
        console.log(currentOrders[i])
        console.log(renderedItems[j])
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




// SOME OLD FUNCTIONS WITH OLD DB
// IGNORE

/*
function renderOrders() {
  var articleIdPropertyName, namePropertyName;
  switch (getLanguage()) {
    case "english":
      articleIdPropertyName = "articleid";
      namePropertyName = "name";
      break;
    case "swedish":
      articleIdPropertyName = "artikelid";
      namePropertyName = "namn";
  }
  var orderItems = $();
  var renderedMenuItems = getMergedRenderedMenuItemsArray(); // Get all the rendered menu items to access information about them
  var orderList = getOrders(); // Gets all the orders to render them. This should in the future be for just one user/table
  console.log(renderedMenuItems);
  for (var i = 0; i < orderList.length; i++) {
    for (var j = 0; j < renderedMenuItems.length; j++) {
      console.log(
        "orderlist id: " +
          orderList[i].id +
          "renderedMenuItems art id: " +
          renderedMenuItems[j][articleIdPropertyName]
      );
      if (orderList[i].id === renderedMenuItems[j][articleIdPropertyName]) {
        console.log(
          "Match: orderlistID: " +
            orderList[i].id +
            " and renderedItemJID: " +
            renderedMenuItems[j][articleIdPropertyName]
        );
      }
    }
  }
  $(".order-list-div").append(orderItems);
}

          var name = "<t>" + renderedMenuItems[j][namePropertyName] + "</t>";
          var quantity = "<t>" + orderList[i].quantity + "</t>";
          orderItems = orderItems.add(
            "<div class=order-item id=" +
              orderList[i].id +
              ">" +
              name +
              " " +
              "<button onclick=removeItem(event.target.parentElement.id)>-</button>" +
              quantity +
              "<button onclick=addItemAndRenderToScreen(event.target.parentElement.id)>+</button>" +
              "</div>"
          );
*/

/*
OLD LANGUAGE SUPPORT
RENDERORDERS
if (orderList[i].language === "swedish") {
      for (var j = 0; j < renderedItems.length; j++) {
        if (orderList[i].id === renderedItems[j].artikelid) {
          // TODO: Remove code duplication

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
    } else {
      for (var j = 0; j < renderedItems.length; j++) {
        if (orderList[i].id === renderedItems[j].articleid) {
          $(".order-item").remove(); // Ugly but removes the previous orders before they're added again with some changes... To avoid duplicates
          var name = "<t>" + renderedItems[j].name + "</t>";
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

  function getPriceOfOrder() {
  var price = 0;
  for (var i = 0; i < currentOrders.length; i++) {
    if (currentOrders[i].language === "swedish") {
      for (var j = 0; j < renderedItems.length; j++) {
        if (currentOrders[i].id === renderedItems[j].artikelid) {
          price =
            price +
            parseFloat(renderedItems[j].prisinklmoms) *
              parseFloat(currentOrders[i].quantity);
        }
      }
    }
    if (currentOrders[i].language === "english") {
      for (var j = 0; j < renderedItems.length; j++) {
        if (currentOrders[i].id === renderedItems[j].articleid) {
          price =
            price + renderedItems[j].priceinclvat * currentOrders[i].quantity;
        }
      }
    }
  }
  price = Math.floor(price * 100) / 100;
  return price;
}

*/
