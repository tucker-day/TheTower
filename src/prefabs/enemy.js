import Phaser from "phaser";
import EventsCenter from "../scenes/eventsCenter";

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

        this.health = 1
        this.attack = 1
        this.gold = 1
        this.lavaKills = true

        this.inIFrames = false
        this.isAlive = true
        this.rewardGold = true
        this.stunned = false

        // get an event that ends iframes when the player attack is done
        EventsCenter.on('attack-done', this.endIFrames, this)
    }

    // for some god forsaken reason, when a game object is added to a group some values 
    // such as velocity are overridden. this function is called imediatly after an enemy 
    // is added to the enemies group to circumvent this "feature" of phaser
    init() {}

    // When inheriting, these functions should be overridden and used for enemy behavior
    onDamaged() {}
    onDie() {}
    update() {}

    gotHit(num) {
        if (this.isAlive && !this.inIFrames) {
            this.health -= num
            if (this.health > 0) {
                this.startIFrames()
                this.onDamaged()
            } else {
                this.die()
            }
        }
    }

    hitLava() {
        if (this.lavaKills) {
            this.rewardGold = false
            this.setVelocityX(0)
            this.setVelocityY(0)
            this.body.setEnable(false)
            this.scene.spawnFire(this.x, this.body.bottom)
            if (this.isAlive) {
                this.die()
            }
        }
    }

    giveGoldReward() {
        // only gives reward if killed by player
        if (this.rewardGold) {
            this.scene.player.changeGold(this.gold)
        }
    }

    startIFrames() {
        this.inIFrames = true
    }

    endIFrames() {
        this.inIFrames = false
    }

    die() {
        this.isAlive = false
        this.giveGoldReward()
        this.onDie()
    }
}

export default Enemy