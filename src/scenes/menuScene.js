import BaseScene from "./baseScene";

class MenuScene extends BaseScene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Menu',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);
    }

    create(){
        this.scene.start('Play')
    }
}

export default MenuScene