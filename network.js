
var ws

var id = 0
var connected = false

var data = {}
var playerData = {}

var lobbyLoading = false

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
}

function connectToServer() {
    console.log("Connecting...")
    if (ws) {
        if (ws.readyState == WebSocket.OPEN) {
			ws.close()
		}
    }
    connected = false
    lobby = ""
    lobbies = {}
    lobbyData = {}
	id = 0
	ws = new WebSocket("wss://fps-game.glitch.me")

    ws.addEventListener("open", (event) => {
        sendMsg({"connect": true}, true)
    })

    ws.addEventListener("message", (event) => {
        var msg = JSON.parse(event.data)
        if (msg.id) {
			connected = true
			console.log("Connected with id: " + msg.id)
			id = msg.id
		}
        if (msg.lobbies) {
            lobbies = msg.lobbies
            // if (lobby) {
            //     lobbyData = lobbies[lobby]
            // }
            // console.log("Got some lobbies: " + JSON.stringify(msg.lobbies))
        }
        if (msg.lobbyData && passType <= 0) {
            lobbyData = msg.lobbyData[1]
        }
        if (msg.joinedLobby) {
            lobbyLoading = false
            lobby = msg.joinedLobby
            showM("Joined lobby: " + lobby)
            tScene = "game"
            overlayT = 1
            player.pos = {x: 0, y: 1, z: 0}
            uiA = 0
            camera.rot = {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}
            input.lockMouse()
            passwordTo.text = ""
            passUI = false
            sendMsg({getLobby: true})
        }
        if (msg.lobbyExists) {
            lobbyLoading = false
            showM("Lobby already exists")
        }
        if (msg.lobbyDoesNotExist) {
            lobbyLoading = false
            showM("Lobby does not exist")
        }
        if (msg.notHost) {
            lobbyLoading = false
            showM("You are not the host")
        }
        if (msg.wrongPassword) {
            lobbyLoading = false
            if (!passUI) {
                passUI = true
            } else {
                showM("Wrong Password")
            }
        }
        if (msg.data) {
            playerData = msg.data
        }
        if (msg.bullet) {
            player.bullets.push(new Bullet(...msg.bullet))
        }
    })

    ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
        connectToServer()
	})
}

setInterval(() => {
    if (scene == "game" && lobby) {
        sendMsg({data: data})
    }
}, 1000/10)

connectToServer()