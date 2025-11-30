document.addEventListener('DOMContentLoaded', fetchAndDisplayItems);

async function fetchAndDisplayItems() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '<p>Loading consoles...</p>';

    try {
        const response = await fetch('/api/items'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const items = await response.json();
        productGrid.innerHTML = ''; 

        if (items.length === 0) {
            productGrid.innerHTML = '<p>No consoles currently listed. Check back soon!</p>';
            return;
        }

        items.forEach(item => {
            const itemUrl = `/item/${item._id}`; 
            
            const card = document.createElement('a');
            card.href = itemUrl;
            card.className = 'product-card';
            
            const mainImage = item.images && item.images.length > 0 ? item.images[0] : 'images/placeholder.jpg';

            card.innerHTML = `
                <img src="${mainImage}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p class="price">£${item.price.toFixed(2)}</p>
                <p class="condition">Condition: ${item.condition}</p>
            `;
            
            productGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Failed to load products:", error);
        productGrid.innerHTML = '<p class="error">Error loading store data. Please try again later.</p>';
    }
}
