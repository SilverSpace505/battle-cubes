
var boxes = []
var explosions = []

var fov = 60
var tFov = 60

var uiA = 0
var uiT = 0

var page = "main"

function srand(seed) {
    let x = Math.sin(seed*3902+7459)*Math.cos(seed*4092+4829)*10000
	return x - Math.floor(x)
}

var menuButton = new ui.Button(0, 0, 0, 0, "rect", "Menu")
menuButton.bgColour = [0, 0, 0, 0.5]

var lobbyOButton = new ui.Button(0, 0, 0, 0, "rect", "Lobby Options")
lobbyOButton.bgColour = [0, 0, 0, 0.5]

var loBackButton = new ui.Button(0, 0, 0, 0, "rect", "Back")
loBackButton.bgColour = [255, 0, 0, 0.5]

var privateButton = new ui.Button(0, 0, 0, 0, "rect", "Public")
privateButton.bgColour = [0, 0, 0, 0.5]

var passwordTo = new ui.TextBox(0, 0, 0, 0, "Password")

var passType = 0

var bulletID = 1

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

    newBox.rotOff = {x:-newBox.size.x/2, y:-newBox.size.y/2, z:-newBox.size.z/2}

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
house(-10, 0, -6, 3, 10, 3)

tree(0, 0, 10, 0)
tree(1, 0, 8, 1000)
tree(-1, 0, 9, 2000)

let secret = createBox(4, 4, 5, 1, 1, 1, [1, 1, 1])
secret.alpha = 0.05

let testG = []
let ts = 0.2
testG.push(createBox(-0.5, 0, 0, ts, ts, ts, [1, 0, 0]))
testG.push(createBox(0.5, 0, 0, ts, ts, ts, [1, 0, 0]))
testG.push(createBox(0, -0.5, 0, ts, ts, ts, [0, 1, 0]))
testG.push(createBox(0, 0.5, 0, ts, ts, ts, [0, 1, 0]))
testG.push(createBox(0, 0, -0.5, ts, ts, ts, [0, 0, 1]))
testG.push(createBox(0, 0, 0.5, ts, ts, ts, [0, 0, 1]))

var test = new webgl.Group(0, 1, -5, testG)

var player = new Player(0, 1, 0)
player.spawn()

var time = 0

var isValid = false

var paused = false

var players = {}

var oldPass = ""

function clearBullets() {
    for (let bullet of player.bullets) {
        bullet.mesh.delete()
    }
    player.bullets = []
}

