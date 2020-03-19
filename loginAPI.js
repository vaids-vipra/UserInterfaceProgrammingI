var accountDB = [];
var loginRole = "";
var targetPage = "";
/* TEST bartender: 
username: elsa
pw: elsa123

TEST manager:
mauro
mauro123
*/

/** Ask V for comments */
function validate() {
  if (loginRole === "") {
    alert("No Role Selected");
  } else {
    var uName = document.getElementById("uname").value;
    var passwd = document.getElementById("passwd").value;
    // var myData = DB.users;
    var userFound = false;
    var user;
    for (var i = 0; i < accountDB.length; i++) {
      if (accountDB[i].username == uName && accountDB[i].password == passwd) {
        var user = accountDB[i];
        userFound = true;
      }
    }
    if (userFound) {
      localStorage.setItem("loggedUser", JSON.stringify(user)); // Needs to pass the user object as a string
      var test = localStorage.getItem("loggedUser");
      console.log(JSON.parse(test)); // Test to see that the parser works
      window.location.href = targetPage;
      console.log(document.location.href);
    } else {
      alert("Login failed for user '" + uName + "'...try again later!");
    }
  }
}

/**
 * Button with chosen login role clicked
 */
$(".login-role-button").click(function(e) {
  e.preventDefault();
  if (loginRole === e.target.id) {
    $("#" + e.target.id).toggleClass("active-login-button");
    loginRole = "";
    targetPage = "";
  } else {
    $(".login-role-button").removeClass("active-login-button");
    $("#" + e.target.id).toggleClass("active-login-button");
    loginRole = e.target.id;
  }
  loginRole = e.target.id;
  console.log(e.target.id);
  switch (e.target.id) {
    case "bartender":
      targetPage = document.location.href; // window.location.origin + "/BARTENDERPAGE.html";
      accountDB = DB_BARTENDERS;
      console.log(accountDB);
      break;
    case "vip-customer":
      targetPage = document.location.href; // Should do something for the VIP
      temp = [];
      for (var i = 0; i < DB_CUSTOMERS.length; i++) {
        if (DB_CUSTOMERS[i].vip === true) {
          temp.push(DB_CUSTOMERS[i]);
        }
      }
      accountDB = temp;
      console.log(accountDB);
      break;
    case "manager":
      targetPage = window.location.origin + "/Management/management.html";
      console.log(targetPage)
      accountDB = DB_MANAGERS;
      console.log(accountDB);
      break;
  }
});

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
