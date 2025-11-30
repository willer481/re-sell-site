document.addEventListener('DOMContentLoaded', fetchItemDetails);

async function fetchItemDetails() {
    // Extract the Item ID from the URL path (e.g., the part after /item/)
    const pathSegments = window.location.pathname.split('/');
    const itemId = pathSegments[pathSegments.length - 1]; 

    if (!itemId || itemId.length !== 24) {
        document.getElementById('product-title').textContent = "Error: Invalid Product ID";
        return;
    }

    try {
        // Fetch the data from the server's single item API endpoint
        const response = await fetch(`/api/item/${itemId}`);
        
        if (response.status === 404) {
             document.getElementById('product-title').textContent = "Console Not Found";
             return;
        }
        if (!response.ok) throw new Error('Failed to fetch item data');

        const item = await response.json();

        // Populate the HTML Placeholders
        document.getElementById('page-title').textContent = item.title;
        document.getElementById('product-title').textContent = item.title;
        document.getElementById('product-price').textContent = `£${item.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = item.description;
        
        const conditionTitle = document.getElementById('condition-title');
        conditionTitle.textContent = 'Condition: ' + item.condition;
        
        // Set up the Contact Seller button link
        const contactButton = document.getElementById('contact-button');
        const mailtoLink = `mailto:yoursupportemail@example.com?subject=Inquiry on ${encodeURIComponent(item.title)} - £${item.price.toFixed(2)}`;
        contactButton.href = mailtoLink;
        
        // Generate Image Gallery
        const galleryContainer = document.getElementById('image-gallery-container');
        if (item.images && item.images.length > 0) {
            item.images.forEach((url, index) => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = `${item.title} - Image ${index + 1}`;
                img.style.maxWidth = '100%';
                img.style.marginBottom = '15px';
                galleryContainer.appendChild(img);
            });
        } else {
             galleryContainer.innerHTML = '<p>No images available for this item.</p>';
        }

    } catch (error) {
        console.error("Error loading item details:", error);
        document.getElementById('product-title').textContent = "Failed to load product details.";
    }
}
