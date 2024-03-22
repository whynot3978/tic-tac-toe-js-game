'use strict';

document.getElementById('x-figure').addEventListener('click', () => selectFigure('X'));
document.getElementById('o-figure').addEventListener('click', () => selectFigure('O'));

const startGame = () => {
    if (figureSelected) {
        document.getElementById('game-board').classList.remove('hidden');
        document.getElementById('restart-button').classList.remove('hidden');

        animateBackground();
    }
}

//Анимация выбора фигуры
const animateFigureSelection = (figureId) => {
    const figureOption = document.getElementById(figureId);
    const selectedFigureImage = figureOption.querySelector('img');

    const background = document.getElementById('background');
    background.innerHTML = ''; //Очищаем фон

    const fieldWidth = window.innerWidth;
    const fieldHeight = window.innerHeight;

    //Создание большого количества копий изображения текущей фигуры
    for (let i = 0; i < 50; i++) {
        const clone = selectedFigureImage.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = (Math.random() * fieldWidth) + 'px';
        clone.style.top = (Math.random() * fieldHeight) + 'px';
        background.appendChild(clone);
    }

    anime({
        targets: '#background img',
        translateX: '-100%',
        easing: 'linear',
        duration: 1900,
        loop: true,
        direction: 'alternate'
    });

    console.log(background.children.length);
}

document.getElementById('x-figure').addEventListener('click', () => animateFigureSelection('x-figure'));
document.getElementById('o-figure').addEventListener('click', () => animateFigureSelection('o-figure'));

let currentPlayer = 'X';                          //Текущий игрок
let cells = ['', '', '', '', '', '', '', '', '']; //Клетки поля
let gameEnd = false;                              //Конец игры

const sound = new Audio();
const placeSound = new Audio('place_sound.mp3');
const winSound = new Audio('win_sound.mp3');
const drawSound = new Audio('draw_sound.mp3');

const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');

settingsButton.addEventListener('click', (event) => {
    //Переключение видимости меню настроек
    if (settingsMenu.style.display === 'block') {
        settingsMenu.style.display = 'none';
    }
    else {
        settingsMenu.style.display = 'block';
    }
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('#settings-menu') && event.target !== settingsButton) {
        settingsMenu.style.display = 'none';
    }
});

let soundEnabled = true;

document.getElementById('sound-checkbox').addEventListener('change', function() {
    soundEnabled = this.checked;

    if (!soundEnabled) {
        sound.pause();
    }
});

//Анимация выбранной фигуры на задний фон
const animateBackground = () => {
    const background = document.getElementById('background');
    background.innerHTML = '';

    if (currentPlayer === 'X') {
        for (let i = 0; i < 50; i++) {
            const clone = document.createElement('img');
            clone.src = 'o.png';
            clone.style.position = 'absolute';
            clone.style.left = (Math.random() * window.innerWidth) + 'px';
            clone.style.top = (Math.random() * window.innerHeight) + 'px';
            background.appendChild(clone);
        }
    }
    else if (currentPlayer === 'O') {
        for (let i = 0; i < 50; i++) {
            const clone = document.createElement('img');
            clone.src = 'x.png';
            clone.style.position = 'absolute';
            clone.style.left = (Math.random() * window.innerWidth) + 'px';
            clone.style.top = (Math.random() * window.innerHeight) + 'px';
            background.appendChild(clone);
        }
    }

    anime({
        targets: '#background img',
        translateX: '-100%',
        easing: 'linear',
        duration: 1900,
        loop: true,
        direction: 'alternate'
    });
}

document.body.style.backgroundColor = 'lightblue';

//Переключение выбранной фигуры
const switchPlayer = () => {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

//Ход игрока
const makeMove = (cellIndex) => {
    if (!gameEnd && cells[cellIndex] === '') {
        cells[cellIndex] = currentPlayer;
        renderBoard();
        animateBackground();

        anime({
            targets: '.cell',
            duration: 500,
            easing: 'easeInOutQuad',
            backgroundColor: ['#123333', '#788899'],
            complete: function() {
                checkWinner();
            }
        });
        
        anime({
            targets: cells[cellIndex],
            opacity: 1,
            duration: 500,
            easing: 'easeInOutQuad'
        });

        switchPlayer();        
    }

    if (soundEnabled) {
        placeSound.play();
    }
}

const checkWinner = () => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            announceWinner(cells[a]);
            return;
        }
    }

    if (!cells.includes('')) {
        announceDraw();
    }
}

const announceWinner = (winner) => {
    gameEnd = true;

    animateSymbols(() => {
        if (soundEnabled) {
            winSound.play();
        }
        alert(`WIN - ${winner}`);
        restartGame();
    });
}

const announceDraw = () => {
    gameEnd = true;
    
    animateSymbols(() => {
        if (soundEnabled) {
            drawSound.play();
        }
        alert('DRAW!');
        restartGame();
    });
}

const renderBoard = () => {
    let cellsElement = document.querySelectorAll('.cell');

    cellsElement.forEach((cell, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = (cells[index] === 'X') ? 'x.png' : (cells[index] === 'O' ? 'o.png' : '');
        imgElement.alt = cells[index];
        cell.innerHTML = '';
        cell.appendChild(imgElement);
    });
}

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        makeMove(index);
    });
});

document.getElementById('restart-button').addEventListener('click', () => {
    restartGame();
});

const restartGame = () => {
    currentPlayer = 'X';
    cells = ['', '', '', '', '', '', '', '', ''];
    gameEnd = false;
    renderBoard();

    document.querySelectorAll('.cell').forEach((cell) => {
        cell.removeAttribute('style');
        cell.classList.add('grey');
    });
}

const animateSymbols = (callback) => {
    anime({
        targets: '.cell',
        scale: [
            {value: 1, duration: 100},
            {value: 1.2, duration: 200},
            {value: 1, duration: 100}
        ],
        easing: 'easeInOutQuad',
        loop: 3,
        complete: callback
    });
}
