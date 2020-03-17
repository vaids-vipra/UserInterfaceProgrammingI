// To change to english we need to change DB2 to collect from Bevereges_eng instead
// Beverages_eng är inte satt som en variabel utan bara en enda stor array

var loadedDB = [];
var currentlyRenderedItems = [];
var language = getLanguage();
var moreInformation = false;
const strongPercentage = 35;

/*
function mergeRenderedMenuItems(currentRendered, newToRender) {
  if (currentRendered.length === 0) {
    return newToRender;
  } else {
    console.log(currentRendered)
    console.log(newToRender)
    Array.prototype.push.apply(currentRendered, newToRender);
    console.log(currentRendered)
    switch (language) {
      case "swedish":
        for (var i = 0; i < currentRendered.length; i++) {
          for (var j = i + 1; j < currentRendered.length; j++) {
            if (
              currentRendered[i].artikelid === currentRendered[j].artikelid &&
              i !== j
            ) {
              currentRendered.splice(j--, 1);
            }
          }
        }
        break;
      case "english":
        for (var i = 0; i < currentRendered.length; i++) {
          for (var j = i + 1; j < currentRendered.length; j++) {
            if (
              currentRendered[i].articleid === currentRendered[j].articleid &&
              i !== j
            ) {
              currentRendered.splice(j--, 1);
            }
          }
        }
        break;
    }
    return currentRendered;
  }
}
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

/*
for (var i = 0; i < mergedArray.length; i++) {
      for (var j = i + 1; j < mergedArray.length; j++) {
        if (mergedArray[i].artikelid === mergedArray[j].artikelid && i !== j) {
          mergedArray.splice(j--, 1);
        }
      }
    }

*/

/* function loadDB(language) {
  switch (language) {
    case "english":
      $.getJSON("./../db/Beverages_eng.js", function(data) {
        loadedDB = data;
      });
      break;
    case "swedish":
      $.getJSON(
        "./../db/DBFilesJSON (not used, only for reference)/dutchman_table_sbl_beer.json",
        function(data) {
          loadedDB = data;
        }
      );
      break;
  }
} */

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

  var namePropertyName = "namn";
  var pricePropertyName = "prisinklmoms";
  var articleIdPropertyName = "artikelid";
  var moreInfoButtonText, orderButtonText, organic;
  switch (language) {
    case "english":
      //namePropertyName = "name";
      //pricePropertyName = "priceinclvat";
      //articleIdPropertyName = "articleid";
      organic = "Organic";
      moreInfoButtonText = "More information";
      orderButtonText = "Order";
      break;
    case "swedish":
      // namePropertyName = "namn";
      // pricePropertyName = "prisinklmoms";
      // articleIdPropertyName = "artikelid";
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
  currentlyRenderedItems = currentlyRenderedItems.concat(beveragesToRender);
  removeDuplicate();
  $(".beverages-list ").append(menuItems); //Appends all the above created divs to our beverage list
}

function getCurrentlyRenderedItems() {
  return currentlyRenderedItems;
}

function findStrongBeveregesToShow(percentage) {
  var objectAlcoholPercentageName = "alkoholhalt";
  /* switch (language) {
    case "english":
      objectAlcoholPercentageName = "alcoholstrength";
      break;
    case "swedish":
      objectAlcoholPercentageName = "alkoholhalt";
      break;
  } */

  var strongBeverages = [];
  loadedDB = getDB();
  for (i = 0; i < loadedDB.length; i++) {
    if (parseFloat(loadedDB[i][objectAlcoholPercentageName]) >= percentage) {
      //Finds spirits from the DB2 with the desired alcohol %
      strongBeverages.push(loadedDB[i]);
    }
  }
  return findBeveragesToShow("liquor", strongBeverages);
}

/**
 * PubDB is the temp (???) DB which stores what items the pub currently have in stock
 * This functions finds those items in the DB2 Lars gave us to get more info about them :)))))
 * @param {string} type Which type of bev to look for
 * @param {array} listOfSpirits The array to search for
 */
function findBeveragesToShow(type, listOfSpirits) {
  var objectIDPropertyName = "artikelid";
  var objectCategoryPropertyName = "varugrupp";
  /* switch (language) {
    case "english":
      objectIDPropertyName = "articleid";
      objectCategoryPropertyName = "catgegory";
      break;
    case "swedish":
      objectIDPropertyName = "artikelid";
      objectCategoryPropertyName = "varugrupp";
      break;
  } */
  var beveragesToShow = [];
  if (type === "liquor") {
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        if (
          DB_STOCK[i].article_id === listOfSpirits[j][objectIDPropertyName] &&
          DB_STOCK[i].in_stock > 0
        ) {
          var itemToPush = {
            salePrice: DB_STOCK[i].sale_price,
            country: DB_STOCK[i].country,
            ...listOfSpirits[j]
          };
          console.log(itemToPush);
          beveragesToShow.push(itemToPush);
        }
      }
    }
  }
  if (type === "other") {
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit = listOfSpirits[j];
        if (DB_STOCK[i].article_id === spirit[objectIDPropertyName]) {
          var spiritCategory = spirit[objectCategoryPropertyName];
          // checks that "varugrupp" ("type of beverage") includes the ID of the clicked menu-tab
          // I.e. if "beer" was clicked the ID is öl, then we look for those that include "öl" in their "varugrupp"

          if (
            !spiritCategory.toLowerCase().includes("öl") &&
            !spiritCategory.toLowerCase().includes("vin") &&
            parseFloat(spirit.alkoholhalt) < strongPercentage
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
    for (i = 0; i < DB_STOCK.length; i++) {
      for (j = 0; j < listOfSpirits.length; j++) {
        var spirit = listOfSpirits[j];
        if (DB_STOCK[i].article_id === spirit[objectIDPropertyName]) {
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
  console.log(beveragesToShow);
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
  var originText, producerText, closeButtonText, organic, kosher;
  switch (language) {
    case "english":
      originPropertyName = "country";
      // producerProperyName = "producer";
      // articleIdPropertyName = "articleid";
      originText = "Origin: ";
      organic = "Organic";
      kosher = "Kosher";
      producerText = "Producer: ";
      closeButtonText = "Close";
      break;
    case "swedish":
      originPropertyName = "ursprunglandnamn";
      // producerProperyName = "producent";
      //  articleIdPropertyName = "artikelid";
      originText = "Ursprungsland: ";
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
      var closeButton =
        "<button id=close-button>" + closeButtonText + "</button>";
      moreInfo = moreInfo.add(
        "<div id=more-info-box>" +
          origin +
          producer +
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

var entriesFromDbAtIndex = Object.entries(loadedDB[3]); // Returns an array containing all of the [key, value] pairs of a given object's own enumerable string properties.
        var temp = entriesFromDbAtIndex[10][1]; // [19] is the percentage entry and [1] extracts that number
        console.log(entriesFromDbAtIndex);
        console.log(temp); 
        
        */

/* MULTILANGUGE SUPPORT
        function removeDuplicate() {
  switch (language) {
    case "swedish":
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
      break;
    case "english":
      for (var i = 0; i < currentlyRenderedItems.length; i++) {
        if (currentlyRenderedItems[i].articleid === undefined) {
          continue;
        } else {
          for (var j = i + 1; j < currentlyRenderedItems.length; j++) {
            if (
              currentlyRenderedItems[i].articleid ===
                currentlyRenderedItems[j].articleid &&
              i !== j
            ) {
              currentlyRenderedItems.splice(j--, 1);
            }
          }
        }
      }
  }
}




        */
