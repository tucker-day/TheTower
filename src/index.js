// phaser import
import Phaser from 'phaser'

// files containing other game scenes
import PlayScene from './scenes/playScene.js'
import MenuScene from './scenes/menuScene.js'
import PreloadScene from './scenes/preloadScene.js'
import PauseScene from './scenes/pauseScene.js'
import UiScene from './scenes/uiScene.js'

// settings shared by all scenes
const SHARED_CONFIG = {
    width: 1000,
    height: 1000
}

// list of all game scene objects
const SCENES = [ PreloadScene, MenuScene, PlayScene, PauseScene, UiScene ]

// make an instance of all game scenes
const initScenes = () => SCENES.map(Scene => new Scene(SHARED_CONFIG))

const baseGameConfig = {
    // renderer being used
    type: Phaser.AUTO,

    width: SHARED_CONFIG.width,
    height: SHARED_CONFIG.height,

    // contains settings for scaling the game
    scale: {
        parent: 'gameContainer', // id of parent for the game canvas
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    // physics settings
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    // limit game fps (fixes some visual issues when moving the camera)
    fps: {
        target: 60,
        forceSetTimeOut: true
      },

    pixelArt: true, // unblurs pixel art

    // creates the scenes in phaser
    scene: initScenes()
}

new Phaser.Game(baseGameConfig)