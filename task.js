const productQuantityControlDec = document.querySelectorAll(".product__quantity-control_dec"); //Минусы
const productQuantityValue = document.querySelectorAll(".product__quantity-value"); //Колличество
const productQuantityControlInc = document.querySelectorAll(".product__quantity-control_inc"); //Плюсы
const productAdd = document.querySelectorAll(".product__add"); //Добавить в корзину
const productList = document.querySelectorAll(".product"); //Список продуктов в магазине
const cart = document.querySelector(".cart"); //Раздел Корзина товаров
let cartProducts;// = document.querySelector(".cart__products"); //Корзина товаров


//Добавление действия на удаление товаров из корзины:
function productDelete() {
    let cartPrList = Array.from(document.querySelectorAll(".cart__product"));
    let cartPrDeleteList = Array.from(document.querySelectorAll(".cart__product__remove"));
    if (cartPrList) {
        for (let i = 0; i < cartPrList.length; i++) {
            cartPrDeleteList[i].onclick = function(event) {
                cartPrList[i].remove();
                //Был ли это последний товар в карзине?
                cartCheck();
                //Сохранение корзины в localStorage:
                cartSaveLS();
            }
        }
    }
}

//Проверка наличия товаров в корзине:
function cartCheck () {
    let cartPrList = Array.from(document.querySelectorAll(".cart__product"));
    if (cartPrList.length == 0) {
        cart.children[1].remove();
        cart.children[0].remove();
    }
}

//Сохранение корзины в localStorage:
function cartSaveLS() {
    let cartPrList = document.querySelectorAll(".cart__product");
    let prList = [];
    if (cartPrList.length > 0) {
        for (let i = 0; i < cartPrList.length; i++) {
            prList[i] = {
                id: Number(cartPrList[i].getAttribute("data-id")),
                src: cartPrList[i].children[0].src,
                count: Number(cartPrList[i].children[1].textContent.replace('\n', '').trim()),
            }
        }
    }
    localStorage.setItem("cartPrList", JSON.stringify(prList));
}

//Загрузка данных из localStorage:
function cartLoadLS(){
    if (localStorage.getItem("cartPrList")) {
        let cartPrList = JSON.parse (localStorage.getItem("cartPrList"));

        //Отображаем раздел "Корзина":
        cart.innerHTML += `<div class="cart__title">Корзина</div>
                            <div class="cart__products">
                            </div>`;
        
        cartProducts = document.querySelector(".cart__products"); //Корзина товаров
        
        for (let i = 0; i < cartPrList.length; i++) {
            cartProducts.innerHTML += `<div class="cart__product" data-id="${cartPrList[i]['id']}">
                                            <img class="cart__product-image" src="${cartPrList[i]['src']}">
                                            <div class="cart__product-count">${cartPrList[i]['count']}</div>
                                            <a href="#" class="cart__product__remove">&times;</a>
                                        </div>`
        }
        
        //Добавление действия на удаление товаров из крзины:
        productDelete();    
    }
}

//Добавить товар в корзину
function productAddCart (i) {
    let id = productList[i].getAttribute("data-id");
    let cartPrList = document.querySelectorAll(".cart__product");
    
    //Если в корзине не было товаров, то добавляем раздел перед добавлением товара
    if (cartPrList.length == 0) {
        cart.innerHTML += `<div class="cart__title">Корзина</div>
                            <div class="cart__products">
                            </div>`;
        cartProducts = document.querySelector(".cart__products"); //Корзина товаров
    }


    cartPrList = Array.from(document.querySelectorAll(".cart__product")).find(item => item.getAttribute("data-id") == id);

    //Если данный товар уже есть в корзине:
    if (cartPrList) {
        cartPrList.children[1].textContent = Number(cartPrList.children[1].textContent) + Number(productQuantityValue[i].textContent);
    //Если товара в корзине нет:
    } else {
        cartProducts.innerHTML += `<div class="cart__product" data-id="${id}">
                                        <img class="cart__product-image" src="${productList[i].children[1].src}">
                                        <div class="cart__product-count">${productQuantityValue[i].textContent}</div>
                                        <a href="#" class="cart__product__remove">&times;</a>
                                    </div>`
    }
    //Сохранение корзины в localStorage:
    cartSaveLS();
    //Анимация движения картинки товара в корзину:
    imageMoove (i);
    //Добавление действия на удаление товаров из крзины:
    productDelete();
}

//Анимация движения картинки товара в корзину:
function imageMoove (i) {
    let numMove = 10;//Колличество движений
    let timeMove = 400;//Время за которое должно завершиться перемещение

    let id = productList[i].getAttribute("data-id");
    //Координаты старта:
    let elemStart = productList[i].children[1].getBoundingClientRect();
    //Координаты назначения:
    let elemFin = Array.from(document.querySelectorAll(".cart__product")).find(item => item.getAttribute("data-id") == id).children[0].getBoundingClientRect();

    //Создание элемента:
    let elem = document.createElement('div');
    elem.className = "product__moove__image";
    document.body.append(elem);

    elem.innerHTML += ` <img src="${productList[i].children[1].src}" alt="" class="product__image">`

    let left = elemStart.left;
    let top = elemStart.top;
    let iMoove = 1;

    let moove = setInterval(function() {
        left = elemStart.left + (elemFin.left - elemStart.left)*iMoove/numMove;
        top = elemStart.top + (elemFin.top - elemStart.top)*iMoove/numMove;
        iMoove++
        elem.style.left = left + 'px';
        elem.style.top = top + 'px';
        if ( iMoove> numMove) {
            elem.remove();
            clearTimeout(moove);}
    }, Math.round(timeMove/numMove)); 
    
}

//Очистка корзины (при необходимости):
if (0) {
    localStorage.setItem("cartPrList", "");
}

//Загрузка данных из localStorage:
cartLoadLS();

//Перебор товаров и создание действий для каждого:
for (let i = 0; i < productQuantityValue.length; i++) {
    //клик по минусу:
    productQuantityControlDec[i].onclick= function(event) {
        if (productQuantityValue[i].textContent > 1) {productQuantityValue[i].textContent--}
        return false;
    }

    //клик по плюсу:
    productQuantityControlInc[i].onclick= function(event) {
        productQuantityValue[i].textContent++;
        return false;
    }

    //Добавить в корзину
    productAdd[i].onclick= function(event) {
        productAddCart(i);
        return false;
    }
}