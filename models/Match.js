/**
* Клас, який представляє матч, та логіку боїв
* */
class Match {
    constructor(player1, player2) {
        this.player1 = player1;                                         // player1 - перший гравець
        this.player2 = player2;                                         // player1 - другий гравець
        this.currentPlayer = Math.random() > 0, 5 ? player1 : player2;  // currentPlayer - гравець, який зараз робить хід
        this.turnTimer = 30;                                            // Час, який дається на хід 
        this.deck = [];                                                 // Колода, має витягуватись з БД
        this.timer = null;                                              // Таймер для слідкування ходу
        this.turnTime = 30;                                             // Время на ход в секундах
        this.turnStart = null;                                          // Для початку ходу
        this.attackCard = null;
        this.defenseCard = null;
    }

    /**
     *Функція для початку матч
     * Додає карти з БД та тосує карти між гравцями
     * Запускає таймер
     */
    startGameMatch() {
        this.generateDeck();                                            //Цей метод має бути доданий Розробником 2
        this.distributeCards(this.player1);
        this.distributeCards(this.player2);
        this.turnStart = Date.now();
        this.startTimer();
        console.log('Game started!');
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //ЦЕ ЗАГЛУШКА ФУНКЦІІ ВИТЯГУВАННЯ КАРТ З БД

    generateDeck() {
        // Пример генерации колоды из 20 карт
        for (let i = 0; i < 20; i++) {
            this.deck.push(this.generateRandomCard());
        }
    }

    // Функция генерации случайной карты
    generateRandomCard() {
        return {
            attack: Math.floor(Math.random() * 10) + 1, // случайное число атаки от 1 до 10
            defense: Math.floor(Math.random() * 10) + 1, // случайное число защиты от 1 до 10
            cost: Math.floor(Math.random() * 5) + 1, // случайная стоимость
        };
    }
    //////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Роздає карти гравцям на початку матчу
     * @param {Object} player - гравець, якому роздаються карти
     */
    distributeCards(player) {
        const hand = [];
        for (let i = 0; i < 4; i++) {                                   // например, 4 карт в руке
            const k = Math.floor(Math.random() * 20) + 1;
            hand.push(this.deck[k]);
        }
        if (player === this.player1) {
            this.player1.pleyerCards = hand;
        } else {
            this.player2.playerCards = hand;
        }
    }

    /**
     * Виконання ходу гравця
     * @param {Object} player - гравець, який робить хід
     * @param {Number} attackCardIndex - індекс картки, яка атакує
     * @param {Number} defendCardIndex - індекс картки, яка захищається
     */
    playTurn(player, attackCardIndex, defendCardIndex) {
        if (player !== this.currentPlayer) {
            //сообщение о том что ход не ваш
        }

        const attackCard = player === this.player1 ? this.player1.pleyerCards[attackCardIndex] : this.player2.playerCards[attackCardIndex];
        const opponentCard = player === this.player1 ? this.player2.playerCards[defendCardIndex] : this.player1.playerCards[defendCardIndex]
        const opponent = player === this.player1 ? this.player2 : this.player1;

        this.setAttCard(attackCard);
        this.setDefCard(opponentCard);

        // if (!opponentCard) {
        //     //сообщение о том что карт у противника нет
        // }

        // Рассчитываем урон
        const result = this.calculateDamage(attackCard, opponentCard, opponent);

        if (result === false) {
            return false;
        }

        // После хода меняем игрока
        this.currentPlayer = player === this.player1 ? this.player2 : this.player1;

        // Раздаем новую карту после хода
        this.dealNewCard();

        this.endTurn()
    }

    /**
     * Функція, яка задає початок роботи таймера
     */
    startTimer() {
        this.timer = setTimeout(() => {
            this.timeUp(); // Время вышло, вызываем функцию
        }, /*this.turnTime * 1000*/ 5000);
    }

    /**
     * Функція, яка завершую роботу таймера
     */
    stopTimer() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    /**
     * Функція, таймера, яка визиваэться, коли чвс таймера сплив
     */
    timeUp() {
        const opponent = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        if (this.attackCard !== null && this.defenseCard === null) {
            console.log(`Час на хід ${this.currentPlayer.login} сплив!\n
                        Опонент не вибрав карту для захисту`);

            opponent.minusHp(this.attackCard.attack);
            this.checkGameOver();
            this.endTurn(); // Передаем ход другому игроку
        }
        else if (this.attackCard === null && this.defenseCard !== null) {
            console.log(`Час на хід ${this.currentPlayer.login} сплив!\n
                Ігрок не вибрав карту для атаки`);

            this.endTurn(); // Передаем ход другому игроку
        }
        else if (this.attackCard === null && this.defenseCard === null) {
            console.log(`Час на хід ${this.currentPlayer.login} сплив!\n
                Ігрок не вибрав карту для атаки та Опонент не вибрав карту для заїисту`);

            this.endTurn(); // Передаем ход другому игроку
        }
    }

    /**
     * Функція закынчення ходу
     */
    endTurn() {
        this.stopTimer(); // Останавливаем текущий таймер
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1; // Смена игрока
        this.turnStart = Date.now(); // Обновляем начало хода
        this.attackCard = null;
        this.defenseCard = null;
        this.startTimer(); // Запускаем новый таймер для следующего хода
    }

    /**
     * Розрахунок завданої шкоди
     * @param {Object} attackCard - карта, яка атакує
     * @param {Object} defendCard - карта, яка захищається
     * @param {Object} opponent - опонент, який захищається
     * @returns {Boolean} true, якщо шкода завдана, і false, якщо недостатньо енергії
     */
    calculateDamage(attackCard, defendCard, opponent) {
        if (this.currentPlayer.energy < attackCard.cost) {//тут жолжна быть модель карты, у которой есть поле cost
            return false;                               //нехватает энергии для использования данной карты 
        }
        const damage = attackCard.attack - defendCard.defense;
        if (damage > 0) {
            if (opponent === this.player1) {
                // ТУТ ДОЛЖНА БЫТЬ ЛОГИКА УДАЛЕНИЯ КАРТЫ ИЗ КОЛОДЫ
                this.player1.minusHp(damage);
            } else {
                //ТУТ ДОЛЖНА БЫТЬ ЛОГИКА УДАЛЕНИЯ КАРТЫ ИЗ КОЛОДЫ
                this.player2.minusHp(damage);
            }
        }

        this.checkGameOver();
        return true;
    }

     /**
     * Перевірка завершення гри
     */
    checkGameOver() {
        if (this.player1.hp <= 0) {
            console.log(`${this.player2} выиграл!`);
            //Сообщение о победе и окончание матча
        } else if (this.player2.hp <= 0) {
            console.log(`${this.player1} выиграл!`);
            //Сообщение о победе и окончание матча
        }
    }

    /**
     * Роздає нову карту після ходу
     */
    dealNewCard() {
        if (this.player1) {
            this.player1.pleyerCards.push(this.deck.pop());
        } else {
            this.player2.playerCards.push(this.deck.pop());
        }
    }
    
    /**
     * Встановлює attackCard
     */
    setAttCard(attackCard){
        this.attackCard = attackCard;
    }

    /**
     * Встановлює defendCard
     */
    setDefCard(defendCard){
        this.defendCard = defendCard;
    }
}

module.exports = Match;