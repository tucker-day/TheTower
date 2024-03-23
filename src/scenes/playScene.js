import BaseScene from "./baseScene"

class PlayScene extends BaseScene {
    constructor(config) {
        super('Play', config)

        this.player = null

        this.playerFacingLeft = false
        this.cameraPlayerYOffset = 50
        this.playerGravity = 500
        this.playerMovementSpeed = 150
        this.playerJumpPower = 300

        this.platforms = null

        this.cameraTarget = null
    }

    create() {
        this.add.image(...this.screenCenter, 'default').setOrigin(0.5)

        this.createPlayer()
        this.createPlatforms()
        this.createControls()

        // make the player collide with platforms
        this.physics.add.collider(this.player, this.platforms)

        this.cameras.main.startFollow(this.player, false, 0, 1, 0, this.cameraPlayerYOffset)
    }

    createPlayer() {
        // create the player object
        this.player = this.physics.add.sprite(...this.screenCenter, 'knight')
            .setOrigin(0.5, 1)

        // set inital player facing direction
        this.player.setFlipX(this.playerFacingLeft)

        // setup player body
        this.player.setBodySize(this.player.width - 104, this.player.height - 44, false)
        this.player.body.setOffset(52, 44)

        // assorted other variables to be set
        this.player.setBounce(0)
        this.player.body.setGravityY(this.playerGravity)

        this.player.play('p_idle')
    }

    createPlatforms() {
        // create a group of platforms
        this.platforms = this.physics.add.group();

        // create just 1 platform temporarily
        const plat = this.platforms.create(this.screenCenter[0], this.screenCenter[1] + 100, 'platform')
                .setImmovable(true)
                .setOrigin(0.5, 1)
    }

    createControls() {
        // create a bunch of keys
        this.key = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,X');
    }

    update() {
        this.controlPlayer()
        this.updatePlayerAnim()
    }

    controlPlayer() {
        // CONTROL SCHEME
        // Left and Right Arrows for Movement
        // Up OR Z to jump
        // Down to quick desend
        
        // jump
        if ((this.key.Z.isDown || this.key.UP.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-this.playerJumpPower);
        }
        // quick desend
        else if (this.key.DOWN.isDown && this.playerJumpPower > this.player.body.velocity.y) {
            this.player.setVelocityY(this.playerJumpPower);
        }
        // prevent moving when both left and right are down
        else if (this.key.RIGHT.isDown === this.key.LEFT.isDown) {
            this.player.setVelocityX(0)
        }
        // move right
        else if (this.key.RIGHT.isDown) {
            this.player.setVelocityX(this.playerMovementSpeed)
        }
        // move left
        else if (this.key.LEFT.isDown) {
            this.player.setVelocityX(-this.playerMovementSpeed)
        } 
        // no left right input
        else {
            this.player.setVelocityX(0)
        }
    }

    // set sprite flipped based on boolian
    updatePlayerAnim() {
        // prevent updating when both left and right down
        if (this.key.RIGHT.isDown != this.key.LEFT.isDown){
            // update which direction the player is looking
            if (this.key.RIGHT.isDown) {
                this.playerFacingLeft = false;
            }
            else if (this.key.LEFT.isDown) {
                this.playerFacingLeft = true;
            }
        }

        this.player.setFlipX(this.playerFacingLeft)

        let yVel = this.player.body.velocity.y
        let xVel = this.player.body.velocity.x
        let onGround = this.player.body.touching.down

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

export default PlayScene