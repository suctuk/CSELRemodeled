// Main JavaScript for CSEL Redesign Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const mobileSunIcon = document.getElementById('mobile-sun-icon');
    const mobileMoonIcon = document.getElementById('mobile-moon-icon');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeToggleIcon('dark');
    } else {
        updateThemeToggleIcon('light');
    }
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    }
    
    // Update theme toggle icon
    function updateThemeToggleIcon(theme) {
        if (theme === 'dark') {
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (mobileSunIcon) mobileSunIcon.classList.remove('hidden');
            if (mobileMoonIcon) mobileMoonIcon.classList.add('hidden');
        } else {
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (mobileSunIcon) mobileSunIcon.classList.add('hidden');
            if (mobileMoonIcon) mobileMoonIcon.classList.remove('hidden');
        }
    }
    
    // Theme toggle event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Scroll animations
    const scrollAnimationElements = document.querySelectorAll('.scroll-animation');
    
    // Initial check for elements in viewport
    checkScrollAnimations();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkScrollAnimations);
    
    function checkScrollAnimations() {
        scrollAnimationElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    }
    
    // Before/After Slider functionality
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const beforeImage = slider.querySelector('.before-image');
        
        if (!handle || !beforeImage) return;
        
        let isDragging = false;
        
        // Initialize position
        beforeImage.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
        handle.style.left = '50%';
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
        
        // Touch events
        handle.addEventListener('touchstart', startDrag);
        window.addEventListener('touchmove', drag);
        window.addEventListener('touchend', stopDrag);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            let position;
            
            if (e.type === 'mousemove') {
                position = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
            } else if (e.type === 'touchmove') {
                position = (e.touches[0].clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
            }
            
            // Constrain position to slider boundaries
            position = Math.max(0, Math.min(100, position));
            
            // Update slider position
            beforeImage.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            handle.style.left = `${position}%`;
        }
        
        function stopDrag() {
            isDragging = false;
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Hide mobile menu when clicking on a link
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            let isValid = true;
            let errorMessage = '';
            
            if (!formValues.name.trim()) {
                isValid = false;
                errorMessage = 'Please enter your name.';
            } else if (!formValues.email.trim() || !isValidEmail(formValues.email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            } else if (!formValues.message.trim()) {
                isValid = false;
                errorMessage = 'Please enter a message.';
            }
            
            // Handle form submission
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                // For this example, we'll just show a success message
                
                // Clear form
                contactForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded my-4';
                successMessage.innerHTML = '<strong>Thank you!</strong> Your message has been sent. We will get back to you soon.';
                
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } else {
                // Show error message
                const errorElement = document.createElement('div');
                errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4';
                errorElement.innerHTML = errorMessage;
                
                contactForm.parentNode.insertBefore(errorElement, contactForm);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorElement.remove();
                }, 5000);
            }
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize counters for statistics
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // ms
                    const step = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += step;
                        counter.textContent = Math.round(current);
                        
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        }
                    }, 16);
                    
                    // Unobserve after counting
                    observer.unobserve(counter);
                }
            });
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // Back to top button functionality
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.remove('opacity-100', 'visible');
                backToTop.classList.add('opacity-0', 'invisible');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});