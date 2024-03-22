import BaseScene from "./baseScene";

class MenuScene extends BaseScene {
    constructor(config) {
        super('Menu', config);
    }

    create(){
        this.add.image(...this.screenCenter, 'default').setOrigin(0.5)
    }
}

export default MenuScene