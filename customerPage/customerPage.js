//Beer Ã–l

var currentRenderedObjects = [];

$(function() {
  /**
   * When a menu-"header" (i.e. beer) is slicked
   */
  $(".beverages-list li").on("click", function(e) {
    e.preventDefault();
    var beveragesToRender = [];
    $(".menuItem").remove(); // Removes all items from the menu since we want to render new
    if (e.target.id === "liquor") {
      // Currently all beverages with alc % > 30 are placed under liquor
      beveragesToRender = findStrongBeveregesToShow(30); // If liquor was clicked we find all strong bev first
    } else {
      beveragesToRender = findBeveragesToShow(e.target.id, DB2.spirits); // Otherwise we just find all sprits that match our id (I.e. beer or wine atm)
    }

    var menuItems = $(); // Jquery object that we'll fill with spirits below

    /**
     * This for loop creates a div for every bev that we're gonna render
     * Adds it to the menuItem jquery object
     */
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

    $(".beverages-list ").append(menuItems); //Appends all the above created divs to our beverage list

    /**
     * Someone clicked order-button
     */
    $(".order-button").on("click", function(e) {
      var orderItems = $();
      addItem(e.target.id); // Calls the order API
      var orderList = getOrders(); // Gets all the orders to render them. This should in the future be for just one user/table
      for (i = 0; i < orderList.length; i++) { 
        for (j = 0; j < currentRenderedObjects.length; j++) {
          if (orderList[i].id === currentRenderedObjects[j].artikelid) { // Finds the item in the orderList in the rendered beverages to get more info about it, i.e. name
            $(".order-item").remove(); // Ugly but removes the previous orders before they're added again with some changes... To avoid duplicates 
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

    /**
     * This should probably be moved to a "menu-API"... Well it works now.
     * 
     */

    $(".more-info-button").on("click", function(e) {
      var moreInfo = $();
      for (i = 0; i < beveragesToRender.length; i++) {
        if (beveragesToRender[i].artikelid === e.target.value) { // e.target.value is the id of the product that more info was requested about
          // Finds its object to get more info
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
      $("#" + e.target.value + ".menuItem").append(moreInfo);  //Appends the additional info the element that match it's ID and class
      $("#close-button").on("click", function() {
        $("#more-info-box").remove();
      });
    });
  });
});

function findStrongBeveregesToShow(percentage) {
  var strongBeverages = [];
  for (i = 0; i < DB2.spirits.length; i++) {
    if (parseFloat(DB2.spirits[i].alkoholhalt) >= percentage) { //Finds spirits from the DB2 with the desired alcohol %
      strongBeverages.push(DB2.spirits[i]);
    }
  }
  console.log(strongBeverages.length);
  return findBeveragesToShow("liquor", strongBeverages);
}

/**
 * PubDB is the temp (???) DB which stores what items the pub currently have in stock
 * This functions finds those items in the DB2 Lars gave us to get more info about them :)))))
 * @param {string} type Which type of bev to look for
 * @param {array} listOfSpirits The array to search for
 */
function findBeveragesToShow(type, listOfSpirits) {
  var beveragesToShow = [];
  if (type === "liquor") {
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
          // checks that "varugrupp" ("type of beverage") includes the ID of the clicked menu-tab
          // I.e. if "beer" was clicked the ID is Ã–l, then we look for those that include "Ã–l" in their "varugrupp"
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
