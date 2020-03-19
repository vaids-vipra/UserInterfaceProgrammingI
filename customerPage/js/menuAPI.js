// To change to english we need to change DB2 to collect from Bevereges_eng instead
// Beverages_eng är inte satt som en variabel utan bara en enda stor array

var loadedDB = [];
var currentlyRenderedItems = [];
var language = getLanguage();
var moreInformation = false;
const strongPercentage = 35;

/**
 * 
 * Helper function that removes duplicates from the list of items in the menu
 */

function removeDuplicate() {
  for (var i = 0; i < currentlyRenderedItems.length; i++) {
    if (currentlyRenderedItems[i].artikelid === undefined) {
      continue;
    } else {
      for (var j = i + 1; j < currentlyRenderedItems.length; j++) {
        if (
          currentlyRenderedItems[i].artikelid ===
            currentlyRenderedItems[j].artikelid &&
          i !== j
        ) {
          currentlyRenderedItems.splice(j--, 1);
        }
      }
    }
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
    beveragesToRender = findStrongBeveregesToShow(strongPercentage); // If liquor was clicked we find all strong bev first
  } else {
    beveragesToRender = findBeveragesToShow(type, getDB()); // Otherwise we just find all sprits that match our id (I.e. beer or wine atm)
  }

  var menuItems = $(); // Jquery object that we'll fill with spirits below

  // Some old variables when we didn't have Shuangs DB.js
  var namePropertyName = "namn";
  var pricePropertyName = "prisinklmoms";
  var articleIdPropertyName = "artikelid";
  var moreInfoButtonText, orderButtonText, organic;
  switch (language) {
    case "english":
      organic = "Organic";
      moreInfoButtonText = "More information";
      orderButtonText = "Order";
      break;
    case "swedish":
      organic = "Ekologisk";
      moreInfoButtonText = "Mer information";
      orderButtonText = "Beställ";
  }

  /**
   * This for loop creates a div for every item that we're gonna render
   * Adds it to the menuItem jquery object
   */
  for (x = 0; x < beveragesToRender.length; x++) {
    var item = beveragesToRender[x][namePropertyName];
    var price = "<t>" + "   " + beveragesToRender[x].salePrice + "SEK" + "</t>";
    var alcoholPercentage =
      "<t>" + " " + beveragesToRender[x].alkoholhalt + "</t>";
    var moreInfoBtn =
      "<button class=more-info-button value=" +
      beveragesToRender[x][articleIdPropertyName] +
      ">" +
      moreInfoButtonText +
      "</button>";
    var orderButton =
      "<button class=order-menu-button id=" +
      beveragesToRender[x][articleIdPropertyName] +
      ">" +
      orderButtonText +
      "</button>";
    menuItems = menuItems.add(
      "<div class=menuItem id=" +
        beveragesToRender[x][articleIdPropertyName] +
        " draggable=true ondragstart=menuItemDragStart(event)>" +
        item +
        price +
        alcoholPercentage +
        moreInfoBtn +
        orderButton +
        "</div>"
    );
  }
  currentlyRenderedItems = currentlyRenderedItems.concat(beveragesToRender); // Keep a list of all rendered and previously rendered items
  removeDuplicate();
  console.log(currentlyRenderedItems)
  $(".beverages-list ").append(menuItems); //Appends all the above created divs to our beverage list
}

/**
 * Helper function to get the list of all rendered items
 * Mainy needed for the order cart so we can keep items in it despite them not be rendered in the menu atm
 */
function getCurrentlyRenderedItems() {
  return currentlyRenderedItems;
}

/**
 * Will look through the Stock DB to find those beverages with alc > some limit
 * @param {int} percentage 
 */

function findStrongBeveregesToShow(percentage) {
  var objectAlcoholPercentageName = "alkoholhalt";
  var strongBeverages = [];
  loadedDB = getDB(); // The Systembolaget DB
  for (i = 0; i < loadedDB.length; i++) {
    if (parseFloat(loadedDB[i][objectAlcoholPercentageName]) >= percentage) {
      strongBeverages.push(loadedDB[i]);
    }
  }
  return findBeveragesToShow("liquor", strongBeverages);
}

/**
 * This functions finds those items in the Systembolaget DB from our Stock DB to get additional info from it
 * @param {string} type Which type of bev to look for
 * @param {array} listOfSpirits The db to search in
 */
