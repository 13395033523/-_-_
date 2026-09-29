const imageDialog = document.querySelector('#image-dialog');
const fullImage = document.querySelector('#full-image');
const imageCaption = document.querySelector('#image-caption');
const imageViewport = document.querySelector('.dialog-image');
const sizeButton = document.querySelector('#size-dialog');
let imageOrigin;
function resetImageSize() {
  imageViewport.classList.remove('is-expanded');
  sizeButton.setAttribute('aria-pressed', 'false');
  sizeButton.textContent = '放大细看';
  imageViewport.scrollTop = 0;
}
document.querySelectorAll('.zoom').forEach(button => {
  button.addEventListener('click', () => {
    imageOrigin = button;
    resetImageSize();
    fullImage.src = button.dataset.src;
    fullImage.alt = button.dataset.caption || '';
    imageCaption.textContent = button.dataset.caption || '';
    imageDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
sizeButton.addEventListener('click', () => {
  const expanded = imageViewport.classList.toggle('is-expanded');
  sizeButton.setAttribute('aria-pressed', String(expanded));
  sizeButton.textContent = expanded ? '适应窗口' : '放大细看';
});
document.querySelector('#close-dialog').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const r = imageDialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  imageOrigin?.focus({preventScroll:true});
});
const progress = document.querySelector('.progress');
let progressScheduled = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  progressScheduled = false;
}
addEventListener('scroll', () => {
  if (!progressScheduled) {requestAnimationFrame(updateProgress);progressScheduled = true;}
}, {passive:true});
addEventListener('resize', updateProgress);
addEventListener('load', updateProgress);
updateProgress();
const navLinks = [...document.querySelectorAll('.studio-nav nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), {rootMargin:'-12% 0px -66% 0px', threshold:0});
  navLinks.forEach(link => {
    const target = document.querySelector(link.hash);
    if (target) observer.observe(target);
  });
}
