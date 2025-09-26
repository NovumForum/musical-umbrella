/**
 * MrProPacks - Main JavaScript File
 * Enhanced interactive features and functionality
 * Modern ES6+ JavaScript with performance optimizations
 */

// =============================================================================
// Global State Management
// =============================================================================

class MrProPacksApp {
    constructor() {
        this.state = {
            currentQuizQuestion: 0,
            quizAnswers: [],
            products: [],
            isLoading: false,
            mobileMenuOpen: false
        };
        
        this.quizQuestions = [
            {
                id: 1,
                question: "What's your primary profession or field?",
                options: [
                    { value: "business", label: "Business & Entrepreneurship" },
                    { value: "creative", label: "Creative & Design" },
                    { value: "tech", label: "Technology & Development" },
                    { value: "education", label: "Education & Training" },
                    { value: "health", label: "Health & Wellness" },
                    { value: "other", label: "Other" }
                ]
            },
            {
                id: 2,
                question: "What's your experience level?",
                options: [
                    { value: "beginner", label: "Just getting started" },
                    { value: "intermediate", label: "Some experience" },
                    { value: "advanced", label: "Very experienced" },
                    { value: "expert", label: "Industry expert" }
                ]
            },
            {
                id: 3,
                question: "What's your main goal?",
                options: [
                    { value: "learn", label: "Learn new skills" },
                    { value: "improve", label: "Improve existing skills" },
                    { value: "tools", label: "Get better tools" },
                    { value: "efficiency", label: "Increase efficiency" },
                    { value: "growth", label: "Grow my business/career" }
                ]
            },
            {
                id: 4,
                question: "What's your budget range?",
                options: [
                    { value: "budget", label: "Under $50" },
                    { value: "standard", label: "$50 - $100" },
                    { value: "premium", label: "$100 - $200" },
                    { value: "unlimited", label: "$200+" }
                ]
            },
            {
                id: 5,
                question: "How do you prefer to learn/work?",
                options: [
                    { value: "self-paced", label: "Self-paced learning" },
                    { value: "structured", label: "Structured programs" },
                    { value: "hands-on", label: "Hands-on practice" },
                    { value: "community", label: "Community-driven" }
                ]
            }
        ];
        
        this.sampleProducts = [
            {
                id: 1,
                title: "Business Starter Pro Pack",
                description: "Everything you need to launch your business with confidence.",
                price: "$99",
                icon: "💼",
                features: ["Business plan template", "Legal documents", "Marketing toolkit", "Financial spreadsheets"],
                category: "business",
                level: "beginner"
            },
            {
                id: 2,
                title: "Creative Designer's Bundle",
                description: "Premium tools and resources for creative professionals.",
                price: "$149",
                icon: "🎨",
                features: ["Design templates", "Stock photos", "Font collection", "Color palettes"],
                category: "creative",
                level: "intermediate"
            },
            {
                id: 3,
                title: "Tech Developer's Toolkit",
                description: "Essential resources for modern software development.",
                price: "$129",
                icon: "💻",
                features: ["Code templates", "Dev tools", "Documentation", "Testing frameworks"],
                category: "tech",
                level: "advanced"
            },
            {
                id: 4,
                title: "Educator's Excellence Pack",
                description: "Comprehensive teaching and training materials.",
                price: "$79",
                icon: "📚",
                features: ["Lesson plans", "Assessment tools", "Presentation templates", "Student resources"],
                category: "education",
                level: "intermediate"
            },
            {
                id: 5,
                title: "Wellness Professional Kit",
                description: "Complete package for health and wellness experts.",
                price: "$109",
                icon: "🌱",
                features: ["Client forms", "Nutrition guides", "Workout plans", "Progress trackers"],
                category: "health",
                level: "beginner"
            },
            {
                id: 6,
                title: "Advanced Analytics Suite",
                description: "Data-driven insights for business optimization.",
                price: "$199",
                icon: "📊",
                features: ["Dashboard templates", "Data visualization", "Report generators", "KPI trackers"],
                category: "business",
                level: "expert"
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.initializeQuiz();
        this.setupAnimationObserver();
        this.setupAccessibility();
        this.removeLoadingScreen();
    }

    // =============================================================================
    // Event Listeners Setup
    // =============================================================================

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Window scroll for header effects
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Window resize for responsive adjustments
        window.addEventListener('resize', () => this.handleResize(), { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // =============================================================================
    // Mobile Menu Management
    // =============================================================================

    toggleMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
        
        if (this.state.mobileMenuOpen) {
            navMenu.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // =============================================================================
    // Smooth Scrolling
    // =============================================================================

    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (this.state.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    // =============================================================================
    // Product Management
    // =============================================================================

    loadProducts() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        this.state.products = [...this.sampleProducts];
        this.renderProducts(this.state.products.slice(0, 3)); // Show first 3 initially
    }

    renderProducts(products) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="product-image">
                ${product.icon}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <ul class="product-features">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="btn btn-primary" onclick="app.selectProduct(${product.id})">
                        Select Pack
                    </button>
                </div>
            </div>
        `;

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        return card;
    }

    loadMoreProducts() {
        const currentLength = document.querySelectorAll('.product-card').length;
        const nextProducts = this.state.products.slice(currentLength, currentLength + 3);
        
        if (nextProducts.length > 0) {
            const productsGrid = document.querySelector('.products-grid');
            nextProducts.forEach((product, index) => {
                const productCard = this.createProductCard(product, currentLength + index);
                productsGrid.appendChild(productCard);
            });
        }

        // Hide load more button if all products are shown
        if (currentLength + nextProducts.length >= this.state.products.length) {
            const loadMoreBtn = document.querySelector('.products-cta');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    selectProduct(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            this.showNotification(`Great choice! ${product.title} added to your interest list.`, 'success');
            // In a real app, this would add to cart or favorites
        }
    }

    // =============================================================================
    // Quiz Functionality
    // =============================================================================

    initializeQuiz() {
        this.renderQuizQuestion();
    }

    renderQuizQuestion() {
        const quizContent = document.getElementById('quiz-content');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('quiz-progress');
        
        if (!quizContent) return;

        const currentQ = this.quizQuestions[this.state.currentQuizQuestion];
        const progress = ((this.state.currentQuizQuestion + 1) / this.quizQuestions.length) * 100;

        // Update progress
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Question ${this.state.currentQuizQuestion + 1} of ${this.quizQuestions.length}`;

        // Render question
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h3 class="question-title">${currentQ.question}</h3>
                <div class="question-options">
                    ${currentQ.options.map((option, index) => `
                        <div class="question-option" onclick="app.selectQuizOption('${option.value}')" data-value="${option.value}">
                            ${option.label}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Update navigation buttons
        const prevBtn = document.getElementById('quiz-prev');
        const nextBtn = document.getElementById('quiz-next');
        
        if (prevBtn) prevBtn.disabled = this.state.currentQuizQuestion === 0;
        if (nextBtn) nextBtn.textContent = this.state.currentQuizQuestion === this.quizQuestions.length - 1 ? 'Get Results' : 'Next';
    }

    selectQuizOption(value) {
        // Remove previous selection
        document.querySelectorAll('.question-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        document.querySelector(`[data-value="${value}"]`).classList.add('selected');

        // Store answer
        this.state.quizAnswers[this.state.currentQuizQuestion] = value;

        // Enable next button
        document.getElementById('quiz-next').disabled = false;
    }

    nextQuestion() {
        if (this.state.currentQuizQuestion < this.quizQuestions.length - 1) {
            this.state.currentQuizQuestion++;
            this.renderQuizQuestion();
        } else {
            this.showQuizResults();
        }
    }

    previousQuestion() {
        if (this.state.currentQuizQuestion > 0) {
            this.state.currentQuizQuestion--;
            this.renderQuizQuestion();
        }
    }

    showQuizResults() {
        const result = this.calculateQuizResult();
        const quizContent = document.getElementById('quiz-content');
        const quizControls = document.querySelector('.quiz-controls');
        const quizResult = document.getElementById('quiz-result');

        // Hide question content and controls
        if (quizContent) quizContent.style.display = 'none';
        if (quizControls) quizControls.style.display = 'none';

        // Show results
        if (quizResult) {
            quizResult.style.display = 'block';
            quizResult.innerHTML = `
                <div class="quiz-result-content">
                    <h3>Your Perfect Pack:</h3>
                    <div class="result-pack">${result.product.icon} ${result.product.title}</div>
                    <p>${result.product.description}</p>
                    <div class="result-features">
                        <h4>What's included:</h4>
                        <ul>
                            ${result.product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-primary" onclick="app.selectProduct(${result.product.id})">
                            Get This Pack - ${result.product.price}
                        </button>
                        <button class="btn btn-outline" onclick="app.restartQuiz()">
                            Take Quiz Again
                        </button>
                    </div>
                </div>
            `;
        }
    }

    calculateQuizResult() {
        const answers = this.state.quizAnswers;
        
        // Simple scoring algorithm based on answers
        let bestMatch = this.state.products[0];
        let bestScore = 0;

        this.state.products.forEach(product => {
            let score = 0;
            
            // Match category
            if (answers[0] === product.category) score += 3;
            
            // Match level
            if (answers[1] === product.level) score += 2;
            
            // Additional scoring based on other answers
            if (answers[2] === 'tools' && product.features.some(f => f.includes('tool'))) score += 1;
            if (answers[3] === 'budget' && parseInt(product.price.replace('$', '')) < 100) score += 1;
            if (answers[3] === 'premium' && parseInt(product.price.replace('$', '')) > 150) score += 1;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = product;
            }
        });

        return { product: bestMatch, score: bestScore };
    }

    restartQuiz() {
        this.state.currentQuizQuestion = 0;
        this.state.quizAnswers = [];
        
        const quizContent = document.getElementById('quiz-content');
        const quizControls = document.querySelector('.quiz-controls');
        const quizResult = document.getElementById('quiz-result');

        if (quizContent) quizContent.style.display = 'block';
        if (quizControls) quizControls.style.display = 'flex';
        if (quizResult) quizResult.style.display = 'none';

        this.renderQuizQuestion();
    }

    // =============================================================================
    // Form Handling
    // =============================================================================

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    // =============================================================================
    // Scroll Effects
    // =============================================================================

    handleScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;

        // Header background opacity on scroll
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    // =============================================================================
    // Animation Observer
    // =============================================================================

    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        // Add staggered animation delay for child elements
                        const children = entry.target.querySelectorAll('.feature, .stat-card, .contact-item');
                        children.forEach((child, index) => {
                            child.style.setProperty('--i', index);
                        });
                    }
                });
            }, observerOptions);

            // Observe elements that need animation
            document.querySelectorAll('.about-content, .stats-grid, .contact-info').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // =============================================================================
    // Accessibility Features
    // =============================================================================

    setupAccessibility() {
        // Keyboard navigation for custom elements
        document.querySelectorAll('.question-option, .product-card').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // ARIA labels for dynamic content
        this.updateAriaLabels();
    }

    updateAriaLabels() {
        // Update quiz progress for screen readers
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            progressText.setAttribute('aria-live', 'polite');
        }
    }

    handleKeyboard(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && this.state.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    // =============================================================================
    // Utility Functions
    // =============================================================================

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-info { border-left: 4px solid #3b82f6; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    removeLoadingScreen() {
        // Remove initial loading screen after page load
        setTimeout(() => {
            this.hideLoading();
        }, 1000);
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.state.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }
}

// =============================================================================
// Global Functions (for backward compatibility with inline handlers)
// =============================================================================

function scrollToSection(targetId) {
    if (window.app) {
        window.app.scrollToSection(targetId);
    }
}

function generatePackName() {
    if (window.packGenerator) {
        window.packGenerator.generateName();
    }
}

function loadMoreProducts() {
    if (window.app) {
        window.app.loadMoreProducts();
    }
}

function nextQuestion() {
    if (window.app) {
        window.app.nextQuestion();
    }
}

function previousQuestion() {
    if (window.app) {
        window.app.previousQuestion();
    }
}

// =============================================================================
// Initialize Application
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.app = new MrProPacksApp();
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime, 'ms');
        });
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you create a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}