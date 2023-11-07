
var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
playButton.bgColour = [0, 0, 0, 0.5]

function menuTick() {
    let aspect = 2906/1621
    let bgSize = {x: canvas.height*aspect, y: canvas.width/aspect}
    if (canvas.width > bgSize.x) {
        bgSize.x = canvas.width
    }
    if (canvas.height > bgSize.y) {
        bgSize.y = canvas.height
    }
    ui.img(canvas.width/2, canvas.height/2, bgSize.x, bgSize.y, bgImg)

    if (scene == "lobbies") {
        lobbiesTick()
        return
    }

    ui.text(canvas.width/2, 100*su, 100*su, "FPS Game", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 300*su, 100*su)
    playButton.textSize = 75*su

    playButton.basic()

    playButton.draw()

    if (playButton.hovered() && mouse.lclick && overlayT == 0) {
        playButton.click()
        tScene = "lobbies"
        overlayT = 1
    }
}