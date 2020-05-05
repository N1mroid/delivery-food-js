const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// Day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuthBtn = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');

let login = localStorage.getItem('gloDelivery');

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
}

const authorized = () => {
  console.log('Авторизован');

  const logOut = () => {
    login = null;

    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

const notAuthorized = () => {
  console.log('Не авторизован');

  const logIn = (event) => {
    event.preventDefault();
    login = loginInput.value.trim();


    loginInput.style.borderColor = '';

    if (login) {
      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuthBtn.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      if (!login) loginInput.style.borderColor = 'red';
      alert('Вы не ввели логин');
    }


  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuthBtn.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

const checkAuth = () => {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();