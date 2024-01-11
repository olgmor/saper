


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function includ(lst, set_mine) {

    for (el of set_mine) {

        if (el[0] === lst[0] && el[1] === lst[1]) {
            return false
        }
    }
    return true
}



class CreateCells {
    constructor(mine, around_mines = 0) {
        this.mine = mine
        this.around_mines = around_mines

    }
}






class GamePole {
    constructor(cell, bomb) {
        this.cell = cell
        this.bomb = bomb
        this.init()
    }






    init() {

        this.pole = []

        this.set_mine = new Set()


        for (let i = 0; i < this.cell; i++) {
            const arr = []

            for (let j = 0; j < this.cell; j++) {
                arr.push(new CreateCells(false))
            }
            this.pole.push(arr)

        }

        while (this.set_mine.size < this.bomb) {

            const res = []
            const x_one = getRandomNumber(0, this.cell)
            const y_one = getRandomNumber(0, this.cell)
            res.push(x_one)
            res.push(y_one)
            if (includ(res, this.set_mine)) {

                this.set_mine.add(res)
            } else { continue }

            this.pole[x_one][y_one].mine = true

            if (x_one === 0) {
                this.x_two = 1

            } else {
                this.x_two = x_one

            }

            if (y_one === 0) {
                this.y_two = 1
            } else { this.y_two = y_one }
            let g = 0
            for (let a = this.x_two - 1; a < x_one + 2; a++) {

                for (let b = this.y_two - 1; b < y_one + 2; b++) {

                    if (a < this.cell && b < this.cell) {
                        this.pole[a][b].around_mines += 1

                    }
                }
            }

        }

    }

}

var run = 0
function runCreateData() {
    run = new GamePole(count_seil, count_bomb)
}





