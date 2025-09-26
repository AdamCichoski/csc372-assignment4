const buttons = document.querySelectorAll('.foodItem');
const favoritesContainer = document.getElementById('favorites');
let favorites = [];

buttons.forEach(button => {
    button.addEventListener('click', toggleFavorite);
});

function toggleFavorite(event) {
    const foodItem = event.currentTarget;
    const itemName = foodItem.querySelector("h3").textContent.trim();

    const existingIndex = favorites.findIndex(
        fav => fav.querySelector("h3").textContent.trim() === itemName
    );

    if (existingIndex > -1) {
        const removedItem = favorites.splice(existingIndex, 1)[0];

        favoritesContainer.removeChild(removedItem);
        console.log(`Removed from favorites: ${itemName}`);
    } else {
        const clone = foodItem.cloneNode(true);
        favorites.push(clone);
        favoritesContainer.appendChild(clone);
        console.log(`Added to favorites: ${itemName}`);
    }
}
