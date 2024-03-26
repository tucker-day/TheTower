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
        this.load.image('goldPile', 'assets/coins.png')

        this.load.spritesheet('knight', 'assets/knightSheet.png', {
            frameWidth: 120, frameHeight: 80,
        })

        this.load.spritesheet('fire', 'assets/fire.png', {
            frameWidth: 96
        })

        this.load.spritesheet('lava', 'assets/lava.png', {
            frameWidth: 48
        })

        this.load.spritesheet('hearts', 'assets/hearts.png' , {
            frameWidth: 16
        })

        this.load.spritesheet('flyingEye', 'assets/flyingEye.png', {
            frameWidth: 60, frameHeight: 50
        })
    }

    create(){
        this.createPlayerAnims()
        this.createFireAnim()
        this.createLavaAnim()
        this.createEnemyAnims()

        this.scene.start('Menu')
    }

    // loads all animations for the player knight character
    createPlayerAnims() {
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
            frames: this.anims.generateFrameNumbers('knight', { start: 21, end: 23 }),
            frameRate: 12,
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
            frames: this.anims.generateFrameNumbers('knight', { start: 33, end: 41 }),
            frameRate: 8,
            repeat: 0
        })

        // player hit
        this.anims.create({
            key: 'p_hit',
            frames: this.anims.generateFrameNumbers('knight', { start: 42, end: 43 }),
            frameRate: 8,
            repeat: 0
        })

        // player test anim loop
        this.anims.create({
            key: 'p_test',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 43 }),
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

    createEnemyAnims() {
        this.anims.create({
            key: 'flyEye_fly',
            frames: this.anims.generateFrameNumbers('flyingEye', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'flyEye_die',
            frames: this.anims.generateFrameNumbers('flyingEye', { start: 16, end: 19 }),
            frameRate: 10,
            repeat: 0
        })
    }
}

export default PreloadScene