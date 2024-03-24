import BaseScene from "./baseScene";

class PauseScene extends BaseScene {
    constructor(sharedConfig) {
        const config = {
            key: 'Pause',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(config);
    }

    create(){

    }
}

export default PauseScene