//Beer Ã–l
var mergeRenderedMenuItemsArray = []; // This variable stores all the items we have rendered in the menu for the order-cart
var language = "swedish"; // Default language
var db = [];
var moreInformation = false;
var currentlyRenderedType = "";

$(function() {
  db = DB_SYSTEMBOLAGET;
  console.log(db);
  console.log(DB_STOCK);
  $(".login-page-container").hide(); // The container shouldn't be visible on load
  setLanguage();
  $(".order-cart-container").hide(); // Hides the order-cart on load since it should be empty then
  $(".language-button").on("click", function(e) {
    if (language !== e.target.id) {
      language = e.target.id;
      setLanguage(); // Function that updates the language of the page
      upDatePrice(); // Updates the price to change language
      changeRenderedItems(currentlyRenderedType); // Updates the rendered items for the new language
    }
  });
  /**
   * When a menu-"header" (i.e. beer) is clicked
   */
  $(".beverages-list li").on("click", function(e) {
    e.preventDefault();
    if (e.target.id === currentlyRenderedType) {
      // Pressed the same button
      currentlyRenderedType = ""; // Nothing should be rendered
      $(".menuItem").remove(); // Removes all the rendered items from the DOM
      $(".beverages-list li").removeClass("active-li");
    } else {
      currentlyRenderedType = e.target.id;
      changeRenderedItems(e.target.id);
      $(".beverages-list li").removeClass("active-li");
      $(".beverages-list li" + "#" + e.target.id).toggleClass("active-li");
    }
  });
});

function changeRenderedItems(type) {
  if (type === "") {
    // Bug handling, find out why this is needed
    return;
  }
  // This calls the function in the menuAPI that selects which bevereges to show
  renderItemsToScreen(type);

  // Keeps track of all items that've been rendered
  mergeRenderedMenuItemsArray = getCurrentlyRenderedItems();

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
      // No more-information is rendered
      renderMoreInfoAboutItem(e.target.value); // Calls the menu API to render more info about the item
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

// Helper function to get the currently selected language
function getLanguage() {
  return language;
}

// Helper function to get the SYSTEMBOLAGET_DB that we loaded on page load
function getDB() {
  return db;
}

// Sets the language of the page through string replacement
function setLanguage() {
  switch (language) {
    case "english":
      // Customer page
      $(".menu-header").text("Bevereges");
      $("#öl").text("Beer");
      $("#vin").text("Wine");
      $("#liquor").text("Liquor");
      $("#other").text("Other spirits");
      $("#order-header").text("Items in cart");
      $("#order-button").text("Order");
      $("#price-box").text("Price: ");
      $("#text-on-picture").text("A family owned pub since 1904");
      $("#open-login-button").text("Press here to login");
      $("#close-login-form").text("Close login form");
      // Login form
      $("#uname").attr("placeholder", "Enter username");
      $("#passwd").attr("placeholder", "Enter password");
      $("#loginbox-login-button").attr("value", "Login");
      $("#login-box-header").text("Login here");
      $("#login-box-username").text("Username");
      $("#login-box-password").text("Password");
      $("#lost-password").text("Lost your password?");
      break;
    case "swedish":
      // Customer Page
      $(".menu-header").text("Drycker");
      $("#öl").text("Öl");
      $("#vin").text("Vin");
      $("#liquor").text("Sprit");
      $("#other").text("Övriga drycker");
      $("#order-header").text("Varor");
      $("#order-button").text("Beställ");
      $("#price-box").text("Pris: ");
      $("#text-on-picture").text("En familjeägd pub sedan 1904");
      $("#open-login-button").text("Klicka här för att logga in");
      $("#close-login-form").text("Stäng ner");
      // Login Form
      $("#uname").attr("placeholder", "Skriv in användarnamn");
      $("#passwd").attr("placeholder", "Skriv in lösenord");
      $("#loginbox-login-button").attr("value", "Logga in");
      $("#login-box-header").text("Logga in här");
      $("#login-box-username").text("Användarnamn");
      $("#login-box-password").text("Lösenord");
      $("#lost-password").text("Glömt lösenord?");

      break;
  }
}