function gameTick() {
    time += delta

    for (let player in players) {
        if (!playerData[player]) {
            players[player].delete()
            delete players[player]
        }
    }

    for (let player in playerData) {
        if (!players[player] && player != id) {
            players[player] = new Player(0, 0, 0)
            for (let mesh of players[player].laserShooter.meshes) {
                mesh.ignoreDepth = false
                mesh.order = false
            }
        }
    }

    
    isValid = !(Math.abs(mouse.x-canvas.width/2) < 300*su && Math.abs(mouse.y-canvas.height/2) < 250*su) || input.isMouseLocked()
    
    if (mouse.lclick && isValid && !input.isMouseLocked()) {
        input.lockMouse()
        mouse.lclick = false
    }

    test.pos.y = Math.sin(time)*0.25 + 1

    testG[0].rot.x += 0.01
    testG[1].rot.x += 0.01

    testG[2].rot.y += 0.01
    testG[3].rot.y += 0.01

    testG[4].rot.z += 0.01
    testG[5].rot.z += 0.01

    test.rot.y += 0.01

    passType -= delta

    test.update()

    player.update()
    camera.pos = {x:player.pos.x, y:player.pos.y+0.2, z:player.pos.z}

    player.updateModel()

    player.lso.pos = {...camera.pos}
    player.lso.rot = {...camera.rot}
    player.lso.update()
    player.laserShooter.update()

    for (let player in players) {
        players[player].lso.pos = {...players[player].pos}
        players[player].lso.pos.y += 0.25
        players[player].lso.rot.y = players[player].rot.y
        players[player].lso.update()
        players[player].laserShooter.update()
    }

    tFov = 60
    if (player.sprinting) {
        tFov = 60*1.33
    }

    fov += (tFov - fov) * delta * 10

    if (jKeys["Escape"]) {
        input.unlockMouse()
    }

    if (jKeys["Tab"]) {
        if (input.isMouseLocked()) {
            input.unlockMouse()
        } else {
            input.lockMouse()
            mouse.lclick = false
        }
    }

    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update()
        if (explosions[i].mesh.alpha < 0.01) {
            explosions[i].mesh.delete()
            explosions.splice(i, 1)
            i--
        }
    }

    for (let player in players) {
        players[player].pos.x += (playerData[player].x - players[player].pos.x) * delta * 10
        players[player].pos.y += (playerData[player].y - players[player].pos.y) * delta * 10
        players[player].pos.z += (playerData[player].z - players[player].pos.z) * delta * 10
        players[player].rot.y += (playerData[player].rot - players[player].rot.y) * delta * 10
        players[player].lso.rot.x += (playerData[player].rotx - players[player].lso.rot.x) * delta * 10
        players[player].updateModel()
    }

    view = mat4.create()
	mat4.translate(view, view, [camera.pos.x, camera.pos.y, camera.pos.z])
	mat4.rotateY(view, view, camera.rot.y)
	mat4.rotateX(view, view, camera.rot.x)
	mat4.rotateZ(view, view, camera.rot.z)
	mat4.invert(view, view)

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0.529, 0.808, 0.922, 1)
    gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)

	gl.enable(gl.BLEND)
	gl.clear(gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	mat4.perspective(projection, fov * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.01, 5000)

    gl.enable(gl.DEPTH_TEST)

	webgl.render()

    test.aRender()
    player.laserShooter.aRender()
    player.lso.aRender()

    for (let player in players) {
        players[player].laserShooter.aRender()
        players[player].lso.aRender()
    }

    if (input.isMouseLocked()) {
        uiT = 0
        paused = false
    } else {
        uiT = 1
        paused = true
    }

    if (fetchC <= 0) {
        fetchC = 3
        sendMsg({getLobby: true})
    }

    uiA += (uiT - uiA) * delta * 10

    ctx.globalAlpha = 1-uiA
    ui.rect(canvas.width/2, canvas.height/2, 25, 2.5, [255, 255, 255, 1])
    ui.rect(canvas.width/2, canvas.height/2, 2.5, 25, [255, 255, 255, 1])

    ctx.globalAlpha = uiA

    if (page == "lobbyO" && lobbyData.host != id) {
        page = "main"
    }

    if (page == "main") {
        ui.rect(canvas.width/2, canvas.height/2, 450*su, 400*su, [0, 0, 0, 0.5])

        ui.text(canvas.width/2, canvas.height/2-125*su, 75*su, "Paused", {align: "center"})
        
        menuButton.set(canvas.width/2, canvas.height/2, 400*su, 100*su)
        menuButton.textSize = 75*su
        menuButton.draw()

        if (uiT == 1) {
            menuButton.basic()
            if (menuButton.hovered() && mouse.lclick && overlayT == 0) {
                menuButton.click()
                tScene = "menu"
                overlayT = 1
                sendMsg({leaveLobby: true})
            }
        }

        if (lobbyData && lobbyData.host == id) {
            lobbyOButton.set(canvas.width/2, canvas.height/2+110*su, 400*su, 100*su)
            lobbyOButton.textSize = 50*su
            lobbyOButton.draw()

            lobbyOButton.basic()

            if (lobbyOButton.hovered() && mouse.lclick) {
                page = "lobbyO"
            }
        }
    } else if (page == "lobbyO") {
        ui.rect(canvas.width/2, canvas.height/2, 600*su, 500*su, [0, 0, 0, 0.5])
        ui.text(canvas.width/2, canvas.height/2-200*su, 50*su, "Lobby Options", {align: "center"})

        loBackButton.set(canvas.width/2, canvas.height/2+200*su, 400*su, 50*su)
        loBackButton.textSize = 35*su

        loBackButton.basic()
        loBackButton.draw()

        if (loBackButton.hovered() && mouse.lclick) {
            loBackButton.click()
            page = "main"
        }

        privateButton.set(canvas.width/2, canvas.height/2 - 30*su, 400*su, 50*su)
        privateButton.textSize = 35*su

        if (lobbyData.private) {
            privateButton.text = "Private"
        } else {
            privateButton.text = "Public"
        }
        
        privateButton.basic()
        privateButton.draw()

        if (privateButton.hovered() && mouse.lclick) {
            privateButton.click()
            lobbyData.private = !lobbyData.private
            sendMsg({setOptions: {private: lobbyData.private}})
        }

        passwordTo.set(canvas.width/2, canvas.height/2 + 30*su, 400*su, 50*su)
        passwordTo.outlineSize = 10*su
        passwordTo.textSize = 35*su

        passwordTo.text = passwordTo.text.substring(0, 10)

        passwordTo.hover()
        passwordTo.draw()

        if (passwordTo.text != oldPass) {
            lobbyData.password = passwordTo.text
            passType = 1
            sendMsg({setOptions: {password: passwordTo.text}})
        }
    }

    passwordTo.text = lobbyData.password
    oldPass = lobbyData.password
    
    ctx.globalAlpha = 1

    data = {
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z,
        rot: camera.rot.y,
        rotx: camera.rot.x,
    }
}



function raycast3D(x, y, z, vx, vy, vz, maxD, stepD=0.1) {
    let r = {x:x, y:y, z:z, s:stepD}

    while (Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2) < maxD) {
        r.x += vx * stepD
        r.y += vy * stepD
        r.z += vz * stepD
        for (let player in players) {
            if (player != id && isColliding3D(r.x, r.y, r.z, r.s, r.s, r.s, players[player].pos.x, players[player].pos.y, players[player].pos.z, players[player].size.x, players[player].size.y, players[player].size.z)) {
                return {d: Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2), point: r}
            }
        }
        for (let box of boxes) {
            if (isColliding3D(r.x, r.y, r.z, r.s, r.s, r.s, box.pos.x, box.pos.y, box.pos.z, box.size.x, box.size.y, box.size.z)) {
                return {d: Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2), point: r}
            }
        }
    }
    return {d: Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2), point: r}
}
