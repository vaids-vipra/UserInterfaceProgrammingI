
/*LANGUAGE SELECTION CONTROL
* Call translate() method on corresponding script page
* This script must be loaded in all pages, along with both the js script and view corresponding to that particular page!
* The indexes and their corresponding languages: [0] English , [1] Swedish
*/

window.onload = translate(localStorage.getItem("index")); /* Call translate(index) with each page load (retrieved save index)*/

$(document).ready(function () { /*Call translate() on menu (flags) selection*/

    $("#eng").click(function(){
        translate(0) /*Call translate() method with selected index 0*/
        localStorage.setItem("index",0); /*Save selected index for the next loaded pages*/
    })

    $("#sve").click(function(){
        translate(1)
        localStorage.setItem("index",1);      
    })

})
