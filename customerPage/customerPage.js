//Beer Ã–l

var currentRenderedObjects = [];

$(function() {
  console.log("first called");
  $(".beverages-list li").on("click", function(e) {
    e.preventDefault();
    var beveragesToRender = [];
    $(".menuItem").remove();
    if (e.target.id === "liquor") {
      beveragesToRender = findStrongBeveregesToShow(30);
    } else {
      beveragesToRender = findBeveragesToShow(e.target.id, DB2.spirits);
    }

    var menuItems = $();

    for (x = 0; x < beveragesToRender.length; x++) {
      var item = beveragesToRender[x].namn;
      var price =
        "<t>" + "   " + beveragesToRender[x].prisinklmoms + "SEK" + "</t>";
      var moreInfoBtn =
        "<button class=more-info-button value=" +
        beveragesToRender[x].artikelid +
        ">More information</button>";
      var orderButton =
        "<button class=order-button id=" +
        beveragesToRender[x].artikelid +
        ">Order</button>";
      menuItems = menuItems.add(
        "<div class=menuItem id=" +
          beveragesToRender[x].artikelid +
          ">" +
          item +
          price +
          moreInfoBtn +
          orderButton +
          "</div>"
      );
    }

    currentRenderedObjects = beveragesToRender;

    $(".beverages-list ").append(menuItems);

    $(".order-button").on("click", function(e) {
      var orderItems = $();
      addItem(e.target.id); // Calls the order API
      var orderList = getOrders();
      for (i = 0; i < orderList.length; i++) {
        for (j = 0; j < currentRenderedObjects.length; j++) {
          if (orderList[i].id === currentRenderedObjects[j].artikelid) {
            $(".order-item").remove();
            var name = "<t>" + currentRenderedObjects[j].namn + "</t>";
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
    });

    $(".more-info-button").on("click", function(e) {
      var moreInfo = $();
      for (i = 0; i < beveragesToRender.length; i++) {
        if (beveragesToRender[i].artikelid === e.target.value) {
          console.log(beveragesToRender[i]);
          var origin =
            "<t>" + "Origin: " + beveragesToRender[i].ursprung + "</t>";
          var producer =
            "<t>" + "Producer: " + beveragesToRender[i].producent + "</t>";
          var closeButton = "<button id=close-button>Close</button>";
          moreInfo = moreInfo.add(
            "<div id=more-info-box>" +
              origin +
              producer +
              closeButton +
              "</div>"
          );
        }
      }
      $("#" + e.target.value + ".menuItem").append(moreInfo);
      $("#close-button").on("click", function() {
        $("#more-info-box").remove();
      });
    });
  });
});

function findStrongBeveregesToShow(percentage) {
  var strongBeverages = [];
  console.log("sp");
  for (i = 0; i < DB2.spirits.length; i++) {
    if (parseFloat(DB2.spirits[i].alkoholhalt) >= percentage) {
      strongBeverages.push(DB2.spirits[i]);
    }
  }
  console.log(strongBeverages.length);
  return findBeveragesToShow("liquor", strongBeverages);
}

function findBeveragesToShow(type, listOfSpirits) {
  var beveragesToShow = [];
  if (type === "liquor") {
    console.log(listOfSpirits[0]);
    for (i = 0; i < PubDB.spirits.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit;
        if (PubDB.spirits[i].beverage_id === listOfSpirits[j].artikelid) {
          console.log(listOfSpirits[j]);
          beveragesToShow.push(listOfSpirits[j]);
        }
      }
    }
  } else {
    for (i = 0; i < PubDB.spirits.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit = listOfSpirits[j];
        if (PubDB.spirits[i].beverage_id === spirit.artikelid) {
          if (spirit.varugrupp.includes(type)) {
            beveragesToShow.push(spirit);
          }
        }
      }
    }
  }
  return beveragesToShow;
}

/* 

    // TEmp
	$("#tempButton").on("click", function() {
		console.log(PubDB.spirits);
		for (i = 0; i < 20; i++) {
			var randomNumber = Math.floor(Math.random() * DB2.spirits.length);
			console.log(DB2.spirits[randomNumber].artikelid);
		}
	});

// Temp function - fills the supply with something to test out stuff
	$("#tempButton").on("click", function() {
		console.log(PubDB.spirits);
        var objectToPush = {
            beverage_id: "",
            stock: 0
        }
		for (i = 0; i < 20; i++) {
			var randomNumber = Math.floor(Math.random() * DB2.spirits.length);
			console.log(DB2.spirits[randomNumber].artikelid);
			objectToPush = {
                beverage_id: DB2.spirits[randomNumber].artikelid,
                stock: 1
            } 
            console.log(objectToPush)
            for(j = 0; j < PubDB.spirits.length; j++) {
                var itemInPubDB = PubDB.spirits[j]
                if(PubDB.spirits[j].beverage_id === objectToPush.beverage_id) {
                    PubDB.spirits[j] = {
                        beverage_id: itemInPubDB.beverage_id,
                        stock: itemInPubDB.stock + 1
                    }
                }
                else {
                    PubDB.spirits.push(objectToPush)
                }
            }
        }
    });
    
    */

/*    // ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  
  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
/*
$('.add-to-cart').click(function(event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for(var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
*/
