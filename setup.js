
var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", { antialias: false })

var gravity = 0.3 * 60
var speed = 250
var friction = 0.5	 
var airFriction = 0.95
var airSpeed = 0.085 * 120 
var jump = 7

var bounces = 0
var lifeTime = 1
var spread = 0.01

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