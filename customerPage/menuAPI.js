var currentlyRenderedItems = []

function mergeRenderedMenuItems(currentRendered, newToRender) {
  if (currentRendered.length === 0) {
    return newToRender;
  } else {
    var mergedArray = currentRendered.concat(newToRender);
    for (var i = 0; i < mergedArray.length; i++) {
      for (var j = i + 1; j < mergedArray.length; j++) {
        if (mergedArray[i].artikelid === mergedArray[j].artikelid && i !== j) {
          mergedArray.splice(j--, 1);
        }
      }
    }
    return mergedArray;
  }
}

/**
 * This function creates a jquery object with a list of rendered items that we have in the temp (???) PubDB
 * It also appends this jquery object to the list which puts it in the DOM
 * @param {string} type type of item to render, i.e. beer or wine
 */

function renderItemsToScreen(type) {
  var beveragesToRender = [];
  $(".menuItem").remove(); // Removes all items from the menu since we want to render new
  if (type === "liquor") {
    // Currently all beverages with alc % > 30 are placed under liquor
    beveragesToRender = findStrongBeveregesToShow(30); // If liquor was clicked we find all strong bev first
  } else {
    beveragesToRender = findBeveragesToShow(type, DB2.spirits); // Otherwise we just find all sprits that match our id (I.e. beer or wine atm)
  }

  var menuItems = $(); // Jquery object that we'll fill with spirits below

  /**
   * This for loop creates a div for every item that we're gonna render
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
        " draggable=true ondragstart=menuItemDragStart(event)>" +
        item +
        price +
        moreInfoBtn +
        orderButton +
        "</div>"
    );
  }
  currentlyRenderedItems = beveragesToRender;
  $(".beverages-list ").append(menuItems); //Appends all the above created divs to our beverage list
}

function getCurrentlyRenderedItems() {
  return currentlyRenderedItems;
}

function findStrongBeveregesToShow(percentage) {
  var strongBeverages = [];
  for (i = 0; i < DB2.spirits.length; i++) {
    if (parseFloat(DB2.spirits[i].alkoholhalt) >= percentage) {
      //Finds spirits from the DB2 with the desired alcohol %
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

/**
 * Function called when "more info button" is clicked which renders this to the screen
 * @param {string} id
 * @param {array} renderedItems
 */
function renderMoreInfoAboutItem(id, renderedItems) {
  var moreInfo = $();
  for (i = 0; i < renderedItems.length; i++) {
    if (renderedItems[i].artikelid === id) {
      // e.target.value is the id of the product that more info was requested about
      // Finds its object to get more info
      console.log(renderedItems[i]);
      var origin = "<t>" + "Origin: " + renderedItems[i].ursprung + "</t>";
      var producer = "<t>" + "Producer: " + renderedItems[i].producent + "</t>";
      var closeButton = "<button id=close-button>Close</button>";
      moreInfo = moreInfo.add(
        "<div id=more-info-box>" + origin + producer + closeButton + "</div>"
      );
    }
  }
  $("#" + id + ".menuItem").append(moreInfo); //Appends the additional info the element that match it's ID and class
  $("#close-button").on("click", function() {
    $("#more-info-box").remove();
  });
}
/**
 * Specifies what data to get from the dragged item
 * Here it is the artikel id of the item
 * @param {event} e
 */
function menuItemDragStart(e) {
  e.dataTransfer.setData("text", e.target.id); // artikelId of the dragged item
}

/**
 * Makes sure that we can drop an item in the order-cart
 * @param {event} e
 */
function allowDrop(e) {
  e.preventDefault();
}
/**
 * When the item is dropped we call the menu API that adds the item and renders it
 * @param {event} e
 */
function menuItemDropped(e) {
  e.preventDefault();
  var data = e.dataTransfer.getData("text");
  addItemAndRenderToScreen(data);
}
