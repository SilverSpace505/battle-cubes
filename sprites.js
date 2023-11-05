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