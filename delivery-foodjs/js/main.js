'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuthBtn = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModal() {
  modal.classList.toggle("is-open");
}

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
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
      // alert('Вы не ввели логин');
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

const createCardRestaurant = () => {
  const card = `
            <a class="card card-restaurant">
						<img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">Тануки</h3>
								<span class="card-tag tag">60 мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									4.5
								</div>
								<div class="price">От 1 200 ₽</div>
								<div class="category">Суши, роллы</div>
							</div>
						</div>
          </a>`;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
  // cardsRestaurants.append(card);
}



const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    createCardGoods();
    createCardGoods();
    createCardGoods();
  }

}

const createCardGoods = () => {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
  <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
									грибы.
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
            </div>`);

  cardsMenu.insertAdjacentElement('beforeend', card);

}


cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();