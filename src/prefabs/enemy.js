class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(x, y, sprite, scene) {
        super(scene, x, y, sprite)

        // save a refrence to the parent scene
        this.scene = scene

        // add this object to the parent scene
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setOrigin(0.5, 1)
        this.setBounce(0)

        this.health = 0
        this.attack = 0
        this.isAlive = true
    }

    gotHit(num) {
        if (this.isAlive) {
            this.damaged()
        }
    }

    // this fuction should be overriden when inherited
    damaged() {
        this.isAlive = false
        this.destroy()
    }
}

export default Enemy