
var cLobbyName = new ui.TextBox(0, 0, 0, 0, "Lobby Name")

var createLobbyButton = new ui.Button(0, 0, 0, 0, "rect", "Create Lobby")
createLobbyButton.bgColour = [0, 0, 0, 0.5]

var backButton = new ui.Button(0, 0, 0, 0, "rect", "Back")
backButton.bgColour = [255, 0, 0, 0.5]

var lobby = ""
var lobbies = {}
var lobbyData = {}

var lobbiesC = new ui.Canvas(0, 0, 0, 0, [0, 0, 0, 0.5])

var sm = 0
var messageA = 0
var em = ""

var fetchC = 0

var passUI = false
var passA = 0
var passLobby = ""

var joinLobbyButton = new ui.Button(0, 0, 0, 0, "rect", "Join Lobby")
joinLobbyButton.bgColour = [0, 255, 0, 0.5]
var passTo = new ui.TextBox(0, 0, 0, 0, "Password")
var cancelButton = new ui.Button(0, 0, 0, 0, "rect", "Cancel")
cancelButton.bgColour = [255, 0, 0, 0.5]

var privateTo = new ui.TextBox(0, 0, 0, 0, "Private Lobby Name")
var joinLobbyButton2 = new ui.Button(0, 0, 0, 0, "rect", "Join Lobby")
joinLobbyButton2.bgColour = [0, 0, 0, 0.5]

function lobbiesTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Lobbies", {align: "center"})

    cLobbyName.text = cLobbyName.text.substring(0, 12)
    privateTo.text = privateTo.text.substring(0, 12)
    passTo.text = passTo.text.substring(0, 10)

    sm -= delta

    if (sm > 0) {
        messageA += (1 - messageA) * delta * 10
    } else {
        messageA += (0 - messageA) * delta * 10
    }

    ctx.globalAlpha = messageA
    ui.text(canvas.width/2, canvas.height/2+325*su, 35*su, em, {align: "center"})
    ctx.globalAlpha = 1

    ui.text(canvas.width/2 - 10*su - 450*su/2, canvas.height/2-320*su, 35*su, "Public", {align: "center"})
    
    cLobbyName.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2 - 37.5*su - 150*su, 450*su, 50*su)
    cLobbyName.outlineSize = 10*su

    if (!passUI) {
        cLobbyName.hover()
    }
    cLobbyName.draw()

    createLobbyButton.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2 + 37.5*su - 150*su, 450*su, 75*su)
    createLobbyButton.textSize = 50*su

    if (!passUI) {
        createLobbyButton.basic()
    }
    createLobbyButton.draw()
    
    if (createLobbyButton.hovered() && mouse.lclick && cLobbyName.text && !lobbyLoading && !passUI) {
        createLobbyButton.click()
        lobbyLoading = true
        showM("Creating lobby called " + cLobbyName.text)
        sendMsg({createLobby: cLobbyName.text})
    }


     
    privateTo.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2 - 37.5*su + 150*su, 450*su, 50*su)
    privateTo.outlineSize = 10*su

    if (!passUI) {
        privateTo.hover()
    }
    privateTo.draw()

    joinLobbyButton2.set(canvas.width/2 + 10*su + 450*su/2, canvas.height/2 + 37.5*su + 150*su, 450*su, 75*su)
    joinLobbyButton2.textSize = 50*su

    if (!passUI) {
        joinLobbyButton2.basic()
    }
    joinLobbyButton2.draw()
    
    if (joinLobbyButton2.hovered() && mouse.lclick && privateTo.text && !lobbyLoading && !passUI) {
        joinLobbyButton2.click()
        lobbyLoading = true
        passLobby = privateTo.text
        showM("Joining Lobby: " + privateTo.text)
        sendMsg({joinLobby: {name: privateTo.text, pass: ""}})
    }

    backButton.set(canvas.width/2, canvas.height-50*su, 300*su, 50*su)
    backButton.textSize = 35*su
    
    if (!passUI) {
        backButton.basic()
    }
    backButton.draw()

    if (backButton.hovered() && mouse.lclick && overlayT == 0 && !passUI) {
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
        ui.text(10*su, i*35*su + 30*su, 22.5*su, lobby)

        ui.text(450*su-30*su-80*su-30*su-5*su, i*35*su + 30*su, 25*su, lobbies[lobby].players.length.toString(), {align: "right"})
        ui.img(450*su-30*su-80*su-30*su/2, i*35*su + 30*su, 25*su, 25*su, peopleImg)

        if (lobbies[lobby].password == "exists") {
            ui.img(450*su-15*su, i*35*su + 30*su, 25*su, 25*su, keyImg)
        }

        let joinRect = [450*su-30*su-80*su/2, i*35*su + 30*su, 80*su, 30*su]
        if (ui.hovered(joinRect[0]+lobbiesC.x-lobbiesC.width/2, joinRect[1]+lobbiesC.y-lobbiesC.height/2, joinRect[2], joinRect[3]) && !passUI) {
            if (mouse.ldown) {
                ui.rect(joinRect[0], joinRect[1], joinRect[2]*0.9, joinRect[3]*0.9, [0, 255, 0, 0.5])
            } else {
                ui.rect(joinRect[0], joinRect[1], joinRect[2]*1.1, joinRect[3]*1.1, [0, 255, 0, 0.5])
            }
            if (mouse.lclick && !lobbyLoading) {
                lobbyLoading = true
                passLobby = lobby
                showM("Joining Lobby: " + lobby)
                sendMsg({joinLobby: {name: lobby, pass: ""}})
            }
        } else {
            ui.rect(...joinRect, [0, 255, 0, 0.35])
        }
        ui.text(joinRect[0], joinRect[1], 25*su, "Join", {align: "center"})
        i++
    }

    ui.setC()

    if (passUI) {
        passA += (1 - passA) * delta * 10
    } else {
        passA += (0 - passA) * delta * 10
    }

    ctx.globalAlpha = passA

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 0.25])

    ui.rect(canvas.width/2, canvas.height/2, 675*su, 300*su, [0, 0, 0, 0.5])

    passTo.set(canvas.width/2, canvas.height/2-85*su, 625*su, 75*su)
    passTo.outlineSize = 10*su
    
    if (passUI) passTo.hover()
    passTo.draw()

    joinLobbyButton.set(canvas.width/2, canvas.height/2, 625*su, 75*su)
    joinLobbyButton.textSize = 50*su
    
    if (passUI) joinLobbyButton.basic()
    joinLobbyButton.draw()

    cancelButton.set(canvas.width/2, canvas.height/2+85*su, 625*su, 75*su)
    cancelButton.textSize = 50*su
    
    if (passUI) cancelButton.basic()
    cancelButton.draw()

    if (joinLobbyButton.hovered() && passUI && mouse.lclick && !lobbyLoading) {
        joinLobbyButton.click()
        lobbyLoading = true
        showM("Joining Lobby: " + passLobby)
        sendMsg({joinLobby: {name: passLobby, pass: passTo.text}})
    }

    if (cancelButton.hovered() && passUI && mouse.lclick) {
        passUI = false
        cancelButton.click()
    }

    ctx.globalAlpha = 1
}

function showM(message, time=3) {
    sm = 3
    em = message
}