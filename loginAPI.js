/** Ask V for comments */
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
