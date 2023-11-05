
class Player extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    constructor(x, y, z) {
        super(x, y, z, 0.5, 1.9, 0.5)
    }
    update() {
        if (keys["KeyW"]) {
            this.vel.x -= Math.sin(camera.rot.y) * speed * delta
            this.vel.z -= Math.cos(camera.rot.y) * speed * delta
        }
        if (keys["KeyS"]) {
            this.vel.x += Math.sin(camera.rot.y) * speed * delta
            this.vel.z += Math.cos(camera.rot.y) * speed * delta
        }
        if (keys["KeyA"]) {
            this.vel.x -= Math.cos(camera.rot.y) * speed * delta
            this.vel.z += Math.sin(camera.rot.y) * speed * delta
        }
        if (keys["KeyD"]) {
            this.vel.x += Math.cos(camera.rot.y) * speed * delta
            this.vel.z -= Math.sin(camera.rot.y) * speed * delta
        }
        if (jKeys["Space"] && this.falling < 0.1) {
            this.vel.y = jump
        }
        this.vel.x *= 0.5
        this.vel.z *= 0.5
        this.vel.y -= gravity * delta
        this.move(this.vel.x * delta, this.vel.y * delta, this.vel.z * delta, 1/delta)
    }
    checkCollide() {
        return this.isColliding(boxes)
    }
    move(x, y, z, steps) {
        this.falling += delta
        for (let i = 0; i < steps; i++) {
            var lastX = this.pos.x
            this.pos.x += x / steps
            
            if (this.checkCollide()) {
                this.pos.x = lastX
            }
            var lastZ = this.pos.z
            this.pos.z += z / steps
            if (this.checkCollide()) {
                this.pos.z = lastZ
            }
            var lastY = this.pos.y
            this.pos.y += y / steps
            if (this.checkCollide()) {
                this.pos.y = lastY
                if (this.vel.y < 0) {
                    this.falling = 0
                }
                this.vel.y = 0
            }
        }
    }
}