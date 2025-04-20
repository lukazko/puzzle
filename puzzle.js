
const size = 5;
let tiles = [];

function createPuzzle() {
    const order = [...Array(size * size - 1).keys()];
    order.push(null); // poslední políčko prázdné
    shuffle(order);

    $('#puzzle').empty();
    tiles = [];

    for (let i = 0; i < size * size; i++) {
        const pos = order[i];
        const tile = $('<div class="tile">');
        tile.data('index', i);
        tile.data('value', pos);

        if (pos !== null) {
            const row = Math.floor(pos / size);
            const col = pos % size;
            tile.css('background-position', `-${col * 120}px -${row * 120}px`);
        } else {
            tile.addClass('empty');
        }

        tiles.push(tile);
        $('#puzzle').append(tile);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function swapTiles(i1, i2) {
    const val1 = tiles[i1].data('value');
    const val2 = tiles[i2].data('value');

    tiles[i1].data('value', val2);
    tiles[i2].data('value', val1);

    tiles[i1].toggleClass('empty', val2 === null);
    tiles[i2].toggleClass('empty', val1 === null);

    updateTileStyle(i1);
    updateTileStyle(i2);
}

function updateTileStyle(index) {
    const tile = tiles[index];
    const val = tile.data('value');
    if (val === null) {
        tile.css('background-image', 'none');
    } else {
        const row = Math.floor(val / size);
        const col = val % size;
        tile.css({
            'background-image': 'url("bg.jpg")',
            'background-position': `-${col * 120}px -${row * 120}px`
        });
    }
}

function isSolved() {
    for (let i = 0; i < size * size - 1; i++) {
        if (tiles[i].data('value') !== i) return false;
    }
    return true;
}

$(document).on('click', '.tile', function () {
    const index = $(this).data('index');
    const emptyIndex = tiles.findIndex(tile => tile.data('value') === null);

    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;
    if (isAdjacent) {
        swapTiles(index, emptyIndex);
        if (isSolved()) {
            $('#modal').fadeIn();
        }
    }
});

$('#cheat').on('click', function () {
    $('#modal').hide();
    $('#puzzle').empty();
    tiles = [];

    for (let i = 0; i < size * size; i++) {
        const tile = $('<div class="tile">');
        tile.data('index', i);

        if (i === size * size - 1) {
            tile.addClass('empty');
            tile.data('value', null);
        } else {
            tile.data('value', i);
            const row = Math.floor(i / size);
            const col = i % size;
            tile.css({
                'background-image': 'url("bg.jpg")',
                'background-position': `-${col * 120}px -${row * 120}px`
            });
        }

        tiles.push(tile);
        $('#puzzle').append(tile);
    }

    setTimeout(() => {
        if (isSolved()) {
            $('#modal').fadeIn();
        }
    }, 300);
});

createPuzzle();
