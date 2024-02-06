let sudoku;


function fillSudoku(difficulty=30) {
  sudoku = Array.from({length: 9}, () => Array.from({length: 9}, () => 0));
  for (let i=0; i<3; i++) {
    fillWholeSquare(i, i);
  }
  fillRemaining(0, 3);
  removeRandomDigits(difficulty);
  showWholeGrid();
}


function randint() {
  return Math.floor(Math.random()*9 + 1);
}


function checkSquare(xOfSquare, yOfSquare, num) {
  let retval = true;
  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      if (sudoku[xOfSquare*3+i][yOfSquare*3+j] === num) {
        retval = false;
      }
    }
  }
  return retval;
}

function checkRow(row, num) {
  let retval = true;
  for (let i=0; i<9; i++) {
    if (sudoku[row][i] === num) {
      retval = false;
    }
  }
  return retval;
}

function checkColumn(col, num) {
  let retval = true;
  for (let i=0; i<9; i++) {
    if (sudoku[i][col] === num) {
      retval = false;
    }
  }
  return retval;
}


function fillWholeSquare(xOfSquare, yOfSquare) {
  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      while (sudoku[xOfSquare*3+i][yOfSquare*3+j] === 0) {
        let num = randint();
        if (checkSquare(xOfSquare, yOfSquare, num)) {
          sudoku[xOfSquare*3+i][yOfSquare*3+j] = num;
        }
      }
    }
  }
}

function roundToThree(num) {
  if (num < 3) {
    return 0;
  } else if (num < 6) {
    return 1;
  } else if (num < 9) {
    return 2;
  }
  return 3;
}

function fillRemaining(i, j) {
  if (i === 8 && j === 9) {
      return true;
  }

  if (j === 9) {
      i += 1;
      j = 0;
  }


  if (sudoku[i][j] !== 0) {
      return fillRemaining(i, j + 1);
  }

  for (let num = 1; num <= 9; num++) {
      if (checkRow(i, num) && checkColumn(j, num) && checkSquare(roundToThree(i), roundToThree(j), num)) {
          sudoku[i][j] = num;
          if (fillRemaining(i, j + 1)) {
              return true;
          }
          sudoku[i][j] = 0;
      }
  }

  return false;
}


function showWholeGrid() {
  for (let i=0; i<9; i++) {
    for (let j=0; j<9; j++) {
      let e = document.getElementById("i"+String(i)+String(j));
      if (sudoku[i][j] !== 0) {
        e.innerHTML = sudoku[i][j];
        e.classList.add("notChangable");
      } else {
        e.innerHTML = "";
        e.classList.remove("notChangable");
      }
    }
  }
}


function removeRandomDigits(howMany) {
  while (howMany > 0) {
    let iToRemove = randint()-1;
    let jToRemove = randint()-1;
    if (sudoku[iToRemove][jToRemove] !== 0) {
      sudoku[iToRemove][jToRemove] = 0;
      howMany--;
    }
  }
}


function checkWinRows() {
  for (let row=0; row<9; row++) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i=0; i<9; i++) {
      let ix = numbers.indexOf(sudoku[row][i]);
      if (ix === -1) {
        return false;
      } else {
        numbers.splice(ix, 1);
      }
    }
  }
  return true;
}

function checkWinCols() {
  for (let col=0; col<9; col++) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i=0; i<9; i++) {
      let ix = numbers.indexOf(sudoku[i][col]);
      if (ix === undefined) {
        return false;
      } else {
        numbers.splice(ix, 1);
      }
    }
  }
  return true;
}

function checkWinSquares() {
  for (let xOfSquare=0; xOfSquare<9; xOfSquare+=3) {
    for (let yOfSquare=0; yOfSquare<9; yOfSquare+=3) {
      let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
          let ix = numbers.indexOf(sudoku[xOfSquare+i][yOfSquare+j]);
          if (ix === undefined) {
            return false;
          } else {
            numbers.splice(ix, 1);
          }
        }
      }
    }
  }
  return true;
}

function checkWin() {
  return checkWinRows() && checkWinCols() && checkWinSquares();
}


function freezeBoard() {
  for (let i=0; i<9; i++) {
    for (let j=0; j<9; j++) {
      let e = document.getElementById("i"+String(i)+String(j));
      e.innerHTML = sudoku[i][j];
      e.classList.add("notChangable");
    }
  }
}


function clicked(caller) {
  if (!caller.classList.contains("notChangable")) {
    let currentVal = Number(caller.innerHTML);
    currentVal++;
    if (currentVal === 10) {
      sudoku[Number(caller.id[1])][Number(caller.id[2])] = 0;
      caller.innerHTML = "";
    } else {
      sudoku[Number(caller.id[1])][Number(caller.id[2])] = currentVal;
      caller.innerHTML = currentVal;
    }
    if (checkWin()) {
      freezeBoard();
      document.getElementById("win").innerHTML = "Congratulations! You won."
    }
  }
}
