"use strict";
let startButton, canvas, ctx, moveInterval, circleRadius = 5, eventNumber = 1, texture, texture2, texture3, texture4;

function saveEvent(message) {
    document.getElementById('message-label').innerText = message;
    saveToLocalStorage(message);
    saveToServer(message);
}

async function openWork() {
    clearInterval(moveInterval);
    removeTable();

    createStructureOfFifthBlock();

    let response = await fetch('emptify_DB.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

    eventNumber = 1;
    localStorage.clear(); 

    saveEvent('Play button pressed');
    
    canvas = document.getElementById('anim-canvas');
    texture = new Image(); texture2 = new Image(); texture3 = new Image(); texture4 = new Image();
    texture.src = "texture.jpg"; texture2.src = "texture2.jpg"; texture3.src = "texture3.jpg"; texture4.src = "texture4.jpg";
    texture.onload = () => {
        texture2.onload = () => {
            texture3.onload = () => {
                texture4.onload = () => {
                    drawCircle(canvas.width / 2, canvas.height / 2); 
                }
            }
        }
    }
}

function createBackgorund() {
    let pattern = ctx.createPattern(texture, "repeat"), pattern2 = ctx.createPattern(texture2, "repeat"), pattern3 = ctx.createPattern(texture3, "repeat"), pattern4 = ctx.createPattern(texture4, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = pattern2;
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = pattern3;
    ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = pattern4;
    ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
}

function drawCircle(centreX, centreY) {
    canvas = document.getElementById('anim-canvas');
    ctx = canvas.getContext('2d');

    createBackgorund();

    ctx.beginPath();
    ctx.arc(centreX, centreY, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

async function closeWork() {
    saveEvent('Close button pressed');
    
    clearInterval(moveInterval);
    await moveToServer();

	let fifthBlock = document.querySelector('.fifth');
    fifthBlock.innerHTML = `<table id="table">
                                <tr>
                                    <th>Number</th>
                                    <th>Server time</th>
                                    <th>Local time</th>
                                    <th>Message</th>
                                </tr>   
                            </table>`;

    let response = await fetch('get.php');
    let tableFromDataBase = await response.json();

    for(let i = 0; i < tableFromDataBase.length; i++)
        appendRow(tableFromDataBase[i]);
	document.getElementById('third-label').innerText = 'Press play to open a work zone';
}

function moveCircle() {
    canvas = document.getElementById('anim-canvas');

    let stepCounter = 0;
    let quadrantCounter = [false, false, false, false];

    let centreX = canvas.width / 2, centreY = canvas.height / 2;
    moveInterval = setInterval(() => {
        if (stepCounter % 4 == 0) {
            centreX -= stepCounter;
            saveEvent('Moved left');
        } else if (stepCounter % 4 == 1) {
            centreY -= stepCounter;
            saveEvent('Moved up');
        } else if (stepCounter % 4 == 2) {
            centreX += stepCounter;
            saveEvent('Moved right');
        } else {
            centreY += stepCounter;
            saveEvent('Moved bottom');
        }

        stepCounter++;
        drawCircle(centreX, centreY);

        if (canvas.width / 2 - centreX > 10 && canvas.height / 2 - centreY > 10) {
            quadrantCounter[0] = true;
            saveEvent('0 quadrant entered');
        } else if (centreX - canvas.width / 2 > 10 && canvas.height / 2 - centreY > 10) {
            quadrantCounter[1] = true;
            saveEvent('1 quadrant entered');
        } else if (centreX - canvas.width / 2 > 10 && centreY - canvas.height / 2 > 10) {
            quadrantCounter[2] = true;
            saveEvent('2 quadrant entered');
        } else if (canvas.width / 2 - centreX > 10 && centreY - canvas.height / 2 > 10) {
            quadrantCounter[3] = true;
            saveEvent('3 quadrant entered');
        }

        let allQuadrantsVisited = true;
        for (let i = 0; i < quadrantCounter.length; i++) {
            if (!quadrantCounter[i]) {
                allQuadrantsVisited = false;
            }
        }
        if (allQuadrantsVisited) {
            clearInterval(moveInterval);
            startButton.innerText = 'Reload';
            startButton.setAttribute('onclick', "reloadCircle()");
            startButton.disabled = false;
            saveEvent('Animation stopped');
        }
    }, 200);
}

function startAnimation() {
    startButton = document.getElementById('start');
    startButton.disabled = true;
	moveCircle();
    saveEvent('Start button pressed');
}

function createStructureOfFifthBlock() {
    let fifthBlock = document.querySelector('.fifth');
    fifthBlock.innerHTML = `<div class="work">
                                <div class="controls">
                                    <div class="left-controls">
                                        <p id="message-label">This is a message field</p>
                                    </div>
                                    <div class="right-controls">
                                        <button type="button" onclick="closeWork()" id="close">Close</button>
                                        <button type="button" onclick="startAnimation()" id="start">Start</button>
                                    </div>
                                </div>
                                <div class="anim">
                                    <canvas id="anim-canvas"></canvas>
                                </div>
                            </div>`;
    document.getElementById('third-label').innerText = 'Press close to close a work zone';
}

function reloadCircle() {
    startButton = document.getElementById('start');
    startButton.innerText = 'Start';
    startButton.setAttribute('onclick', "startAnimation()");

    createStructureOfFifthBlock();

    drawCircle(canvas.width / 2, canvas.height / 2);
    saveEvent('Reload button pressed');
}


async function saveToServer(message) {
    let eventInfo = {
        message : message,
        number : eventNumber
    }
    eventNumber++;

    await fetch('save_immediately.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventInfo)
    });
}

function getLocalTime() {
    let localTime = new Date();

    let year = localTime.getFullYear();
    let month = ('0' + (localTime.getMonth() + 1)).slice(-2); 
    let day = ('0' + localTime.getDate()).slice(-2);
    let hour = ('0' + localTime.getHours()).slice(-2);
    let minute = ('0' + localTime.getMinutes()).slice(-2);
    let second = ('0' + localTime.getSeconds()).slice(-2);

    let formattedLocalTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return formattedLocalTime;
}

function saveToLocalStorage(message) {
    let localTime = getLocalTime();
    
    let eventInfo = {
        message : message,
        number : eventNumber,
        time: localTime
    }

    localStorage.setItem([eventNumber], JSON.stringify(eventInfo));
}

async function moveToServer() {
    let localStorageContent = [];

    for(let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);

        localStorageContent.push(JSON.parse(value));
    }

    await fetch('update_DB.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: localStorageContent})
    });
}


function appendRow(rowData) {
    let table = document.getElementById('table');

    let row = document.createElement('tr');

    let number = document.createElement('td');
    number.textContent = rowData.number;
    row.append(number);

    let serverTime = document.createElement('td');
    serverTime.textContent = rowData.server_time;
    row.append(serverTime);

    let localTime = document.createElement('td');
    localTime.textContent = rowData.local_time;
    row.append(localTime);

    let message = document.createElement('td');
    message.textContent = rowData.message;
    row.append(message);

    table.append(row);
}

function removeTable() {
    let table = document.getElementById('table');

    if(table)
        table.remove();
}

