
class AI extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    laserShooter
    lso // laser shooter origin
    lsv = 0
    bullets = []
    mesh = []
    ls = 0.75
    camera = {x: 0, y: 0, z: 0}
    cvel = {x: 0, y: 0}
    id = 0
    kills = 0
    deaths = 0
    constructor(x, y, z) {
        super(x, y, z, 0.75, 0.75, 0.75)

        this.mesh = new webgl.Box(0, 0, 0, 0.75, 0.75, 0.75, [1, 0, 0])

        let ls = this.ls
        
        let laserShooterG = []
        laserShooterG.push(new webgl.Box(0*ls, (1.05-0.875)*ls, -0.4*ls, 0.1*ls, 0.1*ls, 0.2*ls, [1, 0, 0]))
        laserShooterG.push(new webgl.Box(0*ls, (0.95-0.875)*ls, -0.4*ls, 0.05*ls, 0.05*ls, 0.1*ls, [1, 0, 0]))
        laserShooterG.push(new webgl.Box(0*ls, (0.8-0.875)*ls, 0.1*ls, 0.15*ls, 0.15*ls, 0.5*ls, [1, 0, 0]))
        laserShooterG.push(new webgl.Box(0*ls, (0.7-0.875)*ls, 0.3*ls, 0.2*ls, 0.3*ls, 0.2*ls, [1, 1, 1]))
        laserShooterG.push(new webgl.Box(0*ls, (1-0.875)*ls, 0*ls, 0.2*ls, 0.3*ls, 0.8*ls, [1, 1, 1]))
        laserShooterG[2].rot.x = Math.PI/4
        this.laserShooter = new webgl.Group(0.65*ls, -0.4*ls, -1*ls, laserShooterG)
        this.lso = new webgl.Group(0, 0, 0, [this.laserShooter])
    }
    spawn(range=50) {
        this.pos.x = (Math.random()-0.5)*2*range
        this.pos.y = 1
        this.pos.z = (Math.random()-0.5)*2*range
        this.vel = {x: 0, y: 0, z: 0}
    }
    update() {

        if (isNaN(this.camera.x)) {
            this.camera = {x: 0, y: 0, z: 0}
        }
        if (isNaN(this.vel.x)) {
            this.vel = {x: 0, y: 0, z: 0}
        }

        this.vel.x = lerp(this.vel.x, 0, (1-0.95)*delta*100)
        this.vel.z = lerp(this.vel.z, 0, (1-0.95)*delta*100)
        this.vel.y -= aigravity * delta

        this.cvel.x = lerp(this.cvel.x, 0, (1-0.95)*delta*100)
        this.cvel.z = lerp(this.cvel.z, 0, (1-0.95)*delta*100)

        let moveDir = {x: 0, z: 0}

        this.camera.x += this.cvel.x
        this.camera.y += this.cvel.y

        let ds = []
        for (let player in playerData) {
            if (player != this.id) {
                ds.push([playerData[player], Math.sqrt((playerData[player].x-this.pos.x)**2 + (playerData[player].y-this.pos.y)**2 + (playerData[player].z-this.pos.z)**2)])
            }
        }
        for (let ai of ais) {
            if (ai.id != this.id) {
                ds.push([ai.pos, Math.sqrt((ai.pos.x-this.pos.x)**2 + (ai.pos.y-this.pos.y)**2 + (ai.pos.z-this.pos.z)**2)])
            }
        }
        ds.sort((a, b) => (a[1] - b[1]))

        this.camera.y += (Math.atan2(ds[0][0].x-this.pos.x, ds[0][0].z-this.pos.z)+Math.PI - this.camera.y) * delta * 10

        let len = Math.sqrt((ds[0][0].x-this.pos.x)**2 + (ds[0][0].z-this.pos.z)**2)

        this.camera.x += (Math.atan2(ds[0][0].y-this.pos.y, len) - this.camera.x) * delta * 10

        if (this.camera.x > Math.PI/2*0.99) {
			this.camera.x = Math.PI/2*0.99
		}
		if (this.camera.x < -Math.PI/2*0.99) {
			this.camera.x = -Math.PI/2*0.99
		}

        if (Math.random() < 10*delta) {
            moveDir.x -= Math.sin(this.camera.y)
            moveDir.z -= Math.cos(this.camera.y)
        }
        if (Math.random() < 10*delta) {
            moveDir.x += Math.sin(this.camera.y)
            moveDir.z += Math.cos(this.camera.y)
        }
        if (Math.random() < 10*delta) {
            moveDir.x -= Math.cos(this.camera.y)
            moveDir.z += Math.sin(this.camera.y)
        }
        if (Math.random() < 10*delta) {
            moveDir.x += Math.cos(this.camera.y)
            moveDir.z -= Math.sin(this.camera.y)
        }

        let length = Math.sqrt(moveDir.x**2 + moveDir.z**2)
        if (length > 0) {
            moveDir.x /= length; moveDir.z /= length
        }

        if (this.sprinting) {
            this.aispeed *= 2
        }

        this.vel.x += moveDir.x * aispeed / 2 * delta
        this.vel.z += moveDir.z * aispeed / 2 * delta

        if (this.sprinting) {
            this.aispeed /= 2
        }


        if (Math.random() < 0.5*delta && this.falling < 0.1) {
            this.vel.y = aijump
        }
        this.move(this.vel.x * delta, this.vel.y * delta, this.vel.z * delta, 1/delta/25)

        if (Math.random() < 1*delta) {
            this.lsv = 6
            this.laserShooter.rot.x = 0
            let initialAngle = [this.camera.x + (Math.random()-0.5)*2*spread, this.camera.y + (Math.random()-0.5)*2*spread, camera.rot.z]
            let rotated = rotv3({x: 0.65*this.ls, y: -0.4*this.ls, z: -1*this.ls}, this.camera)
            let lPoint = {x: this.pos.x+rotated.x, y: this.pos.y+0.35+rotated.y, z: this.pos.z+rotated.z}
            let rotated2 = rotv3({x:0, y:0, z:-1}, vec3(...initialAngle))

            let raycast = raycast3D(this.pos.x, this.pos.y, this.pos.z, rotated2.x, rotated2.y, rotated2.z, 100)
            let d = {x: raycast.point.x-lPoint.x, y: raycast.point.y-lPoint.y, z: raycast.point.z-lPoint.z}
            
            let len = Math.sqrt((raycast.point.x-lPoint.x)**2 + (raycast.point.z-lPoint.z)**2)
            let rotated3 = rotv3({x:0, y:0, z:-1}, vec3(Math.atan2(d.y, len), -Math.atan2(d.z, d.x)-Math.PI/2, 0))

            let rLen = Math.sqrt(rotated3.x**2 + rotated3.y**2 + rotated3.z**2)
            let moveDir = {x: rotated3.x/rLen*100*aibulletSpeed, y: rotated3.y/rLen*100*aibulletSpeed, z: rotated3.z/rLen*100*aibulletSpeed}
           
            let bulletData = [this.id, bulletID, this.pos.x+rotated.x, this.pos.y+rotated.y, this.pos.z+rotated.z, moveDir.x, moveDir.y, moveDir.z, aibulletSize, aibounces, ailifeTime, aidrag, aicolour, aibulletRandom, aihoming, aivel]
            
            bulletID += 1

            player.bullets.push(new Bullet(...bulletData))
            sendMsg({bullet: bulletData})
        }

        this.rot.y = this.camera.y

        while (this.checkCollide()) {
            this.pos.y += 1*delta
        }

        if (this.pos.y < -10) {
            this.spawn()
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
