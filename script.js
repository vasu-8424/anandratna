document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.replace('bx-menu', 'bx-x');
            } else {
                icon.classList.replace('bx-x', 'bx-menu');
            }
        });
    }

    /* --- Accordion Logic --- */
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('i');
                    icon.classList.replace('bx-chevron-up', 'bx-chevron-down');
                    icon.classList.replace('icon-bg-white', 'icon-bg-color');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            const icon = item.querySelector('i');
            
            if (item.classList.contains('active')) {
                icon.classList.replace('bx-chevron-down', 'bx-chevron-up');
                icon.classList.replace('icon-bg-color', 'icon-bg-white');
            } else {
                icon.classList.replace('bx-chevron-up', 'bx-chevron-down');
                icon.classList.replace('icon-bg-white', 'icon-bg-color');
            }
        });
    });

    /* --- Services Tabs Logic --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding panel
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

});
// Cinematic Scroll and Parallax Effect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.cinematic-hero');
    const sliderTrack = document.getElementById('hero-slider-track');
    const slides = document.querySelectorAll('.cinematic-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.cinematic-controls .prev');
    const nextBtn = document.querySelector('.cinematic-controls .next');

    // Cinematic Slider Logic (Wiper Effect & Performance Fix)
    if (sliderTrack && slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const updateSlider = (index) => {
            // Remove previous prev-slide class
            slides.forEach(s => s.classList.remove('prev-slide'));
            
            // Turn current active into prev-slide so it stays visible during the cross-slide
            const oldActive = document.querySelector('.cinematic-slide.active');
            if (oldActive) {
                oldActive.classList.remove('active');
                oldActive.classList.add('prev-slide');
                
                // Reset title transform so animation replays fresh next time
                const oldTitle = oldActive.querySelector('.slide-title');
                if (oldTitle) {
                    setTimeout(() => {
                        // Only reset if no longer active
                        if (!oldActive.classList.contains('active')) {
                            oldTitle.style.transition = 'none';
                            // Remove inline styles entirely so base CSS takes over
                            oldTitle.style.transform = '';
                            oldTitle.style.opacity = '';
                            oldTitle.style.width = ''; // Also clear width if used by typing anim
                            // Re-enable transitions after reset
                            requestAnimationFrame(() => requestAnimationFrame(() => {
                                oldTitle.style.transition = '';
                            }));
                        }
                    }, 1400);
                }
                
                // Pause inactive videos after transition to fix shaking/stuttering performance
                const oldVideo = oldActive.querySelector('video');
                if (oldVideo) {
                    setTimeout(() => { 
                        if (!oldActive.classList.contains('active')) oldVideo.pause(); 
                    }, 1200); // 1.2s matches CSS transition length
                }
            }

            // Activate new slide
            slides[index].classList.add('active');
            
            // Play the new video immediately to ensure smooth playback
            const newVideo = slides[index].querySelector('video');
            if (newVideo) {
                let playPromise = newVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(_ => {}); // ignore autoplay errors securely
                }
            }
            
            // Update dots
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider(currentSlide);
        };

        const startAutoPlay = () => {
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
        };

        const resetAutoPlay = () => {
            clearInterval(slideInterval);
            startAutoPlay();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentSlide = idx;
                updateSlider(currentSlide);
                resetAutoPlay();
            });
        });

        // Initialize first slide's video properly
        const firstVideo = slides[0]?.querySelector('video');
        if (firstVideo) {
            firstVideo.play().catch(_ => {});
        }
        
        // Pause other videos initially
        slides.forEach((slide, index) => {
            if (index !== 0) {
                const vid = slide.querySelector('video');
                if (vid) vid.pause();
            }
        });

        startAutoPlay();
    }

    window.addEventListener('scroll', () => {
        // Toggle Nav Background & Height
        if (window.scrollY > 50) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }

        // Parallax Effect for video wrappers (separated from scaling to prevent jitter)
        const wrappers = document.querySelectorAll('.video-parallax-wrapper');
        if (wrappers.length > 0 && hero) {
            const scrollPercent = window.scrollY / window.innerHeight;
            if (scrollPercent <= 1) {
                wrappers.forEach(wrapper => {
                    // Translate the wrapper for parallax, leaving the video element strictly for CSS scale zoom
                    wrapper.style.transform = `translateY(${scrollPercent * 60}px)`;
                });
            }
        }
    });

});

// Auto-scroll Reviews (Enhanced)
document.addEventListener('DOMContentLoaded', () => {
    const scroller = document.querySelector('.reviews-scroller');
    if (!scroller) return;

    let isHovered = false;
    scroller.addEventListener('mouseenter', () => isHovered = true);
    scroller.addEventListener('mouseleave', () => isHovered = false);

    // Clone cards for infinite loop
    const cards = Array.from(scroller.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        scroller.appendChild(clone);
    });

    let scrollAmount = 0;
    function step() {
        if (!isHovered) {
            scrollAmount += 1; // Pixels per frame for smooth movement
            if (scrollAmount >= scroller.scrollWidth / 2) {
                scrollAmount = 0;
            }
            scroller.scrollLeft = scrollAmount;
        }
        requestAnimationFrame(step);
    }

    // Initialize smooth continuous scroll
    // Only if not using scroll-snap (which conflicts with continuous scroll)
    scroller.style.scrollSnapType = 'none'; 
    requestAnimationFrame(step);
});

// Animated Counter
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const decimals = +counter.getAttribute('data-decimals') || 0;
            let current = 0; // Use internal variable to prevent rounding errors
            const inc = target / speed;

            const updateCount = () => {
                if (current < target) {
                    current += inc;
                    // Ensure we don't overshoot
                    const displayValue = current > target ? target : current;
                    counter.innerText = displayValue.toFixed(decimals) + suffix;
                    
                    if (current < target) {
                        setTimeout(updateCount, 15);
                    }
                } else {
                    counter.innerText = target.toFixed(decimals) + suffix;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to trigger only once when visible
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection); 
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
});


// --- Section Scroll-Reveal (repeating on every scroll into view) ---
document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.section-reveal');
    if (!revealEls.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Entering viewport — animate in
                entry.target.classList.add('in-view');
            } else {
                // Leaving viewport — reset so it animates again on next scroll
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
});

// --- Search Modal Overlay ---
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-box input');

    if(searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            searchInput.value = '';
        };

        closeSearchBtn.addEventListener('click', closeSearch);

        // Close on ESC or clicking outside
        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        searchOverlay.addEventListener('click', (e) => {
            if(e.target === searchOverlay) {
                closeSearch();
            }
        });
    }
});
