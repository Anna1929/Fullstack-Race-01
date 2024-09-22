let app, background, deck, gameStarts = false;
let cards = [];
const maxCards = 5; // Максимальное количество карт на руке игрока
let cardWidth = 300; // Ширина карты
let cardHeight = 300; // Высота карты
const cardSpacing = 10; // Расстояние между картами

window.onload = function() {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo: window // Автоматически обновляет размер при изменении окна
    });
    document.body.appendChild(app.view);

    // Загружаем фон и карточки
    loadBackground();
    loadAssets();
};

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateElementSizes();
});

async function loadBackground() {
    try {
        const backgroundTexture = await PIXI.Assets.load('/resources/background.jpg');
        background = new PIXI.Sprite(backgroundTexture);
        app.stage.addChildAt(background, 0);
        updateElementSizes(); // Обновляем размеры фона после его добавления на сцену
    } catch (error) {
        console.error('Error loading background:', error);
    }
}

async function loadAssets() {
    try {
        const deckTexture = await PIXI.Assets.load('/resources/deck.png');
        const playerOneIcon = await PIXI.Assets.load('/resources/icon1.png');
        const playerTwoIcon = await PIXI.Assets.load('/resources//icon2.png');
        createDeck(deckTexture);  // Создаем колоду
        createPlayerIcon(playerOneIcon, 100, 20, "Player1"); // Создаем иконку второго игрока
        createPlayerIcon(playerTwoIcon, 100, 710, "Player2"); // Создаем колоду
        chooseStartingPlayer(playerOneIcon, playerTwoIcon, "Player1", "Player2"); // Выбираем стартового игрока
    } catch (error) {
        console.error('Error loading deck:', error);
    }
}

function createPlayerIcon(texture, x, y, playerName) {
    let icon = new PIXI.Sprite(texture);
    icon.width = 250; // Устанавливаем размеры иконки
    icon.height = 250;
    icon.x = x; // Устанавливаем позицию иконки
    icon.y = y;
    app.stage.addChild(icon);

    // Создаём текст с именем игрока
    let nameStyle = new PIXI.TextStyle({
        fontFamily: 'Arial', // Выбор шрифта
        fontSize: 36, // Размер шрифта
        fill: 'white', // Цвет текста
        align: 'center' // Выравнивание по центру
    });

    let playerNameText = new PIXI.Text(playerName, nameStyle);
    playerNameText.anchor.set(0.5); // Центрируем текст относительно его положения
    playerNameText.x = icon.x + icon.width / 2; // Размещаем текст под иконкой
    playerNameText.y = icon.y + icon.height + 10; // Отступ в 10 пикселей под иконкой

    app.stage.addChild(playerNameText); // Добавляем текст на сцену
}


