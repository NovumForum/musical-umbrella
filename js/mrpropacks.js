/**
 * MrProPacks.com JavaScript Functions
 * Handles interactive features including the Pack Name Generator
 */

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if it's open
                navMenu.classList.remove('active');
            }
        });
    });

    // Initialize Pack Name Generator
    initPackNameGenerator();
});

/**
 * Pack Name Generator Functionality
 */
function initPackNameGenerator() {
    const generateBtn = document.getElementById('generateBtn');
    const keywordInput = document.getElementById('keywordInput');
    const generatedNameDiv = document.getElementById('generatedName');

    if (!generateBtn || !keywordInput || !generatedNameDiv) {
        console.warn('Pack Name Generator elements not found');
        return;
    }

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        generatePackName();
    });

    // Enter key handler for input field
    keywordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePackName();
        }
    });

    function generatePackName() {
        const keywords = keywordInput.value.trim();
        
        if (!keywords) {
            showNotification('Please enter at least one keyword!', 'warning');
            return;
        }

        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;

        // Simulate processing delay for better UX
        setTimeout(() => {
            const generatedName = createPackName(keywords);
            displayGeneratedName(generatedName);
            
            // Reset button
            generateBtn.textContent = 'Generate Pack Name';
            generateBtn.disabled = false;
        }, 800);
    }

    function createPackName(keywords) {
        // Pack name prefixes
        const prefixes = [
            'Ultimate', 'Premium', 'Pro', 'Elite', 'Master', 'Complete', 
            'Advanced', 'Essential', 'Expert', 'Supreme', 'Mega', 'Super',
            'Deluxe', 'Professional', 'Exclusive', 'Comprehensive', 'Total',
            'Power', 'Turbo', 'Max', 'Platinum', 'Gold', 'Diamond'
        ];

        // Pack name suffixes
        const suffixes = [
            'Pack', 'Bundle', 'Kit', 'Suite', 'Collection', 'Toolkit',
            'Arsenal', 'Vault', 'Library', 'Hub', 'Station', 'Center',
            'Lab', 'Factory', 'Studio', 'Workshop', 'Academy', 'Masterclass',
            'Bootcamp', 'System', 'Method', 'Formula', 'Blueprint'
        ];

        // Action words to enhance the name
        const actionWords = [
            'Mastery', 'Success', 'Growth', 'Boost', 'Advantage', 'Edge',
            'Power', 'Force', 'Impact', 'Results', 'Victory', 'Domination',
            'Excellence', 'Perfection', 'Revolution', 'Evolution', 'Innovation',
            'Transformation', 'Breakthrough', 'Achievement', 'Accelerator'
        ];

        // Parse keywords
        const keywordArray = keywords.split(/[,\s]+/)
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);

        // Capitalize first letter of each keyword
        const capitalizedKeywords = keywordArray.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        );

        // Generate different types of pack names
        const nameGenerators = [
            // Type 1: Prefix + Keyword + Suffix
            () => {
                const prefix = getRandomItem(prefixes);
                const keyword = getRandomItem(capitalizedKeywords);
                const suffix = getRandomItem(suffixes);
                return `${prefix} ${keyword} ${suffix}`;
            },

            // Type 2: Keyword + Action Word + Suffix
            () => {
                const keyword = getRandomItem(capitalizedKeywords);
                const action = getRandomItem(actionWords);
                const suffix = getRandomItem(suffixes);
                return `${keyword} ${action} ${suffix}`;
            },

            // Type 3: The + Keyword + Prefix + Suffix
            () => {
                const keyword = getRandomItem(capitalizedKeywords);
                const prefix = getRandomItem(prefixes);
                const suffix = getRandomItem(suffixes);
                return `The ${keyword} ${prefix} ${suffix}`;
            },

            // Type 4: Multiple Keywords + Suffix
            () => {
                if (capitalizedKeywords.length >= 2) {
                    const keyword1 = getRandomItem(capitalizedKeywords);
                    let keyword2 = getRandomItem(capitalizedKeywords);
                    // Ensure different keywords
                    while (keyword2 === keyword1 && capitalizedKeywords.length > 1) {
                        keyword2 = getRandomItem(capitalizedKeywords);
                    }
                    const suffix = getRandomItem(suffixes);
                    return `${keyword1} & ${keyword2} ${suffix}`;
                } else {
                    // Fallback to type 1
                    const prefix = getRandomItem(prefixes);
                    const keyword = getRandomItem(capitalizedKeywords);
                    const suffix = getRandomItem(suffixes);
                    return `${prefix} ${keyword} ${suffix}`;
                }
            },

            // Type 5: Keyword + "Pro" variations
            () => {
                const keyword = getRandomItem(capitalizedKeywords);
                const proVariations = ['Pro', 'Expert', 'Master', 'Guru', 'Ninja', 'Wizard'];
                const proWord = getRandomItem(proVariations);
                const suffix = getRandomItem(suffixes);
                return `${keyword} ${proWord} ${suffix}`;
            }
        ];

        // Select random name generator and create name
        const selectedGenerator = getRandomItem(nameGenerators);
        return selectedGenerator();
    }

    function displayGeneratedName(name) {
        generatedNameDiv.textContent = `✨ ${name}`;
        generatedNameDiv.style.display = 'block';
        
        // Add animation effect
        generatedNameDiv.style.opacity = '0';
        generatedNameDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            generatedNameDiv.style.transition = 'all 0.5s ease';
            generatedNameDiv.style.opacity = '1';
            generatedNameDiv.style.transform = 'translateY(0)';
        }, 100);

        // Add copy-to-clipboard functionality
        generatedNameDiv.style.cursor = 'pointer';
        generatedNameDiv.title = 'Click to copy to clipboard';
        
        generatedNameDiv.onclick = function() {
            copyToClipboard(name);
        };
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

/**
 * Utility Functions
 */

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Pack name copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Pack name copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #10b981, #059669)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #3b82f6, #2563eb)';
    }

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add click handlers for product buttons
document.addEventListener('DOMContentLoaded', function() {
    const productButtons = document.querySelectorAll('.product-button');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            showNotification(`Interest recorded for: ${productName}`, 'info');
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});