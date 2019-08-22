class Starfighter {
    constructor(hp, atk, cAtk) {
        this.baseHP = hp;
        this.hp = this.baseHP;
        this.baseAtk = atk;
        this.atk = this.baseAtk;
        this.cAtk = cAtk;
    }

    
    getBaseHP() {
        return this.baseHP;
    }
    getHP() {
        return this.hp;
    }
    setHP(x) {
        this.hp = x;
    }

    getAtk() {
        return this.atk;
    }

    getCAtk() {
        return this.cAtk;
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