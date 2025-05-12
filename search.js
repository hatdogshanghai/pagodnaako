// Search functionality for Yogee website
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    // Handle search form submission - redirect to search results page
    searchForm.addEventListener('submit', function(e) {
        // Don't prevent default - let the form submit naturally to search-results.html
        // The form action is set to search-results.html in the HTML

        const query = searchInput.value.trim();
        if (!query) {
            e.preventDefault(); // Only prevent if query is empty
            alert('Please enter a search term');
        }
    });

    // Remove keyup event for real-time search since we're redirecting to results page
});
