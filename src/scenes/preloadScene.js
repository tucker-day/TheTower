import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload(){
        this.load.image('default', 'assets/default.jpg')
    }

    create(){
        this.scene.start('Menu')
    }
}

export default PreloadScene