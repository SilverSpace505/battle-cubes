
var lastTime = 0
var delta = 0

var fov = 60

var view = mat4.create()
const projection = mat4.create()

var camera = {pos: {x: 0, y: 0, z: 0}, rot: {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}}

var grassTexture = new webgl.Texture("assets/grass.png")
var boxTexture = new webgl.Texture("assets/box.png")
var woodTexture = new webgl.Texture("assets/wood.png")
var stoneTexture = new webgl.Texture("assets/stone.png")
var leavesTexture = new webgl.Texture("assets/leaves.png")

var boxes = []

function srand(seed) {
    seed += 748473
    return (Math.sin(seed*482032832)+1)/2
}

function createBox(x, y, z, width, height, depth, colour, texture="none", doScale=true, uvMul=1) {
    let newBox = new webgl.Box(x, y, z, width, height, depth, colour)
    boxes.push(newBox)

    if (texture != "none") {
        newBox.useTexture = true
        newBox.texture = texture
        for (let i = 0; i < 6; i++) {
            if (doScale) {
                if (i < 2) {
                    newBox.uvs.push(depth, height, 0, 0, 0, height, depth, 0)
                } else if (i < 4) {
                    newBox.uvs.push(depth, width, 0, 0, 0, width, depth, 0)
                } else {
                    newBox.uvs.push(width, height, 0, 0, width, 0, 0, height)
                }
            } else {
                newBox.uvs.push(0, 0, 1, 1, 1, 0, 0, 1)
            }
        }
        newBox.uvMul = uvMul
        newBox.updateBuffers()
    }

    return newBox
}

function house(x, y, z, width, height, depth, doorSize={x: 1, y: 2}, doors=["1,0"], wallSize=0.1, logSize=0.5) {
    // logs
    createBox(x-width/2, y+height/2, z-depth/2, logSize, height, logSize, [0.75, 0.75, 0.75], woodTexture)
    createBox(x+width/2, y+height/2, z+depth/2, logSize, height, logSize, [0.75, 0.75, 0.75], woodTexture)
    createBox(x-width/2, y+height/2, z+depth/2, logSize, height, logSize, [0.75, 0.75, 0.75], woodTexture)
    createBox(x+width/2, y+height/2, z-depth/2, logSize, height, logSize, [0.75, 0.75, 0.75], woodTexture)

    // walls
    createBox(x-width/2, y+height/2, z, wallSize, height, depth, [0.75, 0.75, 0.75], stoneTexture)
    if (doors.includes("1,0")) {
        createBox(x+width/2, y+height/2, z+depth/2-(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, [0.75, 0.75, 0.75], stoneTexture)
        createBox(x+width/2, y+height/2, z-depth/2+(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, [0.75, 0.75, 0.75], stoneTexture)
        createBox(x+width/2, y+doorSize.y+(height-doorSize.y)/2, z, wallSize, height-doorSize.y, doorSize.x, [0.75, 0.75, 0.75], stoneTexture)
    } else {
        createBox(x+width/2, y+height/2, z, wallSize, height, depth, [0.75, 0.75, 0.75], stoneTexture)
    }
    createBox(x, y+height/2, z-depth/2, width, height, wallSize, [0.75, 0.75, 0.75], stoneTexture)
    createBox(x, y+height/2, z+depth/2, width, height, wallSize, [0.75, 0.75, 0.75], stoneTexture)

    // floor and ceiling
    createBox(x, y, z, width, wallSize/2, depth, [0.75, 0.75, 0.75], woodTexture)
    createBox(x, y+height, z, width+wallSize*0.9, wallSize, depth+wallSize*0.9, [0.75, 0.75, 0.75], woodTexture)
}

function tree(x, y, z, seed) {
    let height = srand(seed)*1.5 + 2
    createBox(x, y+height/2, z, 1, height, 1, [0.75, 0.75, 0.75], woodTexture)
    createBox(x, y+height+1.25, z, 2.5, 2.5, 2.5, [0.75, 0.75, 0.75], leavesTexture)
}

var floor = createBox(0, -0.05, 0, 100, 0.1, 100, [0.75, 0.75, 0.75], grassTexture)

createBox(2, 0.5, 0, 1, 1, 1, [0.75, 0.75, 0.75], boxTexture)
createBox(2, 1.5, 1.5, 1, 1, 1, [0.75, 0.75, 0.75], boxTexture)
createBox(0.5, 2.5, 1.5, 1, 1, 1, [0.75, 0.75, 0.75], boxTexture)
createBox(-4, 2.5, 3, 1, 1, 1, [0.75, 0.75, 0.75], boxTexture)

createBox(10, 2.5, 0, 5, 5, 5, [0.75, 0.75, 0.75], grassTexture)
createBox(7, 1.5, 2, 3, 3, 3, [0.75, 0.75, 0.75], grassTexture)
createBox(10, 2, 3, 3, 4, 3, [0.75, 0.75, 0.75], grassTexture)

house(-10, 0, 0, 5, 4, 5)

tree(0, 0, 10, 0)
tree(1, 0, 8, 1000)
tree(-1, 0, 9, 2000)

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
    camera.pos = {x:player.pos.x, y:player.pos.y+0.5, z:player.pos.z}

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