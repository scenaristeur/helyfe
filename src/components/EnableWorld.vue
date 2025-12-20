<template>
    <div id="enable3d-container"></div>
</template>
<script>

//inspiration : https://github.com/enable3d/enable3d-website/blob/master/src/examples/medieval-fantasy-book-standalone.html


// import the UMD bundle enable3d.framework.min.js
// or from npm enable3d
import { Project, Scene3D, PhysicsLoader } from 'enable3d'
import {
    // Project,
    // PhysicsLoader,
    // Scene3D,
    ExtendedObject3D,
    THREE,
    JoyStick,
    // ThirdPersonControls,
    // PointerLock,
    // PointerDrag,
    ExtendedMesh,
    FLAT
} from 'enable3d'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()


import { Man } from './man.js'
import { Day } from './day.js'

/**
* Is touch device?
*/
const isTouchDevice = 'ontouchstart' in window

class MainScene extends Scene3D {
    constructor() {
        super('MainScene')
        let scene = this
        // this.base_url = process.env.BASE_URL
    }

    async init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.canJump = true
        this.move = false

        this.moveTop = 0
        this.moveRight = 0
    }

    async preload() {
        // preload your assets here
        await this.loadDayView(this)

    }

    async create() {
        let warp
        // set up scene (light, ground, grid, sky, orbitControls)
        warp = await this.warpSpeed(/*'-orbitControls'*/)

        // Initialize the flat elements
        // this.ui = FLAT.init(this.renderer)
        // const orbitControls = warp.orbitControls
        // // Use this if you need events on the 2D elements.
        // // If you are using orbitControls, pass it to initEvents().
        // // This makes sure orbitControls is not messing with the mouse move.
        // FLAT.initEvents({ canvas: this.renderer.domElement, orbitControls })

        // // Call Flat.destroy() on scene restart or stop
        // // or simply add FLAT to the deconstructor
        // this.deconstructor.add(FLAT /* same effect as FLAT.destroy */, orbitControls)

        // enable physics debug
        // this.physics.debug.enable()

        // position camera
        this.camera.position.set(10, 10, 20)

        // blue box (without physics)
        this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } })

        // pink box (with physics)
        this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } })

        // Ajout du personnage
        // this.man = new Man();
        // await this.man.loadModel(this);

        this.details = {}
        this.details.type = "calendar"
        let date = new Date()
        this.details.date = date

        let man = new Man(this)
        man.add()

        /**
  * Add Keys
  */
        this.keys = {
            w: { isDown: false },
            a: { isDown: false },
            s: { isDown: false },
            d: { isDown: false },
            n: { isDown: false }, // goToNow()
            space: { isDown: false }
        }

        const press = (e, isDown) => {
            e.preventDefault()
            const { keyCode } = e
            switch (keyCode) {
                case 87: // w
                    this.keys.w.isDown = isDown
                    break
                case 38: // arrow up
                    this.keys.w.isDown = isDown
                    break
                case 32: // space
                    this.keys.space.isDown = isDown
                    break
                case 78: // n to see now pointer
                    this.keys.n.isDown = isDown
                    break
                // default:
                // console.log('keyCode', keyCode)
            }
        }

        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))

        /**
        * Add joystick
        */
        if (isTouchDevice) {
            const joystick = new JoyStick()
            const axis = joystick.add.axis({
                styles: { left: 35, bottom: 35, size: 100 }
            })
            axis.onMove(event => {
                /**
                * Update Camera
                */
                const { top, right } = event
                this.moveTop = top * 3
                this.moveRight = right * 3
            })
            const buttonA = joystick.add.button({
                letter: 'A',
                styles: { right: 35, bottom: 110, size: 80 }
            })
            buttonA.onClick(() => this.jump())
            const buttonB = joystick.add.button({
                letter: 'B',
                styles: { right: 110, bottom: 35, size: 80 }
            })
            buttonB.onClick(() => (this.move = true))
            buttonB.onRelease(() => (this.move = false))
        }

        // setTimeout(() => {
        //     const placeholder = document.getElementById('welcome-game-placeholder')
        //     if (placeholder) placeholder.remove()
        // }, 500)

    }
    async loadDayView(scene) {
        console.log(scene)
        let day = new Day(scene)
        console.log(day)
    }
    jump() {
        if (!this.man || !this.canJump) return
        this.canJump = false
        this.man.anims.play('jump_running', 500, false)
        setTimeout(() => {
            this.canJump = true
            this.man.anims.play('idle')
        }, 650)
        this.man.body.applyForceY(6)
    }

    goToNow() {
        var now_line = this.scene.getObjectByName("now_line")
        console.log("now_line", now_line, now_line.parent.position)
        this.camera.lookAt(now_line.parent.position)
    }

    update() {
        // this.box.rotation.x += 0.01
        // this.box.rotation.y += 0.01

        // Mise à jour du personnage
        // if (this.man) {
        //     this.man.update();
        // }

        if (this.man && this.man.body) {
            /**
            * Update Controls
            */

            // chute
            // console.log(this.man.body.position.y)
            if (this.man.body.position.y < -20) {
                console.log('chute')
                this.man.position.set(0, 1, 0)
            }

            this.controls.update(this.moveRight * 2, -this.moveTop * 2)
            /**
            * Player Turn
            */
            const speed = 4
            const v3 = new THREE.Vector3()

            const rotation = this.camera.getWorldDirection(v3)
            const theta = Math.atan2(rotation.x, rotation.z)
            const rotationMan = this.man.getWorldDirection(v3)
            const thetaMan = Math.atan2(rotationMan.x, rotationMan.z)
            this.man.body.setAngularVelocityY(0)

            const l = Math.abs(theta - thetaMan)
            let rotationSpeed = isTouchDevice ? 2 : 4
            let d = Math.PI / 24

            if (l > d) {
                if (l > Math.PI - d) rotationSpeed *= -1
                if (theta < thetaMan) rotationSpeed *= -1
                this.man.body.setAngularVelocityY(rotationSpeed)
            }

            /**
            * Player Move
            */

            if (this.keys.n.isDown) {
                this.goToNow()
            }

            if (this.keys.w.isDown || this.move) {
                if (this.man.anims.current === 'idle' && this.canJump) this.man.anims.play('run')

                const x = Math.sin(theta) * speed,
                    y = this.man.body.velocity.y,
                    z = Math.cos(theta) * speed

                this.man.body.setVelocity(x, y, z)
            } else {
                if (this.man.anims.current === 'run' && this.canJump) this.man.anims.play('idle')
            }

            /**
            * Player Jump
            */
            if (this.keys.space.isDown && this.canJump) {
                this.jump()
            }



        }
    }
}

// set your project configs
const config = { scenes: [MainScene] }

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader('/lib', () => new Project(config))

export default {
    name: "EnableWorld",
    mounted() {
        // Initialisation de la scène 3D
        // Le code ci-dessus gère déjà l'initialisation
    }
}
</script>
