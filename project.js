

function piece(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.isKing = false;
    this.isClicked = false;
    this.draw = function () {

        if (this.isClicked == true) {
            ctx.fillStyle = "yellow"
            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 50, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath()
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.col * 100 + 50, this.row * 100 + 50, 35, 0, 2 * Math.PI);
        ctx.fill();

        if (this.isKing == true) {
            ctx.beginPath();
            ctx.fillStyle = "black"
            ctx.arc(this.col * 100 + 50, this.row * 100 + 62.5, 10, 0, Math.PI)
            ctx.stroke();
            ctx.closePath()
            ctx.beginPath();
            ctx.arc(this.col * 100 + 37.5, this.row * 100 + 35, 5, 0, 2 * Math.PI)
            ctx.fill()

            ctx.beginPath();
            ctx.arc(this.col * 100 + 62.5, this.row * 100 + 35, 5, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.fill()


        }

    }
    this.checkKing = function (){
        if (this.color == "red" && this.row == 7) {

            this.isKing = true
        }
        else if (this.color == "gray" && this.row == 0) {
            this.isKing = true
        }
    }
    this.move = function (newRow, newCol) {

        this.row = newRow;
        this.col = newCol;
        this.checkKing();
    }
    this.isValidMove = function (newRow, newCol) {
        if ((newRow % 2 == 0 && newCol % 2 != 0) == false && (newRow % 2 != 0 && newCol % 2 == 0) == false) {
            return false
        }
        else if (
            (checker_board[newRow][newCol] === "") &&
            (
                (this.color === "red" && newRow - this.row === 1 && (newCol - this.col === 1 || newCol - this.col === -1)) ||
                (this.color === "gray" && this.row - newRow === 1 && (newCol - this.col === 1 || newCol - this.col === -1)) ||
                (this.isKing === true && (Math.abs(newRow - this.row) === 1) && (Math.abs(newCol - this.col) === 1))
            )
        ) {
            
            return true;
        }
        
     
        else if (((this.color === "red" || this.isKing === true)) && (checker_board[newRow][newCol] == "") || ((this.color === "gray" || this.isKing === true) && checker_board[newRow][newCol] == "")) {
         
            let mid_row = Math.floor((this.row + newRow) / 2)
            let mid_col = Math.floor((this.col + newCol) / 2)
            if ((checker_board[mid_row][mid_col] !== "") && this.color !== checker_board[mid_row][mid_col].color) {
                checker_board[mid_row][mid_col] = "";
                
                return true
              
            }
           

            else if (checker_board[mid_row][mid_col] == "") {
                return false
            }
        }
    }
}


let checker_board = [
    ["", new piece(0, 1, "red"), "", new piece(0, 3, "red"), "", new piece(0, 5, "red"), "", new piece(0, 7, "red")],
    [new piece(1, 0, "red"), "", new piece(1, 2, "red"), "", new piece(1, 4, "red"), "", new piece(1, 6, "red"), ""],
    ["", new piece(2, 1, "red"), "", new piece(2, 3, "red"), "", new piece(2, 5, "red"), "", new piece(2, 7, "red")],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    [new piece(5, 0, "gray"), "", new piece(5, 2, "gray"), "", new piece(5, 4, "gray"), "", new piece(5, 6, "gray"), ""],
    ["", new piece(6, 1, "gray"), "", new piece(6, 3, "gray"), "", new piece(6, 5, "gray"), "", new piece(6, 7, "gray")],
    [new piece(7, 0, "gray"), "", new piece(7, 2, "gray"), "", new piece(7, 4, "gray"), "", new piece(7, 6, "gray"), ""]
];


let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

function drawBoard() {

    for (let i = 0; i < 8; i++){

        for (let j = 0; j < 8; j++) {

            if (i % 2 == 0 && j % 2 != 0) {

                ctx.fillStyle = "black";

            }
            else if (i % 2 != 0 && j % 2 == 0) {

                ctx.fillStyle = "black";
            }
            else {
                ctx.fillStyle = "white";
            }

            ctx.fillRect(i * 100, j * 100, 100, 100);

        }

    }

}
drawBoard()
function draw_pieces() {

    drawBoard()
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (checker_board[i][j] !== "") {

                checker_board[i][j].draw();
            }
        }
    }
}

document.getElementById("myCanvas").addEventListener("click", clicky)
function clicky(event) {

    let x = event.offsetX
    let y = event.offsetY
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (x >= j * 100 && x < (j + 1) * 100 && y >= i * 100 && y < (i + 1) * 100) {

                row = i, col = j

                if (checker_board[row][col] !== "") {
                    let selectedpiece = getselectedpiece()
                    if (selectedpiece) {
                        selectedpiece.isClicked = false
                    }
                    if (selectedpiece !== checker_board[row][col]) {
                        checker_board[row][col].isClicked = true;
                    }

                    draw_pieces()
                }

                else if (checker_board[row][col] == "") {

                    let selectedpiece = getselectedpiece()
                    if (getselectedpiece() !== null) {
                        if (selectedpiece.isValidMove(row, col) == true) {

                            let previous_row = selectedpiece.row
                            let previous_col = selectedpiece.col
                            checker_board[previous_row][previous_col].isClicked = false
                            selectedpiece.move(row, col)
                            checker_board[previous_row][previous_col] = ""
                            checker_board[row][col] = selectedpiece

                        }
                    }

                }
            }
        }

    draw_pieces();
    }

function getselectedpiece(){
    for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 8; j++) {

            if (checker_board[i][j].isClicked == true) {
                return checker_board[i][j]} 
            }

            }
            return null
        }}
