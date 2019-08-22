class Starfighter {
    constructor(hp, atk, c_Atk) {
        this.baseHP = hp;
        this.hp = this.baseHP;
        this.baseAtk = atk;
        this.atk = this.baseAtk;
        this.c_Atk = c_Atk;
    }


    getHP() {
        return this.hp;
    }
    getBaseHP() {
        return this.baseHP;
    }
    getAtk() {
        return this.atk;
    }


    decreaseHP(x) {
        this.hp -= x;
    }
    increaseAtk() {
        this.atk += this.baseAtk;
    }
    

    reset() {
        this.hp = this.baseHP;
        this.atk = this.baseAtk;
    }
}