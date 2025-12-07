const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    sidebar.classList.toggle('active');
});

menuToggle.addEventListener('mousedown', (e) => {
    e.preventDefault();
});

menuToggle.addEventListener('touchstart', (e) => {
    e.preventDefault();
});