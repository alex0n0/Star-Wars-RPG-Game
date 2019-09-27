class Starfighter {
    constructor(hp, atk, counterAtk) {
        this.baseHP = hp;
        this.hp = this.baseHP;
        this.baseAtk = atk;
        this.atk = this.baseAtk;
        this.counterAtk = counterAtk;
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

    getcounterAtk() {
        return this.counterAtk;
    }


    decreaseHP(x) {
        this.hp -= x;
    }
    increaseAtk() {
        this.atk += this.baseAtk;
    }
    

    resetStats() {
        this.hp = this.baseHP;
        this.atk = this.baseAtk;
    }
}