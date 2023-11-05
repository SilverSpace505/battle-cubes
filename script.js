
var lastTime = 0
var delta = 0

var fov = 60

var view = mat4.create()
const projection = mat4.create()

var camera = {pos: {x: 0, y: 0, z: 0}, rot: {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}}

var grassTexture = new webgl.Texture("assets/grass.png")

var boxes = []

function createBox(x, y, z, width, height, length, colour) {
    let newBox = new webgl.Box(x, y, z, width, height, length, colour)
    boxes.push(newBox)
    return newBox
}

var floor = createBox(0, -1, 0, 100, 0.1, 100, [0.25, 0.75, 0])
floor.useTexture = true
floor.texture = grassTexture
for (let i = 0; i < 6; i++) {
    floor.uvs.push(0, 0, 1, 1, 1, 0, 0, 1)
}
floor.uvMul = 50
floor.updateBuffers()

createBox(2, -0.5, 0, 1, 1, 1, [0.5, 0.3, 0.1])
createBox(2, 0.5, 1.5, 1, 1, 1, [0.5, 0.3, 0.1])
createBox(0.5, 1.5, 1.5, 1, 1, 1, [0.5, 0.3, 0.1])

var player = new Player(0, 1, 0)

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

    player.update()
    camera.pos = {x:player.pos.x, y:player.pos.y, z:player.pos.z}

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