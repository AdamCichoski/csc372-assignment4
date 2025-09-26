const buttons = document.querySelectorAll('.foodItem');
const favoritesContainer = document.getElementById('favorites');
const totalCost = document.getElementById("totalCost");

let favorites = [];
let favoritesCost = 0.00;


buttons.forEach(button => {
    button.addEventListener('click', toggleFavorite);
});

function toggleFavorite(event) {
    const foodItem = event.currentTarget;
    let itemPrice = priceCentsFrom(foodItem);
    const itemName = foodItem.querySelector("h3").textContent.trim();
    const existingIndex = favorites.findIndex(
        fav => fav.querySelector("h3").textContent.trim() === itemName
    );

    if (existingIndex > -1) {
        favoritesCost -= itemPrice;
        const removedItem = favorites.splice(existingIndex, 1)[0];
        foodItem.style.backgroundColor = "antiquewhite";
        favoritesContainer.removeChild(removedItem);
        console.log(`Removed from favorites: ${itemName} for - \$${centsToDollar(itemPrice)}`);
    } else {
        favoritesCost += itemPrice;
        foodItem.style.backgroundColor = "rgb(244, 212, 170)";
        const clone = foodItem.cloneNode(true);
        favorites.push(clone);
        favoritesContainer.appendChild(clone);
        console.log(`Added to favorites: ${itemName} for + \$${centsToDollar(itemPrice)}`);
    }
    totalCost.textContent = centsToDollar(favoritesCost);
}

function centsToDollar(price){
    return (price / 100).toFixed(2);
}


function priceCentsFrom(foodItem) {
  const priceText = foodItem.querySelector("#price").textContent;
  const dollars = parseFloat(priceText);
  return Math.round((isNaN(dollars) ? 0 : dollars) * 100);
}