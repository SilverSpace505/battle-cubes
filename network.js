
var ws

var id = 0
var connected = false

var data = {}
var playerData = {}

var lobbyLoading = false

var isHost = false

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
}

var vid = ""
var vidLoaded = localStorage.getItem("id")
var letters = "abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRS0123456789"
if (vidLoaded) {
	vid = vidLoaded
} else {
	for (let i = 0; i < 8; i++) {
		vid += letters[Math.round(Math.random()*(letters.length-1))]
	}
	localStorage.setItem("id", vid)
}

function getViews() {
	ws.send(JSON.stringify({getViews: true}))
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
	ws = new WebSocket("wss://server.silverspace.online:443")

    ws.addEventListener("open", (event) => {
        sendMsg({connect: "battle-cubes"}, true)
    })

    ws.addEventListener("message", (event) => {
        var msg = JSON.parse(event.data)
        if ("connected" in msg) {
			connected = true
			console.log("Connected with id: " + msg.connected)
			id = msg.connected
            sendMsg({view: vid})

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
        if ("ping" in msg) {
            sendMsg({ping: true})
        }
        if ("views" in msg) {
            console.log(JSON.stringify(msg.views))
        }
        if ("lobbies" in msg) {
            lobbies = msg.lobbies
            // if (lobby) {
            //     lobbyData = lobbies[lobby]
            // }
            // console.log("Got some lobbies: " + JSON.stringify(msg.lobbies))
        }
        if ("lobbyData" in msg && optType <= 0) {
            if (msg.lobbyData[1]) {
                lobbyData = msg.lobbyData[1]
            }
        }
        if ("joinedLobby" in msg) {
            lobbyLoading = false
            lobby = msg.joinedLobby
            showM("Joined lobby: " + lobby)
            tScene = "game"
            overlayT = 1
            player.spawn()
            for (let ai of ais) {
                ai.delete()
            }
            ais = []
            clearBullets()
            uiA = 0
            camera.rot = {x: 0, y: 0, z: 0}
            input.lockMouse()
            passwordTo.text = ""
            passUI = false
            kills = 0
            isDead = false
            deadA = 0
            player.lsdown = 0
            player.laserShooter.pos.y = -0.4*player.ls
            deaths = 0
            sendMsg({getLobby: true})
        }
        if ("lobbyExists" in msg) {
            lobbyLoading = false
            showM("Lobby already exists")
        }
        if ("lobbyDoesNotExist" in msg) {
            lobbyLoading = false
            showM("Lobby does not exist")
        }
        if ("notHost" in msg) {
            lobbyLoading = false
            showM("You are not the host")
        }
        if ("wrongPassword" in msg) {
            lobbyLoading = false
            if (!passUI) {
                passUI = true
            } else {
                showM("Wrong Password")
            }
        }
        if ("data" in msg) {
            playerData = msg.data
        }
        if ("bullet" in msg) {
            player.bullets.push(new Bullet(...msg.bullet))
        }
        if ("hit" in msg) {
            isDead = true
            deaths += 1
        }
        if ("aihit" in msg) {
            for (let ai of ais) {
                if (ai.id == msg.aihit) {
                    ai.spawn()
                }
            }
        }
        if ("clearBullets" in msg) {
            clearBullets()
        }
        if ("resetStats" in msg) {
            kills = 0
            deaths = 0
        }
    })

    ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
        connectToServer()
	})
}

setInterval(() => {
    if (!window.scene) { return }
    if (scene == "game" && lobby) {
        sendMsg({data: data})
    }
}, 1000/10)

connectToServer()
