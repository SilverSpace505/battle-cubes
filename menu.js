
var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
playButton.bgColour = [0, 0, 0, 0.5]

var instructionsButton = new ui.Button(0, 0, 0, 0, "rect", "Instructions")
instructionsButton.bgColour = [0, 0, 0, 0.5]

var usernameTo = new ui.TextBox(0, 0, 0, 0, "Username")

let lusername = localStorage.getItem("username")
if (lusername) {
    username = lusername
    usernameTo.text = lusername
}

function menuTick() {
    let aspect = 2906/1621
    let bgSize = {x: canvas.height*aspect, y: canvas.width/aspect}
    if (canvas.width > bgSize.x) {
        bgSize.x = canvas.width
    }
    if (canvas.height > bgSize.y) {
        bgSize.y = canvas.height
    }
    ui.img(canvas.width/2, canvas.height/2, bgSize.x, bgSize.y, bgImg)

    if (scene == "lobbies") {
        lobbiesTick()
        return
    }
    if (scene == "instructions") {
        instructionsTick()
        return
    }

    ui.text(canvas.width/2, 100*su, 100*su, "Battle Cubes", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 300*su, 100*su)
    playButton.textSize = 75*su

    playButton.basic()

    playButton.draw()

    if (playButton.hovered() && mouse.lclick && overlayT == 0) {
        playButton.click()
        tScene = "lobbies"
        messageA = 0
        sm = 0
        overlayT = 1
        passTo.text = ""
        cLobbyName.text = ""
        privateTo.text = ""
        passUI = false
        passA = 0
    }

    instructionsButton.set(canvas.width/2, canvas.height/2+80*su, 300*su, 50*su)
    instructionsButton.textSize = 50*su

    instructionsButton.basic()

    instructionsButton.draw()

    if (instructionsButton.hovered() && mouse.lclick) {
        tScene = "instructions"
        instructionsButton.click()
        overlayT = 1
    }

    usernameTo.set(canvas.width/2, canvas.height/2+130*su, 300*su, 30*su)
    usernameTo.outlineSize = 10*su

    usernameTo.text = usernameTo.text.substring(0, 14)

    usernameTo.hover()
    usernameTo.draw()

    username = usernameTo.text

    localStorage.setItem("username", username)
}