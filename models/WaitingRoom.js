// models/WaitingRoom.js
const Player = require('./Player.js');

/**
 * Клас, який представляє модель кімнати в якій один гравець очікує,
 * інший гравець має підєднатись
 */
class WaitingRoom {
    constructor() {
      this.rooms = {}; // Словарь для хранения комнат
    }
  
    /**
     * Створення кімнати для очікування
     * 
     * player - гравець, який створив кімнату
     * 
     * return - ID кімнати
    */ 
    createRoom(player) {
      const roomId = `id_${Date.now()}`; // Генерція унікального ID для кімнати
      this.rooms[roomId] = {
        players: [player], // Гравець, який створив кімнату (Модель графець)
        status: 'waiting' // Статус кімнти
      };
      return roomId;
    }
  
    /**
     * Додавання гравця в кімнату
     * 
     * roomId - ID кімнати, в яку заходить графець
     * player - гравець, який заходить в кімнату (другий гравець)
     * 
     * return - true, якщо приєднання до кімнати пройшло успішно, в іншому разі повертає false
    */ 
    joinRoom(roomId, player) {
      const room = this.rooms[roomId];
      if (room && room.players.length === 1) {
        room.players.push(player);
        room.status = 'full'; // Комната теперь полна
        return true;
      }
      return false;
    }
  
    /**
     * Отримання стану кімнати
     * 
     * roomId - ID кімнати, стан якої ми хочемо отримати
     *
     * return - повертає данні кімнати
    */ 
    getRoom(roomId) {
      return this.rooms[roomId] || null;
    }
  
    /**
     * Видалення кімнати
     * 
     * roomId - ID кімнати, яку хочемо видалити
     *
     * return - повертає данні кімнати
    */
    removeRoom(roomId) {
      delete this.rooms[roomId];
    }
  }
  
  module.exports = new WaitingRoom();
  