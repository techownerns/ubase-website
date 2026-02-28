// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

// Hero video handling
const heroVideo = document.getElementById('heroVideo');
const heroFallback = document.getElementById('heroFallback');
const videoSrc = heroVideo.querySelector('source').src;

if (videoSrc && videoSrc !== window.location.href) {
  heroVideo.style.display = 'block';
  heroFallback.style.display = 'none';
  heroVideo.load();
}

// Chatbot button (placeholder)
document.getElementById('chatbotBtn').addEventListener('click', () => {
  alert('AI 챗봇은 추후 연동됩니다.');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
