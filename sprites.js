class Object3D {
	pos = {x: 0, y: 0, z: 0}
	size = {x: 0, y: 0, z: 0}
	rot = {x: 0, y: 0, z: 0}
	visible = true
	constructor(x, y, z, width, height, depth) {
		this.pos.x = x
		this.pos.y = y
		this.pos.z = z
		this.size.x = width
		this.size.y = height
		this.size.z = depth
	}
	isColliding(objects) {
		for (let object of objects) {
			if (
				this.pos.x+this.size.x/2 > object.pos.x-object.size.x/2 &&
				this.pos.x-this.size.x/2 < object.pos.x+object.size.x/2 &&
				this.pos.y+this.size.y/2 > object.pos.y-object.size.y/2 &&
				this.pos.y-this.size.y/2 < object.pos.y+object.size.y/2 &&
				this.pos.z+this.size.z/2 > object.pos.z-object.size.z/2 &&
				this.pos.z-this.size.z/2 < object.pos.z+object.size.z/2
			) {
				return true
			}
		}
		return false
	}
}

function isColliding3D(x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2) {
	return (
		x1+w1/2 > x2-w2/2 && x1-w1/2 < x2+w2/2 &&
		y1+h1/2 > y2-h2/2 && y1-h1/2 < y2+h2/2 &&
		z1+d1/2 > z2-d2/2 && z1-d1/2 < z2+d2/2
	)
}

class Bullet extends Object3D {
    vel = {x: 0, y: 0, z: 0}
    mesh
    exists = true
    time = 0
    bounces = 0
    maxBounces = 0
    lifeTime = 0
    size2 = 0
    drag = 0
    colour = [0, 1, 1]
    real = false
    id = 0
    constructor(id, x, y, z, vx, vy, vz, size, maxBounces, lifeTime, drag, colour) {
        super(x, y, z, size, size, size*2)
	this.id = id
        this.vel = {x:vx, y:vy, z:vz}
        this.mesh = new webgl.Box(x, y, z, size/2, size*2, size/2, colour)
        this.maxBounces = maxBounces
        this.lifeTime = lifeTime
        this.size2 = size
        this.colour = colour
        this.drag = drag
    }
    update() {
        this.vel.x -= this.drag * delta * this.vel.x * 100
        this.vel.y -= this.drag * delta * this.vel.y * 100
        this.vel.z -= this.drag * delta * this.vel.z * 100

        this.move(this.vel.x*delta, this.vel.y*delta, this.vel.z*delta, 1/delta)
        this.mesh.pos = {...this.pos}

        let d = Math.sqrt(this.vel.x**2 + this.vel.z**2)
        this.rot.y = Math.atan2(this.vel.x, this.vel.z)
        this.rot.x = Math.atan2(d, this.vel.y)

        this.mesh.rot = {...this.rot}

        this.time += delta
        if (this.time > this.lifeTime || this.bounces > this.maxBounces) {
            this.exists = false
        }
        
        if (this.real) {
            for (let player in players) {
                if (this.isColliding([players[player]])) {
                    sendMsg({hit: player})
                }
            }
        }
    }
    checkCollide() {
        for (let player in players) {
            if (player != this.id && this.isColliding([players[player]])) {
                return true
            }
        }
        return this.isColliding(boxes)
    }
    move(x, y, z, steps) {
        this.falling += delta
        let f = this.size2*10*4
        for (let i = 0; i < steps; i++) {
            var lastX = this.pos.x
            this.pos.x += x / steps
            if (this.checkCollide()) {
                this.vel.x *= -1
                this.pos.y += 0.05
                if (this.checkCollide()) {
                    this.pos.x = lastX
                    this.pos.y -= 0.05
                }
                this.bounces += 1
                explosions.push(new Explosion(this.pos.x, this.pos.y, this.pos.z, f, this.colour))
                if (this.real) {
                    for (let player in players) {
                        if (isColliding3D(this.pos.x, this.pos.y, this.pos.z, f/10, f/10, f/10, players[player].pos.x, players[player].pos.y, players[player].pos.z, players[player].size.x, players[player].size.y, players[player].size.z)) {
                            sendMsg({hit: player})
                        }
                    }
                }
                return
            }
            var lastZ = this.pos.z
            this.pos.z += z / steps
            if (this.checkCollide()) {
                this.pos.z = lastZ
                this.vel.z *= -1
                this.bounces += 1
                explosions.push(new Explosion(this.pos.x, this.pos.y, this.pos.z, f, this.colour))
                if (this.real) {
                    for (let player in players) {
                        if (isColliding3D(this.pos.x, this.pos.y, this.pos.z, f/10, f/10, f/10, players[player].pos.x, players[player].pos.y, players[player].pos.z, players[player].size.x, players[player].size.y, players[player].size.z)) {
                            sendMsg({hit: player})
                        }
                    }
                }
                return
            }
            var lastY = this.pos.y
            this.pos.y += y / steps
            if (this.checkCollide()) {
                this.pos.y = lastY
                this.vel.y *= -1
                if (this.vel.y < 0) {
                    this.falling = 0
                }
                this.bounces += 1
                explosions.push(new Explosion(this.pos.x, this.pos.y, this.pos.z, f, this.colour))
                if (this.real) {
                    for (let player in players) {
                        if (isColliding3D(this.pos.x, this.pos.y, this.pos.z, f/10, f/10, f/10, players[player].pos.x, players[player].pos.y, players[player].pos.z, players[player].size.x, players[player].size.y, players[player].size.z)) {
                            sendMsg({hit: player})
                        }
                    }
                }
                return
                // this.vel.y = 0
            }
        }
    }
}

class Explosion extends Object3D {
    vel = 0
    size2 = 0
    mesh
    rv = {x: 0, y: 0, z: 0}
    constructor(x, y, z, force, colour) {
        super(x, y, z, 0, 0, 0)
        this.vel = force
        this.mesh = new webgl.Box(x, y, z, 0, 0, 0, colour)
        this.mesh.alpha = 0.25
        this.mesh.order = true
        this.mesh.rot.x = Math.random()*Math.PI*2
        this.mesh.rot.y = Math.random()*Math.PI*2
        this.mesh.rot.z = Math.random()*Math.PI*2

        this.rv = {x:(Math.random()-0.5)*2 * Math.PI*2,y:(Math.random()-0.5)*2 * Math.PI*2,z:(Math.random()-0.5)*2 * Math.PI*2}
    }
    update() {
        this.vel -= (1-0.9) * this.vel * delta * 100
        this.size2 += this.vel * delta
        this.mesh.alpha = this.vel
        if (this.mesh.alpha > 0.5) {
            this.mesh.alpha = 0.5
        }
        this.mesh.size = {x: this.size2, y: this.size2, z: this.size2}
        this.mesh.rotOff = {x: -this.size2/2, y: -this.size2/2, z: -this.size2/2}

        this.mesh.rot.x += this.rv.x/4 * delta
        this.mesh.rot.y += this.rv.y/4 * delta
        this.mesh.rot.z += this.rv.z/4 * delta
        // this.mesh.rot.y += Math.random()
        // this.mesh.rot.z += Math.random()
    }
}
