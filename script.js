const canvas = document.getElementById('puzzleCanvas');
const context = canvas.getContext('2d');
const shuffleButton = document.getElementById('shuffleButton');
const leaderboardList = document.getElementById('leaderboardList');
const GRID_SIZE = 5;
const TILE_SIZE = canvas.width / GRID_SIZE;
let tiles = [];
let blankTile = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

const image = new Image();
image.src = 'path/to/your/image.jpg'; // 画像のパスを正しく設定してください
image.onload = function () {
    initializeTiles();
    shuffleTiles();
    drawTiles();
};

canvas.addEventListener('click', onCanvasClick);
shuffleButton.addEventListener('click', shuffleTiles);

function initializeTiles() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            tiles.push({ x: j, y: i, correctX: j, correctY: i });
        }
    }
    tiles.pop(); // 最後のタイルを削除して空白にする
    tiles.push(blankTile);
}

function shuffleTiles() {
    tiles.sort(() => Math.random() - 0.5);
    drawTiles();
}

function drawTiles() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let tile of tiles) {
        if (tile === blankTile) continue;
        context.drawImage(
            image,
            tile.correctX * TILE_SIZE, tile.correctY * TILE_SIZE, TILE_SIZE, TILE_SIZE,
            tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE
        );
    }
}

function onCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedTile = getTileAtPosition(x, y);
    if (clickedTile && isAdjacent(clickedTile, blankTile)) {
        swapTiles(clickedTile, blankTile);
        drawTiles();
        if (isSolved()) {
            alert('パズルが完成しました！');
            updateLeaderboard();
        }
    }
}

function getTileAtPosition(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    return tiles.find(tile => tile.x === col && tile.y === row);
}

function isAdjacent(tile1, tile2) {
    return (Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y)) === 1;
}

function swapTiles(tile1, tile2) {
    [tile1.x, tile2.x] = [tile2.x, tile1.x];
    [tile1.y, tile2.y] = [tile2.y, tile1.y];
}

function isSolved() {
    return tiles.every(tile => tile.x === tile.correctX && tile.y === tile.correctY);
}

function updateLeaderboard() {
    const username = prompt('名前を入力してください:');
    const listItem = document.createElement('li');
    listItem.textContent = username;
    leaderboardList.appendChild(listItem);
}
