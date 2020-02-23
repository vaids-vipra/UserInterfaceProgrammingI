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

