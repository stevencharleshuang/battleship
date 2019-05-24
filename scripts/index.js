$(document).ready(() => {
  // jQ Selectors
  const 
    $gameArea = $('.game-area'),
    $gameBoard = $('.game-board')
    $playerBoard = $('#player-board');
    $opponentBoard = $('#opponent-board');
    let $playerTile;
    let $opponentTile;
    let $tile;

  // JS Var Decs
  let opponentShips = {
    carrier: {
      name: 'carrier',
      holes: 5,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    battleship: {
      name: 'battleship',
      holes: 4,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    cruiser: {
      name: 'cruiser',
      holes: 3,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    submarine: {
      name: 'submarine',
      holes: 3,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    destroyer: {
      name: 'destroyer',
      holes: 2,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    }
  };

  let opponentBoardArr = [[],[],[],[],[],[],[],[],[],[],[]];
  let playerBoardArr = [[],[],[],[],[],[],[],[],[],[],[]];
  let opponentShipsArr = [];
  let playerShipsArr = [];
  let playerSelectedTilesArr = [];
  let whitePeg = `<div class="peg white-peg"></div>`;
  let redPeg = `<div class="peg red-peg"></div>`;

  /**
   * @function createBoards
   * @description Creates the Player and Opponent boards and fills with tiles
   */
  const createBoards = () => {
    let rowCharCode = 64;

    for (let i = 0; i < 11; i += 1) {
      for (let j = 0; j < 11; j += 1) {
        let col = j;
        let row = String.fromCharCode(rowCharCode);

        let blankTile = 
          `<div 
            class="tile marker blank-tile"
            data-type="blank" 
            id="blank-tile-${row}${col}">
          </div>`;

        let playerTile = 
          `<div 
            class="tile player-tile"
            data-type="player"
            data-row="${i}" 
            data-col="${j}"
            id="player-tile-${row}${col}">
          </div>`;

        let opponentTile = 
          `<div 
            class="tile opponent-tile"
            data-type="opponent" 
            data-row="${i}" 
            data-col="${j}"
            id="opponent-tile-${row}${col}">
          </div>`;

        let colNum = 
          `<div
            class="tile marker col-num">
          ${col}</div>`;

        let rowChar = 
          `<div
            class="tile marker row-char">
          ${String.fromCharCode(rowCharCode)}</div>`;

        if (i === 0 && j === 0) {
          opponentBoardArr[i].push(null)
          playerBoardArr[i].push(null)
          $($opponentBoard).append(blankTile);
          $($playerBoard).append(blankTile);
        } else if (i === 0 && j > 0) {
          opponentBoardArr[i].push(col);
          playerBoardArr[i].push(col);
          $($opponentBoard).append(colNum);
          $($playerBoard).append(colNum);
        } else if (j === 0) {
          opponentBoardArr[i].push(row);
          playerBoardArr[i].push(row);
          $($opponentBoard).append(rowChar);
          $($playerBoard).append(rowChar);
        } else {
          opponentBoardArr[i].push(null);
          playerBoardArr[i].push(null);
          $($opponentBoard).append(opponentTile);
          $($playerBoard).append(playerTile);
        }
      }
      rowCharCode += 1;
    }
        
    // Update jQ Selector Vars
    $tile = $('.tile');
    $playerTile = $('.player-tile');
    $opponentTile = $('.opponent-tile');

    // Set tile click handlers
    $($playerTile).on('click', handlePlayerTileClick);
    $($opponentTile).on('click', handleOpponentTileClick);
  };

  /**
   * @function attemptPlacement
   * @param {number} startX The X coordinate to start attempting ship placement
   * @param {number} startY The Y coordinate to start attempting ship placement
   * @param {string} orientation The orientation to attempt ship placement, either horizontal or vertical
   * @param {number} size The size of the ship to be placed
   * @param {string} ship The ship being placed
   */
  const attemptPlacement = (startX, startY, orientation, size, ship) => {
    const colMax = 10;
    const rowMax = 10;
    // Defined as the end coordinate X or Y later defined by ship size and orientation
    let end;
    let isClear = true;

    // Split logic by orientation
    // Attempt horizontal placement
    if (orientation === 'horizontal') {
      // Check if there is suffient columns to fully place the ship
      let colDiff = Math.abs(colMax - startY);
      if (colDiff < size) {
        startY = colMax - size;
      }
      end = startY + size;
      // iterate the board arr by column arr[i][j]
      for (let i = startY; i < end; i += 1) {
        if (opponentBoardArr[startX][i] !== null) {
          isClear = false;
        }
      }
      // if the row from startY to end === null, place the ship
      if (isClear === true) {
        for (let i = startY; i < end; i += 1) {
          opponentBoardArr[startX][i] = ship;
        }
        // If not clear, update coordinates or orientation and re-attempt placement recursively
      } else {
        if (startX <= 5 && startX - 1 > 0) {
          startX -= 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else if (startX > 5 && startX + 1 <= rowMax) {
          startX += 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else {
          console.log('Placement failed. Update orientation. Failed ship: ', ship, { startY });
          orientation = 'vertical';
          attemptPlacement(startX, startY, orientation, size, ship);
        }
      }
    // Attempt vertical placement. Logic mirrors horizontal placement
    } else {
      let rowDiff = Math.abs(rowMax - startX);
      
      if (rowDiff < size) {
        startX = rowMax - size;
      }

      end = startX + size;
      
      for (let i = startX; i < end; i += 1) {
        if (opponentBoardArr[i][startY] !== null) {
          isClear = false;
        }
      }
      
      if (isClear === true) {
        for (let i = startX; i < end; i += 1) {
          opponentBoardArr[i][startY] = ship;
        }
      } else {
        if (startY <= 5 && startY - 1 > 0) {
          startY -= 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else if (startY > 5 && startY + 1 <= colMax) {
          startY += 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else {
          console.log('Placement failed. Update orientation. Failed ship: ', ship, { startY });
          orientation = 'horizontal';
          attemptPlacement(startX, startY, orientation, size, ship);
        }
      }
    }
  };

  /**
   * @function placeOppShips
   * @description Places the opponent's ships randomly around the opponent's board without overlap
   */
  const placeOppShips = () => {
    // Iterate through opponent ships 
    // For every ship in opponent ships
    for (let ship in opponentShips) {      
      // Generate a randomized orientation for placement
      let randOrientation = Math.floor(Math.random() * 2) + 1;
      randOrientation === 1 ? randOrientation = 'horizontal' : randOrientation = 'vertical';

      // Generate a randomized tile to start attempted placement
      // randStartX will refer to the row and randStartY will refer to the column
        // Because the smallest ship is the cruiser, occupying 2 tiles, ignore the last row and column in placement
      let randStartX = Math.floor(Math.random() * 9) + 1;
      let randStartY = Math.floor(Math.random() * 9) + 1;
      
      let size = opponentShips[ship].holes;
      // Call attemptPlacement(startTile, orientation, size)
      attemptPlacement(randStartX, randStartY, randOrientation, size, ship);
    }
    console.log('opponentBoardArr', opponentBoardArr);
  }

  /**
   * @function checkHit
   * @description Checks the ship arrs depending on player type and returns true if there's a hit or false
   * @param {string} targetType 
   * @param {string} tileID 
   */
  const checkHit = (row, col) => {
    if (opponentBoardArr[row][col] !== null) {
      return true;
    }
    return false;
  };

  /**
   * @function handleOpponentTileClick
   * @description Handles the click event for opponent tiles
   * @param {object} e 
   */
  const handleOpponentTileClick = (e) => {
    console.log('Opponent tile clicked', e);
    let targetRow = e.target.dataset.row;
    let targetCol = e.target.dataset.col;
    let $selectedTile = $(e.target)[0];
    let oppTargetShip = opponentBoardArr[targetRow][targetCol];

    console.log(opponentShips[oppTargetShip], { opponentShips });
    
    if (!checkHit(targetRow, targetCol)) {
      $($selectedTile).append(whitePeg)
    } else {
      opponentShips[oppTargetShip].hits += 1;
      console.log('checkHit ship hits: ', opponentShips[oppTargetShip].hits);
      $($selectedTile).append(redPeg);
    }

    if (opponentShips[oppTargetShip]) {
      if (opponentShips[oppTargetShip].hits === opponentShips[oppTargetShip].holes) {
        if (opponentShips[oppTargetShip].name === 'battleship') {
          console.log('Sank the Battleship. You win!', opponentShips[oppTargetShip]);
        }
      }
    }
  };

  /**
   * @function handlePlayerTileClick
   * @description Handles the click event for player tiles
   * @param {object} e 
   */
  const handlePlayerTileClick = (e) => {
    console.log('Player tile clicked', e);
  };

  createBoards();
  placeOppShips();
});

