document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.nav').classList.remove('open');
}));
