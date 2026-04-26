document.addEventListener('DOMContentLoaded', () => {

    // reset scroll if page has hash
    if (window.location.hash) {
        window.scrollTo(0, 0);
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // date restriction (today to +20 days)
    const dateInput = document.getElementById('guest-date');

    if (dateInput) {
        const today = new Date();

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        dateInput.min = formatDate(today);

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 20);
        dateInput.max = formatDate(maxDate);
    }

    // mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // navbar scroll effect
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show', 'appear');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    document.querySelectorAll('.scroll-animate, .fade-in')
        .forEach(el => observer.observe(el));

    // parallax effect
    const heroBg = document.getElementById('hero-bg');

    window.addEventListener('scroll', () => {
        if (heroBg) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
    });

    // reservation form
    const resForm = document.getElementById('reservation-form');

    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = resForm.querySelector('button[type="submit"]');

            const name = document.getElementById('guest-name').value;
            const date = document.getElementById('guest-date').value;
            const time = document.getElementById('guest-time').value;
            const guests = document.getElementById('guest-count').value;

            btn.innerHTML = 'Processing...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            const queryParams = new URLSearchParams({
                name,
                date,
                time,
                guests
            }).toString();

            setTimeout(() => {
                window.location.href = `/success.html?${queryParams}`;
            }, 1000);
        });
    }

    // newsletter form
    const newsletterForm = document.querySelector('.newsletter-form, .subscribe-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerHTML = 'Subscribing...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = 'Subscribed!';
                btn.style.backgroundColor = '#2ecc71';
                newsletterForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1000);
        });
    }

    // rating calculation
    function updateAverageRating() {
        const reviewCards = document.querySelectorAll('.review-card');

        let total = 0;
        let count = 0;

        reviewCards.forEach(card => {
            const stars = card.querySelector('.stars');
            if (stars) {
                const filled = (stars.textContent.match(/★/g) || []).length;
                total += filled;
                count++;
            }
        });

        if (!count) return;

        const average = (total / count).toFixed(1);

        const avgStars = document.querySelector('.average-stars');
        const avgScore = document.querySelector('.average-score');

        if (avgStars && avgScore) {
            let starsDisplay = '';
            const full = Math.floor(average);
            const half = average % 1 >= 0.5;

            for (let i = 0; i < 5; i++) {
                if (i < full) starsDisplay += '★';
                else if (i === full && half) starsDisplay += '★';
                else starsDisplay += '☆';
            }

            avgStars.textContent = starsDisplay;
            avgScore.textContent = average;
        }
    }

    updateAverageRating();

    // review form
    const reviewForm = document.getElementById('review-form');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value;
            const email = document.getElementById('review-email').value;
            const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
            const text = document.getElementById('review-text').value;
            const photo = document.getElementById('review-photo').files[0];

            if (!name || !email || !text || rating == 0) {
                alert('Fill all fields + rating');
                return;
            }

            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < rating ? '★' : '☆';
            }

            const card = document.createElement('div');
            card.className = 'review-card scroll-animate show';

            card.innerHTML = `
                <p>"${text}"</p>
                <cite>- ${name}</cite>
                <div class="stars">${stars}</div>
            `;

            if (photo) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '6px';
                    img.style.marginTop = '10px';
                    card.appendChild(img);
                };
                reader.readAsDataURL(photo);
            }

            document.querySelector('.reviews-grid')?.appendChild(card);

            updateAverageRating();
            reviewForm.reset();

            alert('Review submitted!');
        });
    }

});