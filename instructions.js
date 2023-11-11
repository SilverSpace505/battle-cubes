
function instructionsTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Instructions", {align: "center"})

    ui.text(canvas.width/2-300*su, 100*su+150*su, 50*su, "Controls", {align: "center"})
    ui.text(canvas.width/2-300*su, 100*su+150*su+50*su, 30*su, "WASD - Move \nTab - Pause/Unpause \nSpace - Jump \nLeft Click - Shoot \n1-6 - Switch Laser Shooter \nShift - Sprint", {align: "center"})

    ui.text(canvas.width/2+300*su, 100*su+150*su, 50*su, "Guide", {align: "center"})
    ui.text(canvas.width/2+300*su, 100*su+150*su+50*su, 25*su, "This is a FPS game made in about a week. To play just create a lobby or join one on the left in the lobbies list, then, either fight some AI's that spawn around the map or fight some friends. The goal of this game is to try and get as many kills as possible.", {align: "center", wrap: 450*su})

    backButton.set(canvas.width/2, canvas.height-50*su, 300*su, 50*su)
    backButton.textSize = 35*su
    
    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick && overlayT == 0) {
        overlayT = 1
        tScene = "menu"
    }
}