
var cLobbyName = new ui.TextBox(0, 0, 0, 0, "Lobby Name")

var createLobbyButton = new ui.Button(0, 0, 0, 0, "rect", "Create Lobby")
createLobbyButton.bgColour = [0, 0, 0, 0.5]

var backButton = new ui.Button(0, 0, 0, 0, "rect", "Back")
backButton.bgColour = [255, 0, 0, 0.5]

var lobby = ""
var lobbies = {}
var lobbyData = {}

var lobbiesC = new ui.Canvas(0, 0, 0, 0, [0, 0, 0, 0.5])

var fetchC = 0

function lobbiesTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Lobbies", {align: "center"})

    if (cLobbyName.text.length > 12) {
        cLobbyName.text = cLobbyName.text.substring(0, 12)
    }
    
    cLobbyName.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2 - 75*su, 450*su, 50*su)

    cLobbyName.hover()
    cLobbyName.draw()

    createLobbyButton.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2, 450*su, 75*su)
    createLobbyButton.textSize = 50*su

    createLobbyButton.basic()
    createLobbyButton.draw()
    
    if (createLobbyButton.hovered() && mouse.lclick && cLobbyName.text && !lobbyLoading) {
        createLobbyButton.click()
        lobbyLoading = true
        console.log("Creating lobby called " + cLobbyName.text)
        sendMsg({createLobby: cLobbyName.text})
    }

    backButton.set(canvas.width/2, canvas.height-50*su, 300*su, 50*su)
    backButton.textSize = 35*su
    
    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick && overlayT == 0) {
        overlayT = 1
        tScene = "menu"
    }

    lobbiesC.set(canvas.width/2 - 10*su - 450*su/2, canvas.height/2, 450*su, 600*su)

    if (fetchC <= 0) {
        fetchC = 3
        sendMsg({fetchLobbies: true})
    }

    lobbiesC.draw()

    ui.setC(lobbiesC)

    let i = 0
    for (let lobby in lobbies) {
        ui.rect(450*su/2, i*35*su + 30*su, 450*su, 30*su, [0, 0, 0, 0.5])
        ui.text(10*su, i*35*su + 30*su, 25*su, lobby)

        ui.text(450*su-10*su-80*su-30*su-5*su, i*35*su + 30*su, 25*su, lobbies[lobby].players.length.toString(), {align: "right"})
        ui.img(450*su-10*su-80*su-30*su/2, i*35*su + 30*su, 25*su, 25*su, peopleImg)

        let joinRect = [450*su-10*su-80*su/2, i*35*su + 30*su, 80*su, 30*su]
        if (ui.hovered(joinRect[0]+lobbiesC.x-lobbiesC.width/2, joinRect[1]+lobbiesC.y-lobbiesC.height/2, joinRect[2], joinRect[3])) {
            if (mouse.ldown) {
                ui.rect(joinRect[0], joinRect[1], joinRect[2]*0.9, joinRect[3]*0.9, [0, 255, 0, 0.5])
            } else {
                ui.rect(joinRect[0], joinRect[1], joinRect[2]*1.1, joinRect[3]*1.1, [0, 255, 0, 0.5])
            }
            if (mouse.lclick && !lobbyLoading) {
                console.log("Joining Lobby: " + lobby)
                sendMsg({joinLobby: lobby})
            }
        } else {
            ui.rect(...joinRect, [0, 255, 0, 0.35])
        }
        ui.text(joinRect[0], joinRect[1], 25*su, "Join", {align: "center"})
        i++
    }

    ui.setC()
}

input.checkInputs = (event) => {
    if (input.focused) {
		input.focused.focused = false
		input.focused = null
	}
	
	cLobbyName.checkFocus(event)

	if (!input.focused) {
		input.getInput.blur()
	}
}