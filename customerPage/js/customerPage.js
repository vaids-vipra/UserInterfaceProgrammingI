//Beer Ã–l
var language = "swedish"; // Default language
var db = [];
var moreInformation = false;
var currentlyRenderedType = "";

/**
 * TEST VIP
 * username: dansch
 * pw: 9b0c08c58fdeb1b25525ac0cb8187eda
 */

$(function() {
  checkVIPStatus();
  db = DB_SYSTEMBOLAGET;
  console.log(db);
  console.log(DB_STOCK);
  $(".login-page-container").hide(); // The container shouldn't be visible on load
  setLanguage();
  $(".order-cart-container").hide(); // Hides the order-cart on load since it should be empty then
});

/** BUTTONS ON CUSTOMER PAGE CLICKS */
/**
 * Language button is clicked
 */

$(".language-button").on("click", function(e) {
  if (language !== e.target.id) {
    language = e.target.id;
    setLanguage(); // Function that updates the language of the page
    upDatePrice(); // Updates the price to change language
    changeRenderedItems(currentlyRenderedType); // Updates the rendered items for the new language
  }
});

$("#customer-page-logout-button").on("click", function(e) {
  e.preventDefault();
  logOut(); // Calls the loginAPI
  checkVIPStatus();
  console.log("temp");
});

$("#open-login-button").click(function(e) {
  e.preventDefault();
  $(".login-page-container").show();
  $("#open-login-button").hide();
});

$("#close-login-form").click(function(e) {
  e.preventDefault();
  $(".login-page-container").hide();
  $("#open-login-button").show();
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

function changeRenderedItems(type) {
  if (type === "") {
    // Bug handling, find out why this is needed
    return;
  }
  // This calls the function in the menuAPI that selects which bevereges to show
  renderItemsToScreen(type);

  // Keeps track of all items that've been rendered
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

$("#order-button").click(function(e){
  e.preventDefault();
  orderButtonClicked(); // Calls function in orderCartAPI
})

function checkVIPStatus() {
  console.log("Vip status");
  console.log(JSON.parse(localStorage.getItem("loggedUser")));
  var user = JSON.parse(localStorage.getItem("loggedUser")); // Gets the locally stored user
  if (user !== null) {
    console.log("User !== null");
    $("#open-login-button").hide();
    if (user.vip === true) {
      console.log("user.vip === true");
      // Checks in the user object if it's a VIP-customer
      $("#special").show(); // Special drinks for VIP
      $("#vip-customer-serv-form").show() // Special serving options for VIP
      $("#add-to-credit").show() // Special payment option for VIP
      $("#add-to-credit-label").show();
    } else {
      $(".beverages-list li#special").hide();
      $("#vip-customer-serv-form").hide()
      $("#add-to-credit").hide()
      $("#add-to-credit-label").hide();
    }
  } else {
    console.log("else");
    $("#add-to-credit").hide()
    $("#add-to-credit-label").hide();
    $(".beverages-list li#special").hide();
    $("#vip-customer-serv-form").hide()
    $("#customer-page-logout-button").hide();
  }
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
      $("#text-on-picture").text("A family owned pub since 1904");
      $("#open-login-button").text("Press here to login");
      $("#customer-page-logout-button").text("Logout");
      // Menu
      $(".menu-header").text("Drink menu");
      $("#öl").text("Beer");
      $("#vin").text("Wine");
      $("#liquor").text("Liquor");
      $("#special").text("Special drinks");
      $("#other").text("Other spirits");
      // Order cart
      $("#order-header").text("Items in cart");
      $("#order-button").text("Order");
      $("#price-box").text("Price: ");
      $("#add-to-credit-label").text("Add to credit");
      $("#pay-in-app-label").text("Pay in app")
      $("#pay-to-bartender-label").text("Pay to bartender");
      // Login form
      $("#vip-customer").text("VIP-customer");
      $("#uname").attr("placeholder", "Enter username");
      $("#passwd").attr("placeholder", "Enter password");
      $("#loginbox-login-button").attr("value", "Login");
      $("#login-box-header").text("Login here");
      $("#login-box-username").text("Username");
      $("#login-box-password").text("Password");
      $("#lost-password").text("Lost your password?");
      $("#close-login-form").text("Close login form");
      break;
    case "swedish":
      // Customer Page
      $("#text-on-picture").text("En familjeägd pub sedan 1904");
      $("#open-login-button").text("Klicka här för att logga in");
      $("#customer-page-logout-button").text("Logga ut");
      // Menu
      $(".menu-header").text("Dryckesmeny");
      $("#öl").text("Öl");
      $("#vin").text("Vin");
      $("#liquor").text("Sprit");
      $("#special").text("Unika drinkar");
      $("#other").text("Övriga drycker");
      // Order cart
      $("#order-header").text("Varor");
      $("#order-button").text("Beställ");
      $("#price-box").text("Pris: ");
      $("#pay-in-app-label").text("Betala i app")
      $("#pay-to-bartender-label").text("Betala till bartender");
      $("#add-to-credit-label").text("Lägg till kredit");
      // Login Form
      $("#vip-customer").text("VIP-kund");
      $("#uname").attr("placeholder", "Skriv in användarnamn");
      $("#passwd").attr("placeholder", "Skriv in lösenord");
      $("#loginbox-login-button").attr("value", "Logga in");
      $("#login-box-header").text("Logga in här");
      $("#login-box-username").text("Användarnamn");
      $("#login-box-password").text("Lösenord");
      $("#lost-password").text("Glömt lösenord?");
      $("#close-login-form").text("Stäng ner");
      break;
  }
}
