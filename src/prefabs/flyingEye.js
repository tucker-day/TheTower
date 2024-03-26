import Enemy from "./enemy"

class FlyingEye extends Enemy {
    constructor(x, y, scene) {
        super(x, y, 'flyingEye', scene)

        this.health = 3
        this.attack = 1
        this.gold = 5

        this.movement = 40

        // adjust body width on death to prevent make it look better
        this.deathBodyWidth = 10

        // start playing the animations
        this.play('flyEye_fly')

        this.on('animationcomplete-flyEye_hit', this.hitAnimEnd, this)
        this.on('animationcomplete-flyEye_die', () => { this.fallCheck =  true }, this)

        // set the correct hitbox size
        this.body.setSize(25, 20)
    }

    init() {
        this.setBounce(1, 0)
        this.setVelocityX((Phaser.Math.Between(0, 1)) ? this.movement : -this.movement)
    }

    onDamaged() {
        this.play('flyEye_hit')
        this.setVelocityX(0)
        this.stunned = true
    }

    hitAnimEnd() {
        this.setVelocityX((this.flipX) ? -this.movement : this.movement)
        this.stunned = false
    }

    onDie() {
        // reset body height to prevent anim from clipping through floor
        this.body.setSize(this.deathBodyWidth, this.height)
        this.setGravityY(this.scene.player.gravity)
        this.play('flyEye_die')
        this.setVelocityX(0)
    }

    dieAnimFallingCheck() {
        // finish the death animation only if on the ground
        if (this.fallCheck && this.body.touching.down) {
            this.play('flyEye_dead', true)
            this.fallCheck = false
        }
    }

    update() {
        this.animUpdate()
        this.dieAnimFallingCheck()
    }

    animUpdate() {
        if (!this.stunned && this.isAlive) {
            this.play('flyEye_fly', true)
        }

        // flip sprite for movement direction
        if (this.body.velocity.x > 0) {
            this.setFlipX(false)
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true)
        }
    }
}

export default FlyingEye