
var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
playButton.bgColour = [0, 0, 0, 0.5]

function menuTick() {
    ui.img(canvas.width/2, canvas.height/2, canvas.width, canvas.height, bgImg)

    ui.text(canvas.width/2, 100*su, 100*su, "FPS Game", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 300*su, 100*su)
    playButton.textSize = 75*su

    playButton.basic()

    playButton.draw()

    if (playButton.hovered() && mouse.lclick && overlayT == 0) {
        playButton.click()
        tScene = "game"
        overlayT = 1
        player.pos = {x: 0, y: 1, z: 0}
        uiA = 0
        camera.rot = {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}
        input.lockMouse()
    }
}