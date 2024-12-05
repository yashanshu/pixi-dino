import {googlyFrames} from '../assets/loader';
import * as PIXI from 'pixi.js';

interface GooglyFrames {
    nE: string;
    sW: string;
    nW: string;
    o:  string;
    sE:  string;
}

// Prepare frames
const eyes: GooglyFrames = googlyFrames;

const centerFrame: keyof GooglyFrames = 'o';

export class GameApp {

    private app: PIXI.Application;
    private leftEye: PIXI.Sprite;
    private rightEye: PIXI.Sprite;

    constructor(parent: HTMLElement, width: number, height: number) {

        this.app = new PIXI.Application({width, height, backgroundColor : 0x000000});
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        // init Pixi loader
        let loader = new PIXI.Loader();

        // Add user player assets
        console.log('Player to load', eyes);
        Object.keys(eyes).forEach(key => {
            console.log(`adding with key: ${key} to the loader ${eyes[key]}`);
            loader.add(eyes[key]);
        });

        // Load assets
        loader.load(this.onAssetsLoaded.bind(this));
    }

    private onAssetsLoaded() {
        this.leftEye = new PIXI.Sprite(PIXI.Texture.from(eyes[centerFrame]));
        this.leftEye.x = 275;
        this.leftEye.y = 450;
        this.leftEye['vx'] = 1;
        this.leftEye.anchor.set(0.5, 0.5);

        this.rightEye = new PIXI.Sprite(PIXI.Texture.from(eyes[centerFrame]));
        this.rightEye.x = 675;
        this.rightEye.y = 450;
        this.rightEye['vx'] = 1;
        this.rightEye.anchor.set(0.5, 0.5);

        this.app.stage.addChild(this.leftEye);
        this.app.stage.addChild(this.rightEye);
        // Start the game loop
        this.startGameLoop();
    }

    private startGameLoop() {
        this.app.ticker.add(this.update.bind(this));
    }

    private update(delta: number) {
        // Get mouse position
        const mousePos = this.app.renderer.plugins.interaction.mouse.global;

        // Update the position of the eyes based on mouse position
        this.updateEyePosition(this.leftEye, mousePos.x, mousePos.y);
        this.updateEyePosition(this.rightEye, mousePos.x, mousePos.y);
    }

    private updateEyePosition(eye: PIXI.Sprite, mouseX: number, mouseY: number) {
        // Define the max distance the "pupil" can move from the eye's center
        const maxMoveDistance = 20; // Adjust this value to control eye movement range

        // Calculate the distance and angle to the mouse
        const dx = mouseX - eye.x;
        const dy = mouseY - eye.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Limit the eye movement to a circular area
        const clampedDistance = Math.min(distance, maxMoveDistance);
        
        // Determine the texture based on the angle
        if (angle < -Math.PI / 4) {
            // Looking left
            eye.texture = PIXI.Texture.from(eyes['nW']);
        } else if (angle > Math.PI / 4) {
            // Looking right
            eye.texture = PIXI.Texture.from(eyes['nE']);
        } else if (angle > 0) {
            // Looking down-right
            eye.texture = PIXI.Texture.from(eyes['sE']);
        } else {
            // Looking down-left
            eye.texture = PIXI.Texture.from(eyes['sW']);
        }
    }

}

