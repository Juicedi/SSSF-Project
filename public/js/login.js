const loginSelect = document.getElementById('select-login');
const registerSelect = document.getElementById('select-register');
const backButtons = Array.from(document.querySelectorAll('.login-btn-back'));
const reveal = (block) => {
  switch (block) {
    case 'login':
      document.getElementById('welcome-block').classList.add('fadeOut');
      setTimeout(() => {
        document.getElementById('login-block').classList.remove('hide', 'fadeOut');
      }, 680);
      break;
    case 'register':
      document.getElementById('welcome-block').classList.add('fadeOut');
      setTimeout(() => {
        document.getElementById('register-block').classList.remove('hide', 'fadeOut');
      }, 680);
      break;
    case 'menu':
      document.getElementById('login-block').classList.add('fadeOut');
      document.getElementById('register-block').classList.add('fadeOut');
      setTimeout(() => {
        document.getElementById('welcome-block').classList.remove('fadeOut');
      }, 680);
      break;

  }
}
loginSelect.addEventListener('click', () => {
  reveal('login');
});
registerSelect.addEventListener('click', () => {
  reveal('register');
});
for (const button of backButtons) {
  button.addEventListener('click', () => {
    reveal('menu');
  });
}
