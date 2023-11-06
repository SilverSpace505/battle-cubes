
class Player extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    laserShooter = []
    constructor(x, y, z) {
        super(x, y, z, 0.5, 1.9, 0.5)

        this.clsb(0, 1-0.875, 0, 0.2, 0.3, 0.8, [1, 1, 1])
        this.clsb(0, 0.7-0.875, 0.3, 0.2, 0.3, 0.2, [1, 1, 1])
        this.clsb(0, 0.8-0.875, 0.1, 0.5, 0.15, 0.15, [0, 1, 1])
        this.clsb(0, 1.05-0.875, -0.4, 0.1, 0.1, 0.2, [0, 1, 1])
        this.clsb(0, 0.95-0.875, -0.4, 0.05, 0.05, 0.1, [0, 1, 1])
    }
    clsb(x, y, z, width, height, depth, colour, rx=0, ry=0, rz=0) /* create laser shooter box */ {
        this.laserShooter.push([[x, y, z, rx, ry, rz], new webgl.Box(x, y, z, width, height, depth, colour)])
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

        while (this.checkCollide()) {
            this.pos.y += 0.01
        }

        for (let part of this.laserShooter) {
            let rotated = rotVec({x: part[0][0]+0.5, y: part[0][1], z: part[0][2]-1}, camera.rot.x, camera.rot.y, 0)
            part[1].pos = {x: this.pos.x + rotated.x, y: this.pos.y + rotated.y, z: this.pos.z + rotated.z}
            part[1].rotOff = {x:-part[1].size.x/2, y:-part[1].size.y/2, z:-part[1].size.z/2}
            part[1].rot = {x:part[0][3] + camera.rot.x, y:part[0][4] + camera.rot.y, z:part[0][5]}
        }
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
                this.pos.y += 0.025
                if (this.checkCollide()) {
                    this.pos.x = lastX
                    this.pos.y -= 0.025
                }
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