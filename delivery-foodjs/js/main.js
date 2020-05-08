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
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');

const cart = [];

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
    cartButton.style.display = ''; // * When we logout cart of goods will not be displayed [button]
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex'; // * Logout button display [button]
  cartButton.style.display = 'flex'; // * Cart of goods display [button]
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
  price,
  id
}) => {

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
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
								<button class="button button-primary button-add-cart" id=${id}>
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
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

const addToCart = (event) => {
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart'); // * We only add button and inside button elements but not the card

  if (buttonAddToCart) { // * If there was a click on the button the statement works futher
    const card = target.closest('.card'); // * When clicked on the buttonAddToCart [button] all of the card is selected
    const title = card.querySelector('.card-title-reg').textContent; // * get only the text of the buttons, but NOT HTML code
    const price = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id; // * id of each product in menu tied to a buttonAddCart [button]

    const food = cart.find(item => item.id === id);

    if (food) { // * if there is no food, add 1 quantity [count]
      food.count += 1; // * product quantity 1
    } else {
      cart.push({ // * adds the objects [cards] into an array => card = []
        id,
        title,
        price,
        count: 1
      })
    }
  }
}

const renderCart = () => {
  modalBody.textContent = '';

  cart.forEach(({
    id,
    title,
    price,
    count
  }) => {
    const itemCart = `
        <div class="food-row">
         <span class="food-name">${title}</span> 
          <strong class="food-price">${price}</strong> 
        <div class="food-counter">
         <button class="counter-button counter-minus" data-id=${id}>-</button> 
          <span class="counter">${count}</span> 
        <button class="counter-button counter-plus" data-id=${id}>+</button> 
         </div> 
        </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  })

  const totalPrice = cart.reduce((result, item) => {
    return result + (parseFloat(item.price) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}

const changeCount = (event) => {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }


}

const init = () => {
  getData('./db/partners.json')
    .then(data => data.forEach(createCardRestaurant));

  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

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