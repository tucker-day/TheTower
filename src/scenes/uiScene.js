import Player from "../prefabs/player";
import BaseScene from "./baseScene";
import EventsCenter from "./eventsCenter";

class UiScene extends BaseScene {
    constructor(sharedConfig) {
        const passConfig = {
            key: 'Ui',

            width: sharedConfig.width,
            height: sharedConfig.height
        }
        super(passConfig);

        // array of all events
        this.eventRef = [
            {name: 'update-gold', method: this.updateGold},
            {name: 'update-hearts', method: this.updateHearts},
            {name: 'update-lavaDistance', method: this.updateLavaDistance},
            {name: 'gameOver', method: this.gameOver}
        ]

        // ui config from init
        this.uiConfig = null
        this.parentScene = null

        // positioning vars
        this.cornerOffsetY = 32
        this.cornerOffsetX = 32
        this.goldTextOffsetX = 10
        this.heartsPerRow = 10

        this.lavaShowDistance = 250
    }

    init(uiConfig) {
        // takes in config from start method in playScene
        this.uiConfig = uiConfig
        this.parentScene = uiConfig.parentScene

         // group for hearts
         this.hearts = null
 
         // gold icon and text
         this.goldIcon = null
         this.goldText = null
    }

    create(){
        this.createEvents()
        this.createHearts()
        this.createLavaDistance()
        this.createStartTimer()
    }

    createEvents() {
        // take in events
        this.eventRef.map((event) => {
            EventsCenter.on(event.name, event.method, this)
        })

        // clean up on scene shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.eventRef.map((event) => {
                EventsCenter.off(event.name, event.method, this)
            })
        })
    }

    createHearts() {
        // create the correct amount of hearts
        this.hearts = this.add.group()

        // get the width and height of the texture and multiply by game zoom
        let width = this.textures.get('hearts').get(0).width * this.uiConfig.gameZoom
        let height = this.textures.get('hearts').get(0).height * this.uiConfig.gameZoom
        
        // create all the hearts and scale it up to the correct size
        for (let i = 0; i < this.uiConfig.maxHealth; i++) {
            let row = Math.floor(i / this.heartsPerRow)
            this.hearts.create(this.cornerOffsetX + (i - this.heartsPerRow * row) * width, this.cornerOffsetY + row * height, 'hearts', 0)
                .setOrigin(0, 0)
                .setScale(this.uiConfig.gameZoom)
        }

        // create the icon for gold
        this.goldIcon = this.add.image(this.config.width - this.cornerOffsetX, this.cornerOffsetY, 'goldPile')
            .setOrigin(1, 0)
            .setScale(this.uiConfig.gameZoom)
        
        // create gold text
        this.goldText = this.add.text(this.config.width - this.cornerOffsetX - this.goldIcon.width * this.uiConfig.gameZoom - this.goldTextOffsetX, this.cornerOffsetY, '0', this.defaultFont(this.goldIcon.height * this.uiConfig.gameZoom))
            .setOrigin(1, 0)
    }

    createLavaDistance() {
        this.lavaText = this.add.text(this.config.width / 2, this.config.height - 100, '0', this.defaultFont(this.goldIcon.height * this.uiConfig.gameZoom))
            .setOrigin(0.5, 0)
            .setVisible(false)
    }

    createStartTimer() {
        let time = 3
        let timerText = this.add.text(...this.screenCenter, `${time}`, this.defaultFont(250))
            .setOrigin(0.5, 0.5)

        this.lavaSpeedup = this.time.addEvent({
            delay: 1000,
            repeat: time,
            callbackScope: this,
            loop: true,
            callback: () => {
                time--
                timerText.text = `${time}`
                if (time === 0) {
                    this.parentScene.scene.resume()
                    timerText.setVisible(false)
                }
            }
        })
    }

    updateGold(gold) {
		this.goldText.text = `${gold}`
	}

    updateHearts(health) {
        for (let i = 0; i < this.uiConfig.maxHealth; i++) {
            this.hearts.getChildren()[i].setFrame((i < health) ? 0 : 4)
        }
    }

    updateLavaDistance(distance) {
        distance = Math.floor(distance)
        if (distance > this.lavaShowDistance) {
            this.lavaText.setVisible(true)
            this.lavaText.text = `${distance}`
        } else {
            this.lavaText.setVisible(false)
        }
    }

    gameOver(gold) {
        this.add.text(this.config.width / 2, this.config.height / 2, 'GAME OVER', this.defaultFont(100))
            .setOrigin(0.5, 1)
        
        this.add.text(this.config.width / 2, this.config.height / 2 + 75, `Your gold: ${gold}`, this.defaultFont(60))
            .setOrigin(0.5, 1)

        this.add.text(this.config.width / 2, this.config.height / 2 + 300, 'Press Z to restart', this.defaultFont(50))
            .setOrigin(0.5, 1)
        this.add.text(this.config.width / 2, this.config.height / 2 + 350, 'Press X return to main menu', this.defaultFont(50))
            .setOrigin(0.5, 1)

        this.input.keyboard.on('keydown-Z', () => {
            this.parentScene.scene.restart('Play')
            this.scene.stop('Ui')
        })
        
        this.input.keyboard.on('keydown-X', () => {
            this.parentScene.scene.stop('Play')
            this.scene.start('Menu')
        })
    }
}

export default UiScene