import BaseScene from "./baseScene";

class PauseScene extends BaseScene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Pause',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);
    }

    create(){

    }
}

export default PauseScene