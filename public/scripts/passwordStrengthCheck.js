function passwordCheck(password) {
  let str = password.trim();
  let check = str.match(
    /^(?=.*[A-Z]{1,})(?=.*[!@#$&*]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,}$/
  );

  if (check) {
    return true;
  } else {
    return false;
  }
}

(function () {
  const passwordFieldElement = document.querySelector(
    '#input-password.register'
  );
  const passwordFailedAlert = document.querySelector('ul.password-check');
  const registerButton = document.querySelector('form.register-form button');

  passwordFieldElement.addEventListener('change', (e) => {
    const password = e.target;
    if (passwordCheck(password.value)) {
      registrationChecks.password = true;
      passwordFailedAlert.className = 'no-show';
      if (registrationChecks.email && registrationChecks.password) {
        registerButton.disabled = false;
      }
    } else {
      registrationChecks.password = false;
      passwordFailedAlert.className = 'show';
      if (!registrationChecks.email || !registrationChecks.password) {
        registerButton.disabled = true;
      }
      passwordCheck.className = 'show';
      registerButton.disabled = true;
    }
  });
})();
