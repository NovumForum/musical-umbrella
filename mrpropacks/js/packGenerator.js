/**
 * MrProPacks - Pack Name Generator
 * Creative algorithm for generating product pack names
 * Advanced name generation with multiple algorithms and styles
 */

class PackNameGenerator {
    constructor() {
        this.nameComponents = {
            business: {
                prefixes: ['Pro', 'Elite', 'Executive', 'Premier', 'Ultimate', 'Master', 'Expert', 'Strategic', 'Dynamic', 'Advanced'],
                cores: ['Business', 'Venture', 'Enterprise', 'Success', 'Growth', 'Innovation', 'Solution', 'Strategy', 'Performance', 'Excellence'],
                suffixes: ['Pack', 'Bundle', 'Suite', 'Kit', 'Collection', 'Set', 'Arsenal', 'Toolkit', 'Series', 'Package'],
                adjectives: ['Comprehensive', 'Complete', 'Essential', 'Premium', 'Professional', 'Powerful', 'Proven', 'Winning', 'Smart', 'Modern']
            },
            creative: {
                prefixes: ['Artistic', 'Creative', 'Design', 'Visual', 'Inspired', 'Brilliant', 'Imaginative', 'Innovative', 'Stylish', 'Aesthetic'],
                cores: ['Creator', 'Artist', 'Designer', 'Studio', 'Vision', 'Craft', 'Expression', 'Inspiration', 'Masterpiece', 'Canvas'],
                suffixes: ['Collection', 'Pack', 'Bundle', 'Set', 'Kit', 'Library', 'Palette', 'Gallery', 'Workshop', 'Studio'],
                adjectives: ['Vibrant', 'Bold', 'Elegant', 'Stunning', 'Beautiful', 'Unique', 'Original', 'Artistic', 'Colorful', 'Expressive']
            },
            tech: {
                prefixes: ['Tech', 'Digital', 'Code', 'Dev', 'Cyber', 'Smart', 'Advanced', 'Next-Gen', 'AI', 'Cloud'],
                cores: ['Developer', 'Programmer', 'Engineer', 'Builder', 'Creator', 'Innovator', 'Architect', 'Specialist', 'Expert', 'Master'],
                suffixes: ['Toolkit', 'Suite', 'Framework', 'Stack', 'Package', 'Library', 'SDK', 'API', 'Platform', 'System'],
                adjectives: ['Cutting-edge', 'Revolutionary', 'Advanced', 'Powerful', 'Efficient', 'Scalable', 'Robust', 'Intelligent', 'Modern', 'Innovative']
            },
            lifestyle: {
                prefixes: ['Life', 'Wellness', 'Healthy', 'Balanced', 'Zen', 'Pure', 'Natural', 'Organic', 'Fresh', 'Vital'],
                cores: ['Living', 'Lifestyle', 'Wellness', 'Health', 'Balance', 'Harmony', 'Peace', 'Energy', 'Vitality', 'Spirit'],
                suffixes: ['Pack', 'Kit', 'Bundle', 'Collection', 'Set', 'Series', 'System', 'Program', 'Method', 'Approach'],
                adjectives: ['Holistic', 'Natural', 'Balanced', 'Peaceful', 'Energizing', 'Refreshing', 'Mindful', 'Authentic', 'Pure', 'Transformative']
            },
            education: {
                prefixes: ['Learn', 'Study', 'Academic', 'Scholar', 'Genius', 'Brain', 'Knowledge', 'Wisdom', 'Smart', 'Brilliant'],
                cores: ['Student', 'Learner', 'Scholar', 'Teacher', 'Educator', 'Master', 'Academy', 'University', 'School', 'Institute'],
                suffixes: ['Pack', 'Kit', 'Bundle', 'Library', 'Collection', 'Series', 'Course', 'Program', 'System', 'Method'],
                adjectives: ['Comprehensive', 'Complete', 'Essential', 'Advanced', 'Expert', 'Proven', 'Effective', 'Structured', 'Progressive', 'Mastery']
            },
            fitness: {
                prefixes: ['Fit', 'Strong', 'Power', 'Athletic', 'Performance', 'Elite', 'Champion', 'Victory', 'Peak', 'Ultimate'],
                cores: ['Fitness', 'Strength', 'Performance', 'Training', 'Workout', 'Exercise', 'Athletic', 'Sport', 'Champion', 'Winner'],
                suffixes: ['Pack', 'Kit', 'Program', 'System', 'Method', 'Training', 'Regimen', 'Plan', 'Guide', 'Blueprint'],
                adjectives: ['Intense', 'Powerful', 'Effective', 'Proven', 'Results-driven', 'High-performance', 'Elite', 'Professional', 'Complete', 'Ultimate']
            }
        };

        this.namePatterns = [
            '{adjective} {prefix} {suffix}',
            '{prefix} {core} {suffix}',
            '{adjective} {core} {suffix}',
            '{prefix} {adjective} {suffix}',
            'The {adjective} {core} {suffix}',
            '{core} {prefix} {suffix}',
            '{adjective} {prefix} {core}',
            'Ultimate {core} {suffix}',
            'Pro {core} {suffix}',
            '{prefix} Master {suffix}'
        ];

        this.styleModifiers = {
            professional: {
                weight: { prefixes: 2, cores: 2, suffixes: 1, adjectives: 1 },
                avoid: ['Fun', 'Playful', 'Silly', 'Crazy']
            },
            fun: {
                weight: { prefixes: 1, cores: 1, suffixes: 2, adjectives: 2 },
                extraWords: ['Fun', 'Awesome', 'Super', 'Mega', 'Ultra', 'Fantastic', 'Amazing', 'Incredible', 'Epic', 'Legendary'],
                patterns: ['{extraWord} {core} {suffix}', 'Super {adjective} {suffix}', '{extraWord} {prefix} Pack']
            },
            minimal: {
                weight: { prefixes: 1, cores: 3, suffixes: 2, adjectives: 0 },
                patterns: ['{core}', '{prefix} {core}', '{core} {suffix}'],
                prefer: ['Pack', 'Kit', 'Set', 'Bundle']
            },
            bold: {
                weight: { prefixes: 3, cores: 2, suffixes: 1, adjectives: 3 },
                extraWords: ['Ultimate', 'Supreme', 'Maximum', 'Extreme', 'Intense', 'Powerful', 'Elite', 'Master', 'Champion', 'Victory'],
                patterns: ['{extraWord} {core} {suffix}', 'The {extraWord} {adjective} {suffix}']
            },
            classic: {
                weight: { prefixes: 2, cores: 3, suffixes: 2, adjectives: 2 },
                prefer: ['Professional', 'Premium', 'Standard', 'Complete', 'Essential', 'Traditional', 'Proven', 'Established']
            }
        };

        this.usedNames = new Set(); // Track generated names to avoid duplicates
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for generate button clicks
        const generateBtn = document.querySelector('.generator-controls .btn-primary');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateName());
        }

        // Listen for category/style changes to auto-generate preview
        const categorySelect = document.getElementById('pack-category');
        const styleSelect = document.getElementById('pack-style');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.generatePreview());
        }
        
        if (styleSelect) {
            styleSelect.addEventListener('change', () => this.generatePreview());
        }
    }

    generateName() {
        const category = document.getElementById('pack-category')?.value || 'business';
        const style = document.getElementById('pack-style')?.value || 'professional';
        
        if (!category) {
            this.showError('Please select a category first!');
            return;
        }

        this.showLoading();
        
        // Simulate processing time for better UX
        setTimeout(() => {
            const generatedName = this.createName(category, style);
            this.displayResult(generatedName, category, style);
            this.hideLoading();
            
            // Analytics tracking (in real app)
            this.trackGeneration(category, style, generatedName);
        }, 800);
    }

    generatePreview() {
        const category = document.getElementById('pack-category')?.value;
        const style = document.getElementById('pack-style')?.value;
        
        if (category && style) {
            const previewName = this.createName(category, style);
            // Could show a subtle preview in the UI
        }
    }

    createName(category, style) {
        const components = this.nameComponents[category] || this.nameComponents.business;
        const styleConfig = this.styleModifiers[style] || this.styleModifiers.professional;
        
        let attempts = 0;
        let generatedName;
        
        // Try to generate a unique name
        do {
            generatedName = this.generateSingleName(components, styleConfig, style);
            attempts++;
        } while (this.usedNames.has(generatedName) && attempts < 10);
        
        // Add to used names
        this.usedNames.add(generatedName);
        
        // Clear old names if we have too many stored
        if (this.usedNames.size > 100) {
            const oldNames = Array.from(this.usedNames).slice(0, 50);
            oldNames.forEach(name => this.usedNames.delete(name));
        }
        
        return generatedName;
    }

    generateSingleName(components, styleConfig, style) {
        // Choose pattern based on style
        let patterns = [...this.namePatterns];
        
        if (styleConfig.patterns) {
            patterns = [...patterns, ...styleConfig.patterns];
        }
        
        const pattern = this.randomChoice(patterns);
        
        // Get components based on style weights
        const selectedComponents = this.selectComponents(components, styleConfig, style);
        
        // Replace placeholders in pattern
        let name = pattern;
        Object.keys(selectedComponents).forEach(key => {
            const placeholder = `{${key}}`;
            if (name.includes(placeholder) && selectedComponents[key]) {
                name = name.replace(placeholder, selectedComponents[key]);
            }
        });
        
        // Clean up any remaining placeholders
        name = name.replace(/\{[^}]+\}/g, '').replace(/\s+/g, ' ').trim();
        
        // Apply final style modifications
        name = this.applyStyleModifications(name, style);
        
        return name;
    }

    selectComponents(components, styleConfig, style) {
        const selected = {};
        
        // Select based on weights and style preferences
        Object.keys(components).forEach(componentType => {
            const options = components[componentType];
            const weight = styleConfig.weight?.[componentType] || 1;
            
            if (weight > 0 && Math.random() < weight / 3) {
                selected[componentType] = this.selectWeightedOption(options, styleConfig, style);
            }
        });
        
        // Add extra words for certain styles
        if (styleConfig.extraWords && Math.random() < 0.4) {
            selected.extraWord = this.randomChoice(styleConfig.extraWords);
        }
        
        return selected;
    }

    selectWeightedOption(options, styleConfig, style) {
        // Filter out avoided words
        let filteredOptions = options;
        if (styleConfig.avoid) {
            filteredOptions = options.filter(option => 
                !styleConfig.avoid.some(avoided => option.includes(avoided))
            );
        }
        
        // Prefer certain options if specified
        if (styleConfig.prefer && Math.random() < 0.6) {
            const preferredOptions = filteredOptions.filter(option =>
                styleConfig.prefer.some(preferred => option.includes(preferred))
            );
            if (preferredOptions.length > 0) {
                return this.randomChoice(preferredOptions);
            }
        }
        
        return this.randomChoice(filteredOptions);
    }

    applyStyleModifications(name, style) {
        switch (style) {
            case 'fun':
                // Add fun punctuation occasionally
                if (Math.random() < 0.3) {
                    name += '!';
                }
                break;
                
            case 'minimal':
                // Remove articles and simplify
                name = name.replace(/^The\s+/i, '');
                break;
                
            case 'bold':
                // Make it uppercase occasionally
                if (Math.random() < 0.2) {
                    name = name.toUpperCase();
                }
                break;
        }
        
        return name;
    }

    displayResult(name, category, style) {
        const resultContainer = document.getElementById('generator-result');
        if (!resultContainer) return;
        
        // Get category icon
        const categoryIcons = {
            business: '💼',
            creative: '🎨',
            tech: '💻',
            lifestyle: '🌱',
            education: '📚',
            fitness: '💪'
        };
        
        const icon = categoryIcons[category] || '📦';
        
        // Create result HTML with animation
        resultContainer.innerHTML = `
            <div class="result-content">
                <div class="result-icon">${icon}</div>
                <div class="generated-name">${name}</div>
                <div class="result-meta">
                    <span class="result-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span class="result-style">${style.charAt(0).toUpperCase() + style.slice(1)} Style</span>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="packGenerator.copyToClipboard('${name}')">
                        📋 Copy Name
                    </button>
                    <button class="btn btn-secondary" onclick="packGenerator.generateName()">
                        ✨ Generate Another
                    </button>
                </div>
            </div>
        `;
        
        // Add animation class
        setTimeout(() => {
            resultContainer.classList.add('result-animated');
        }, 100);
    }

    showLoading() {
        const resultContainer = document.getElementById('generator-result');
        if (!resultContainer) return;
        
        resultContainer.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p>Crafting your perfect pack name...</p>
            </div>
        `;
    }

    hideLoading() {
        // Loading is replaced by result display
    }

    showError(message) {
        const resultContainer = document.getElementById('generator-result');
        if (!resultContainer) return;
        
        resultContainer.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopySuccess();
            } else {
                this.showCopyError();
            }
        } catch (err) {
            this.showCopyError();
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        // Show temporary success message
        const copyBtn = document.querySelector('.result-actions .btn-outline');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.disabled = true;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.disabled = false;
            }, 2000);
        }
        
        if (window.app) {
            window.app.showNotification('Pack name copied to clipboard!', 'success');
        }
    }

    showCopyError() {
        if (window.app) {
            window.app.showNotification('Failed to copy to clipboard. Please select and copy manually.', 'error');
        }
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    trackGeneration(category, style, name) {
        // Analytics tracking for generated names
        // In a real app, this would send data to analytics service
        console.log('Generated pack name:', {
            category,
            style,
            name,
            timestamp: new Date().toISOString()
        });
    }

    // Public API methods
    getRandomName(category = 'business', style = 'professional') {
        return this.createName(category, style);
    }

    getNameSuggestions(category, style, count = 5) {
        const suggestions = [];
        for (let i = 0; i < count; i++) {
            suggestions.push(this.createName(category, style));
        }
        return suggestions;
    }

    exportNames(names) {
        // Export generated names as JSON
        const data = JSON.stringify(names, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-pack-names.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Add additional styles for the generator results
const generatorStyles = `
    .result-content {
        text-align: center;
        animation: resultFadeIn 0.6s ease-out;
    }
    
    .result-meta {
        display: flex;
        justify-content: center;
        gap: var(--spacing-4);
        margin: var(--spacing-4) 0;
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .result-category,
    .result-style {
        background: var(--gray-100);
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--radius-full);
    }
    
    .result-actions {
        display: flex;
        gap: var(--spacing-3);
        justify-content: center;
        margin-top: var(--spacing-6);
        flex-wrap: wrap;
    }
    
    .loading-content {
        text-align: center;
        color: var(--gray-600);
    }
    
    .loading-spinner {
        margin-bottom: var(--spacing-4);
    }
    
    .error-content {
        text-align: center;
        color: var(--error);
    }
    
    .error-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-4);
    }
    
    @keyframes resultFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .result-animated .generated-name {
        animation: namePopIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes namePopIn {
        0% {
            opacity: 0;
            transform: scale(0.3) rotate(-10deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.1) rotate(5deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    @media (max-width: 480px) {
        .result-actions {
            flex-direction: column;
        }
        
        .result-actions .btn {
            width: 100%;
        }
    }
`;

// Inject styles
if (!document.querySelector('#generator-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'generator-styles';
    styleSheet.textContent = generatorStyles;
    document.head.appendChild(styleSheet);
}

// Initialize the pack generator
document.addEventListener('DOMContentLoaded', () => {
    window.packGenerator = new PackNameGenerator();
});