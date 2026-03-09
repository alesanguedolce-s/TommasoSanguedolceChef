/* ═══════════════════════════════════════════════════
   SCRIPT PRINCIPALE — Chef Tommaso Sanguedolce
   Inizializza AOS, parallax, navbar scroll, smooth scroll
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ───────── LENIS — Smooth Scroll Selettivo ─────────
    // Rilevamento Browser: Chromium-based (Opera, Chrome, Edge)
    const isChromium = !!window.chrome || navigator.userAgent.indexOf("OPR") !== -1 || navigator.userAgent.indexOf("Opera") !== -1;

    let lenis = null;

    if (!isChromium) {
        // SETTAGGI PER MOZILLA / ALTRI (EFFETTO DIVINO)
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            if (lenis) lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } else {
        // SU CHROMIUM (OPERA/CHROME) USIAMO LO SCROLL NATIVO OTTIMIZZATO
        document.documentElement.style.scrollBehavior = 'smooth';
    }


    // ───────── AOS — Animazioni allo scroll ─────────
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: 'mobile'
    });


    // ───────── NAVBAR — Cambio stile on scroll ─────────
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    const scrollThreshold = 80;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    // Ascolta lo scroll con requestAnimationFrame per performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });


    // ───────── PARALLAX — Movimento leggero sull'hero ─────────
    const heroParallax = document.querySelector('.hero-parallax');

    if (heroParallax) {
        let parallaxTicking = false;

        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const heroHeight = document.querySelector('.hero').offsetHeight;

                    // Attiva parallax solo quando l'hero è visibile
                    if (scrollY < heroHeight) {
                        const translateY = scrollY * 0.35;
                        heroParallax.style.transform = `translateY(${translateY}px)`;
                    }

                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }


    // ───────── SMOOTH SCROLL — Per ancoraggi interni ─────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');

            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ───────── GALLERY SLIDER MOBILE — Touch-optimized ─────────
    const sliderTrack = document.querySelector('.slider-track');

    if (sliderTrack) {
        // Indicatore visivo di scroll: nascondi dopo il primo swipe
        let hasScrolled = false;

        sliderTrack.addEventListener('scroll', () => {
            if (!hasScrolled) {
                hasScrolled = true;
                sliderTrack.classList.add('scrolled');
            }
        }, { passive: true });
    }


    // ───────── LAZY LOAD OTTIMIZZATO ─────────
    // Aggiunge un effetto fade-in quando le immagini si caricano
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });


    // ───────── BIO DRAWER (PANNELLO LATERALE) ─────────
    const bioDrawer = document.getElementById('bio-drawer');
    const bioOpenBtn = document.querySelector('.visione-cta');
    const bioCloseElements = document.querySelectorAll('[data-close-drawer]');

    const bioBody = document.querySelector('.bio-body');

    function toggleBioDrawer(open) {
        if (!bioDrawer) return;

        if (open) {
            bioDrawer.classList.add('active');
            bioDrawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Blocco scroll nativo body
        } else {
            bioDrawer.classList.remove('active');
            bioDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Sblocco scroll nativo body

            // Reset Scroll
            if (bioBody) {
                setTimeout(() => {
                    bioBody.scrollTop = 0;
                }, 500); // Aspetta la fine dell'animazione
            }
        }
    }

    if (bioOpenBtn) {
        bioOpenBtn.addEventListener('click', () => toggleBioDrawer(true));
    }

    bioCloseElements.forEach(el => {
        el.addEventListener('click', () => toggleBioDrawer(false));
    });

    // ───────── SERVICE DRAWER — Pannello Servizi ─────────
    const serviceDrawer = document.getElementById('service-drawer');
    const serviceCards = document.querySelectorAll('.servizio-card');
    const serviceCloseElements = document.querySelectorAll('[data-close-service-drawer]');

    // Contenuti dei servizi
    const serviceData = {
        'formazione': {
            title: 'Consulenza gastronomica',
            subtitle: 'Identità e Visione',
            description: "Affianco ristoranti, hotel e nuovi progetti di ristorazione nello sviluppo dell’identità culinaria, dalla creazione dei menu al food cost, fino all’organizzazione della cucina e alla formazione della brigata."
        },
        'esperienze': {
            title: 'Esperienze gastronomiche private',
            subtitle: 'Racconto e Convivialità',
            description: "Cene d’autore ed esperienze gastronomiche su misura per eventi privati, ville e occasioni speciali, dove la cucina diventa racconto, territorio e convivialità."
        },
        'cucina': {
            title: 'Formazione e Masterclass',
            subtitle: 'Cultura e Tecnica',
            description: "Workshop e percorsi formativi dedicati alla cucina mediterranea, alla pasta artigianale e alla cultura gastronomica italiana. Le attività possono svolgersi online o in presenza e includere format per aziende, team building e collaborazioni con brand del settore food."
        }
    };

    function toggleServiceDrawer(open, serviceId = null) {
        if (!serviceDrawer) return;

        if (open && serviceId && serviceData[serviceId]) {
            // Popola il drawer
            const data = serviceData[serviceId];
            document.getElementById('service-title').innerHTML = data.title;
            document.getElementById('service-subtitle').innerText = data.subtitle;
            document.getElementById('service-description').innerText = data.description;

            serviceDrawer.classList.add('active');
            serviceDrawer.setAttribute('aria-hidden', 'false');
            if (typeof lenis !== 'undefined') lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            serviceDrawer.classList.remove('active');
            serviceDrawer.setAttribute('aria-hidden', 'true');
            if (typeof lenis !== 'undefined') lenis.start();
            document.body.style.overflow = '';
        }
    }

    if (serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-service-id');
                toggleServiceDrawer(true, id);
            });
        });
    }

    serviceCloseElements.forEach(el => {
        el.addEventListener('click', () => toggleServiceDrawer(false));
    });

    // ───────── LIGHTBOX GALLERY ─────────
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryPanels = document.querySelectorAll('.mosaic-item');

    // Apri Lightbox
    if (galleryPanels.length > 0) {
        galleryPanels.forEach(panel => {
            panel.addEventListener('click', () => {
                const imgSrc = panel.getAttribute('data-src');
                if (imgSrc && lightbox && lightboxImg) {
                    lightboxImg.src = imgSrc;
                    lightbox.classList.add('active');
                    lightbox.setAttribute('aria-hidden', 'false');
                    if (typeof lenis !== 'undefined') lenis.stop(); // Ferma lo scroll della pagina
                }
            });
        });
    }

    // Chiudi Lightbox
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        if (typeof lenis !== 'undefined') lenis.start(); // Riattiva lo scroll
        if (lightboxImg) {
            setTimeout(() => {
                lightboxImg.src = ''; // Pulisci src dopo l'animazione
            }, 400);
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Chiudi cliccando fuori dall'immagine
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // ───────── BACK TO TOP BUTTON ─────────
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

});
