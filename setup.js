
var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", { antialias: false })

var gravity = 0.3 * 60
var speed = 500
var friction = 0.5	 
var airFriction = 0.95
var airSpeed = 0.085 * 120 
var jump = 7