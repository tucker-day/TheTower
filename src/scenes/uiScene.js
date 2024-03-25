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
            {name: 'update-hearts', method: this.updateHearts}
        ]

        // ui config from init
        this.uiConfig = null

        // group for hearts
        this.hearts = null
        this.heartsPerRow = 10

        // gold icon and text
        this.goldIcon = null
        this.goldText = null

        // positioning vars
        this.cornerOffsetY = 32
        this.cornerOffsetX = 32
        this.goldTextOffsetX = 10
    }

    init(uiConfig) {
        // takes in config from start method in playScene
        this.uiConfig = uiConfig
    }

    create(){
        this.createEvents()
        this.createHearts()
    }

    createEvents() {
        // take in events
        this.eventRef.map((event) => {
            EventsCenter.on(event.name, event.method, this)
        })

        // clean up on scene shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.eventRef.map((event) => {
                EventsCenter.on(event.name, event.method, this)
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
        this.goldText = this.add.text(this.config.width - this.cornerOffsetX - this.goldIcon.width * this.uiConfig.gameZoom - this.goldTextOffsetX, this.cornerOffsetY, '0', 
            { fontSize: this.goldIcon.height * this.uiConfig.gameZoom, fill: '#fff', fontFamily: 'SilverFont' })
            .setOrigin(1, 0)
    }

    updateGold(gold) {
		this.goldText.text = `${gold}`
	}

    updateHearts(health) {
        for (let i = 0; i < this.uiConfig.maxHealth; i++) {
            let test = this.hearts.getChildren()[i].setFrame((i < health) ? 0 : 4)
        }
    }
}

export default UiScene