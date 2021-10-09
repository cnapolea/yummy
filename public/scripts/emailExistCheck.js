// jshint esversion:10

const registrationChecks = {};
const emailStatusElement = document.querySelector('p.email-status');
const registerButton = document.querySelector('form.register-form button');

function emailExistStatusCheck(status) {
  if (status) {
    registrationChecks.email = false;
    emailStatusElement.innerHTML = 'Email already exists';
    emailStatusElement.style.color = 'red';
    emailStatusElement.className = 'show';

    if (!registrationChecks.email || !registrationChecks.password) {
      registerButton.disabled = true;
    }
  } else {
    registrationChecks.email = true;
    emailStatusElement.innerHTML = 'Email available';

    if (registrationChecks.email && registrationChecks.password) {
      registerButton.disabled = false;
    }

    emailStatusElement.style.color = 'lightgreen';
  }
}

(function () {
  const inputEmailElement = document.querySelector('#input-email.register');

  inputEmailElement.addEventListener('change', (e) => {
    const emailField = e.target;
    let email = emailField.value;
    let url = `/authentication/email-check?email=${email}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((data) => {
        if (data.status === 200) {
          return data.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        emailExistStatusCheck(data.exists);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
})();
