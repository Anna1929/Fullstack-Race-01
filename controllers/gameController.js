// controllers/gameController.js
const Match = require('../models/Match');
const waitingRoom = require('../models/WaitingRoom');
const matches = {}; // Временное хранилище матчей
const path = require('path');

/**
 * Створює новий матч, якщо кімната очікування повна (2 гравці)
 * roomId - ідентифікатор кімнати
 * Якщо кімната не знайдена або не заповнена, повертає повідомлення про помилку
 * Інакше створює новий матч і перенаправляє гравців на сторінку початку гри
 */
exports.createMatch = (req, res) => {
    const { roomId } = req.query;
    const room = waitingRoom.getRoom(roomId);

    if (!room || room.players.length !== 2) {
        res.status(200).json({ message: "Комната не создана или не полная", room });
    }
    else {
        const [player1, player2] = room.players;
        const newMatch = new Match(player1, player2);

        newMatch.startGameMatch();
        // waitingRoom.removeRoom(roomId);

        res.redirect(`/game/start-game-page?roomId=${roomId}`);
    }
};

/**
 * Відображає сторінку гри
 * Відправляє HTML файл сторінки гри для гравців
 */
exports.showGamePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
};

/**
 * Виконує хід у грі
 * Отримує параметри з запиту: matchId, player (гравець), attackCardIndex (індекс атакуючої карти), defendCardIndex (індекс карти захисту)
 * Якщо матч не знайдено, повертає помилку 404
 * Інакше викликає метод playTurn для гравця і обробляє результат
 */
// controllers/gameController.js
exports.playTurn = (req, res) => {
    const { matchId, player, attackCardIndex, defendCardIndex } = req.body;

    const match = matches[matchId];
    if (!match) {
        return res.status(404).json({ message: 'Матч не найден' });
    }

    try {
        const result = match.playTurn(player, attackCardIndex, defendCardIndex);

        if (result === false) {
            return res.status(400).json({ message: 'Недостаточно энергии для использования данной карты' });
        }

        res.status(200).json({ message: 'Ход выполнен', match });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Повертає поточний стан матчу
 * Отримує matchId з параметрів запиту
 * Якщо матч не знайдено, повертає помилку 404
 * Інакше повертає стан матчу та час, що залишився до завершення ходу
 */
exports.getMatchState = (req, res) => {
    const { matchId } = req.params;

    const match = matches[matchId];
    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }

    const timeRemaining = match.turnTime - Math.floor((Date.now() - match.turnStart) / 1000);
    res.status(200).json({ match, timeRemaining });
  };
