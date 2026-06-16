document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Light/Dark Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        updateThemeIcons(targetTheme);
    });

    function updateThemeIcons(theme) {
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // 3. Mobile Hamburger Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuOpenIcon = document.getElementById('menu-icon-hamburger');
    const menuCloseIcon = document.getElementById('menu-icon-close');

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            menuOpenIcon.style.display = 'none';
            menuCloseIcon.style.display = 'block';
        } else {
            menuOpenIcon.style.display = 'block';
            menuCloseIcon.style.display = 'none';
        }
    });

    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                menuOpenIcon.style.display = 'block';
                menuCloseIcon.style.display = 'none';
            }
        });
    });

    // 4. Scroll Tracking (Progress indicator & Back-to-Top button)
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        // Scroll progress width
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollableHeight > 0) {
            const percentage = (window.scrollY / totalScrollableHeight) * 100;
            scrollProgressBar.style.width = `${percentage}%`;
        }

        // Back-to-top visibility
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Scroll Reveal & Active Navigation Highlights using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-element');
    const sections = document.querySelectorAll('section');

    // Reveal elements on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Highlight Active Section Link
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(sec => navObserver.observe(sec));

    // 6. Statistics Counter Animation
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    }, { threshold: 0.25 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const decimals = +counter.getAttribute('data-decimals') || 0;
            const prefix = counter.getAttribute('data-prefix') || '';
            const duration = 1500; // ms
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing curve (easeOutQuad)
                const easedProgress = progress * (2 - progress);
                const currentValue = easedProgress * target;

                if (decimals > 0) {
                    const formattedVal = currentValue.toFixed(0);
                    // Add decimal point representation
                    counter.textContent = `${prefix}${formattedVal}`;
                } else {
                    counter.textContent = Math.floor(currentValue);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Lock final value
                    if (decimals > 0) {
                        counter.textContent = `${prefix}${target}`;
                    } else {
                        counter.textContent = target + (counter.parentElement.id === 'stat-completed-projects' || counter.parentElement.id === 'stat-leadership-roles' || counter.parentElement.id === 'stat-case-studies' ? '+' : '');
                    }
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // 7. Skill Progress Bar Animate
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !skillsAnimated) {
            progressBars.forEach(bar => {
                const widthValue = bar.getAttribute('data-width');
                bar.style.width = widthValue;
            });
            skillsAnimated = true;
        }
    }, { threshold: 0.2 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 8. Projects Grid Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Apply a simple transition fade
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Re-trigger visual layout frame
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // 9. Testimonials Slider
    const testimonialTrack = document.getElementById('testimonials-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('t-prev-btn');
    const nextBtn = document.getElementById('t-next-btn');
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;
    let autoplayTimer = null;

    function showSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentSlide - 1);
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentSlide + 1);
        startAutoplay();
    });

    // Autoplay controls
    const sliderContainer = document.getElementById('testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
        startAutoplay();
    }

    // 10. Contact Form Logic & Custom Validation
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatusBox = document.getElementById('form-status-box');
    const submitBtn = document.getElementById('btn-submit-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve input fields
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');

        let isValid = true;
        formStatusBox.className = 'form-status'; // Reset status styles
        formStatusBox.style.display = 'none';

        // Basic inputs validate checks
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            isValid = false;
            showFormStatus('Please fill in all mandatory text fields.', 'error');
            return;
        }

        // Email address regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            showFormStatus('Please introduce a valid email format structure.', 'error');
            return;
        }

        if (isValid) {
            // Set sending spinner representation
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="spin-icon" style="animation: spin 1s linear infinite; display: inline-block;">🔄</i> Sending Message...';

            // Mock contact submit network delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                showFormStatus('Thank you! Your message was delivered successfully. Alex will contact you shortly.', 'success');
                contactForm.reset();
            }, 1500);
        }
    });

    function showFormStatus(msg, type) {
        formStatusBox.textContent = msg;
        formStatusBox.classList.add(type);
        formStatusBox.style.display = 'block';
    }

    // Embed spin keyframes in CSS on load
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
});
