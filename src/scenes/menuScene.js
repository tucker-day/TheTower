import BaseScene from "./baseScene";

class MenuScene extends BaseScene {
    constructor(sharedConfig) {
        const config = {
            key: 'Menu',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(config);
    }

    create(){
        this.scene.start('Play')
    }
}

export default MenuScene