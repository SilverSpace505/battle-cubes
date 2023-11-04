
var lastTime = 0
var delta = 0

var fov = 60

var view = mat4.create()
const projection = mat4.create()

var camera = {pos: {x: 0, y: 0, z: 0}, rot: {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}}

var floor = new webgl.Box(0, -1, 0, 100, 0.1, 100, [0.25, 0.75, 0])

function tick(timestamp) {
    requestAnimationFrame(tick)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.canvas.width = canvas.width
	gl.canvas.height = canvas.height
    document.body.style.cursor = "default"

    delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
	if (!delta) { delta = 0 }
	if (delta > 0.1) { delta = 0.1 }

    input.setGlobals()

    let speed = 0.1

    if (keys["KeyW"]) {
        camera.pos.x -= Math.sin(camera.rot.y) * speed
        camera.pos.z -= Math.cos(camera.rot.y) * speed
    }
    if (keys["KeyS"]) {
        camera.pos.x += Math.sin(camera.rot.y) * speed
        camera.pos.z += Math.cos(camera.rot.y) * speed
    }
    if (keys["KeyA"]) {
        camera.pos.x -= Math.cos(camera.rot.y) * speed
        camera.pos.z += Math.sin(camera.rot.y) * speed
    }
    if (keys["KeyD"]) {
        camera.pos.x += Math.cos(camera.rot.y) * speed
        camera.pos.z -= Math.sin(camera.rot.y) * speed
    }
    if (keys["Space"]) {
        camera.pos.y += speed
    }
    if (keys["ShiftLeft"]) {
        camera.pos.y -= speed
    }

    if (jKeys["Escape"] || jKeys["Tab"]) {
        input.unlockMouse()
    }

    if (mouse.lclick) {
        input.lockMouse()
    }

    view = mat4.create()
	mat4.translate(view, view, [camera.pos.x, camera.pos.y, camera.pos.z])
	mat4.rotateY(view, view, camera.rot.y)
	mat4.rotateX(view, view, camera.rot.x)
	mat4.rotateZ(view, view, camera.rot.z)
	mat4.invert(view, view)

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0.529, 0.808, 0.922, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	mat4.perspective(projection, fov * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.01, 5000)

	webgl.render()

    input.updateInput()
}

var sensitivity = 0.005

input.mouseMove = (event) => {
    if (!input.isMouseLocked()) {
        this.mouse.x = event.clientX
		this.mouse.y = event.clientY
    } else {
        camera.rot.x -= event.movementY*sensitivity
		if (camera.rot.x > Math.PI/2*0.99) {
			camera.rot.x = Math.PI/2*0.99
		}
		if (camera.rot.x < -Math.PI/2*0.99) {
			camera.rot.x = -Math.PI/2*0.99
		}
		camera.rot.y -= event.movementX*sensitivity	
    }
}

requestAnimationFrame(tick)