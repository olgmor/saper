

const board = document.querySelector('#board') // Контейнер с игровым полем //
const first_size = document.querySelector('#first_screen') // Контейнер с полем выбора //
const button_start = document.querySelector('#demo')
const watch = document.querySelector('#time') // Контейнер отображения времени //
const watch_bomb = document.querySelector('#watch_bomb')
const tools = document.querySelector('#tools') // Контейнер с кнопками //
const win = document.querySelector('#win') // Контейнер с надписью Победа //

var count_seil = 0
var number_dificult = 1
var count_bomb = 0

var zoom = 1.0
var flag_bomb = 0
var stop_time = 0
var time = 0
var buffer = []
var flag_select_cell = 0
var flag_select_bomb = 0
var buffer_for_help = []
var list_find_bomb = []
var finded_cell_help = []
var iter = 0



function startButton() {
    // Прячет кнопку начало игры покф не выбрана сложность и размер игрового поля //

    if (flag_select_bomb === 1 && flag_select_cell == 1) {

        button_start.classList.remove('none_display')
        button_start.classList.add('seil-btn-start')
    }
}


function set_count_bomb(count) {
    // Установка количества(сложность) бомб 



    const elements = document.querySelectorAll('.bomb-btn')
    for (i of elements) {
        i.classList.remove('selected')
    }
    const elem = document.querySelector(`#bomb${count}`)
    elem.classList.add('selected')
    number_dificult = count
    count_bomb = ((count_seil ** 2) / 100) * number_dificult
    flag_select_bomb = 1
    startButton()

}

function set_count_seil(count) {
    // Установка размера игрового поля 

    const elements = document.querySelectorAll('.seil-btn')
    for (i of elements) {
        i.classList.remove('selected')
    }
    const elem = document.querySelector(`#seil${count}`)
    elem.classList.add('selected')
    count_seil = count
    count_bomb = ((count_seil ** 2) / 100) * number_dificult
    flag_select_cell = 1
    startButton()

}


function setTime(value) {
    // Отсчет времени
    watch.innerHTML = value
}


function startTime() {
    //Отсчет времени
    let current = time++
    setTime(current)

}




function around_opened_cell(x, y) {
    // Получение координат соседних с заданной клетки 
    const list_coords = []
    for (j = y - 1; j <= y + 1; j++) {
        for (i = x - 1; i <= x + 1; i++) {
            if (i === x && j === y) {
                continue
            }
            if (i >= 0 && i < count_seil && j >= 0 && j < count_seil) {
                list_coords.push(`${i}:${j}`)
            }
        }
    }
    return list_coords
}




function late_we_look_cell_around_bomb(list_find_bomb) {
    // Нахождени клеток помощи (п
    // сравниваем количество бомб со спискам бомб если в списке содержиться соседние координаты с клеткой,
    // в количестве равном количеству бомб, то оставшиеся на открытые клетки заносим в список "помощь"
    now_open_cell = document.querySelectorAll('.white_sqauer')
    for (sqauer of now_open_cell) {
        if (sqauer) {
            const res = sqauer.querySelector('#number')
            if (res) {
                number = parseInt(res.getAttribute('data'))
            }
            around = preparation_coordinates(sqauer)
            seil_cell = 0
            bomb_ceil = 0
            for (round_cell of around) {
                round = document.getElementById(`${round_cell}`)
                if (round.classList.contains('seil')) {
                    seil_cell++
                }
                if (list_find_bomb.includes(round_cell) === true) {
                    bomb_ceil++
                }
            }
            if (bomb_ceil === number) {
                for (second of around) {
                    row = document.getElementById(`${second}`)
                    if (row.classList.contains('seil') && list_find_bomb.includes(second) === false) {
                        if (finded_cell_help.includes(row) === false) {
                            finded_cell_help.push(row)
                        }
                    }
                }
            }
        }
    }
}

function preparation_coordinates(sqauer) {
    // Распарсеровка id на координаты

    if (typeof (sqauer) === 'string') {
        coord_cell = sqauer
    } else {
        coord_cell = sqauer.id
    }
    const coords = coord_cell.split(':')
    const x = Number(coords[0])
    const y = Number(coords[1])
    return around_opened_cell(x, y)
}

function preparation_cells(number, number_id, res_next) {
    // Поиск клеток с бомбами со стороны игрока 
    let count_not_open_cell = 0 // Количество не открытых клеток вокруг клетки //
    find_bomb = [] // список найденых бомб //
    for (sqauer of res_next) {
        if (sqauer) {
            res = document.getElementById(`${sqauer}`)
            if (res.classList.contains('seil')) {
                count_not_open_cell++
                find_bomb.push(sqauer)
            }
        }
    }
    if (count_not_open_cell === number) {
        for (i of find_bomb) {
            if (list_find_bomb.includes(i) === false)
                list_find_bomb.push(i)
        }
    }
}

function Clue() {
    // запуск поиска помощи //

    now_open_cell = document.querySelectorAll('.white_sqauer')
    if (finded_cell_help.length === 0) {
        for (sqauer of now_open_cell) {
            if (sqauer) {
                const res = sqauer.querySelector('#number')
                if (res) {
                    const number = parseInt(res.getAttribute('data'))
                    const number_id = sqauer.id
                    const res_next = preparation_coordinates(sqauer) // получаем координаты соседних клеток //
                    preparation_cells(number, number_id, res_next)
                }
            }
        }
        late_we_look_cell_around_bomb(list_find_bomb)
    }
    if (finded_cell_help.length > 0) {
        if (iter <= finded_cell_help.length + 1) {
            const res = document.querySelector('.blink')
            if (res) { res.classList.remove('blink') }
            finded_cell_help[iter].classList.add('blink')
            iter++
            if (iter === finded_cell_help.length) {
                iter = 0
            }
        }
    }
}



