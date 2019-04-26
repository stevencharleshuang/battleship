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
      holes: 5,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    battleship: {
      holes: 4,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    cruiser: {
      holes: 3,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    submarine: {
      holes: 3,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    },
    destroyer: {
      holes: 2,
      hits: 0,
      orientation: '',
      placementCol: 0,
      placementRow: 0,
      position: []
    }
  };

  let opponentBoardArr = [[],[],[],[],[],[],[],[],[],[],[]];
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
            id="${i}">
          </div>`;

        let playerTile = 
          `<div 
            class="tile player-tile"
            data-type="player"
            data-col="${col}"
            data-row="${row}" 
            id="player-tile-${row}${col}">
          </div>`;

        let opponentTile = 
          `<div 
            class="tile opponent-tile"
            data-type="opponent" 
            data-col="${col}"
            data-row="${row}" 
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
          $($opponentBoard).append(blankTile);
          $($playerBoard).append(blankTile);
        } else if (i === 0 && j > 0) {
          opponentBoardArr[i].push(col);
          $($opponentBoard).append(colNum);
          $($playerBoard).append(colNum);
        } else if (j === 0) {
          opponentBoardArr[i].push(row);
          $($opponentBoard).append(rowChar);
          $($playerBoard).append(rowChar);
        } else {
          opponentBoardArr[i].push(j);
          $($opponentBoard).append(opponentTile);
          $($playerBoard).append(playerTile);
        }
      }
      rowCharCode += 1;
    }
    console.log({ opponentBoardArr });
    
    // Update jQ Selector Vars
    $tile = $('.tile');
    $playerTile = $('.player-tile');
    $opponentTile = $('.opponent-tile');

    // Set tile click handlers
    $($playerTile).on('click', handlePlayerTileClick);
    $($opponentTile).on('click', handleOpponentTileClick);
  };

  const placeOppShips = () => {
    let shipOrientation;
    let placedColsArr = [];
    let placedRowsArr = [];

    // Iterate through opponent ships 
    // For every ship in opponent ships
    for (let ship in opponentShips) {
      let curShip = opponentShips[ship];
      let holes = curShip.holes;
      let placementCol;
      let placementRow;
      let colMax;
      let colMin;
      let rowMax;
      let rowMin;
      
      // Get a random number 1 or 2 to determine ship orientation. 
      // 1 === vertical, 2 === horizontal 
      // Temporarily default to vertical placement for development purposes
      shipOrientation = Math.floor(Math.random() * 2) + 1;
      // shipOrientation = 1;

      // Set the ship's orientation value
      shipOrientation === 1 ? curShip.orientation = 'vertical' : curShip.orientation = 'horizontal';

      const attemptPlacement = (row, col, orientation) => {
        console.log('attemptPlacement(): ', { row, col, orientation });
        let hasOverlap;
        orientation === 'vertical' ? 
          hasOverlap = placedColsArr.indexOf(col) > -1 :
          hasOverlap = placedRowsArr.indexOf(row) > -1;
        // Conditional to go into validation if there exists a position in the column already
        // Else proceed with placement
        if (hasOverlap) {
          // Potential overlap, resolve
          console.log('possible overlap');

          orientation === 'vertical' ? col += 1 : row += 1;
          attemptPlacement(row, col, orientation);
        } else {
          // No potential overlap, proceed with placement
          curShip.placementCol = col;
          curShip.placementRow = row;
          // Iterate for the number of holes of each ship
          // For loop commits placement
          // Only proceed if validation to prevent ship overlap passes
          for (let i = 1; i <= holes; i += 1) {
            // Because we are placing vertically, increment the row
            if (orientation === 'vertical') {
              placedColsArr.push(col);
              placedRowsArr.push(row + i);
            } else if (orientation === 'horizontal') {
              placedColsArr.push(col + i);
              placedRowsArr.push(row);
            }

            let position = 
              orientation === 'vertical' ? 
                `${String.fromCharCode(row + i)}${col}` :
                `${String.fromCharCode(row)}${col + i}`;
            curShip.position.push(position);
          }
        }
      }

      // Split conditional based on orientation
      if (curShip.orientation === 'vertical') {
        colMax = 10;
        colMin = 1;
        placementCol = Math.floor(Math.random() * (colMax - colMin)) + colMin;

        // Max and min for deriving char codes randomly within range
        rowMax = 75 - holes;
        rowMin = 64;
        let randomRowStart = Math.floor(Math.random() * (rowMax - rowMin)) + rowMin;

        attemptPlacement(randomRowStart, placementCol, 'vertical');
        opponentShipsArr = opponentShipsArr.concat(curShip.position);
        // Else horizonatal 
      } else {
        console.log('place by row');
        rowMax = 75;
        rowMin = 64;
        placementRow = Math.floor(Math.random() * (rowMax - rowMin)) + rowMin;
        colMax = 11 - holes;
        colMin = 0;
        let randomColStart = Math.floor(Math.random() * (colMax - colMin)) + colMin;

        attemptPlacement(placementRow, randomColStart, 'horizontal');
        opponentShipsArr = opponentShipsArr.concat(curShip.position);
      }
    }
    console.log({ opponentShips, opponentShipsArr, placedColsArr, placedRowsArr });
  }

  /**
   * @function checkHit
   * @description Checks the ship arrs depending on player type and returns true if there's a hit or false
   * @param {string} targetType 
   * @param {string} tileID 
   */
  const checkHit = (targetType, tileID) => {
    // console.log(targetType, tileID);
    if (targetType === 'opponent') {
      if (opponentShipsArr.indexOf(tileID) > -1) {
        return true;
      }
    } else {
      if (playerShipsArr.indexOf(tileID) > -1) {
        return true;
      }
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
    let $selectedTile = $(e.target)[0];
    let identifier = `${$selectedTile.dataset.row}${$selectedTile.dataset.col}`;

    if ($selectedTile.classList[0] === 'tile' && 
      playerSelectedTilesArr.indexOf(identifier) === -1) {
      playerSelectedTilesArr.push(identifier);
      
      if (!checkHit('opponent', identifier)) {
        $($selectedTile).append(whitePeg)
      } else {
        $($selectedTile).append(redPeg);
      }
    }
    console.log($selectedTile);
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
  // placeOppShips();
});

