var currentOrders = [];

function addItem(itemID) {
  if (currentOrders.length > 0) {
    for (i = 0; i < currentOrders.length; i++) {
      if (itemID === currentOrders[i].id) {
        newQuant = currentOrders[i].quantity + 1;
        currentOrders[i].quantity = newQuant;
        return 0;
      }
    }
  }
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
