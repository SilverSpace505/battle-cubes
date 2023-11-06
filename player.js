
class Player extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    laserShooter
    lso // laser shooter origin
    lsv = 0
    bullets = []
    constructor(x, y, z) {
        super(x, y, z, 0.5, 1.9, 0.5)
        
        let laserShooterG = []
        laserShooterG.push(new webgl.Box(0, 1.05-0.875, -0.4, 0.1, 0.1, 0.2, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0, 0.95-0.875, -0.4, 0.05, 0.05, 0.1, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0, 0.8-0.875, 0.1, 0.15, 0.15, 0.5, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0, 0.7-0.875, 0.3, 0.2, 0.3, 0.2, [1, 1, 1]))
        laserShooterG.push(new webgl.Box(0, 1-0.875, 0, 0.2, 0.3, 0.8, [1, 1, 1]))
        laserShooterG[2].rot.x = Math.PI/4
        for (let mesh of laserShooterG) {
            mesh.ignoreDepth = true
            mesh.order = true
        }
        this.laserShooter = new webgl.Group(0.65, -0.4, -1, laserShooterG)
        this.lso = new webgl.Group(0, 0, 0, [this.laserShooter])
    }
    update() {
        this.vel.x -= (1 - 0.5) * delta * this.vel.x * 100
        this.vel.z -= (1 - 0.5) * delta * this.vel.z * 100
        this.vel.y -= gravity * delta

        let moveDir = {x: 0, z: 0}

        if (keys["KeyW"] && !paused) {
            moveDir.x -= Math.sin(camera.rot.y)
            moveDir.z -= Math.cos(camera.rot.y)
        }
        if (keys["KeyS"] && !paused) {
            moveDir.x += Math.sin(camera.rot.y)
            moveDir.z += Math.cos(camera.rot.y)
        }
        if (keys["KeyA"] && !paused) {
            moveDir.x -= Math.cos(camera.rot.y)
            moveDir.z += Math.sin(camera.rot.y)
        }
        if (keys["KeyD"] && !paused) {
            moveDir.x += Math.cos(camera.rot.y)
            moveDir.z -= Math.sin(camera.rot.y)
        }

        let length = Math.sqrt(moveDir.x**2 + moveDir.z**2)
        if (length > 0) {
            moveDir.x /= length; moveDir.z /= length
        }

        if (this.sprinting) {
            this.speed *= 2
        }

        this.vel.x += moveDir.x * speed * delta
        this.vel.z += moveDir.z * speed * delta

        if (this.sprinting) {
            this.speed /= 2
        }


        if (jKeys["Space"] && this.falling < 0.1) {
            this.vel.y = jump
        }
        this.move(this.vel.x * delta, this.vel.y * delta, this.vel.z * delta, 1/delta)

        if (mouse.lclick && isValid) {
            this.lsv = 6
            this.laserShooter.rot.x = 0
            let rotated = rotVec({x:0, y:0, z:-1*100}, camera.rot.x + (Math.random()-0.5)*2*spread, camera.rot.y + (Math.random()-0.5)*2*spread, camera.rot.z + (Math.random()-0.5)*2*spread)
            this.bullets.push(new Bullet(camera.pos.x, camera.pos.y, camera.pos.z, rotated.x, rotated.y, rotated.z, 0.1))
        }

        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update()
            if (!this.bullets[i].exists) {
                this.bullets[i].mesh.delete()
                this.bullets.splice(i, 1)
                i--
            }
        }

        this.lsv -= 60 * delta

        this.laserShooter.rot.x += this.lsv * delta

        if (this.laserShooter.rot.x < 0) {
            this.laserShooter.rot.x = 0
        }

        while (this.checkCollide()) {
            this.pos.y += 0.01
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
                this.pos.y += 0.05
                if (this.checkCollide()) {
                    this.pos.x = lastX
                    this.pos.y -= 0.05
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