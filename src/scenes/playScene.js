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

        // game background
        this.background = null

        // player
        this.player = null
        
        this.playerCanFly = false
        this.cameraPlayerYOffset = 40
        this.playerGravity = 750
        this.playerMovementSpeed = 200
        this.playerJumpPower = 450 

        this.playerFacingLeft = false
        this.playerAlive = true
        this.playerAttacking = false

        // player attack hitbox
        this.playerAttackHitbox = null

        this.playerAttackRange = 60

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
        this.lavaInitSpeed = -10
        this.lavaRenderDepth = 10

        this.lavaMove = true

        // fire effects
        this.fireEffects = null

        // game boundries
        this.gameBoundsX = {
            min: 16,
            max: this.config.width -  16
        }
    }

    create() {
        this.createBG()
        this.createPlatforms()
        this.createWalls()
        this.createPlayer()
        this.createFire()
        this.createLava()
        this.createControls()

        // make the player collide with the enviroment
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.walls)

        // make the camera follow the player
        this.cameras.main.startFollow(this.player, false, 0, 1, 0, this.cameraPlayerYOffset)

        // start the game ui
        this.scene.launch('Ui')
    }

    createBG() {
        // create a group of background sprites
        this.background = this.add.group()

        // create the first
        this.background.create(this.screenCenter[0], 0, 'brickBG')

        // fill group until screen is filled
        do {
            this.background.create(this.background.getLast(true).x, this.background.getLast(true).y + this.background.getLast(true).height, 'brickBG')
        } while (this.background.getLast(true).y < this.cameras.main.y + this.config.height)
    }

    createPlayer() {
        // create the player object
        this.player = this.physics.add.sprite(...this.screenCenter, 'knight')
            .setOrigin(0.5, 1)

        // set inital player facing direction
        this.player.setFlipX(this.playerFacingLeft)

        // setup player body
        this.player.setBodySize(this.player.width - 101, this.player.height - 44, false)
        this.player.body.setOffset(50, 44)

        // assorted other variables to be set
        this.player.setBounce(0)
        this.player.body.setGravityY(this.playerGravity)

        // create the player attack hitbox
        // set scale seems to f everyting up for some reason so these values make no sence but trust me it works lol
        this.playerAttackHitbox = this.physics.add.image(1000, 0)
        this.playerAttackHitbox.setSize(this.playerAttackRange, this.player.height - 35)
        this.playerAttackHitbox.setOrigin(-0.1, 1.2)

        // add on animation end events
        this.player.on('animationcomplete-p_death', this.gameOver, this)
        this.player.on('animationcomplete-p_attack', this.playerAttackDone, this)

        this.player.play('p_idle')
    }

    gameOver() {
        // dosen't do anything currently. will eventually create a menu
    }

    playerAttackDone() {
        // set player attacking to false
        this.playerAttacking = false

        this.playerAttackHitbox.setPosition(1000, 0)
    }

    createWalls() {
        // create a group of wall sprites
        this.walls = this.physics.add.group()

        // there is no setImmovable for all in a group so it has to be set everytime
        // a wall is created

        // create the first two walls
        this.walls.create(0, 0, 'wall')
            .setImmovable(true)

        this.walls.create(this.config.width, 0, 'wall')
            .setImmovable(true)
            .setFlipX(true)

        // fill group until screen is filled
        while (this.walls.getLast(true).y < this.config.height) {
            this.walls.create(0, this.walls.getLast(true).y + this.walls.getLast(true).height, 'wall')
                .setImmovable(true)
        
            this.walls.create(this.config.width, this.walls.getLast(true).y, 'wall')
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

        this.platforms.create(this.screenCenter[0], this.screenCenter[1] - 2 * this.platformYDistance, 'platform')
            .setImmovable(true)
            .setOrigin(0.5, 0)
    }

    createLava() {
        // create a group for lava objects
        this.lava = this.physics.add.group();

        // create the first lava object
        let instance = this.lava.create(0, this.lavaInitY, 'lava')
            .setImmovable(true)
            .setOrigin(0, 0)
            .play('lava')

        instance.setBodySize(instance.width, instance.height * 0.6)
        instance.setOffset(0, instance.height * 0.4)

        debugger

        // create the lava objects
        while (this.lava.getLast(true).x + this.lava.getLast(true).width < this.config.width) {
            let instance = this.lava.create(this.lava.getLast(true).x + this.lava.getLast(true).width, this.lavaInitY, 'lava')
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
        this.physics.add.collider(this.player, this.lava, this.hitLava, null, this)

        // change lava render depth
        this.lava.setDepth(this.lavaRenderDepth)

        // make the lava start moving
        this.lava.setVelocityY(this.lavaInitSpeed)
    }

    createFire() {
        // create a group of fire
        this.fireEffects = this.add.group();
    }

    createControls() {
        // create a bunch of keys
        this.key = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,X');

        // create on press events
        this.key.UP.on('down', this.playerJump, this)
        this.key.Z.on('down', this.playerJump, this)

        this.key.DOWN.on('down', this.playerQuickDecend, this)
        this.key.X.on('down', this.startPlayerAttack, this)
    }

    playerJump() {
        if ((this.player.body.touching.down || this.playerCanFly) && !this.playerAttacking) {
            this.player.setVelocityY(-this.playerJumpPower);
        }
    }

    playerQuickDecend() {
        if (this.playerJumpPower > this.player.body.velocity.y && !this.playerAttacking) {
            this.player.setVelocityY(this.playerJumpPower);
        }
    }

    startPlayerAttack() {
        // make sure not already attacking
        if (!this.playerAttacking)
        {
            this.playerAttacking = true
            this.player.play('p_attack', true)
            this.player.setVelocityX(0)
            
            this.playerAttackHitbox.setPosition((this.playerFacingLeft) ? this.player.x - this.playerAttackHitbox.width - 8: this.player.x, this.player.y)
        }
    }

    update() {
        this.controlPlayer()
        this.updatePlayerAnim()
        this.recycleWallsAndBG()
        this.lavaCheck()
    }

    // contains all while down player controls
    controlPlayer() {
        // check if the player is alive and not attacking
        if (this.playerAlive && !this.playerAttacking)
        {
            // prevent moving when both left and right are down
            if (this.key.RIGHT.isDown === this.key.LEFT.isDown) {
                this.player.setVelocityX(0)
            }

            // to prevent a phaser bug with the player jumping off walls, check if the player 
            // is against the game bounds before seting velocity. this isn't necessary for
            // platforms as the bug dosen't happen with them

            // move right
            else if (this.key.RIGHT.isDown) {
                if (this.player.x + this.player.width / 2 < this.gameBoundsX.max) {
                    this.player.setVelocityX(this.playerMovementSpeed)
                    this.playerFacingLeft = false;
                }
            }

            // move left
            else if (this.key.LEFT.isDown) {
                if (this.player.x - this.player.width / 2 > this.gameBoundsX.min) {
                    this.player.setVelocityX(-this.playerMovementSpeed)
                    this.playerFacingLeft = true;
                }
            } 

            // no left right input
            else {
                this.player.setVelocityX(0)
            }
        }
    }

    updatePlayerAnim() {
        if (this.playerAlive && !this.playerAttacking)
        {
            // set player face based on bool
            this.player.setFlipX(this.playerFacingLeft)

            let yVel = this.player.body.velocity.y
            let xVel = this.player.body.velocity.x
            let onGround = this.player.body.touching.down

            // check player
            // check if moving on ground with input
            if (xVel != 0 && onGround && (this.key.RIGHT.isDown || this.key.LEFT.isDown)) {
                this.player.play('p_walk', true)
            }
            // jumping
            else if (yVel < 0 && !onGround) {
                this.player.play('p_jump', true)
            }
            // falling
            else if (yVel > 0 && !onGround) {
                this.player.play('p_fall', true)
            }
            // else play idle
            else {
                this.player.play('p_idle', true)
            }
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

    playerDie() {
        // check if the player is already dead
        if (this.playerAlive) {
            // remove listeners for key inputs
            this.key.UP.off('down')
            this.key.DOWN.off('down')
            this.key.Z.off('down')
            this.key.X.off('down')

            // set player dead
            this.playerAlive = false

            // set x velocity to 0
            this.player.setVelocityX(0)

            // play death animation
            this.player.play('p_death', true)
        }
    }

    hitLava() {
        this.player.setGravityY(0)
        this.player.setVelocityY(0)
        this.player.body.setEnable(false)
        this.spawnFire(this.player.x, this.player.y)
        this.playerDie()
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