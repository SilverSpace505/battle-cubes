
class Player extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    laserShooter
    lso // laser shooter origin
    lsv = 0
    bullets = []
    mesh = []
    ls = 0.75
    sprinting = false
    lsdown = 0
    cooldown = 0
    constructor(x, y, z) {
        super(x, y, z, 0.75, 0.75, 0.75)

        this.mesh = new webgl.Box(0, 0, 0, 0.75, 0.75, 0.75, [0, 0.5, 1])

        let ls = this.ls
        
        let laserShooterG = []
        laserShooterG.push(new webgl.Box(0*ls, (1.05-0.875)*ls, -0.4*ls, 0.1*ls, 0.1*ls, 0.2*ls, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0*ls, (0.95-0.875)*ls, -0.4*ls, 0.05*ls, 0.05*ls, 0.1*ls, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0*ls, (0.8-0.875)*ls, 0.1*ls, 0.15*ls, 0.15*ls, 0.5*ls, [0, 1, 1]))
        laserShooterG.push(new webgl.Box(0*ls, (0.7-0.875)*ls, 0.3*ls, 0.2*ls, 0.3*ls, 0.2*ls, [1, 1, 1]))
        laserShooterG.push(new webgl.Box(0*ls, (1-0.875)*ls, 0*ls, 0.2*ls, 0.3*ls, 0.8*ls, [1, 1, 1]))
        laserShooterG[2].rot.x = Math.PI/4
        for (let mesh of laserShooterG) {
            mesh.ignoreDepth = true
        }
        this.laserShooter = new webgl.Group(0.65*ls, -0.4*ls, -1*ls, laserShooterG)
        this.lso = new webgl.Group(0, 0, 0, [this.laserShooter])
    }
    spawn(range=20) {
        this.pos.x = (Math.random()-0.5)*2*range
        this.pos.y = 1
        this.pos.z = (Math.random()-0.5)*2*range
        this.vel = {x: 0, y: 0, z: 0}
    }
    update() {
        this.vel.x = lerp(this.vel.x, 0, 0.5*100*delta)
        this.vel.z = lerp(this.vel.z, 0, 0.5*100*delta)
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

        if (keys["ShiftLeft"]) {
            this.vel.x += moveDir.x * speed * 2 * delta
            this.vel.z += moveDir.z * speed * 2 * delta
            this.sprinting = true
        } else {
            this.vel.x += moveDir.x * speed * delta
            this.vel.z += moveDir.z * speed * delta
            this.sprinting = false
        }
        

        if (this.sprinting) {
            this.speed /= 2
        }

        if (jKeys["Space"] && this.falling < 0.1) {
            this.vel.y = jump
        }
        this.move(this.vel.x * delta, this.vel.y * delta, this.vel.z * delta, 1/delta)

        this.cooldown -= delta
        if (mouse.ldown && this.cooldown <= 0 && isValid) {
            this.cooldown = cooldown
            for (let i = 0; i < perShot; i++) {
                this.lsv = 6
                this.laserShooter.rot.x = 0
                let initialAngle = [camera.rot.x + (Math.random()-0.5)*2*spread, camera.rot.y + (Math.random()-0.5)*2*spread, camera.rot.z]
                let rotated = rotv3({x: 0.65*this.ls, y: -0.4*this.ls, z: -1*this.ls}, camera.rot)
                let lPoint = {x: camera.pos.x+rotated.x, y: camera.pos.y+rotated.y, z: camera.pos.z+rotated.z}
                let rotated2 = rotv3({x:0, y:0, z:-1}, vec3(...initialAngle))

                let raycast = raycast3D(camera.pos.x, camera.pos.y, camera.pos.z, rotated2.x, rotated2.y, rotated2.z, 100)
                let d = {x: raycast.point.x-lPoint.x, y: raycast.point.y-lPoint.y, z: raycast.point.z-lPoint.z}
                
                let len = Math.sqrt((raycast.point.x-lPoint.x)**2 + (raycast.point.z-lPoint.z)**2)
                let rotated3 = rotv3({x:0, y:0, z:-1}, vec3(Math.atan2(d.y, len), -Math.atan2(d.z, d.x)-Math.PI/2, 0))

                let rLen = Math.sqrt(rotated3.x**2 + rotated3.y**2 + rotated3.z**2)
                let moveDir = {x: rotated3.x/rLen*100*bulletSpeed, y: rotated3.y/rLen*100*bulletSpeed, z: rotated3.z/rLen*100*bulletSpeed}
            
                let bulletData = [id, bulletID, camera.pos.x+rotated.x, camera.pos.y+rotated.y, camera.pos.z+rotated.z, moveDir.x, moveDir.y, moveDir.z, bulletSize, bounces, lifeTime, drag, colour, bulletRandom, homing, vel]
                
                bulletID += 1

                this.bullets.push(new Bullet(...bulletData))
                this.bullets[this.bullets.length-1].real = true
                sendMsg({bullet: bulletData})
            }
        }

        this.updateNeeded()

        this.rot.y = camera.rot.y
        this.mesh.visible = false

        this.laserShooter.meshes[0].colour = colour
        this.laserShooter.meshes[1].colour = colour
        this.laserShooter.meshes[2].colour = colour

        while (this.checkCollide()) {
            this.pos.y += 1*delta
        }

        if (this.pos.y < -10) {
            isDead = true
            deaths += 1
        }
    }
    updateNeeded() {
        this.lsdown -= delta
        if (this.lsdown > 0) {
            this.laserShooter.pos.y = lerp(this.laserShooter.pos.y, -1.2*this.ls, delta*10)
        } else {
            this.laserShooter.pos.y = lerp(this.laserShooter.pos.y, -0.4*this.ls, delta*10)
        }
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update()
            if (!this.bullets[i].exists || i < this.bullets.length-maxBullets) {
                this.bullets[i].mesh.delete()
                this.bullets.splice(i, 1)
                i--
            }
        }
    }
    updateModel() {
        if (isNaN(this.pos.x)) {
            this.pos = {x: 0, y: 0, z: 0}
        }
        if (isNaN(this.rot.y)) {
            this.rot.y = 0
        }
        if (isNaN(this.lso.rot.x)) {
            this.lso.rot.x = 0
        }

        this.mesh.pos = {...this.pos}
        this.mesh.rot.y = this.rot.y

        this.lsv -= 60 * delta

        this.laserShooter.rot.x += this.lsv * delta

        if (this.laserShooter.rot.x < 0) {
            this.laserShooter.rot.x = 0
        }
    }
    checkCollide() {
        return collidingMap(this)
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
                this.pos.y += 0.05
                if (this.checkCollide()) {
                    this.pos.z = lastZ
                    this.pos.y -= 0.05
                }
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
    delete() {
        for (let mesh of this.laserShooter.meshes) {
            mesh.delete()
        }
        this.mesh.delete()
    }
}
