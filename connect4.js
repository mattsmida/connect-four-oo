"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//const WIDTH = 7;    // Commented out because they've moved to Game class.
//const HEIGHT = 6;

//let currPlayer = 1; // active player: 1 or 2
//const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)

class Game {

  // TODO: can put optional default parameters here
  constructor(height, width) {

    // TODO: don't have this
    //constructor(height, width, board, currPlayer) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.currPlayer = 1;
    this.start();
    //this.currPlayer = currPlayer;
  }

  /** makeBoard: fill in global `board`:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    // TODO: create board here and populate it here instead of this.board = []
    //        in constructor.
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({ length: this.width }).fill(null);
      this.board.push(emptyRow);
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    // TODO: can make table element's inner HTML to be an empty string instead
    //        of deleting through for loop
    const htmlBoard = document.getElementById("board");

    // this actually doesn't delete tiles, commenting it out still gives
    // a single board.
    const oldTiles = document.querySelectorAll('tr');
    for (let i = 0; i < oldTiles.length; i++) {
      oldTiles[i].remove();
    }

    // add comment for this code
    // This sets the top row for the game for colors to be dropped in.
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
   *    (return null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }



  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    /** Takes an array of arrays from checkForWin; returns boolean
 *  // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
*/
    // TODO: find way to use call or bind to make this work
    // TODO: perhaps bind _win to a variable

    //function _win(cells) { // Make it an arrow function PER THE SOLN FROM RS.
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
        );

    const innerWin = _win.bind(this); // Matt's attempt at context correction.

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        //if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        if (_win(horiz) || _win(vert) ||
            _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    return undefined;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    // console.log(evt.target.id.slice(4));
    // const x = 3;
    console.log(evt.target.innerHTML);
    const x = Number(evt.target.id.toString().slice(4));
    console.log('x passed here!', x);

    // const x = Number(evt.target.id.slice(evt.target.id.length-1));

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      return this.endGame('Tie!');
    }

    // switch players
    console.log('This is currentPlayer', this.currPlayer);
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    console.log('This is after the swap', this.currPlayer);
  }

  /** Start game. */

  start() {
    this.makeBoard(); // TODO: can have this in contructor
    this.makeHtmlBoard(); // TODO: can have this in constructor
  }

  // startTheGame() {
  //   const button =
  // }

}

//start();

// turn this to event listener once button to start game is clicked
new Game(6, 7);