function chooseStartingPlayer(playerOneIcon, playerTwoIcon, playerOneName, playerTwoName) {
    let currentIcon; // Текущая иконка для отображения
    let interval; // Переменная для хранения интервала анимации
    const duration = 5000; // Длительность анимации в миллисекундах (5 секунд)
    const switchInterval = 200; // Интервал переключения иконок (0.2 секунды)
    const displayTime = 3000; // Время отображения статичной иконки (3 секунды)
    const centerX = app.screen.width / 2 - 125; // Центр экрана по X для иконок (иконки по 250px шириной)
    const centerY = app.screen.height / 2 - 125; // Центр экрана по Y для иконок

    // Создаем контейнер для анимации иконок
    let iconContainer = new PIXI.Container();
    app.stage.addChild(iconContainer);

    // Функция, которая переключает иконки каждые 200 мс
    interval = setInterval(() => {
        // Очищаем контейнер перед добавлением новой иконки
        iconContainer.removeChildren();

        // Выбираем, какая иконка показывается
        if (currentIcon === playerOneIcon) {
            currentIcon = playerTwoIcon;
        } else {
            currentIcon = playerOneIcon;
        }

        // Добавляем выбранную иконку в центр экрана
        let icon = new PIXI.Sprite(currentIcon);
        icon.width = 250; // Размер иконки
        icon.height = 250;
        icon.x = centerX;
        icon.y = centerY;
        iconContainer.addChild(icon);
    }, switchInterval);

    // Через 5 секунд выбираем случайного игрока и останавливаем анимацию
    setTimeout(() => {
        clearInterval(interval); // Останавливаем переключение

        // Очищаем контейнер перед финальной иконкой
        iconContainer.removeChildren();

        // Случайным образом выбираем игрока
        let selectedIcon = Math.random() > 0.5 ? playerOneIcon : playerTwoIcon;
        let playerWinOnStart;

        // Показываем финальную иконку выбранного игрока
        let icon = new PIXI.Sprite(selectedIcon);
        icon.width = 250;
        icon.height = 250;
        icon.x = centerX;
        icon.y = centerY;

        // Создаём текст с именем игрока
        let nameStyle = new PIXI.TextStyle({
            fontFamily: 'Arial', // Выбор шрифта
            fontSize: 36, // Размер шрифта
            fill: 'white', // Цвет текста
            align: 'center' // Выравнивание по центру
        });

        if (selectedIcon === playerOneIcon) {
            playerWinOnStart = playerOneName;
        } else
            playerWinOnStart = playerTwoName;

        let playerNameText = new PIXI.Text(playerWinOnStart, nameStyle);
        playerNameText.anchor.set(0.5); // Центрируем текст относительно его положения
        playerNameText.x = icon.x + icon.width / 2; // Размещаем текст под иконкой
        playerNameText.y = icon.y + icon.height + 10; // Отступ в 10 пикселей под иконкой

        app.stage.addChild(playerNameText); // Добавляем текст на сцену

        iconContainer.addChild(icon);

        setTimeout(() => {
            iconContainer.removeChildren(); // Убираем иконку
            app.stage.removeChild(playerNameText); // Убираем текст
            if (!gameStarts) {
                showCards();
            } else {
                addNewCard(); // Добавляем карту при повторном нажатии
            }
        }, displayTime);

    }, duration);
}


function createDeck(texture) {
    if (!deck) { // Проверяем, чтобы колода не создавалась повторно
        deck = new PIXI.Sprite(texture);
        deck.width = 400; // Примерная ширина колоды
        deck.height = 400; // Примерная высота колоды
        deck.x = app.screen.width - deck.width - 20; // Отступ от правого края
        deck.y = app.screen.height / 2 - deck.height / 2;
        deck.interactive = true;
        deck.buttonMode = true;
        app.stage.addChild(deck);

        deck.on('pointerdown', () => {
            if (!gameStarts) {
                // showCards();
            } else {
                addNewCard(); // Добавляем карту при повторном нажатии
            }
        });
    }
}

let opponentCards = [];

function showCards() {
    const numberOfCards = 4;
    const startX = (app.screen.width - (numberOfCards * cardWidth + (numberOfCards - 1) * cardSpacing)) / 2; // Начальная позиция по X для центрирования

    for (let i = 0; i < numberOfCards; i++) {
        PIXI.Assets.load('/resources/card1.png').then(texture => {
            let newCard = new PIXI.Sprite(texture);
            newCard.width = cardWidth; // Установите размеры карты
            newCard.height = cardHeight;
            newCard.x = startX + i * (cardWidth + cardSpacing); // Устанавливаем горизонтальное положение карты
            newCard.y = app.screen.height - cardHeight - 20; // Располагаем карты внизу экрана
            newCard.alpha = 0; // Изначально карта невидима
            newCard.interactive = true;
            newCard.buttonMode = true;

            newCard.on('pointerdown', () => {
                moveCardToCenterYou(i); // Анимация перемещения при клике на карту
            });

            cards.push(newCard); // Добавляем карту в массив
            app.stage.addChild(newCard);

            // Анимация появления карты
            fadeInCard(newCard);
        });
        PIXI.Assets.load('/resources/card2.png').then(texture => {
            let newCard = new PIXI.Sprite(texture);
            newCard.width = cardWidth; // Устанавливаем размеры карты
            newCard.height = cardHeight;
            newCard.x = startX + i * (cardWidth + cardSpacing); // Устанавливаем горизонтальное положение карты
            newCard.y = 20; // Располагаем карты вверху экрана (оппонент)
            newCard.interactive = true;
            newCard.buttonMode = true;

            // Добавляем обработчик нажатия на карту оппонента
            newCard.on('pointerdown', () => {
                moveCardToCenterOpponent(i); // Анимация перемещения при клике на карту оппонента
            });

            opponentCards.push(newCard); // Добавляем карту оппонента в массив
            app.stage.addChild(newCard);
        });
    }

    gameStarts = true; // Теперь карты разданы, и игра началась
}

