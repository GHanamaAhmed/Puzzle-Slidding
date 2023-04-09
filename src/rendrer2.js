//main code
let puzzle = document.getElementById("puzzle")
let btnstart = document.querySelector(".start")
let btnstop = document.querySelector(".stop")
let timer = document.querySelector(".timer")
let continu = document.querySelector(".continue")
let start = document.querySelector("#start")
let goal = document.querySelector("#goal")
let ref = document.querySelector("#ref")
let L = document.querySelector("#L")
let ran = document.querySelector("#ran")
let P = document.querySelector("#P")
let A = document.querySelector("#A")
let goalTabel = [0, 1, 2, 3, 4, 5, 6, 7, 8]
let deptha = document.querySelector(".depth-a")
let timea = document.querySelector(".time-a")
let depthl = document.querySelector(".depth-l")
let timel = document.querySelector(".time-l")
let depthp = document.querySelector(".depth-p")
let timep = document.querySelector(".time-p")
goal.value = goalTabel.toString()
let depth = document.querySelector("#depth")
let RGame = document.querySelector(".RGame")
let win = document.querySelector(".win")
let startTime;
let newTime;
let isStart = false;
var interval;
var tabel = [];
let clearTabel = () => {
    tabel = []
}
let emptyIndex;
let tabelRandom = () => {
    clearTabel()
    let path = [-1, 1, -3, 3]
    let random = Math.floor(Math.random() * (100 - 10) + 10)
    tabel = [...goalTabel]
    emptyIndex = tabel.indexOf(0)
    let targetIndex
    let row;
    let col;
    for (let index = 0; index < random; index++) {
        row = Math.floor(emptyIndex / 3);
        col = emptyIndex % 3;
        let random2 = path[Math.floor(Math.random() * 4)]
        if (random2 == -1 && col > 0) {
            targetIndex = emptyIndex + random2;
            [tabel[emptyIndex], tabel[targetIndex]] = [tabel[targetIndex], tabel[emptyIndex]];
        } else if (random2 == 1 && col < 2) {
            targetIndex = emptyIndex + random2;
            [tabel[emptyIndex], tabel[targetIndex]] = [tabel[targetIndex], tabel[emptyIndex]];
        } else if (random2 == -3 && row > 0) {
            targetIndex = emptyIndex + random2;
            [tabel[emptyIndex], tabel[targetIndex]] = [tabel[targetIndex], tabel[emptyIndex]];
        } else if (random2 == 3 && row < 2) {
            targetIndex = emptyIndex + random2;
            [tabel[emptyIndex], tabel[targetIndex]] = [tabel[targetIndex], tabel[emptyIndex]];
        }
        emptyIndex = tabel.indexOf(0)
    }
    start.value = tabel.toString()
}
btnstart.addEventListener("click", (e) => {
    btnstop.disabled = false
    continu.disabled = false
    e.preventDefault()
    if (!isStart && btnstart.innerHTML == "Start") {
        isStart = true;
        btnstart.innerHTML = "Restart"
        startTime = Date.now()
        interval = setInterval(() => {
            let t = Date.now()
            newTime = t - startTime
            timer.innerHTML = (newTime / 1000).toFixed(2)
        }, 50)
    } else {
        btnstop.disabled = true
        continu.disabled = true
        clearInterval(interval)
        clearTabel()
        tabelRandom()
        removePuzzle()
        start.value = tabel
        afichage()
        timer.innerHTML = 0
        btnstart.innerHTML = "Start"
        isStart = false
        timea.innerHTML = "Time:"
        deptha.innerHTML = "Depth:"
        timel.innerHTML = "Time:"
        depthl.innerHTML = "Depth:"
        timep.innerHTML = "Time:"
        depthp.innerHTML = "Depth:"
    }
})
btnstop.addEventListener("click", (e) => {
    e.preventDefault()
    isStart = false;
    clearInterval(interval)
})
continu.addEventListener("click", (e) => {
    e.preventDefault()
    if (!isStart) {
        isStart = true
        let newTime2
        interval = setInterval(() => {
            let t = Date.now()
            newTime2 = t - startTime + newTime
            timer.innerHTML = ((newTime2 / 1000)).toFixed(2)
            newTime = newTime2
            newTime = 0
        }, 50)
    }
})
let removePuzzle = () => {
    while (puzzle.firstChild) {
        puzzle.removeChild(puzzle.firstChild)
    }
}
var click = (e) => {
    if (isStart) {
        if ((emptyIndex - e == 1 && emptyIndex % 3 > 0) || (emptyIndex - e == -1 && emptyIndex % 3 < 2) || (emptyIndex - e == 3 && Math.floor(emptyIndex / 3) > 0) || (emptyIndex - e == -3 && Math.floor(emptyIndex / 3) < 2)) {
            [tabel[emptyIndex], tabel[e]] = [tabel[e], tabel[emptyIndex]]
        }
        emptyIndex = tabel.indexOf(0)
        removePuzzle()
        afichage()
    }
}
var element
var afichage = () => {
    tabel.map((e) => {
        element = document.createElement("button")
        element.onclick = () => {
            click(tabel.indexOf(e));
            if (tabel.toString() == goalTabel.toString()) {
                isStart = false;
                clearInterval(interval)
                win.classList.replace("hidden", "flex")
            }
        }
        if (e == 0) {
            element.className = "flex justify-center items-center text-7xl bg-white"
            element.innerHTML = ""
        } else {
            element.className = "flex justify-center items-center text-7xl bg-gray-900 text-amber-500"
            element.innerHTML = e
        }
        puzzle.appendChild(element)
    })
}
tabelRandom()
removePuzzle()
afichage()
function sleep(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}
let isClicking = false;
A.addEventListener("click", async (e) => {
    e.preventDefault();
    if (isClicking) {
        return;
    }
    let s = start.value;
    let g = goal.value;
    try {
        if (s == "" || g == "") {

        } else {
            let ts = String(s).split(",").map((e) => Number.parseInt(e))
            let tg = String(g).split(",").map((e) => Number.parseInt(e))
            tabel = ts;
            goalTabel = tg;
            emptyIndex = tabel.indexOf(0)
            removePuzzle()
            afichage()
        }
    } catch (error) {
        alert("Tabel value not correct")
    }
    e.preventDefault();
    btnstart.innerHTML = "Restart"
    isStart = true
    timer.innerHTML = `0s`
    let resulat = window.versions.a(tabel, goalTabel);
    resulat.then(async ({ path, nowTime }) => {
        console.log(path);
        isClicking = true;
        timea.innerHTML = `Time: ${nowTime}`
        deptha.innerHTML = `Depth: ${path.length}`
        btnstart.innerHTML = "Start"
        let targetIndex;
        for (const e of path) {
            await new Promise(resolve => setTimeout(resolve, 400));
            if (e == "up") {
                targetIndex = emptyIndex - 3
                click(targetIndex)
            } else if (e == "down") {
                targetIndex = emptyIndex + 3
                click(targetIndex)
            } else if (e == "right") {
                targetIndex = emptyIndex + 1
                click(targetIndex)
            }
            else if (e == "left") {
                targetIndex = emptyIndex - 1
                click(targetIndex)
            }
        }

        isStart = false
        clearInterval(interval)
        isClicking = false;

    }).catch(err => {
        isClicking = false
        isStart = false
    });


})
L.addEventListener("click", async (e) => {
    e.preventDefault();
    if (isClicking) {
        return;
    }
    let s = start.value;
    let g = goal.value;
    try {
        if (s == "" || g == "") {

        } else {
            let ts = String(s).split(",").map((e) => Number.parseInt(e))
            let tg = String(g).split(",").map((e) => Number.parseInt(e))
            tabel = ts;
            goalTabel = tg;
            emptyIndex = tabel.indexOf(0)
            removePuzzle()
            afichage()
        }
    } catch (error) {
        alert("Tabel value not correct")
    }
    isStart = true
    btnstart.innerHTML = "Restart"
    timer.innerHTML = `0s`
    let resulat = window.versions.l(tabel, goalTabel);
    resulat.then(async ({ path, nowTime }) => {
        console.log(path);
        isClicking = true;
        timel.innerHTML = `Time: ${nowTime}`
        depthl.innerHTML = `Depth: ${path.length}`
        btnstart.innerHTML = "Start"
        let targetIndex;
        for (const e of path) {
            await new Promise(resolve => setTimeout(resolve, 400));
            if (e == "up") {
                targetIndex = emptyIndex - 3
                click(targetIndex)
            } else if (e == "down") {
                targetIndex = emptyIndex + 3
                click(targetIndex)
            } else if (e == "right") {
                targetIndex = emptyIndex + 1
                click(targetIndex)
            }
            else if (e == "left") {
                targetIndex = emptyIndex - 1
                click(targetIndex)
            }
        }
        isStart = false
        clearInterval(interval)
        isClicking = false;

    }).catch(err => {
        isClicking = false
        isStart = false
    })
})

