
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

var antihackButton = new ui.Button(0, 0, 0, 0, "rect", "Antihack")
antihackButton.bgColour = [0, 0, 0, 0.5]

var resetStatsButton = new ui.Button(0, 0, 0, 0, "rect", "Reset Stats")
resetStatsButton.bgColour = [255, 0, 0, 0.5]

var passwordTo = new ui.TextBox(0, 0, 0, 0, "Password")

var passType = 0

var bulletID = 1

var kills = 0
var deaths = 0

var selectedls = 1
var lsnames = ["Pistol", "Sniper", "Shotgun", "Machine Gun", "Bee Gun", "Rocket Launcher"]

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

function house(x, y, z, width, height, depth,  doors=["1,0"], doorSize={x: 1, y: 2}, wallSize=0.1, logSize=0.5) {
    // logs
    createBox(x-width/2, y+height/2, z-depth/2, logSize, height, logSize, [0.75, 1, 1])
    createBox(x+width/2, y+height/2, z+depth/2, logSize, height, logSize, [0.75, 1, 1])
    createBox(x-width/2, y+height/2, z+depth/2, logSize, height, logSize, [0.75, 1, 1])
    createBox(x+width/2, y+height/2, z-depth/2, logSize, height, logSize, [0.75, 1, 1])

    let c = [0.9, 0.9, 0.9]
    // walls
    if (doors.includes("-1,0")) {
        createBox(x-width/2, y+height/2, z+depth/2-(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, c)
        createBox(x-width/2, y+height/2, z-depth/2+(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, c)
        createBox(x-width/2, y+doorSize.y+(height-doorSize.y)/2, z, wallSize, height-doorSize.y, doorSize.x, c)
    } else {
        createBox(x-width/2, y+height/2, z, wallSize, height, depth, c)
    }
    if (doors.includes("1,0")) {
        createBox(x+width/2, y+height/2, z+depth/2-(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, c)
        createBox(x+width/2, y+height/2, z-depth/2+(depth-doorSize.x)/4, wallSize, height, (depth-doorSize.x)/2, c)
        createBox(x+width/2, y+doorSize.y+(height-doorSize.y)/2, z, wallSize, height-doorSize.y, doorSize.x, c)
    } else {
        createBox(x+width/2, y+height/2, z, wallSize, height, depth, c)
    }
    if (doors.includes("0,1")) {
        createBox(x+width/2-(width-doorSize.x)/4, y+height/2, z+depth/2, (width-doorSize.x)/2, height, wallSize, c)
        createBox(x-width/2+(width-doorSize.x)/4, y+height/2, z+depth/2, (width-doorSize.x)/2, height, wallSize, c)
        createBox(x, y+doorSize.y+(height-doorSize.y)/2, z+depth/2, doorSize.x, height-doorSize.y, wallSize, c)
    } else {
        createBox(x, y+height/2, z+depth/2, width, height, wallSize, c)
    }
    if (doors.includes("0,-1")) {
        createBox(x+width/2-(width-doorSize.x)/4, y+height/2, z-depth/2, (width-doorSize.x)/2, height, wallSize, c)
        createBox(x-width/2+(width-doorSize.x)/4, y+height/2, z-depth/2, (width-doorSize.x)/2, height, wallSize, c)
        createBox(x, y+doorSize.y+(height-doorSize.y)/2, z-depth/2, doorSize.x, height-doorSize.y, wallSize, c)
    } else {
        createBox(x, y+height/2, z-depth/2, width, height, wallSize, c)
    }
    // createBox(x, y+height/2, z-depth/2, width, height, wallSize, c)
    // createBox(x, y+height/2, z+depth/2, width, height, wallSize, c)

    let tx = width+wallSize*0.9 
    let tz = depth+wallSize*0.9 

    let s = tx/2
    if (tz/2 < s) s = tz/2

    // floor and ceiling
    if (doors.includes("bottom")) {
        createBox(x-tx/2+(tx-s)/4, y, z, (tx-s)/2, wallSize, tz, [0.5, 0.5, 0.5])
        createBox(x+tx/2-(tx-s)/4, y, z, (tx-s)/2, wallSize, tz, [0.5, 0.5, 0.5])

        createBox(x, y, z-tz/2+(tz-s)/4, s, wallSize, (tz-s)/2, [0.5, 0.5, 0.5])
        createBox(x, y, z+tz/2-(tz-s)/4, s, wallSize, (tz-s)/2, [0.5, 0.5, 0.5])
    } else {
        createBox(x, y, z, width, wallSize/2, depth, [0.5, 0.5, 0.5])
    }
    
    if (doors.includes("top")) {
        createBox(x-tx/2+(tx-s)/4, y+height, z, (tx-s)/2, wallSize, tz, [0.5, 0.5, 0.5])
        createBox(x+tx/2-(tx-s)/4, y+height, z, (tx-s)/2, wallSize, tz, [0.5, 0.5, 0.5])

        createBox(x, y+height, z-tz/2+(tz-s)/4, s, wallSize, (tz-s)/2, [0.5, 0.5, 0.5])
        createBox(x, y+height, z+tz/2-(tz-s)/4, s, wallSize, (tz-s)/2, [0.5, 0.5, 0.5])

        let dirs = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
        for (let i = 0; i < Math.floor(height)/1; i++) {
            createBox(x+dirs[i%4][0]*s/4, y+i*1+0.5, z+dirs[i%4][1]*s/4, s/3, wallSize*3, s/3, [0.8, 0.8, 0.8])
        }
    } else {
        createBox(x, y+height, z, width+wallSize*0.9, wallSize, depth+wallSize*0.9, [0.5, 0.5, 0.5])
    }
}

function hill(x, y, z, width, height, depth, seed, amt2=3) {
    createBox(x, y+height/2, z, width, height, depth, [0.75, 0.75, 0.75], noiseTexture)
    let amt = Math.round(srand(seed)*amt2)
    for (let i = 0; i < amt; i++) {
        let h = srand(seed+i*3) * height * 1.5
        createBox(x+(srand(seed+i*3+3+1)-0.5)*2*width, y+h/2, z+(srand(seed+i*3+3+2)-0.5)*2*depth, width, h, depth, [0.75, 0.75, 0.75], noiseTexture)
    }
}

var floor = createBox(0, -0.05, 0, 100, 0.1, 100, [0.75, 0.75, 0.75], noiseTexture)

var skyboxSize = 1000
var skybox = new webgl.Box(0, 0, 0, skyboxSize, skyboxSize, skyboxSize, [1, 1, 1])
skybox.useTexture = true
skybox.texture = starsTexture
skybox.oneSide = false
skybox.shading = false
let repeat = 3
for (let i = 0; i < 6; i++) {
    skybox.uvs.push(0, 0, repeat, repeat, repeat, 0, 0, repeat)
}

var ais = []
for (let i = 0; i < 5; i++) {
    ais.push(new AI(0, 1, 0))
    ais[ais.length-1].spawn()
    ais[ais.length-1].id = -i - 1
}

// spawn
house(0, 0, 0, 10, 4, 10, ["1,0", "-1,0", "0,1", "0,-1", "top"])
house(0, 4, 0, 10, 4, 10, ["1,0", "-1,0", "bottom", "top"])
house(0, 8, 0, 10, 4, 10, ["0,1", "0,-1", "bottom"])
house(7.5, 4, 0, 5, 4, 5, ["1,0", "-1,0", "0,1", "0,-1", "top"], {x: 3, y: 3})
house(-7.5, 4, 0, 5, 4, 5, ["1,0", "-1,0", "0,1", "0,-1", "top"], {x: 3, y: 3})
house(0, 8, 7.5, 5, 4, 5, ["1,0", "-1,0", "0,1", "0,-1", "top"], {x: 3, y: 3})
house(0, 8, -7.5, 5, 4, 5, ["1,0", "-1,0", "0,1", "0,-1", "top"], {x: 3, y: 3})

// tower with hill
hill(25, 0, 25, 10, 10, 10, 8, 10)
house(8, 0, 15, 5, 10, 5, ["-1,0", "top"])

// city
house(-8 - 10, 0, 15 + 10, 5, 4, 5, ["-1,0"])
house(-16 - 10, 0, 10 + 10, 5, 8, 5, ["0,1", "top"])
house(-20 - 10, 0, 20 + 10, 5, 4, 5, ["0,-1"])
house(-25 - 10, 0, 12 + 10, 5, 4, 5, ["1,0"])

// sniper tower
house(-25, 0, -25, 5, 20, 5, ["1,0", "top"])
house(-25, 20, -25, 5, 4, 5, ["1,0", "-1,0", "0,1", "0,-1", "bottom"], {x: 3, y: 3})
hill(-20, 0, -20, 5, 5, 5, 10)
hill(-20, 0, -30, 5, 5, 5, 11)
hill(-30, 0, -20, 5, 5, 5, 12)

// hill range
hill(20, 0, -30, 10, 5, 5, 13)
hill(30, 0, -20, 5, 4.5, 10, 14)
hill(20, 0, -20, 5, 5, 5, 15)
hill(15, 0, -25, 5, 5, 10, 16)

createBox(19.9, 0.5, -23, 1, 1, 1, [0.75, 0.75, 0.75], noiseTexture)
createBox(17.9, 2, -25, 1, 1, 1, [0.75, 0.75, 0.75], noiseTexture)
createBox(17.9, 2, -26, 1, 3, 1, [0.75, 0.75, 0.75], noiseTexture)
createBox(17.9, 2, -27, 1, 5, 1, [0.75, 0.75, 0.75], noiseTexture)

var player = new Player(0, 1, 0)
player.spawn()

var time = 0

var isValid = false

var paused = false

var players = {}

var oldPass = ""

var split = {}
var samt = 4

for (let x = 0; x < samt; x++) {
    for (let z = 0; z < samt; z++) {
        let p = [(x-samt/2+0.5)*2, (z-samt/2+0.5)*2]
        split[p.join(",")] = []
        // let sv = new webgl.Box(p[0]*(50/samt), 0, p[1]*(50/samt), 100/samt, 100, 100/samt, [0.5, 0.5, 0.5])
        // sv.alpha = 0.5
        // sv.oneSide = false
    }
}

for (let box of boxes) {
    for (let x = 0; x < samt; x++) {
        for (let z = 0; z < samt; z++) {
            let p = [(x-samt/2+0.5)*2, (z-samt/2+0.5)*2]
            if (isColliding3D(p[0]*(50/samt), 0, p[1]*(50/samt), 100/samt, 100, 100/samt, box.pos.x, box.pos.y, box.pos.z, box.size.x, box.size.y, box.size.z)) {
                split[p.join(",")].push(box)
            }
        }
    }
}

function collidingMap(obj) {
    for (let x = 0; x < samt; x++) {
        for (let z = 0; z < samt; z++) {
            let p = [(x-samt/2+0.5)*2, (z-samt/2+0.5)*2]
            if (isColliding3D(p[0]*(50/samt), 0, p[1]*(50/samt), 100/samt, 100, 100/samt, obj.pos.x, obj.pos.y, obj.pos.z, obj.size.x, obj.size.y, obj.size.z)) {
                if (obj.isColliding(split[p.join(",")])) {
                    return true
                }
            }
        }
    }
    return false
}
function collidingMap3D(x2, y2, z2, w, h, d) {
    for (let x = 0; x < samt; x++) {
        for (let z = 0; z < samt; z++) {
            let p = [(x-samt/2+0.5)*2, (z-samt/2+0.5)*2]
            if (isColliding3D(p[0]*(50/samt), 0, p[1]*(50/samt), 100/samt, 100, 100/samt, x2, y2, z2, w, h, d)) {
                for (let box of split[p.join(",")]) {
                    if (isColliding3D(x2, y2, z2, w, h, d, box.pos.x, box.pos.y, box.pos.z, box.size.x, box.size.y, box.size.z)) {
                        return true
                    }
                }
            }
        }
    }
    return false
}

function clearBullets() {
    for (let bullet of player.bullets) {
        bullet.mesh.delete()
    }
    player.bullets = []
}

function setLaserShooter() {
    speed = 250
    jump = 7
    gravity = 18
    bulletSize = 0.1
    bulletSpeed = 1
    homing = 0
    bulletRandom = 0
    spread = 0.01
    drag = 0
    vel = [0, 0, 0]
    lifeTime = 1
    colour = [0, 1, 1]
    perShot = 1
    cooldown = 0.3
    bounces = 0
    
    if (selectedls == 1) {
        // pistol
    } else if (selectedls == 2) {
        // sniper
        bulletSpeed = 10
        spread = 0
        colour = [0, 0, 0]
        cooldown = 0.5
    } else if (selectedls == 3) {
        // shotgun
        perShot = 10
        spread = 0.1
        lifeTime = 0.2
        bulletSpeed = 0.5
        colour = [1, 0.5, 0]
        cooldown = 0.5
    } else if (selectedls == 4) {
        // machine gun
        spread = 0.1
        colour = [0, 0, 1]
        cooldown = 0.05
    }  else if (selectedls == 5) {
        // bee gun
        drag = 0.1
        bulletRandom = 100
        bulletSpeed = 0.5
        homing = 25
        lifeTime = 10
        colour = [1, 1, 0]
        cooldown = 0.1
    } else if (selectedls == 6) {
        // rocket launcher
        vel[1] = -10
        bulletSpeed = 0.25
        bulletSize = 0.5
        lifeTime = 2
        colour = [0, 1, 0]
        cooldown = 0.5
    }
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

    passType -= delta

    player.update()
    camera.pos = {x:player.pos.x, y:player.pos.y+0.3, z:player.pos.z}

    player.updateModel()

    player.lso.pos = {...camera.pos}
    player.lso.rot = {...camera.rot}
    player.lso.update()
    player.laserShooter.update()

    for (let player in players) {
        players[player].lso.pos = {...players[player].pos}
        players[player].lso.pos.y += 0.35
        players[player].lso.rot.y = players[player].rot.y
        players[player].lso.update()
        players[player].laserShooter.update()
    }

    for (let ai of ais) {
        if (isHost) {
            ai.update()
        } else if (lobbyData && lobbyData.host && playerData[lobbyData.host] && playerData[lobbyData.host].ais) {
            ai.pos.x += (playerData[lobbyData.host].ais[ai.id.toString()][0] - ai.pos.x) * delta * 10
            ai.pos.y += (playerData[lobbyData.host].ais[ai.id.toString()][1] - ai.pos.y) * delta * 10
            ai.pos.z += (playerData[lobbyData.host].ais[ai.id.toString()][2] - ai.pos.z) * delta * 10
            ai.camera.x += (playerData[lobbyData.host].ais[ai.id.toString()][3] - ai.camera.x) * delta * 10
            ai.camera.y += (playerData[lobbyData.host].ais[ai.id.toString()][4] - ai.camera.y) * delta * 10
        }
        ai.rot.y = ai.camera.y
        ai.lso.pos = {...ai.pos}
        ai.lso.pos.y += 0.35
        ai.lso.rot.y = ai.rot.y
        ai.lso.rot.x = ai.camera.x
        ai.lso.update()
        ai.laserShooter.update()
        ai.updateModel()
    }

    tFov = 60
    if (player.sprinting) {
        tFov = 60*1.2
    }

    fov = lerp(fov, tFov, delta * 10)

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

    for (let i = 1; i < 7; i++) {
        if (jKeys["Digit"+i] && i != selectedls) {
            selectedls = i
            player.lsdown = 0.35
            setLaserShooter()
        }
    }

    if (lobby && lobbyData.antihack) {
        setLaserShooter()
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
        players[player].laserShooter.meshes[0].colour = playerData[player].colour
        players[player].laserShooter.meshes[1].colour = playerData[player].colour
        players[player].laserShooter.meshes[2].colour = playerData[player].colour
        players[player].updateModel()
    }

    view = mat4.create()
	mat4.translate(view, view, [camera.pos.x, camera.pos.y, camera.pos.z])
	mat4.rotateY(view, view, camera.rot.y)
	mat4.rotateX(view, view, camera.rot.x)
	mat4.rotateZ(view, view, camera.rot.z)
	mat4.invert(view, view)

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)

	gl.enable(gl.BLEND)
	gl.clear(gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	mat4.perspective(projection, fov * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.01, 5000)

    gl.enable(gl.DEPTH_TEST)

	webgl.render()

    player.laserShooter.aRender()
    player.lso.aRender()

    for (let player in players) {
        players[player].laserShooter.aRender()
        players[player].lso.aRender()
    }
    
    for (let ai of ais) {
        ai.laserShooter.aRender()
        ai.lso.aRender()
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

    ui.text(canvas.width - 50*su, canvas.height - 50*su, 50*su, lsnames[selectedls-1], {align: "right"})

    ui.rect(canvas.width/2, 100*su, 600*su, 200*su, [0, 0, 0, 0.5])

    isHost = lobbyData && lobbyData.host == id

    uiA = lerp(uiA, uiT, delta*10)

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

        privateButton.set(canvas.width/2, canvas.height/2 - 90*su, 400*su, 50*su)
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

        passwordTo.set(canvas.width/2, canvas.height/2 - 30*su, 400*su, 50*su)
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


        antihackButton.set(canvas.width/2, canvas.height/2 + 30*su, 400*su, 50*su)
        antihackButton.textSize = 35*su
        if (lobbyData.antihack) {
            antihackButton.text = "Antihack"
        } else {
            antihackButton.text = "No Antihack"
        }
        
        antihackButton.basic()
        antihackButton.draw()

        if (antihackButton.hovered() && mouse.lclick) {
            antihackButton.click()
            lobbyData.antihack = !lobbyData.antihack
            sendMsg({setOptions: {antihack: lobbyData.antihack}, clearBullets: true})
        }

        resetStatsButton.set(canvas.width/2, canvas.height/2 + 90*su, 400*su, 50*su)
        resetStatsButton.textSize = 35*su
        
        resetStatsButton.basic()
        resetStatsButton.draw()

        if (resetStatsButton.hovered() && mouse.lclick) {
            resetStatsButton.click()
            sendMsg({resetStats: true})
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
        colour: colour,
        kills: kills,
        deaths: deaths,
        username: username,
    }
    if (isHost) {
        let poses = {}
        for (let ai of ais) {
            poses[ai.id.toString()] = [ai.pos.x, ai.pos.y, ai.pos.z, ai.camera.x, ai.camera.y]
        }
        data["ais"] = poses
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
        if (collidingMap3D(r.x, r.y, r.z, r.s, r.s, r.s)) {
            return {d: Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2), point: r}
        }
    }
    return {d: Math.sqrt((r.x-x)**2 + (r.y-y)**2 + (r.z-z)**2), point: r}
}
