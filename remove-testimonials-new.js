// JavaScript to remove testimonials section
document.addEventListener('DOMContentLoaded', function() {
    // Function to remove testimonials section
    function removeTestimonials() {
        // Remove the testimonials link from the navbar
        const navLinks = document.querySelectorAll('a.nav-link');
        navLinks.forEach(link => {
            if (link.textContent.toLowerCase().includes('testimonial') || 
                (link.href && link.href.toLowerCase().includes('testimonial'))) {
                link.style.display = 'none';
                link.style.visibility = 'hidden';
                link.style.width = '0';
                link.style.height = '0';
                link.style.padding = '0';
                link.style.margin = '0';
                link.style.overflow = 'hidden';
                link.style.opacity = '0';
                link.style.position = 'absolute';
                link.style.zIndex = '-9999';
                link.style.pointerEvents = 'none';
                link.innerHTML = '';
                link.href = '#';
            }
        });
        
        // Remove by heading text - VERY AGGRESSIVE
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (heading.textContent.toLowerCase().includes('testimonial')) {
                // Find the parent section or div that contains this heading
                let parent = heading.parentElement;
                
                // If the parent is the body, we need to be more careful
                if (parent.tagName === 'BODY') {
                    // Just remove the heading and any siblings that look like testimonials
                    heading.style.display = 'none';
                    heading.style.visibility = 'hidden';
                    heading.style.height = '0';
                    heading.style.width = '0';
                    heading.style.overflow = 'hidden';
                    heading.style.margin = '0';
                    heading.style.padding = '0';
                    heading.style.opacity = '0';
                    heading.style.position = 'absolute';
                    heading.style.zIndex = '-9999';
                    heading.style.pointerEvents = 'none';
                    heading.innerHTML = '';
                    
                    // Look for siblings that might be testimonial cards
                    let sibling = heading.nextElementSibling;
                    while (sibling) {
                        const computedStyle = window.getComputedStyle(sibling);
                        const bgColor = computedStyle.backgroundColor;
                        
                        // If it's a pink div, it's probably a testimonial card
                        if (sibling.tagName === 'DIV' && 
                            (bgColor.includes('rgb(239, 209, 248)') || 
                             bgColor.includes('rgb(248, 209, 248)') ||
                             bgColor.includes('rgb(255, 192, 203)') ||
                             bgColor.includes('rgb(255, 182, 193)') ||
                             bgColor.includes('rgb(240, 214, 245)'))) {
                            sibling.style.display = 'none';
                            sibling.style.visibility = 'hidden';
                            sibling.style.height = '0';
                            sibling.style.width = '0';
                            sibling.style.overflow = 'hidden';
                            sibling.style.margin = '0';
                            sibling.style.padding = '0';
                            sibling.style.opacity = '0';
                            sibling.style.position = 'absolute';
                            sibling.style.zIndex = '-9999';
                            sibling.style.pointerEvents = 'none';
                            sibling.innerHTML = '';
                        }
                        
                        sibling = sibling.nextElementSibling;
                    }
                } else {
                    // Go up the DOM tree to find a suitable container
                    let depth = 0;
                    const maxDepth = 10; // Increase depth to find container
                    
                    while (depth < maxDepth && parent) {
                        if (parent.tagName === 'SECTION' || parent.tagName === 'DIV') {
                            // Found a suitable container, remove it
                            parent.style.display = 'none';
                            parent.style.visibility = 'hidden';
                            parent.style.height = '0';
                            parent.style.width = '0';
                            parent.style.overflow = 'hidden';
                            parent.style.margin = '0';
                            parent.style.padding = '0';
                            parent.style.opacity = '0';
                            parent.style.position = 'absolute';
                            parent.style.zIndex = '-9999';
                            parent.style.pointerEvents = 'none';
                            parent.innerHTML = '';
                            break;
                        }
                        
                        if (parent.parentElement) {
                            parent = parent.parentElement;
                            depth++;
                        } else {
                            break;
                        }
                    }
                }
            }
        });
        
        // DIRECT TARGETING - Find the exact structure from the screenshot
        // Look for a div with pink background that contains the testimonials heading
        const pinkDivs = document.querySelectorAll('div');
        pinkDivs.forEach(div => {
            const computedStyle = window.getComputedStyle(div);
            const bgColor = computedStyle.backgroundColor;
            
            // Check if background color is pink-ish (from the screenshot)
            if (bgColor.includes('rgb(240, 214, 245)') || 
                bgColor.includes('rgb(239, 209, 248)') || 
                bgColor.includes('rgb(248, 209, 248)')) {
                
                // Check if this div contains a testimonials heading
                const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6');
                let hasTestimonialHeading = false;
                
                headings.forEach(heading => {
                    if (heading.textContent.toLowerCase().includes('testimonial')) {
                        hasTestimonialHeading = true;
                    }
                });
                
                // If it has a testimonials heading or contains the text "Absolutely love the treats here!"
                if (hasTestimonialHeading || 
                    div.textContent.includes('Absolutely love the treats here!') ||
                    div.textContent.includes('Every bite is pure heaven')) {
                    // This is the testimonials section, remove it
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                    div.style.height = '0';
                    div.style.width = '0';
                    div.style.overflow = 'hidden';
                    div.style.margin = '0';
                    div.style.padding = '0';
                    div.style.opacity = '0';
                    div.style.position = 'absolute';
                    div.style.zIndex = '-9999';
                    div.style.pointerEvents = 'none';
                    div.innerHTML = '';
                }
            }
        });
        
        // Remove the entire section with pink background
        const bodyChildren = document.body.children;
        for (let i = 0; i < bodyChildren.length; i++) {
            const element = bodyChildren[i];
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;
            
            // If it's a div with pink background
            if (element.tagName === 'DIV' && 
                (bgColor.includes('rgb(240, 214, 245)') || 
                 bgColor.includes('rgb(239, 209, 248)') || 
                 bgColor.includes('rgb(248, 209, 248)'))) {
                
                // Remove it
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.height = '0';
                element.style.width = '0';
                element.style.overflow = 'hidden';
                element.style.margin = '0';
                element.style.padding = '0';
                element.style.opacity = '0';
                element.style.position = 'absolute';
                element.style.zIndex = '-9999';
                element.style.pointerEvents = 'none';
                element.innerHTML = '';
            }
            
            // If it contains the text "Testimonials"
            if (element.textContent.includes('Testimonials')) {
                // Remove it
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.height = '0';
                element.style.width = '0';
                element.style.overflow = 'hidden';
                element.style.margin = '0';
                element.style.padding = '0';
                element.style.opacity = '0';
                element.style.position = 'absolute';
                element.style.zIndex = '-9999';
                element.style.pointerEvents = 'none';
                element.innerHTML = '';
            }
        }
        
        // Target the specific pink testimonial cards
        const pinkCards = document.querySelectorAll('div[style*="background-color: #f8d1f8"], div[style*="background: #f8d1f8"]');
        pinkCards.forEach(card => {
            card.style.display = 'none';
            card.style.visibility = 'hidden';
            card.style.height = '0';
            card.style.width = '0';
            card.style.overflow = 'hidden';
            card.style.margin = '0';
            card.style.padding = '0';
            card.style.opacity = '0';
            card.style.position = 'absolute';
            card.style.zIndex = '-9999';
            card.style.pointerEvents = 'none';
            card.innerHTML = '';
        });
        
        // Remove any elements with stars
        const starElements = document.querySelectorAll('.stars, [class*="star"], [id*="star"]');
        starElements.forEach(element => {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.height = '0';
            element.style.width = '0';
            element.style.overflow = 'hidden';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.opacity = '0';
            element.style.position = 'absolute';
            element.style.zIndex = '-9999';
            element.style.pointerEvents = 'none';
            element.innerHTML = '';
        });
    }
    
    // Run immediately
    removeTestimonials();
    
    // Also run after a short delay to catch dynamically loaded content
    setTimeout(removeTestimonials, 100);
    setTimeout(removeTestimonials, 500);
    setTimeout(removeTestimonials, 1000);
    setTimeout(removeTestimonials, 2000);
    
    // Run when window is fully loaded
    window.addEventListener('load', removeTestimonials);
    
    // Run when DOM changes
    const observer = new MutationObserver(function(mutations) {
        removeTestimonials();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
