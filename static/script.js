// 1. Modal & Sample Pre-fill Logic
const modal = document.getElementById('contactModal');
const btnHero = document.getElementById('openModalHero');
const btnNav = document.getElementById('openModalNav');
const btnFooter = document.getElementById('openModalFooter');
const requestSampleBtn = document.getElementById('requestSampleBtn');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('leadForm');
const interestInput = document.getElementById('leadInterest');

let currentSelectedMaterial = 'Fenix NTM® Nero Ingo';

const openModal = (e, prefill = '') => {
    if (e) e.preventDefault();
    if (prefill && interestInput) {
        interestInput.value = `Sample Request: ${prefill}`;
    }
    modal.style.display = 'flex';
};

if (btnHero) btnHero.onclick = (e) => openModal(e);
if (btnNav) btnNav.onclick = (e) => openModal(e);
if (btnFooter) btnFooter.onclick = (e) => openModal(e);
if (requestSampleBtn) {
    requestSampleBtn.onclick = (e) => openModal(e, currentSelectedMaterial);
}

if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

// 2. Interactive Material & Lighting Studio
const swatches = document.querySelectorAll('.swatch-item');
const labTitle = document.getElementById('labTitle');
const labOrigin = document.getElementById('labOrigin');
const labDesc = document.getElementById('labDesc');
const labImage = document.getElementById('labImage');
const labStage = document.getElementById('labStage');
const modeBtns = document.querySelectorAll('.mode-btn');

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        currentSelectedMaterial = swatch.dataset.title;
        labTitle.textContent = swatch.dataset.title;
        labOrigin.textContent = swatch.dataset.origin;
        labDesc.textContent = swatch.dataset.desc;

        labImage.style.opacity = '0.3';
        setTimeout(() => {
            labImage.src = swatch.dataset.img;
            labImage.style.opacity = '1';
        }, 180);
    });
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.mode === 'night') {
            labStage.classList.add('night-mode');
        } else {
            labStage.classList.remove('night-mode');
        }
    });
});

// 3. Scroll Progress & Reveal Animations
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) progressBar.style.width = scrolled + '%';
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 4. Form Submission to Flask
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            name: document.getElementById('leadName').value,
            email: document.getElementById('leadEmail').value,
            phone: document.getElementById('leadPhone').value,
            interest: interestInput ? interestInput.value : 'General'
        };

        try {
            const response = await fetch('/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Thank you. Your inquiry has been received by Interium Atelier.');
                modal.style.display = 'none';
                form.reset();
            }
        } catch (error) {
            alert('Connection error. Please try again.');
        }
    };
}
