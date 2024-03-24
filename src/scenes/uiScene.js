import BaseScene from "./baseScene";

class UiScene extends BaseScene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Ui',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);
    }

    create(){
        this.add.text(0, 0, 'test good :)', this.defaultFont)
            .setOrigin(0)
    }
}

export default UiScene