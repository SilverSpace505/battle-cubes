
var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", { antialias: false })

var uCanvas = document.getElementById("uCanvas")
var ctx = uCanvas.getContext("2d")

var webgl = new Webgl()

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

var view = mat4.create()
const projection = mat4.create()

var camera = {pos: {x: 0, y: 0, z: 0}, rot: {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}}

var grassTexture = new webgl.Texture("assets/grass.png")
var boxTexture = new webgl.Texture("assets/box.png")
var woodTexture = new webgl.Texture("assets/wood.png")
var stoneTexture = new webgl.Texture("assets/stone.png")
var leavesTexture = new webgl.Texture("assets/leaves.png")

var bgImg = new Image(); bgImg.src = "assets/bg.png"
var peopleImg = new Image(); peopleImg.src = "assets/people.png"
var keyImg = new Image(); keyImg.src = "assets/key.png"

function rotVec(vec, rx, ry, rz) {
    // Rotation around Z-axis
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const x1 = vec.x * cosZ - vec.y * sinZ;
    const y1 = vec.x * sinZ + vec.y * cosZ;

    // Rotation around X-axis
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = y1 * cosX - vec.z * sinX;
    const z1 = y1 * sinX + vec.z * cosX;

    // Rotation around Y-axis
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = x1 * cosY + z1 * sinY;
    const z2 = -x1 * sinY + z1 * cosY;

    return {x:x2, y:y2, z:z2}
}