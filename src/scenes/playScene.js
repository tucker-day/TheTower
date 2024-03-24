import BaseScene from "./baseScene"

class PlayScene extends BaseScene {
    constructor(sharedConfig) {
        const gameSize = 400

        const config = {
            key: 'Play',

            width: gameSize,
            height: gameSize,
            
            cameras: {
                zoom: sharedConfig.width / gameSize
            }
        }
        super(config)

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

        // platforms
        this.platforms = null
        this.platformYDistance = 112

        // walls
        this.walls = null
    }

    create() {
        this.createBG()
        this.createPlayer()
        this.createPlatforms()
        this.createWalls()
        this.createControls()

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

        this.player.play('p_idle')
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
        do {
            this.walls.create(0, this.walls.getLast(true).y + this.walls.getLast(true).height, 'wall')
                .setImmovable(true)
        
            this.walls.create(this.config.width, this.walls.getLast(true).y, 'wall')
                .setImmovable(true)
                .setFlipX(true)
        } while (this.walls.getLast(true).y < this.cameras.main.midPoint.y + this.config.height / 2)

        // make the player collide with walls
        this.physics.add.collider(this.player, this.walls)
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


        // make the player collide with platforms
        this.physics.add.collider(this.player, this.platforms)
    }

    createControls() {
        // create a bunch of keys
        this.key = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,X');

        // create on press events
        this.key.UP.on('down', this.playerJump, this)
        this.key.Z.on('down', this.playerJump, this)

        this.key.DOWN.on('down', this.playerQuickDecend, this)
    }

    playerJump() {
        if (this.player.body.touching.down || this.playerCanFly) {
            this.player.setVelocityY(-this.playerJumpPower);
        }
    }

    playerQuickDecend() {
        if (this.playerJumpPower > this.player.body.velocity.y) {
            this.player.setVelocityY(this.playerJumpPower);
        }
    }

    update() {
        this.controlPlayer()
        this.updatePlayerAnim()
        this.recycleWallsAndBG()
    }

    // contains all while down player controls
    controlPlayer() {
        // check if the player is alive
        if (this.playerAlive)
        {
            // prevent moving when both left and right are down
            if (this.key.RIGHT.isDown === this.key.LEFT.isDown) {
                this.player.setVelocityX(0)
            }

            // move right
            else if (this.key.RIGHT.isDown) {
                this.player.setVelocityX(this.playerMovementSpeed)
                this.playerFacingLeft = false;
            }

            // move left
            else if (this.key.LEFT.isDown) {
                this.player.setVelocityX(-this.playerMovementSpeed)
                this.playerFacingLeft = true;
            } 

            // no left right input
            else {
                this.player.setVelocityX(0)
            }

            // KILL YOURSELF *thunder*
            if (this.key.X.isDown) {
                this.playerDie()
            } 
        }
    }

    updatePlayerAnim() {
        if (this.playerAlive)
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

    playerDie(lavaDeath = false) {
        // set player dead
        this.playerAlive = false

        // set x velocity to 0
        this.player.setVelocityX(0)

        // remove listeners for key inputs
        this.key.UP.off('down')
        this.key.DOWN.off('down')
        this.key.Z.off('down')

        // play death animation
        if (lavaDeath) {
            this.player.play('p_lavaDeath', true)
        } else {
            this.player.play('p_death', true)
        }
    }
}

export default PlayScene