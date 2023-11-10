
var lastTime = 0
var delta = 0

var targetSize = {x: 1500, y: 1000}
var su = 1

var scene = "menu"
var tScene = "menu"

var overlayA = 0
var overlayT = 0

function lerp(start, end, multiply) {
    if (multiply > 1) multiply = 1
    if (multiply < 0) multiply = 0
    return start + (end-start) * multiply
}

function tick(timestamp) {
requestAnimationFrame(tick)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.canvas.width = canvas.width
    gl.canvas.height = canvas.height
    uCanvas.width = window.innerWidth
    uCanvas.height = window.innerHeight
    document.body.style.cursor = "default"

    let aspect = canvas.width / targetSize.x

	su = aspect
	if (su > canvas.height / targetSize.y) {
		su = canvas.height / targetSize.y
	}

    delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
	if (!delta) { delta = 0 }
	if (delta > 0.1) { delta = 0.1 }

    fetchC -= delta

    input.setGlobals()

    if (scene == "game" && !lobby && overlayT == 0) {
        overlayT = 1
        tScene = "menu"
    }

    if (scene == "game") {
        gameTick()
    } else {
        menuTick()
    }

    overlayA = lerp(overlayA, overlayT, delta*10)

    if (Math.abs(overlayT-overlayA) < 0.01 && overlayT == 1) {
        overlayT = 0
        scene = tScene
    }
    
    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, overlayA])

    input.updateInput()
}

var sensitivity = 0.005

input.mouseMove = (event) => {
    if (!input.isMouseLocked()) {
        if (event.clientX) {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
        }
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

input.checkInputs = (event) => {
    if (input.focused) {
		input.focused.focused = false
		input.focused = null
	}

    if (scene == "lobbies") {
        if (passUI) {
            passTo.checkFocus(event)
        } else {
            cLobbyName.checkFocus(event)
            privateTo.checkFocus(event)
        }
    } else if (scene == "game" && page == "lobbyO") {
        passwordTo.checkFocus(event)
    }
	

	if (!input.focused) {
		input.getInput.blur()
	}
}

requestAnimationFrame(tick)