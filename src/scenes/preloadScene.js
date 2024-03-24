import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Preload',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);
    }

    preload(){
        this.load.image('wall', 'assets/wall.png')
        this.load.image('brickBG', 'assets/brickBG.png')
        this.load.image('platform', 'assets/platform.jpg')

        this.load.spritesheet('knight', 'assets/knightSheet.png', {
            frameWidth: 120, frameHeight: 80
        })

        this.load.spritesheet('fire', 'assets/fire.png', {
            frameWidth: 96, frameHeight: 96
        })

        this.load.spritesheet('lava', 'assets/lava.png', {
            frameWidth: 48, frameHeight: 48
        })
    }

    create(){
        this.createPlayerAnims()
        this.createFireAnim()
        this.createLavaAnim()

        this.scene.start('Menu')

    }

    // loads all animations for the player knight character
    createPlayerAnims() {

        // KNIGHT SPRITESHEET GUIDE
        // Walk         1 - 10
        // Idle         11 - 20
        // Attack       21 - 24
        // Jump         25 - 27
        // (NOT USED)   28 - 29
        // Fall         30 - 32
        // Death        33 - 42

        // player walk
        this.anims.create({
            key: 'p_walk',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 9 }),
            frameRate: 14,
            repeat: -1
        })

        // player idle
        this.anims.create({
            key: 'p_idle',
            frames: this.anims.generateFrameNumbers('knight', { start: 10, end: 19 }),
            frameRate: 8,
            repeat: -1
        })

        // player attack
        this.anims.create({
            key: 'p_attack',
            frames: this.anims.generateFrameNumbers('knight', { start: 20, end: 23 }),
            frameRate: 16,
            repeat: false
        })

        // player jump
        this.anims.create({
            key: 'p_jump',
            frames: this.anims.generateFrameNumbers('knight', { start: 24, end: 26 }),
            frameRate: 12,
            repeat: -1
        })

        // player fall
        this.anims.create({
            key: 'p_fall',
            frames: this.anims.generateFrameNumbers('knight', { start: 29, end: 31 }),
            frameRate: 12,
            repeat: -1
        })

        // player death
        this.anims.create({
            key: 'p_death',
            frames: this.anims.generateFrameNumbers('knight', { start: 32, end: 41 }),
            frameRate: 12,
            repeat: 0
        })

        // player test anim loop
        this.anims.create({
            key: 'p_test',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 41 }),
            frameRate: 12,
            repeat: -1
        })
    }

    createFireAnim() {
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 18 }),
            frameRate: 12,
            repeat: -1
        })
    }

    createLavaAnim() {
        this.anims.create({
            key: 'lava',
            frames: this.anims.generateFrameNumbers('lava', { start: 1, end: 7 }),
            frameRate: 6,
            repeat: -1
        })
    }
}

export default PreloadScene