class Starfighter {
    constructor(hp, atk, c_Atk) {
        this.isPlayer = false;
        this.isAlive = true;
        this.baseHP = hp;
        this.hp = this.baseHP;
        this.baseAtk = atk;
        this.atk = this.baseAtk;
        this.c_Atk = c_Atk;
    }

    setPlayer(x) {
        this.isPlayer = x;
    }
    setAlive(x) {
        this.isAlive = x;
    }


    increaseHP() {
        this.hp += this.baseHP;
    }
    increaseAtk() {
        this.atk += this.baseAtk;
    }

    
    reset() {
        this.isPlayer = false;
        this.isAlive = true;
        this.hp = this.baseHP;
        this.atk = this.baseAtk;
    }
}