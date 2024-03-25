import Player from "../prefabs/player"
import BaseScene from "./baseScene"

class PlayScene extends BaseScene {
    constructor(sharedConfig) {
        const gameSize = 400

        const passConfig = {
            key: 'Play',

            width: gameSize,
            height: gameSize,
            
            cameras: {
                zoom: sharedConfig.width / gameSize
            }
        }
        super(passConfig)
        this.sharedConfig = sharedConfig

        // game background
        this.background = null

        // player
        this.player = null

        // platforms
        this.platforms = null
        this.platformYDistance = 112

        // walls
        this.walls = null
        this.wallsRenderDepth = 11

        // lava
        this.lava = null
        this.lavaFiller = null

        this.lavaInitY = 300
        this.lavaInitSpeed = -20
        this.lavaRenderDepth = 10

        this.lavaMove = true

        // fire effects
        this.fireEffects = null

        // game boundries
        this.gameBoundsX = {
            min: 16,
            max: this.config.width -  16
        }

        // ui config
        this.uiConfig = {
            gameZoom: passConfig.cameras.zoom,
        }
    }

    create() {
        this.createBG()
        this.player = new Player(...this.screenCenter, this)
        this.player.createControls()
        this.createPlatforms()
        this.createWalls()
        this.createFire()
        this.createLava()
        this.createUi({
            gameZoom: this.uiConfig.gameZoom,
            maxHealth: this.player.maxHealth
        })

        // make the player collide with the enviroment
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.walls)

        // make the camera follow the player
        this.cameras.main.startFollow(this.player, false, 0, this.player.cameraFollowFactor, 0, this.player.cameraYOffset)
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

        // change lava render depth
        this.walls.setDepth(this.wallsRenderDepth)
    }

    createPlatforms() {
        // create a group of platforms
        this.platforms = this.physics.add.group();

        this.platforms.create(this.screenCenter[0], this.screenCenter[1], 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)

        this.platforms.create(0, this.screenCenter[1] - this.platformYDistance, 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)

        this.platforms.create(this.config.width, this.screenCenter[1] - this.platformYDistance, 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)

        this.platforms.create(this.screenCenter[0], this.screenCenter[1] - 2 * this.platformYDistance, 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)
    }

    createLava() {
        // create a group for lava objects
        this.lava = this.physics.add.group();

        // get the width of the lava sprite
        let width = this.textures.get('lava').get(0).width

        // create all lava objects
        for (let i = 0; i < this.config.width + width; i += width) {
            let instance = this.lava.create(i, this.lavaInitY, 'lava')
                .setImmovable(true)
                .setOrigin(0, 0)
                .play('lava')

            instance.setBodySize(instance.width, instance.height * 0.6)
            instance.setOffset(0, instance.height * 0.4)
        }

        // create the rest of the lava
        this.lavaFiller = this.lava.create(0, this.lava.getLast(true).y + this.lava.getLast(true).height, 'lava')
            .setImmovable(true)
            .setOrigin(0, 0)
        this.lavaFiller.setScale(this.config.width / this.lavaFiller.width, this.config.height / this.lavaFiller.height)

        // make the player die when touching lava
        this.physics.add.collider(this.player, this.lava, this.player.hitLava, null, this.player)

        // change lava render depth
        this.lava.setDepth(this.lavaRenderDepth)

        // make the lava start moving
        this.lava.setVelocityY(this.lavaInitSpeed)
    }

    createFire() {
        // create a group of fire
        this.fireEffects = this.add.group();
    }

    createUi(config) {
         // start the game ui
         this.scene.launch('Ui', config)
    }

    update() {
        this.player.update()
        this.recycleWallsAndBG()
        this.lavaCheck()
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

    spawnFire(x, y) {
        // spawn a fire instance
        this.fireEffects.create(x, y, 'fire')
            .setOrigin(0.5, 1)
            .play('fire', true)
    }

    lavaCheck() {
        // check if the lava has reached the top of the screen
        if (this.lavaFiller.y <= this.cameras.main.midPoint.y - this.config.height / 2) {
            this.lava.setVelocityY(0)
            this.lavaMove = false
        }

        // remove all platforms that are under the lava
        this.platforms.getChildren().forEach(plat => {
            if (plat.y > this.lavaFiller.y) {
                plat.destroy()
            }
        })
    }
}

export default PlayScene