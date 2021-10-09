const showPasswordCheck = document.getElementById('show-password');
const passwordFieldElement = document.querySelector('#input-password.register');

showPasswordCheck.addEventListener('click', (e) => {
  if (e.target.checked) {
    passwordFieldElement.type = 'text';
  } else {
    passwordFieldElement.type = 'password';
  }
});
