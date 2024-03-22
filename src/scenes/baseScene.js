import Phaser from "phaser";

// super class which all other classes inherit from. any methods or data that
// will be used across multiple scenes can be placed here.
class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config
        this.defaultFont = {fontSize: '32px', fill: '#000'}
        this.screenCenter = [config.width / 2, config.height / 2]
    }

    create(){
        
    }
}

export default BaseScene