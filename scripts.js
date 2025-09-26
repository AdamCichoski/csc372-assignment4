function dollarsToCents(d) {
  const n = parseFloat(d);
  return Math.round((isNaN(n) ? 0 : n) * 100);
}

function centsToDollars(cents) {
  return (cents / 100).toFixed(2);
}

function titleFromH3(h3) {
  if (!h3) return '';
  for (const node of h3.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.trim();
  }
  const c = h3.cloneNode(true);
  Array.from(c.querySelectorAll('*')).forEach(el => el.remove());
  return c.textContent.trim();
}


// Adds contents when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.foodItem');

  // Build the Favorites summary section at the bottom
  const { totalSpan, listEl } = createFavoritesSection();

  // State
  let totalCents = 0;
  const liByKey = new Map();

  // Initialize each card: ensure price row + button + dataset, then wire click
  cards.forEach((card, idx) => {
    // Name from <h3>
    const name = titleFromH3(card.querySelector('h3'));
    card.dataset.name = card.dataset.name || name;

    // Price from data attribute (you add data-price="##.##" in HTML)
    const priceStr = (card.dataset.price || '0').trim();
    const priceCents = dollarsToCents(priceStr);
    card.dataset.priceCents = String(priceCents);
    card.dataset.key = card.dataset.key || `dish-${idx}`;

    // 1) Ensure a price row exists (e.g., "$ 13.50") just under the <h3>
    ensurePriceRow(card, priceStr);

    // 2) Ensure an "Add to Favorites" button exists
    const btn = ensureFavButton(card);

    // 3) Wire the button
    btn.addEventListener('click', () => toggleFavorite(card, btn));
  });

  // ----- DOM builders -----
  function ensurePriceRow(card, priceStr) {
    if (card.querySelector('.price')) return; // don't duplicate
    const priceP = document.createElement('p');
    const dollar = document.createTextNode('$');
    const span = document.createElement('span');
    span.className = 'price';
    span.textContent = Number.parseFloat(priceStr || '0').toFixed(2);
    priceP.appendChild(dollar);
    priceP.appendChild(span);

    const h3 = card.querySelector('h3');
    if (h3 && h3.nextSibling) {
      card.insertBefore(priceP, h3.nextSibling);
    } else {
      card.appendChild(priceP);
    }
  }

  function ensureFavButton(card) {
    let btn = card.querySelector('.favButton');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'favButton';
      btn.textContent = 'Add to Favorites';
      btn.setAttribute('aria-pressed', 'false');
      card.appendChild(btn);
    }
    return btn;
  }


  // Creates the favorites section at the bottom
  function createFavoritesSection() {
    const wrapper = document.createElement('div');
    wrapper.className = 'card pageItem';

    const info = document.createElement('div');
    info.className = 'restaurantInfo';

    const h3 = document.createElement('h3');
    h3.textContent = 'Favorites';
    const hr = document.createElement('hr');

    const pTotal = document.createElement('p');
    pTotal.className = 'favoritesCost';
    pTotal.appendChild(document.createTextNode('Total Cost: $'));
    const totalSpan = document.createElement('span');
    totalSpan.id = 'totalCost';
    totalSpan.textContent = '0.00';
    pTotal.appendChild(totalSpan);

    info.appendChild(h3);
    info.appendChild(hr);
    info.appendChild(pTotal);

    const container = document.createElement('div');
    container.className = 'foodContainer';
    container.id = 'favorites';

    const listEl = document.createElement('ul');
    listEl.id = 'favoritesList';
    listEl.setAttribute('aria-live', 'polite');
    container.appendChild(listEl);

    wrapper.appendChild(info);
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    return { totalSpan, listEl };
  }

  // Moves foodItems in and out of favorites
  function toggleFavorite(card, btn) {
    const key = card.dataset.key;
    const name = card.dataset.name || '';
    const priceCents = parseInt(card.dataset.priceCents || '0', 10);

    const isSelected = card.classList.contains('is-favorite');
    if (isSelected) {
      // Remove
      const li = liByKey.get(key);
      if (li) {
        listEl.removeChild(li);
        liByKey.delete(key);
      }
      card.classList.remove('is-favorite');
      card.style.backgroundColor = "antiquewhite";
      btn.textContent = 'Add to Favorites';
      btn.setAttribute('aria-pressed', 'false');

      totalCents = Math.max(0, totalCents - priceCents);
      renderTotal();
    } else {
      // Add
      const li = document.createElement('li');
      li.dataset.key = key;

      const nameText = document.createTextNode(`${name} — $`);
      const priceNode = document.createElement('span');
      priceNode.className = 'favoritePrice';
      priceNode.textContent = centsToDollars(priceCents);

      li.appendChild(nameText);
      li.appendChild(priceNode);

      listEl.appendChild(li);
      liByKey.set(key, li);

      card.classList.add('is-favorite');
      card.style.backgroundColor = "rgb(244, 212, 170)";
      btn.textContent = 'Remove from Favorites';
      btn.setAttribute('aria-pressed', 'true');

      totalCents += priceCents;
      renderTotal();
    }
  }

  function renderTotal() {
    // Update the total in the Favorites section
    const totalSpan = document.getElementById('totalCost');
    if (totalSpan) totalSpan.textContent = centsToDollars(totalCents);
  }
});