function findBeveragesToShow(type, listOfSpirits) {
  var objectIDPropertyName = "artikelid";
  var objectCategoryPropertyName = "varugrupp";
  var beveragesToShow = [];
  if (type === "liquor") {
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        if (
          DB_STOCK[i].article_id === listOfSpirits[j][objectIDPropertyName] &&
          DB_STOCK[i].in_stock > 0
        ) {
          var itemToPush = { // Creates an object with the info from DB_STOCK DB_STOXCK[i] and Systembolaget (listOfspirit[j]) that we need
            salePrice: DB_STOCK[i].sale_price,
            country: DB_STOCK[i].country,
            ...listOfSpirits[j]
          };
          beveragesToShow.push(itemToPush);
        }
      }
    }
  }
  // If time, find a better solution than this IF-statement.
  if (type === "other") {
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit = listOfSpirits[j];
        if (DB_STOCK[i].article_id === spirit[objectIDPropertyName]) {
          var spiritCategory = spirit[objectCategoryPropertyName];  // The category of the current beverage
          if ( // Checks that it's not Beer, wine or strong liquor. I.e, it only fits in "other"
            !spiritCategory.toLowerCase().includes("öl") &&
            !spiritCategory.toLowerCase().includes("vin") &&
            parseFloat(spirit.alkoholhalt) < strongPercentage &&
            DB_STOCK[i].in_stock > 0
          ) {
            var itemToPush = {
              salePrice: DB_STOCK[i].sale_price,
              country: DB_STOCK[i].country,
              ...spirit
            };
            beveragesToShow.push(itemToPush);
          }
        }
      }
    }
  } else {
    // Beer or wine
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit = listOfSpirits[j];
        if (
          DB_STOCK[i].article_id === spirit[objectIDPropertyName] &&
          DB_STOCK[i].in_stock > 0
        ) {
          var spiritCategory = spirit[objectCategoryPropertyName];
          // checks that "varugrupp" ("type of beverage") includes the ID of the clicked menu-tab
          // I.e. if "beer" was clicked the ID is öl, then we look for those that include "öl" in their "varugrupp"

          if (spiritCategory.toLowerCase().includes(type)) {
            var itemToPush = {
              salePrice: DB_STOCK[i].sale_price,
              country: DB_STOCK[i].country,
              ...spirit
            };
            beveragesToShow.push(itemToPush);
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
function renderMoreInfoAboutItem(id) {
  var originPropertyName = "ursprunglandnamn";
  var producerProperyName = "producent";
  var articleIdPropertyName = "artikelid";
  var kosherToDOM = "";
  var ecoToDOM = "";
  var originText, producerText, closeButtonText, organic, kosher, typeText;
  // Multilingual functionality
  switch (language) {
    case "english":
      originPropertyName = "country";
      typeText = "Type: ";
      originText = "Origin: ";
      packagingText = "Packaging: ";
      organic = "Organic";
      kosher = "Kosher";
      producerText = "Producer: ";
      closeButtonText = "Close";
      break;
    case "swedish":
      originPropertyName = "ursprunglandnamn";
      typeText = "Varugrupp: ";
      originText = "Ursprungsland: ";
      packagingText = "Förpackning: ";
      kosher = "Kosher";
      organic = "Ekologisk";
      producerText = "Producent: ";
      closeButtonText = "Stäng";
  }
  var moreInfo = $();
  for (i = 0; i < currentlyRenderedItems.length; i++) {
    if (currentlyRenderedItems[i][articleIdPropertyName] === id) {
      console.log(currentlyRenderedItems[i]);
      if (currentlyRenderedItems[i].koscher === "1") {
        kosherToDOM = "<t>" + kosher + "</t>";
      }
      if (currentlyRenderedItems[i].ekologisk === "1") {
        ecoToDOM = "<t>" + organic + "</t>";
      }
      // Since the DB only is in swedish I made some manual translation of the common types of packaging
      if (getLanguage() === "english") {
        switch (currentlyRenderedItems[i].forpackning) {
          case "Flaska":
            packagingText = packagingText + "Bottle";
            break;
          case "Burk":
            packagingText = packagingText + "Can";
        }
      } else {
        packagingText = packagingText + currentlyRenderedItems[i].forpackning;
      }
      // e.target.value is the id of the product that more info was requested about
      // Finds its object to get more info
      var origin =
        "<t>" +
        originText +
        currentlyRenderedItems[i][originPropertyName] +
        "</t>";
      var producer =
        "<t>" +
        producerText +
        currentlyRenderedItems[i][producerProperyName] +
        "</t>";

      var type =
        "<t>" + typeText + currentlyRenderedItems[i].varugrupp + " </t>";
      var packaging = "<t>" + packagingText + "</t>";
      var closeButton =
        "<button id=close-button>" + closeButtonText + "</button>";
      moreInfo = moreInfo.add(
        "<div id=more-info-box>" +
          origin +
          producer +
          type +
          packaging +
          ecoToDOM +
          kosherToDOM +
          closeButton +
          "</div>"
      );
    }
  }
  $("#" + id + ".menuItem").append(moreInfo); //Appends the additional info the element that match it's ID and class
  $("#close-button").on("click", function() {
    $("#more-info-box").remove();
  });
}

function getMoreInfoBoolValue() {
  return moreInformation;
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
  console.log(data);
  addItem(data);
}

/*         The way to access stuff despite language but was pretty slow:
          (but it tought me quite a bit about JS objects so worth it anyhow)
var entriesFromDbAtIndex = Object.entries(loadedDB[3]); // Returns an array containing all of the [key, value] pairs of a given object's own enumerable string properties.
        var temp = entriesFromDbAtIndex[10][1]; // [19] is the percentage entry and [1] extracts that number
        console.log(entriesFromDbAtIndex);
        console.log(temp); 
        
        */