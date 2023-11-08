
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

            console.log("Ahh, i see you want to mess some stuff up, here's some variables to try out!")
            console.log("speed - player speed [default:250]")
            console.log("jump - player jump height [default:7]")
            console.log("gravity - player gravity [default:18]")
            console.log("bulletSize - the bullet size [default:0.1]")
            console.log("bulletSpeed - the bullet speed [default:1]")
            console.log("vel - the bullet veloctiy [default:[0, 0, 0]]")
            console.log("bounces - the bullet bounces [default:0]")
            console.log("lifeTime - the bullet life time [default:1] WARNING: very dangerous")
            console.log("colour - the colour of the bullet in [red, green, blue] from 0 to 1 [default:[0, 1, 1]]")
            console.log("bulletRandom - makes the bullet move randomly [default:0]")
            console.log("homing - makes the bullet home in on players [default:0]")
            console.log("drag - makes the bullet slow down, negative numbers make it go faster [default:0]")
            console.log("maxBullets - the max amount of bullets [default:50]")
		}
        if (msg.lobbies) {
            lobbies = msg.lobbies
            // if (lobby) {
            //     lobbyData = lobbies[lobby]
            // }
            // console.log("Got some lobbies: " + JSON.stringify(msg.lobbies))
        }
        if (msg.lobbyData && passType <= 0) {
            if (msg.lobbyData[1]) {
                lobbyData = msg.lobbyData[1]
            }
        }
        if (msg.joinedLobby) {
            lobbyLoading = false
            lobby = msg.joinedLobby
            showM("Joined lobby: " + lobby)
            tScene = "game"
            overlayT = 1
            player.spawn()
            clearBullets()
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
        if (msg.hit) {
            player.spawn()
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