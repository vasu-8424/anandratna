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

// Hero Slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    let currentSlide = 0;

    if(slides.length > 0 && nextBtn && prevBtn) {
        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
        }

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }
});

// Auto-scroll Reviews
document.addEventListener('DOMContentLoaded', () => {
    const reviewsScroller = document.querySelector('.reviews-scroller');
    if (reviewsScroller) {
        let isHovered = false;
        let scrollPos = 0;
        
        reviewsScroller.addEventListener('mouseenter', () => isHovered = true);
        reviewsScroller.addEventListener('mouseleave', () => isHovered = false);

        setInterval(() => {
            if (!isHovered) {
                const card = reviewsScroller.querySelector('.review-card');
                if (!card) return;
                const cardWidth = card.offsetWidth + 32;
                
                scrollPos += cardWidth;
                let maxScroll = reviewsScroller.scrollWidth - reviewsScroller.clientWidth;

                if (scrollPos > maxScroll + 10) {
                    scrollPos = 0;
                    reviewsScroller.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    reviewsScroller.scrollTo({ left: scrollPos, behavior: 'smooth' });
                }
            }
        }, 3500); 
    }
});
