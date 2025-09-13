// script.js
// Open link in new tab immediately when the card's button is clicked
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function (e) {
    const btn = e.target.closest('.card-button');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      window.open(this.href, '_blank', 'noopener,noreferrer');
    }
  });
});

// Hover lift for social links
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-2px)';
  });
  link.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
  });
});

// Logo pop-in animation
document.addEventListener('DOMContentLoaded', function () {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.transform = 'scale(0)';
    logo.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { logo.style.transform = 'scale(1)'; }, 200);
  }
});

// Fade-in cards
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 600 + index * 150);
  });
});
