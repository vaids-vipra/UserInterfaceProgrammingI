var currentOrders = []; // Temp way to see which orders the user currently have in their basket, should be in a DB in the future??

function addItem(itemID) {
  if (currentOrders.length > 0) {
    for (i = 0; i < currentOrders.length; i++) {
      if (itemID === currentOrders[i].id) { // Checks if the added item already exists
        newQuant = currentOrders[i].quantity + 1; 
        currentOrders[i].quantity = newQuant; // Then we just increase its quant and doesn't make a new entry
        return 0; // To break out of the function
      }
    }
  }
  // Otherwise we just make a new object to push into the orders
  newOrder = {
    id: itemID,
    quantity: 1
  };
  currentOrders.push(newOrder);
}

function getOrders() {
  // Here we should get order from a specific user/table id etc
  // Right now it's just the one though :(

  return currentOrders;
}
