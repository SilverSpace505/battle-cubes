
utils.setGlobals()

var glcanvas = document.getElementById("canvas")
var gl = glcanvas.getContext("webgl2", { antialias: false })

var canvas = document.getElementById("uCanvas")
var ctx = canvas.getContext("2d")

var webgl = new Webgl()

utils.setStyles()

var gravity = 0.3 * 60
var speed = 250
var jump = 7

var bounces = 0
var lifeTime = 1
var spread = 0.01
var bulletSize = 0.1
var bulletSpeed = 1
var colour = [0, 1, 1]
var drag = 0
var rapidFire = false
var bulletRandom = 0
var homing = 0
var vel = [0, 0, 0]
var maxBullets = 250
var perShot = 1
var cooldown = 0.1

var aigravity = 0.3 * 60
var aispeed = 250
var aijump = 7

var aibounces = 0
var ailifeTime = 1
var aispread = 0.01
var aibulletSize = 0.1
var aibulletSpeed = 1
var aicolour = [1, 0, 0]
var aidrag = 0
var airapidFire = false
var aibulletRandom = 0
var aihoming = 0
var aivel = [0, 0, 0]
var aimaxBullets = 50


var view = mat4.create()
const projection = mat4.create()

var camera = {pos: {x: 0, y: 0, z: 0}, rot: {x: 0, y: 0, z: 0}}

var grassTexture = new webgl.Texture("assets/grass.png")
var boxTexture = new webgl.Texture("assets/box.png")
var woodTexture = new webgl.Texture("assets/wood.png")
var stoneTexture = new webgl.Texture("assets/stone.png")
var leavesTexture = new webgl.Texture("assets/leaves.png")
var noiseTexture = new webgl.Texture("assets/noise.png")
var starsTexture = new webgl.Texture("assets/stars.png")

var bgImg = new Image(); bgImg.src = "assets/bg.png"
var peopleImg = new Image(); peopleImg.src = "assets/people.png"
var keyImg = new Image(); keyImg.src = "assets/key.png"