// Функция для анимации появления карты с постепенным увеличением прозрачности
function fadeInCard(card) {
    let alphaSpeed = 0.01; // Скорость увеличения прозрачности
    card.alpha = 0; // Начальная прозрачность

    app.ticker.add(function onFade() {
        if (card.alpha < 1) {
            card.alpha += alphaSpeed; // Плавно увеличиваем прозрачность
        } else {
            card.alpha = 1; // Устанавливаем окончательное значение
            app.ticker.remove(onFade); // Удаляем анимацию, когда карта полностью видима
        }
    });
}


function addNewCard() {
    if (cards.length < maxCards) {
        PIXI.Assets.load('/resources/card1.png').then(texture => {
            let newCard = new PIXI.Sprite(texture);
            newCard.width = cardWidth;
            newCard.height = cardHeight;

            // Вычисляем позицию для новой карты
            const newX = cards[cards.length - 1].x + cardWidth + cardSpacing;
            const newY = app.screen.height - cardHeight - 20;

            newCard.x = app.screen.width; // Стартовая позиция карты за экраном
            newCard.y = newY;

            cards.push(newCard); // Добавляем карту в массив
            app.stage.addChild(newCard);

            // Анимация перемещения карты на нужную позицию справа
            app.ticker.add(() => animateCard(newCard, newX, newY));
        });
    }
}

function moveCardToCenterYou(clickedIndex) {
    const centerX = app.screen.width / 3 - cards[clickedIndex].width / 3;
    const centerY = app.screen.height / 2 - cards[clickedIndex].height / 2;

    // Анимация перемещения выбранной карты в центр
    app.ticker.add(() => animateCard(cards[clickedIndex], centerX, centerY));

    // Смещаем карты справа от выбранной на одну позицию влево
    for (let i = clickedIndex + 1; i < cards.length; i++) {
        const targetX = cards[i - 1].x; // Позиция слева
        const targetY = cards[i].y; // Оставляем на той же высоте

        app.ticker.add(() => animateCard(cards[i], targetX, targetY));
    }
}

function moveCardToCenterOpponent(clickedIndex) {
    const centerX = app.screen.width / 1.5 - opponentCards[clickedIndex].width / 1.5;
    const centerY = app.screen.height / 2 - opponentCards[clickedIndex].height / 2;

    // Анимация перемещения выбранной карты оппонента в центр
    app.ticker.add(() => animateCard(opponentCards[clickedIndex], centerX, centerY));

    // Смещаем карты справа от выбранной на одну позицию влево
    for (let i = clickedIndex + 1; i < opponentCards.length; i++) {
        const targetX = opponentCards[i - 1].x; // Позиция слева
        const targetY = opponentCards[i].y; // Оставляем на той же высоте

        app.ticker.add(() => animateCard(opponentCards[i], targetX, targetY));
    }
}

function animateCard(card, targetX, targetY) {
    const speed = 5;
    const dx = targetX - card.x;
    const dy = targetY - card.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > speed) {
        card.x += (dx / distance) * speed;
        card.y += (dy / distance) * speed;
    } else {
        // Если карта достигла целевой позиции
        card.x = targetX;
        card.y = targetY;
        app.ticker.remove(() => animateCard(card, targetX, targetY));
    }
}

function updateElementSizes() {
    if (background) {
        background.width = app.screen.width;
        background.height = app.screen.height;
    }
    if (deck) {
        // Изменяем размеры колоды пропорционально окну
        deck.width = app.screen.width * 0.15; // Колода занимает 10% ширины экрана
        deck.height = deck.width * 1; // Поддерживаем пропорции колоды

        // Обновляем позицию колоды, чтобы она оставалась по центру
        deck.x = app.screen.width - deck.width - 20; // Отступ от правого края
        deck.y = app.screen.height / 2 - deck.height / 2;
    }
}

