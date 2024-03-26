import Phaser from "phaser";
import EventsCenter from "../scenes/eventsCenter";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(x, y, scene) {
        super(scene, x, y, 'knight')
        
        // save a refrence to the parent scene
        this.scene = scene

        // add this object to the parent scene
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        // player config
        this.canFly = true
        this.gravity = 750
        this.movementSpeed = 200
        this.jumpPower = 450
        this.hitIFrameDuration = 1000
        
        // camera config
        this.cameraYOffset = 40
        this.cameraFollowFactor = 0.1

        // runtime variables
        this.facingLeft = false
        this.alive = true
        this.stunned = false
        this.attacking = false
        this.immortal = false

        this.gold = 0
        this.maxHealth = 3
        this.health = this.maxHealth
        this.attack = 1

        // attack hitbox
        this.attackHitbox = null
        this.attackRange = 50
        this.attackHeight = 45

        this.create()
        this.createControls()
    }

    create() {
        // set initial player facing
        this.setFlipX(this.facingLeft)

        // adjust the player's body
        this.setOrigin(0.5, 1)
        this.setBodySize(this.width - 100, this.height - 44, false)
        this.body.setOffset(50, 44)

        this.setBounce(0)
        this.body.setGravityY(this.gravity)

        // create the player attack hitbox
        this.attackHitbox = this.scene.add.rectangle(1000, 0, this.attackRange, this.attackHeight)
            .setVisible(false)
            .setOrigin(0, 1)
        
        // make the hitbox a physics object
        this.scene.physics.add.existing(this.attackHitbox)

        // create on animation end events
        this.on('animationcomplete-p_death', this.gameOver, this)
        this.on('animationcomplete-p_attack', this.attackDone, this)
        this.on('animationcomplete-p_hit', this.endHit, this)

        this.play('p_idle')
    }

    gameOver() {
        // dosen't do anything currently. will eventually create a menu
    }

    attackDone() {
        // set player attacking to false
        this.attacking = false

        this.attackHitbox.setPosition(1000, 0)

        // emit an event to let enemies get damaged again
        EventsCenter.emit('attack-done')
    }

    endHit() {
        this.stunned = false;
    }

    createControls() {
        // create a bunch of keys
        this.scene.key = this.scene.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,X');

        // create on press events
        this.scene.key.UP.on('down', this.jump, this)
        this.scene.key.Z.on('down', this.jump, this)

        this.scene.key.DOWN.on('down', this.quickDecend, this)
        this.scene.key.X.on('down', this.startAttack, this)
    }

    jump() {
        if ((this.body.touching.down || this.canFly) && !this.attacking && !this.stunned) {
            this.setVelocityY(-this.jumpPower);
        }
    }

    quickDecend() {
        if (this.jumpPower > this.body.velocity.y && !this.attacking) {
            this.setVelocityY(this.jumpPower);
        }
    }

    startAttack() {
        // make sure not already attacking or stunned
        if (!this.attacking && !this.stunned)
        {
            this.attacking = true
            this.play('p_attack', true)
            this.setVelocityX(0)
            this.attackHitbox.setPosition((this.facingLeft) ? this.x - this.attackHitbox.width: this.x, this.y)
        }
    }

    // contains all while down player controls
    control() {
        // check if the player is alive, not attacking and not stunned
        if (this.alive && !this.attacking)
        {
            // prevent moving when both left and right are down
            if (this.scene.key.RIGHT.isDown === this.scene.key.LEFT.isDown) {
                this.setVelocityX(0)
            }

            // to prevent a phaser bug with the player jumping off walls, check if the player 
            // is against the game bounds before seting velocity. this isn't necessary for
            // platforms as the bug dosen't happen with them

            // move right
            else if (this.scene.key.RIGHT.isDown) {
                if (this.x + this.body.width / 2 < this.scene.gameBoundsX.max) {
                    this.setVelocityX(this.movementSpeed)
                    this.facingLeft = false;
                }
            }

            // move left
            else if (this.scene.key.LEFT.isDown) {
                if (this.x - this.body.width / 2 > this.scene.gameBoundsX.min) {
                    this.setVelocityX(-this.movementSpeed)
                    this.facingLeft = true;
                }
            } 

            // no left right input
            else {
                this.setVelocityX(0)
            }
        }
    }

    updateAnim() {
        if (this.alive && !this.attacking && !this.stunned)
        {
            // set player face based on bool
            this.setFlipX(this.facingLeft)

            let yVel = this.body.velocity.y
            let xVel = this.body.velocity.x
            let onGround = this.body.touching.down

            // check player
            // check if moving on ground with input
            if (xVel != 0 && onGround && (this.scene.key.RIGHT.isDown || this.scene.key.LEFT.isDown)) {
                this.play('p_walk', true)
            }
            // jumping
            else if (yVel < 0 && !onGround) {
                this.play('p_jump', true)
            }
            // falling
            else if (yVel > 0 && !onGround) {
                this.play('p_fall', true)
            }
            // else play idle
            else {
                this.play('p_idle', true)
            }
        }
    }

    die() {
        // check if the player is already dead
        if (this.alive) {
            // remove listeners for key inputs
            this.scene.key.UP.off('down')
            this.scene.key.DOWN.off('down')
            this.scene.key.Z.off('down')
            this.scene.key.X.off('down')

            // set player dead
            this.alive = false

            // set x velocity to 0
            this.setVelocityX(0)

            // play death animation
            this.play('p_death', true)
        }
    }

    hitLava() {
        this.setGravityY(0)
        this.setVelocityY(0)
        this.body.setEnable(false)
        this.scene.spawnFire(this.x, this.body.bottom)
        this.changeHealth(-this.maxHealth)
        this.die()
    }

    changeGold(change) {
        if (this.gold + change > 0) {
            this.gold += change
            EventsCenter.emit('update-gold', this.gold)
            return true
        } 
        else {
            return false
        }
    }

    changeHealth(change) {
        this.health += change

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth
        }
        else if (this.health <= 0) {
            this.health = 0
        }

        EventsCenter.emit('update-hearts', this.health)
    }

    update() {
        this.control()
        this.updateAnim()
    }

    gotHit(damage) {
        if (!this.immortal && this.alive) {
            this.changeHealth(-damage)
            if (this.health <= 0) {
                this.die()
            } else {
                this.play('p_hit')
                this.stunned = true
                this.getIFrames()
            }
        }
    }

    getIFrames() {
        this.immortal = true
        this.scene.timedEvent = this.scene.time.addEvent({
            delay: this.hitIFrameDuration,
            callback: this.endIFrames,
            callbackScope: this,
            loop: false
        })
    }

    endIFrames() {
        this.immortal = false
        this.scene.timedEvent.remove()
    }
}

export default Player