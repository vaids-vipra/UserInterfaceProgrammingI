//Beer Ã–l

var mergeRenderedMenuItemsArray = []; // This variable stores all the items we have rendered in the menu for the order-cart

$(function() {
  /**
   * When a menu-"header" (i.e. beer) is clicked
   */
  $(".beverages-list li").on("click", function(e) {
    e.preventDefault();
    renderItemsToScreen(e.target.id);


    mergeRenderedMenuItemsArray = mergeRenderedMenuItems(
      mergeRenderedMenuItemsArray,
      getCurrentlyRenderedItems() // Helper function in the menuAPI that returns the currently rendered items
    );

    /**
     * Someone clicked order-button
     */
    $(".order-button").on("click", function(e) {
      e.preventDefault();
      addItem(e.target.id); // Calls the order API
      renderOrders();
    });

    $(".more-info-button").on("click", function(e) {
      e.preventDefault();
      renderMoreInfoAboutItem(e.target.value);
    });
  });
});

// Helper function to access the global variable
function getMergedRenderedMenuItemsArray() {
  return mergeRenderedMenuItemsArray;
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
