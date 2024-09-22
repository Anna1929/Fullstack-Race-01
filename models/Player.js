/**
* Клас, який представляє гравця
* */
class Player {
    constructor(login, id) {
        this.userId = id;
        this.login = login;
        this.hp = 20;
        this.energy = 20;
        this.pleyerCards = [];
    }

    minusHp(hp) {
        this.hp -= hp;
    }
}

module.exports = Player;