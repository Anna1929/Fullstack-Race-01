// controllers/gameController.js
const WaitingRoom = require("../models/WaitingRoom");
const path = require('path');
const Player = require("../models/Player");

const matches = {}; // Временное хранилище матчей (можно заменить на БД)

/**
 * Створює нову кімнату для гри
 * Створює гравця (тимчасова заглушка) і додає його в нову кімнату очікування
 * Перенаправляє користувача на сторінку очікування
 */
exports.createRoom = (req, res) => {
    // const { user } = req.body;                                       //ТУТ ДОЛЖЕН БЫТЬ ЮЗЕР, можн полчучить с сессии 
    const player = new Player("Max", 1);                                //ЭТО ПРОСТО ЗАГЛУШКА, можно взять данные и сессии
    const roomId = WaitingRoom.createRoom(player);
    res.redirect(`/waiting-room/waiting-page?roomId=${roomId}`);
};

/**
 * Відображає головну сторінку, де користувач може створити кімнату
 * Відправляє HTML файл головної сторінки
 */
exports.getCreateRoomPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/main.html'));
};

/**
 * Відображає сторінку очікування для гравця, який приєднався до кімнати
 * Відправляє HTML файл сторінки очікування
 */
exports.getWaitingPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/waiting.html'));
};

/**
 * Відображає сторінку приєднання до кімнати
 * Відправляє HTML файл для приєднання до вже існуючої кімнати
 */
exports.getJoinPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/join-room.html'));
};

/**
 * Додає гравця в існуючу кімнату очікування
 * roomId - ідентифікатор кімнати, отриманий з форми
 * Перевіряє, чи вдалося приєднати гравця. Якщо так, то:
 * - Якщо кімната заповнена (2 гравці), перенаправляє на початок гри
 * - Якщо кімната ще не повна, повертає повідомлення про очікування другого гравця
 * Інакше повертає помилку підключення
 */
exports.joinRoom = (req, res) => {
    // const { roomId, user } = req.body;                                
    const { roomId } = req.body;
    const player = new Player("Max2", 2);                                //ЭТО ТОЖЕ ПРОСТО ЗАГЛУШКА, можно взять данные и сессии

    const succsess = WaitingRoom.joinRoom(roomId, player);

    if (succsess) {
        const room = WaitingRoom.getRoom(roomId);

        if (room && room.players.length === 2) {
            res.redirect(`/game/start-game?roomId=${roomId}`);
        }
        else {
            res.status(200).json({ message: 'Ожидание второго игрока...' }); // сообщение о ожиданнии
        }

    }
    else {
        res.status(400).json({message : "Ошибка подключения"});// сообщение о ошибки
    }
};

/**
 * Повертає статус кімнати
 * roomId - ідентифікатор кімнати
 * Якщо кімната знайдена, повертає її статус (гравці, які приєднались)
 * Якщо кімната не існує, повертає помилку 404
 */
exports.getRoomStatus = (req, res) => {
    // console.log(roomId);
    const {roomId} = req.params;
    console.log(roomId);

    const room = WaitingRoom.getRoom(roomId);
    console.log(room.players.length);
    if(room){
        res.status(200).json({room});
    }
    else{
        res.status(404).json({message : "Room does not exist or not found"})
    }
};
