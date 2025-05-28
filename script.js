// Initialize theme with light class (which shows dark theme by default)
document.documentElement.classList.add('light');
localStorage.theme = 'light';

// Check system preference for dark mode (which will show light theme)
// This overrides the default if user's system is set to dark mode
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.remove('light');
    localStorage.theme = 'dark';
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

/**
 * Toggles between light and dark themes
 * Note: 'light' class presence shows dark theme and vice versa
 */
function toggleDarkMode() {
    if (document.documentElement.classList.contains('light')) {
        // Remove light class to show light theme
        document.documentElement.classList.remove('light');
        localStorage.theme = 'dark';
    } else {
        // Add light class to show dark theme
        document.documentElement.classList.add('light');
        localStorage.theme = 'light';
    }
}

// Listen for system theme changes
// Updates theme when user changes their system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        // System switched to dark mode, show light theme
        document.documentElement.classList.remove('light');
        localStorage.theme = 'dark';
    } else {
        // System switched to light mode, show dark theme
        document.documentElement.classList.add('light');
        localStorage.theme = 'light';
    }
});

// Add click event listeners to theme toggle buttons
if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
}

if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleDarkMode);
}

// Typing animation function
function createTypingAnimation(element, texts, typingSpeed = 100, deletingSpeed = 50, prefix = '') {
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let currentCharIndex = 0;

    // Generate random delay for more natural typing effect
    function getRandomDelay() {
        return Math.random() * 100 + 50; // Random delay between 50-150ms
    }

    function typeText() {
        const targetText = texts[currentIndex];
        
        if (isDeleting) {
            // Delete text from right to left
            currentText = targetText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            element.textContent = prefix + currentText;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % texts.length;
                setTimeout(typeText, 500); // Pause before typing next word
            } else {
                setTimeout(typeText, deletingSpeed);
            }
        } else {
            // Type text from left to right
            currentText = targetText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            element.textContent = prefix + currentText;
            
            if (currentCharIndex === targetText.length) {
                isDeleting = true;
                setTimeout(typeText, 2000); // Pause before deleting
            } else {
                setTimeout(typeText, typingSpeed + getRandomDelay());
            }
        }
    }

    // Start the animation
    typeText();
}

// Initialize typing animation for brand name
const brandText = document.querySelector('.text-2xl');
if (brandText) {
    const texts = ['Faith Developer', 'Ivan', 'F8Developer'];
    createTypingAnimation(brandText, texts);
}

// Initialize typing animation for hero section greeting
const heroGreeting = document.querySelector('.text-4xl');
if (heroGreeting) {
    const greetingTexts = ['F8Developer', 'Faith Developer', 'Ivan'];
    createTypingAnimation(heroGreeting, greetingTexts, 80, 40, 'Hi, I\'m '); // Keep 'Hi, I'm' static
}

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuContent = document.querySelector('.mobile-menu-content');

/**
 * Closes the mobile menu and restores page scrolling
 */
function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Initialize mobile menu functionality
if (mobileMenuButton && mobileMenuOverlay && mobileMenuClose) {
    // Toggle menu on hamburger button click
    mobileMenuButton.addEventListener('click', () => {
        if (mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        } else {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }
    });

    // Close menu when close button is clicked
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    // Close menu when clicking outside the content
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking a navigation link
    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Flare animation for glass panels
document.querySelectorAll('.glass-panel:not(nav)').forEach(panel => {
    let animationStartTime = null;
    let animationDuration = 400; // Animation duration in milliseconds
    let isAnimating = false;
    let currentPosition = -100; // Start position in percentage
    let isHovering = false;

    // Start animation on hover
    panel.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!isAnimating) {
            isAnimating = true;
            animationStartTime = Date.now();
            requestAnimationFrame(animate);
        }
    });

    // Handle animation on mouse leave
    panel.addEventListener('mouseleave', () => {
        isHovering = false;
        if (isAnimating) {
            isAnimating = false;
            const elapsed = Date.now() - animationStartTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            currentPosition = -100 + (progress * 300); // Calculate current position (-100 to 200)
            
            // Start reverse animation from current position
            animationStartTime = Date.now();
            const startPosition = currentPosition;
            const distanceToTravel = startPosition - (-100);
            const reverseDuration = (distanceToTravel / 300) * animationDuration; // Scale duration based on distance

            requestAnimationFrame(() => reverseAnimate(startPosition, reverseDuration));
        }
    });

    // Forward animation function
    function animate() {
        if (!isAnimating) return;

        const elapsed = Date.now() - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        currentPosition = -100 + (progress * 300);

        panel.style.setProperty('--shine-position', `${currentPosition}%`);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            // If animation completes and we're not hovering, start reverse animation
            if (!isHovering) {
                const startPosition = currentPosition;
                const distanceToTravel = startPosition - (-100);
                const reverseDuration = (distanceToTravel / 300) * animationDuration;
                requestAnimationFrame(() => reverseAnimate(startPosition, reverseDuration));
            }
        }
    }

    // Reverse animation function
    function reverseAnimate(startPosition, duration) {
        const startTime = Date.now();
        
        function reverse() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            currentPosition = startPosition - (progress * (startPosition - (-100)));

            panel.style.setProperty('--shine-position', `${currentPosition}%`);

            if (progress < 1) {
                requestAnimationFrame(reverse);
            }
        }

        reverse();
    }
}); 