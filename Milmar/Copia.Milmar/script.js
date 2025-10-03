
        let translations = {};
        let currentLanguage = 'es';
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');

        // ---------------------------
        // Traducciones
        // ---------------------------

        // Cargar JSON del idioma
        async function loadLanguage(lang) {
            try {
                const response = await fetch(`./json/${lang}.json`);
                translations = await response.json();
                currentLanguage = lang;
                updateTexts();
            } catch (error) {
                console.error("Error cargando idioma:", error);
            }
        }

        // Actualizar textos en la página
        function updateTexts() {
            document.querySelectorAll("[data-translate]").forEach(element => {
                const key = element.getAttribute("data-translate");
                if (translations[key]) {
                    if (element.tagName === "INPUT" && element.placeholder !== undefined) {
                        element.placeholder = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });
            document.documentElement.lang = currentLanguage;
        }

        // Cambiar idioma
        function changeLanguage(lang) {
            // Actualizar botón activo
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[onclick="changeLanguage('${lang}')"]`)?.classList.add('active');

            // Cargar JSON y actualizar textos
            loadLanguage(lang);
        }

        // ---------------------------
        // Navegación entre páginas (ya no necesaria con enlaces directos)
        // ---------------------------
        // Función eliminada: showPage() - ahora se usa navegación directa con enlaces HTML

        // ---------------------------
        // Secciones del menú
        // ---------------------------
        function showMenuSection(sectionId) {
            document.querySelectorAll('.menu-content').forEach(content => content.classList.remove('active'));
            document.querySelectorAll('.menu-tab').forEach(tab => tab.classList.remove('active'));
            
            document.getElementById(sectionId).classList.add('active');
            document.querySelector(`[onclick="showMenuSection('${sectionId}')"]`)?.classList.add('active');
        }

        // ---------------------------
        // Header transparente
        // ---------------------------
        function updateHeader() {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.remove('transparent');
                header.classList.add('solid');
            } else {
                header.classList.remove('solid');
                header.classList.add('transparent');
            }
        }

        // ---------------------------
        // Hero carousel
        // ---------------------------
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // ---------------------------
        // Formularios
        // ---------------------------
        function handleFormSubmit(event) {
            event.preventDefault();
            alert('¡Gracias! Tu ' + (event.target.closest('.reservation-form') ? 'reserva' : 
                event.target.closest('.comments-section') ? 'comentario' : 'suscripción') + 
                ' ha sido enviada. Te contactaremos pronto.');
            event.target.reset();
        }

        // ---------------------------
        // Inicialización
        // ---------------------------
        document.addEventListener('DOMContentLoaded', function() {
            // Scroll header
            window.addEventListener('scroll', updateHeader);

            // Carousel automático
            setInterval(nextSlide, 5000);

            // Formularios
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', handleFormSubmit);
            });

            // Animación fade-in
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);
            document.querySelectorAll('.section, .menu-item, .blog-post, .gallery-item').forEach(el => {
                observer.observe(el);
            });

            // Menú móvil
            const mobileMenu = document.querySelector('.mobile-menu');
            const nav = document.querySelector('.nav');
            mobileMenu.addEventListener('click', function() {
                nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'var(--secondary)';
                nav.style.padding = '1rem';
                nav.style.boxShadow = '0 4px 6px var(--shadow)';
            });
            document.querySelectorAll('.nav a').forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        nav.style.display = 'none';
                    }
                });
            });

            // Inicializar idioma por defecto
            changeLanguage('es');
        });

        // ---------------------------
        // Smooth scroll
        // ---------------------------
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            })
        });

        // ---------------------------
        // Hover effects
        // ---------------------------
        document.addEventListener('mouseover', function(e) {
            if (e.target.matches('.btn, .menu-tab, .gallery-item, .social-links a')) {
                e.target.style.transform = 'translateY(-2px)';
            }
        });
        document.addEventListener('mouseout', function(e) {
            if (e.target.matches('.btn, .menu-tab, .gallery-item, .social-links a')) {
                e.target.style.transform = 'translateY(0)';
            }
        });
