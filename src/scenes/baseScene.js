import Phaser from "phaser";

// super class which all other classes inherit from. any methods or data that
// will be used across multiple scenes can be placed here.
class BaseScene extends Phaser.Scene {
    constructor(passedConfig) {
        super(passedConfig);

        this.config = passedConfig;
        this.screenCenter = [passedConfig.width / 2, passedConfig.height / 2]

        this.baseDefaultFont = {
            fill: '#fff',
            fontFamily: 'SilverFont'
        }
    }

    // returns the default font with the given font size
    defaultFont(size) {
        return {
            fontSize: `${size}px`,
            fill: this.baseDefaultFont.fill,
            fontFamily: this.baseDefaultFont.fontFamily
        }
    }

    create(){
        
    }
}

export default BaseScene