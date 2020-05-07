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

const getData = async (url) => {

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }

  return await response.json();

}

// console.log(getData('./db/partners.json'));

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

const createCardRestaurant = ({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) => {

  // console.log(restaurant.name);
  // console.log(restaurant);


  const card = `
            <a class="card card-restaurant" data-products=${products}>
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
          </a>`;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
  // cardsRestaurants.append(card);
}





const createCardGoods = ({
  description,
  image,
  name,
  price
}) => {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
  <img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
            </div>`);

  cardsMenu.insertAdjacentElement('beforeend', card);

}

const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (restaurant) {
    // console.log(restaurant.dataset.products);
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`./db/${restaurant.dataset.products}`)
      .then(data => data.forEach(createCardGoods));
    // createCardGoods();
    // createCardGoods();
    // createCardGoods();
  }

}

const init = () => {
  getData('./db/partners.json')
    .then(data => data.forEach(createCardRestaurant));

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })

  checkAuth();
}

init();

// createCardRestaurant();
// createCardRestaurant();
// createCardRestaurant();