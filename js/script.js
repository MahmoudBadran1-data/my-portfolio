document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Mobile Menu Toggle
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Intersection Observer for Scroll Animations
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Navbar blur effect on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Project image slider setup for any card with multiple images
    const projectImageContainers = document.querySelectorAll('.project-image');
    projectImageContainers.forEach(container => {
        const directImages = Array.from(container.querySelectorAll(':scope > img'));
        const track = container.querySelector('.slider-track') || document.createElement('div');
        let slides = Array.from(container.querySelectorAll('.slide'));

        if (directImages.length > 1) {
            container.classList.add('slider');
            track.classList.add('slider-track');
            directImages.forEach(img => {
                img.classList.add('slide');
                track.appendChild(img);
            });
            container.prepend(track);
            slides = Array.from(track.querySelectorAll('.slide'));
        } else if (track.classList.contains('slider-track')) {
            container.classList.add('slider');
            slides = Array.from(track.querySelectorAll('.slide'));
        }

        if (slides.length <= 1) {
            return;
        }

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'slider-control prev';
        prevBtn.setAttribute('aria-label', 'Previous image');
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'slider-control next';
        nextBtn.setAttribute('aria-label', 'Next image');
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        let currentIndex = 0;

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(slides.length - 1, currentIndex + 1);
            updateSlider();
        });

        updateSlider();
    });

    // Fullscreen image modal for project images
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <div class="image-modal-backdrop"></div>
        <div class="image-modal-content">
            <button type="button" class="image-modal-close" aria-label="Close image view">&times;</button>
            <img src="" alt="" />
            <div class="image-modal-caption"></div>
        </div>
    `;
    document.body.appendChild(imageModal);

    const modalBackdrop = imageModal.querySelector('.image-modal-backdrop');
    const modalClose = imageModal.querySelector('.image-modal-close');
    const modalImage = imageModal.querySelector('img');
    const modalCaption = imageModal.querySelector('.image-modal-caption');

    const closeImageModal = () => {
        imageModal.classList.remove('visible');
        document.body.style.overflow = '';
    };

    const openImageModal = (img) => {
        modalImage.src = img.src;
        modalImage.alt = img.alt || '';
        modalCaption.textContent = img.alt || '';
        imageModal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    document.querySelectorAll('.project-image img').forEach(img => {
        img.addEventListener('click', () => openImageModal(img));
    });

    modalBackdrop.addEventListener('click', closeImageModal);
    modalClose.addEventListener('click', closeImageModal);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && imageModal.classList.contains('visible')) {
            closeImageModal();
        }
    });

    // Form submission prevention (demo only)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
                btn.classList.replace('btn-primary', 'btn-secondary');
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-secondary', 'btn-primary');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
