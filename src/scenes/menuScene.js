import BaseScene from "./baseScene";

class MenuScene extends BaseScene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Menu',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);

        this.menuGroup = null
    }

    create(){
        this.menuGroup = this.add.group()
        this.createMain()
    }

    createText(x, y, text, font, clickMethod) {
        const button = this.add.text(x, y, text, font)
            .setOrigin(0.5, 1)
            
        if (clickMethod != null) {
            button.setInteractive()
            .on('pointerover', () => {
                button.setStyle({fill: '#ff0'})
            }, button)
            .on('pointerout', () => {
                button.setStyle({fill: this.baseDefaultFont.fill})
            }, button)
            .on('pointerup', clickMethod, this)
        }
        
        return button
    }

    createMain() {
        this.menuGroup.clear(true, true)

        this.menuGroup.addMultiple([
            this.createText(this.screenCenter[0], this.config.height * 0.39, 'THE TOWER', this.defaultFont(150)),
            this.createText(this.screenCenter[0], this.config.height * 0.47, 'Start Game', this.defaultFont(60), () => { this.scene.start('Play') }),
            this.createText(this.screenCenter[0], this.config.height * 0.54, 'Instructions', this.defaultFont(60), this.createInstructions),
            this.createText(this.screenCenter[0], this.config.height * 0.61, 'Controls', this.defaultFont(60), this.createControls),
            this.createText(this.screenCenter[0], this.config.height * 0.68, 'Credits', this.defaultFont(60), this.createCredits)
        ])
    }

    createInstructions() {
        this.menuGroup.clear(true, true)

        this.menuGroup.addMultiple([
            this.add.sprite(this.screenCenter[0], this.config.height * 0.3, 'flyingEye')
                .setOrigin(0.5, 0.5)
                .setScale(4)
                .play('flyEye_fly'),
            this.createText(this.screenCenter[0], this.config.height * 0.6, 
                'The goal of this game is gather as much gold as you can\nand survive as long as possible while the tower is filling\nwith lava. The longer you survive and the more monsters\nyou kill, the more gold you get.',
                this.defaultFont(50)),
            this.createText(this.screenCenter[0], this.config.height * 0.9, 'Back to Menu', this.defaultFont(60), this.createMain)
        ])
    }

    createControls() {
        this.menuGroup.clear(true, true)
        this.menuGroup.addMultiple([
            this.add.text(this.config.width * 0.35, this.config.height * 0.2, 'Press Left or Right to Run', this.defaultFont(60))
                .setOrigin(0, 0.5),
            this.add.sprite(this.config.width * 0.35, this.config.height * 0.16, 'knight')
                .setOrigin(1, 0.5)
                .setScale(2)
                .play('p_walk'),

            this.add.text(this.config.width * 0.35, this.config.height * 0.35, 'Press Up or Z to Jump', this.defaultFont(60))
                .setOrigin(0, 0.5),
            this.add.sprite(this.config.width * 0.35, this.config.height * 0.31, 'knight')
                .setOrigin(1, 0.5)
                .setScale(2)
                .play('p_jump'),

            this.add.text(this.config.width * 0.35, this.config.height * 0.5, 'Press Down to Quick Desend', this.defaultFont(60))
                .setOrigin(0, 0.5),
            this.add.sprite(this.config.width * 0.35, this.config.height * 0.46, 'knight')
                .setOrigin(1, 0.5)
                .setScale(2)
                .play('p_fall'),

            this.add.text(this.config.width * 0.35, this.config.height * 0.65, 'Press X to Attack', this.defaultFont(60))
                .setOrigin(0, 0.5),
            this.add.sprite(this.config.width * 0.32, this.config.height * 0.61, 'knight')
                .setOrigin(1, 0.5)
                .setScale(2)
                .play('p_attackLooping'),

            this.createText(this.screenCenter[0], this.config.height * 0.9, 'Back to Menu', this.defaultFont(60), this.createMain)
        ])
    }

    createCredits() {
        this.menuGroup.clear(true, true)

        this.menuGroup.addMultiple([
            this.createText(this.screenCenter[0], this.config.height * 0.25, 'Thank you artists for making this game possible!', this.defaultFont(60)),
            this.createText(this.screenCenter[0], this.config.height * 0.35, 'Fantasy Knight created by aamatniekss', this.defaultFont(45), () => {window.open("https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character")}),
            this.createText(this.screenCenter[0], this.config.height * 0.4, 'Flying Eye created by LuizMelo', this.defaultFont(45), () => {window.open("https://luizmelo.itch.io/monsters-creatures-fantasy")}),
            this.createText(this.screenCenter[0], this.config.height * 0.45, 'Pixel Platformer Castle created by Szadi art.', this.defaultFont(45), () => {window.open("https://szadiart.itch.io/pixel-platformer-castle")}),
            this.createText(this.screenCenter[0], this.config.height * 0.5, 'Silver Font created by Poppy Works', this.defaultFont(45), () => {window.open("https://poppyworks.itch.io/silver")}),
            this.createText(this.screenCenter[0], this.config.height * 0.55, 'Particle FX created by RagnaPixel', this.defaultFont(45), () => {window.open("https://ragnapixel.itch.io/particle-fx")}),
            this.createText(this.screenCenter[0], this.config.height * 0.6, 'Lava created by BeyonderBoy', this.defaultFont(45), () => {window.open("https://beyonderboy.itch.io/top-down-lava-tileset-16x16")}),
            this.createText(this.screenCenter[0], this.config.height * 0.65, 'Heart Icons created by ELV Games', this.defaultFont(45), () => {window.open("https://elvgames.itch.io/free-inventory-asset-pack")}),
            this.createText(this.screenCenter[0], this.config.height * 0.9, 'Back to Menu', this.defaultFont(60), this.createMain)
        ])
    }
}

export default MenuScene