P.addEventListener("click", async (e) => {
    e.preventDefault();
    if (isClicking) {
        return;
    }
    let s = start.value;
    let g = goal.value;
    try {
        if (s == "" || g == "") {

        } else {
            let ts = String(s).split(",").map((e) => Number.parseInt(e))
            let tg = String(g).split(",").map((e) => Number.parseInt(e))
            tabel = ts;
            goalTabel = tg;
            emptyIndex = tabel.indexOf(0)
            removePuzzle()
            afichage()
        }
    } catch (error) {
        alert("Tabel value not correct")
    }
    let nDepth;
    try {
        nDepth = Number.parseInt(depth.value);
        if (depth.value) {
            e.preventDefault();
            btnstart.innerHTML = "Restart"
            isStart = true
            timer.innerHTML = `0s`
            let resulat = window.versions.p(tabel, goalTabel, nDepth);
            resulat.then(async ({ path, nowTime }) => {
                console.log(path);
                isClicking = true;
                timep.innerHTML = `Time: ${nowTime}`
                depthp.innerHTML = `Depth: ${path.length}`
                btnstart.innerHTML = "Start"
                let targetIndex
                for (const e of path) {
                    await new Promise(resolve => setTimeout(resolve, 400));
                    if (e == "up") {
                        targetIndex = emptyIndex - 3
                        click(targetIndex)
                    } else if (e == "down") {
                        targetIndex = emptyIndex + 3
                        click(targetIndex)
                    } else if (e == "right") {
                        targetIndex = emptyIndex + 1
                        click(targetIndex)
                    }
                    else if (e == "left") {
                        targetIndex = emptyIndex - 1
                        click(targetIndex)
                    }
                }
                isStart = false
                clearInterval(interval)
                isClicking = false;
            }).catch(err => { isClicking = false });
        } else {
            isClicking = false;
        }

    } catch (error) {
        alert("Entry number value");
        isClicking = false;
    }
})
ref.addEventListener("click", (e) => {
    e.preventDefault()
    let s = start.value;
    let g = goal.value;
    try {
        if (s == "" || g == "") {

        } else {
            let ts = String(s).split(",").map((e) => Number.parseInt(e))
            let tg = String(g).split(",").map((e) => Number.parseInt(e))
            tabel = ts;
            goalTabel = tg;
            emptyIndex = tabel.indexOf(0)
            removePuzzle()
            startTime = 0
            clearInterval(interval)
            isStart = false
            timer.innerHTML = 0
            btnstart.innerHTML = "Start"
            afichage()
            timea.innerHTML = "Time:"
            deptha.innerHTML = "Depth:"
            timel.innerHTML = "Time:"
            depthl.innerHTML = "Depth:"
            timep.innerHTML = "Time:"
            depthp.innerHTML = "Depth:"
        }
    } catch (error) {
        alert("Tabel value not correct")
    }

})
ran.addEventListener("click", (e) => {
    e.preventDefault()

    if (goal.value == " ") {
        goalTabel = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        goal.value = goalTabel.toString()
    }
    tabelRandom()
    emptyIndex = tabel.indexOf(0)
    removePuzzle()
    startTime = 0
    clearInterval(interval)
    isStart = false
    timer.innerHTML = 0
    btnstart.innerHTML = "Start"
    afichage()
    start.value = tabel.toString()
    timea.innerHTML = "Time:"
    deptha.innerHTML = "Depth:"
    timel.innerHTML = "Time:"
    depthl.innerHTML = "Depth:"
    timep.innerHTML = "Time:"
    depthp.innerHTML = "Depth:"
})
RGame.addEventListener("click", (e) => {
    win.classList.replace("flex", "hidden")
    tabelRandom()
    emptyIndex = tabel.indexOf(0)
    removePuzzle()
    startTime = 0
    clearInterval(interval)
    isStart = false
    timer.innerHTML = 0
    btnstart.innerHTML = "Start"
    afichage()
})