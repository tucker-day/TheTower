import BaseScene from "./baseScene";

class PauseScene extends BaseScene {
    constructor(sharedConfig) {
        const gameSize = 400

        const passConfig = {
            key: 'Menu',

            width: gameSize,
            height: gameSize,
            
            cameras: {
                zoom: sharedConfig.width / gameSize
            }
        }
        super(passConfig)
        this.sharedConfig = sharedConfig

        this.moveSpeed = -30
    }

    // this whole thing is basically just a copy paste of the infinite 
    // scrolling tower i made for the play scene lol. its lazy but it
    // works

    init() {
        this.background = null
        this.walls = null
        this.cameraTarget = null
    }

    create(){
        this.createBG()

        this.cameraTarget = this.physics.add.image(...this.screenCenter)
        this.cameras.main.startFollow(this.cameraTarget, false, 0, 1)

        this.createWalls()

        this.cameraTarget.body.setVelocityY(this.moveSpeed)

        // start the menu ui
        this.scene.launch('MenuUi', this)
    }

    update() {
        this.recycleWallsAndBG()
    }

    createBG() {
        // create a group of background sprites
        this.background = this.add.group()

        // get background sprite height
        let height = this.textures.get('brickBG').get(0).height

        // create all background panels
        for (let i = 0; i < this.config.height + height; i += height) {
            this.background.create(this.screenCenter[0], i, 'brickBG')
        }
    }

    createWalls() {
        // create a group of wall sprites
        this.walls = this.physics.add.group()

        // get wall sprite height
        let height = this.textures.get('wall').get(0).height

        // create all walls
        for (let i = 0; i < this.config.height + height; i += height) {
            this.walls.create(0, i, 'wall')
                .setImmovable(true)
            this.walls.create(this.config.width, i, 'wall')
                .setImmovable(true)
                .setFlipX(true)
        }
    }

    // moves walls that are out of the screen
    recycleWallsAndBG() {
        // move walls
        this.walls.getChildren().forEach(wall => {
            // check if bottom of wall is out the top of screen
            if (wall.y + wall.height / 2 < this.cameras.main.midPoint.y - this.config.height / 2) {   
                wall.y += this.walls.getLength() / 2 * wall.height
            }

            // check if top of wall is out the bottom of screen
            if (wall.y - wall.height / 2 > this.cameras.main.midPoint.y + this.config.height / 2) {   
                wall.y -= this.walls.getLength() / 2 * wall.height
            }
        })

        // move the background
        this.background.getChildren().forEach(bg => {
            // check if bottom of bg is out the top of screen
            if (bg.y + bg.height / 2 < this.cameras.main.midPoint.y - this.config.height / 2) {   
                bg.y += this.background.getLength() * bg.height
            }

            // check if top of bg is out the bottom of screen
            if (bg.y - bg.height / 2 > this.cameras.main.midPoint.y + this.config.height / 2) {   
                bg.y -= this.background.getLength() * bg.height
            }
        })
    }
}

export default PauseScene