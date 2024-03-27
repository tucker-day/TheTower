import FlyingEye from "../prefabs/flyingEye"
import Player from "../prefabs/player"
import BaseScene from "./baseScene"
import EventsCenter from "../scenes/eventsCenter";

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

        // object storage
        this.background = null
        this.player = null
        this.platforms = null
        this.walls = null
        this.lava = null
        this.lavaFiller = null
        this.lavaGradient = null
        this.fireEffects = null
        this.enemies = null
        this.enemiesHitboxes = null
        
        // settings
        this.platformYDistance = 112
        this.wallsRenderDepth = 11
        this.lavaRenderDepth = 10
        this.layerGapSize = 90

        this.lavaInitY = 300
        this.lavaSpeed = -10
        this.lavaMaxSpeed = -120
        this.lavaSpeedupInitDelay = 5000
        this.lavaSpeedupDelay = 500
        this.lavaGradientSizeFactor = 7
        this.gradualGold = 10

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
        
        // make the camera follow the player
        this.cameras.main.startFollow(this.player, false, 0, this.player.cameraFollowFactor, 0, this.player.cameraYOffset)
        
        this.createWalls()
        this.createFire()
        this.createLava()
        this.createPlatformsGroup()
        this.createEnemyGroup()
        this.createUi({
            gameZoom: this.uiConfig.gameZoom,
            maxHealth: this.player.maxHealth
        })

        // make the player collide with the enviroment
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.walls)

        // make enemies collide with the enviroment
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.collider(this.enemies, this.walls)

        this.initSpawnLayers()

        this.createLavaSpeedupEvents()
    }

    createLavaSpeedupEvents() {
        // delay the speedup start then start speeding up the lava
        this.lavaDelay = this.time.addEvent({
            delay: this.lavaSpeedupInitDelay,
            callbackScope: this,
            loop: false,
            callback: () => {
                this.lavaSpeedup = this.time.addEvent({
                    delay: this.lavaSpeedupDelay,
                    callbackScope: this,
                    loop: true,
                    callback: this.onLavaSpeedup
                })
            }
        })
    }

    onLavaSpeedup() {
        if (this.player.alive) {
            if (this.lavaSpeed > this.lavaMaxSpeed) {
                this.lavaSpeed--
                this.lavaGradient.setDisplaySize(this.lavaGradient.width, this.lavaSpeed * -this.lavaGradientSizeFactor)
            }
            this.player.changeGold(5)
        }
    }

    update() {
        this.player.update()
        this.recycleWallsAndBG()
        this.checkLayers()
        this.lavaCheck()
        this.enemies.getChildren().forEach(enemy => { enemy.update() })
        this.updateUiLavaDistance()
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

    createPlatformsGroup() {
        // create a group of platforms
        this.platforms = this.physics.add.group();

        this.platforms.create(this.screenCenter[0], this.screenCenter[1], 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)
    }

    spawnLayer(yPos) {
        // get the gap's position
        let leftPos = Phaser.Math.Between(this.gameBoundsX.min, this.gameBoundsX.max - this.layerGapSize)
        let rightPos = leftPos + this.layerGapSize

        // get platform width
        let platWidth = this.textures.get('platform').get(0).width

        // create the left platforms
        for (let i = leftPos; i > 0; i -= platWidth) {
            this.platforms.create(i, yPos, 'platform')
                .setImmovable(true)
                .setOrigin(1, 0)
        }

        // create the right platforms
        for (let i = rightPos; i < this.config.width; i += platWidth) {
            this.platforms.create(i, yPos, 'platform')
                .setImmovable(true)
                .setOrigin(0, 0)
        }

        // put an enemy at a random position
        let enemyPos = Phaser.Math.Between(this.gameBoundsX.min + 25, this.gameBoundsX.max - 25)
        this.createEnemy(new FlyingEye(enemyPos, yPos, this))
    }

    initSpawnLayers() {
        // spawn enough layers to get to the top of the screen
        let camTop = this.cameras.main.midPoint.y - this.config.height / 2

        while (this.getHighestLayer() > camTop) {
            this.spawnLayer(this.getHighestLayer() - this.platformYDistance)
        }
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
        this.lavaFiller.setScale(this.config.width / this.lavaFiller.width, this.config.height / this.lavaFiller.height + 5)

        // add the gradient but make it body tiny so it dosent hit the player
        this.lavaGradient = this.lava.create(this.lavaFiller.x, this.lavaFiller.y, 'gradient')
            .setOrigin(0, 1)
            .setBodySize(1, 1, false)
        this.lavaGradient.setDisplaySize(this.lavaGradient.width, this.lavaSpeed * -this.lavaGradientSizeFactor)

        // make the player die when touching lava
        this.physics.add.overlap(this.player, this.lava, this.player.hitLava, null, this.player)

        // change lava render depth
        this.lava.setDepth(this.lavaRenderDepth)

        // make the lava start moving
        this.lava.setVelocityY(this.lavaSpeed)
    }

    createFire() {
        // create a group of fire
        this.fireEffects = this.add.group();
    }

    createEnemyGroup() {
        // create a group for the enemies
        this.enemies = this.physics.add.group()

        // add a collider for the enemy getting hit
        this.physics.add.overlap(this.player.attackHitbox, this.enemies, (hitbox, enemy) => {
            enemy.gotHit(this.player.attack)
        }, null, this)

        // add a collider for the player getting hit
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            if (enemy.isAlive) {
                player.gotHit(enemy.attack)
            }
        }, null, this)

        // make enemies die when touching lava
        this.physics.add.overlap(this.lava, this.enemies,  (lava, enemy) => {
            enemy.hitLava()
        }, null, this)
    }

    createEnemy(enemy) {
        this.enemies.add(enemy)
        enemy.init()
    }

    createUi(config) {
         // start the game ui
         this.scene.launch('Ui', config)
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
            this.lavaFiller.y = this.cameras.main.midPoint.y - this.config.height / 2
        }

        // remove all platforms that are under the lava
        this.platforms.getChildren().forEach(plat => {
            if (plat.y > this.lavaFiller.y) {
                plat.destroy()
            }
        })

        // remove all flames that are under the lava
        this.fireEffects.getChildren().forEach(fire => {
            if (fire.y - fire.height > this.lavaFiller.y) {
                fire.destroy()
            }
        })

        // remove all enemies that are under the lava
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y - enemy.height > this.lavaFiller.y) {
                enemy.destroy()
            }
        })

        this.lava.setVelocityY(this.lavaSpeed)
    }

    getHighestLayer() {
        let high = 1000
        this.platforms.getChildren().forEach((plat) => {
            high = Math.min(high, plat.y)
        })
        return high
    }

    checkLayers() {
        let camTop = this.cameras.main.midPoint.y - this.config.height / 2
        if (this.getHighestLayer() > camTop) {
            this.spawnLayer(this.getHighestLayer() - this.platformYDistance)
        }
    }

    updateUiLavaDistance() {
        EventsCenter.emit('update-lavaDistance', this.lavaFiller.y - this.player.y)
    }
}

export default PlayScene