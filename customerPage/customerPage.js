//Beer Ã–l
var mergeRenderedMenuItemsArray = []; // This variable stores all the items we have rendered in the menu for the order-cart
var language = "swedish"; // Default language
var db = [];
var moreInformation = false;
var currentlyRenderedType = "";

$(function() {
  db = DB_SYSTEMBOLAGET;
  console.log(db)
  console.log(DB_STOCK)
  $(".login-page-container").hide();
  // loadDB(language);
  setLanguage();
  $("#order-button").hide();
  $(".order-cart-container").hide();
  $(".language-button").on("click", function(e) {
    if (language !== e.target.id) {
      language = e.target.id;
      setLanguage();
      console.log("language: " + language);
      //   loadDB(language);
      upDatePrice();
      console.log(currentlyRenderedType)
      changeRenderedItems(currentlyRenderedType);
    }
  });
  /**
   * When a menu-"header" (i.e. beer) is clicked
   */
  $(".beverages-list li").on("click", function(e) {
    e.preventDefault();
    if (e.target.id === currentlyRenderedType) { // Pressed the same button
      currentlyRenderedType = "";
      $(".menuItem").remove();
      $(".beverages-list li").removeClass("active-li");
    } else {
      currentlyRenderedType = e.target.id;
      changeRenderedItems(e.target.id);
      $(".beverages-list li").removeClass("active-li");
      $(".beverages-list li" + "#" + e.target.id).toggleClass("active-li");  
    }
  });
});

function validate() {
  var uName = document.getElementById("uname").value;
  var passwd = document.getElementById("passwd").value;
  var myData = DB.users;
  var userFound = false;

  for (var i = 0; i < myData.length; i++) {
    if (myData[i].username == uName && myData[i].password == passwd) {
      userFound = true;
    }
  }
  if (userFound) {
    localStorage.setItem("loggedUser", uName);
    document.location.href = "index.html";
    console.log(document.location.href);
  } else {
    alert("Login failed for user '" + uName + "'...try again later!");
  }
}

function openLogin(e) {
  e.preventDefault();
  $(".login-page-container").show();
  $("#open-login-button").hide();
}

function closeForm(e) {
  e.preventDefault();
  $(".login-page-container").hide();
  $("#open-login-button").show();
}

function changeRenderedItems(type) {
  if(type === ""){ // Bug handling, find out why this is needed
    return;
  }
  // This calls the function in the menuAPI that selects which bevereges to show
  renderItemsToScreen(type);

  /*
  mergeRenderedMenuItemsArray = mergeRenderedMenuItems(
    mergeRenderedMenuItemsArray,
    getCurrentlyRenderedItems() // Helper function in the menuAPI that returns the currently rendered items
  ); */

  mergeRenderedMenuItemsArray = getCurrentlyRenderedItems();
  console.log(mergeRenderedMenuItemsArray);
  /**
   * Someone clicked order-button
   */
  $(".order-menu-button").on("click", function(e) {
    e.preventDefault();
    addItem(e.target.id); // Calls the order API
  });

  $(".more-info-button").on("click", function(e) {
    e.preventDefault();
    if (getMoreInfoBoolValue === false) {
      renderMoreInfoAboutItem(e.target.value);
    } else {
      $("#more-info-box").remove();
      renderMoreInfoAboutItem(e.target.value);
    }
  });
}

// Helper function to access the global variable
function getMergedRenderedMenuItemsArray() {
  return mergeRenderedMenuItemsArray;
}

function getLanguage() {
  return language;
}

function getDB() {
  return db;
}

function setLanguage() {
  switch (language) {
    case "english":
      $(".menu-header").text("Bevereges");
      $("#öl").text("Beer");
      $("#vin").text("Wine");
      $("#liquor").text("Liquor");
      $("#other").text("Other spirits")
      $("#order-header").text("Items in cart");
      $("#order-button").text("Order");
      $("#price-box").text("Price: ");
      $("#text-on-picture").text("A family owned pub since 1904");
      $("#open-login-button").text("Press here to login");
      $("#close-login-form").text("Close login form");
      break;
    case "swedish":
      $(".menu-header").text("Drycker");
      $("#öl").text("Öl");
      $("#vin").text("Vin");
      $("#liquor").text("Sprit");
      $("#other").text("Other spirits")
      $("#order-header").text("Varor");
      $("#order-button").text("Beställ");
      $("#price-box").text("Pris: ");
      $("#text-on-picture").text("En familjeägd pub sedan 1904");
      $("#open-login-button").text("Klicka här för att logga in");
      $("#close-login-form").text("Stäng ner");
      break;
  }
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
