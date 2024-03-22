// phaser import
import Phaser from 'phaser'

// files containing other game scenes
import PlayScene from './scenes/playScene.js'
import MenuScene from './scenes/menuScene.js'
import PreloadScene from './scenes/preloadScene.js'
import PauseScene from './scenes/pauseScene.js'

// settings shared by all scenes
const SHARED_CONFIG = {
    width: 720,
    height: 1080,
}

// list of all game scene objects
const SCENES = [ PreloadScene, MenuScene, PlayScene, PauseScene ]

// make an instance of all game scenes
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => SCENES.map(createScene)

const config = {
    // renderer being used
    type: Phaser.AUTO,

    // game screen dimentions
    width: SHARED_CONFIG.width,
    height: SHARED_CONFIG.height,

    // contains settings for scaling the game (does not effect positioning
    // using width and height)
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: SHARED_CONFIG.width,
        height: SHARED_CONFIG.height
    },

    // physics settings
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    pixelArt: true, // unblurs pixel art

    // creates the scenes in phaser
    scene: initScenes()
}

new Phaser.Game(config)