function size_field_plus() {
    zoom += 0.1
    board.style.zoom = zoom
}

function size_field_minus() {
    zoom -= 0.1
    board.style.zoom = zoom
}


function replayGame() {
    board.innerHTML = ''
    buffer = []
    flag_bomb = 0
    list_find_bomb = []
    finded_cell_help = []
    board.classList.remove('enable_mouse')
    win.classList.remove('win')
    win.classList.add('none_display')
    time = 0
    clearInterval(stop_time)
    creatTable()
}


function stopGame() {
    all_cell = document.querySelectorAll('.seil')
    for (cell of all_cell) {
        cell.click()
    }
    clearInterval(stop_time)
    board.classList.add('enable_mouse')
}


function getWatchBomb() {
    put_flag = document.querySelectorAll('.img_bomb').length
    watch_bomb.innerHTML = count_bomb - put_flag
}


function definitionVictory() {

    all_cell_win = document.querySelectorAll('.seil')
    if (flag_bomb == 0 && all_cell_win.length == count_bomb) {

        win.classList.add('win')
        board.classList.add('enable_mouse')
        win.classList.remove('none_display')
        clearInterval(stop_time)
    }
}



function creatOpenCell(x, y) {
    //открывает соседнии клетки при выпадании клетки с "0"
    const list_coords = []
    for (j = y - 1; j <= y + 1; j++) {
        for (i = x - 1; i <= x + 1; i++) {
            if (i === x && j === y) {
                continue
            }
            if (i >= 0 && i < count_seil && j >= 0 && j < count_seil) {
                list_coords.push(`${i}:${j}`)
            }
        }
    }

    for (const x of list_coords) {
        const element = document.getElementById(x)
        openFunction(element)
    }
}





function openFunction(it_id) {
    //открытие|прорисовка клетки//

    finded_cell_help = []
    iter = 0
    it_id.innerHTML = ''
    it_id.classList.add('white_sqauer')
    it_id.classList.remove('seil')

    const coord_cell = it_id.id

    const coords = coord_cell.split(':')
    const x = Number(coords[0])
    const y = Number(coords[1])

    if (run.pole[x][y].mine !== true) {
        open_cell = run.pole[x][y].around_mines
    } else { open_cell = '*' }



    if (open_cell === '*') {

        if (flag_bomb === 0) {
            it_id.innerHTML = '<img src="image/bomb_red.png">'
            flag_bomb = 1
            stopGame()
        } else if (flag_bomb === 1) {
            it_id.innerHTML = '<img src="image/open_bomb.png">'
        }
    } else if (open_cell === 1) {
        it_id.innerHTML = '<img src="image/one.jpg" width="16px;" height="16px" id="number" data="1">'
    } else if (open_cell === 2) {
        it_id.innerHTML = '<img src="image/two.jpg" width="16px;" height="16px" id="number" data="2">'
    } else if (open_cell === 3) {
        it_id.innerHTML = '<img src="image/three.jpg" width="16px;" height="16px" id="number" data="3">'
    } else if (open_cell === 4) {
        it_id.innerHTML = '<img src="image/four.jpg" width="16px;" height="16px" id="number" data="4">'
    } else if (open_cell === 5) {
        it_id.innerHTML = '<img src="image/five.jpg" width="16px;" height="16px" id="number" data="5">'
    } else if (open_cell === 6) {
        it_id.innerHTML = '<img src="image/six.jpg" width="16px;" height="16px" id="number" data="6">'
    } else if (open_cell === 7) {
        it_id.innerHTML = '<img src="image/seven.jpg" width="16px;" height="16px" id="number" data="7">'
    } else if (open_cell === 8) {
        it_id.innerHTML = '<img src="image/eight.jpg" width="16px;" height="16px" id="number" data="8">'
    } else if (open_cell === 0) {
        if (buffer.includes(coord_cell) === false) {
            buffer.push(coord_cell)
            creatOpenCell(x, y)
        }

    }



    getWatchBomb()
    definitionVictory()




}

function put_bomb(bomb_id) {

    const img = '<img src="image/bomb.jpg" class="img_bomb">'
    const ask_img = '<img src="image/ask.jpg" width="13px" height="13px" style="padding-bottom:1px;padding-right:1px">'

    if (bomb_id.innerHTML === '') {
        bomb_id.innerHTML = img


    } else if (bomb_id.innerHTML == img) {
        bomb_id.innerHTML = ask_img

    } else if (bomb_id.innerHTML == ask_img) {
        bomb_id.innerHTML = ''
    }

    getWatchBomb()

}


function newGame() {
    runCreateData()
    creatTable()
}

function creatTable() {
    // Прорисова начального игравого поля //

    board.classList.add('game_field')
    board.classList.remove('none_display')
    board.setAttribute('oncontextmenu', 'return false;')
    first_screen.classList.add('none_display')
    button_start.classList.add('none_display')
    tools.classList.remove('none_display')
    tools.classList.add('tools')

    stop_time = setInterval(startTime, 1000)
    getWatchBomb()

    for (j = 0; j < count_seil; j++) {
        const stroka = document.createElement('div')
        stroka.id = `stroka${j}`
        stroka.classList.add('dis_none')
        board.append(stroka)
        f = document.getElementById(`stroka${j}`)

        for (i = 0; i < count_seil; i++) {

            const cell = document.createElement('div')
            cell.id = `${j}:${i}`
            cell.setAttribute('onclick', 'openFunction(this)')
            cell.setAttribute('oncontextmenu', 'put_bomb(this)')
            cell.classList.add('seil')

            f.append(cell)
        }
    }


}



