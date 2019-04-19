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
    let rowCharCode = 65;

    for (let i = 0; i < 121; i += 1) {
      let col = i % 11;
      let row = String.fromCharCode(rowCharCode - 1);

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
        ${i}</div>`;

      let rowNum = 
        `<div
          class="tile marker row-char">
        ${String.fromCharCode(rowCharCode)}</div>`;

      if (i === 0) {
        $($opponentBoard).append(blankTile);
        $($playerBoard).append(blankTile);
      } else if (i < 11) {
        $($opponentBoard).append(colNum);
        $($playerBoard).append(colNum);
      } else if (i % 11 === 0) {
        $($opponentBoard).append(rowNum);
        $($playerBoard).append(rowNum);
        rowCharCode += 1;
      } else {
        $($opponentBoard).append(opponentTile);
        $($playerBoard).append(playerTile);
      }
    }
    
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
      
      // Get a random number 1 or 2 to determine ship orientation. 
      // 1 === vertical, 2 === horizontal 
      // Temporarily default to vertical placement for development purposes
      // shipOrientation = Math.floor(Math.random() * 2) + 1;
      shipOrientation = 1;

      // Set the ship's orientation value
      shipOrientation === 1 ? curShip.orientation = 'vertical' : curShip.orientation = 'horizontal';

      const attemptPlacement = (row, col, orientation) => {
        // Conditional to go into validation if there exists a position in the column already
        // Else proceed with placement
        if (placedColsArr.indexOf(col) > -1) {
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

            let position = `${String.fromCharCode(row + i)}${col}`;
            curShip.position.push(position);
          }
        }
      }

      // Split conditional based on orientation
      if (curShip.orientation === 'vertical') {
        placementCol = Math.floor(Math.random() * 10) + 1;

        // Max and min for deriving char codes randomly within range
        let max = 75 - holes;
        let min = 64;
        let randomRowStart = Math.floor(Math.random() * (max - min)) + min;

        attemptPlacement(randomRowStart, placementCol, 'vertical');

        opponentShipsArr = opponentShipsArr.concat(curShip.position);
        // Else horizonatal 
      } else {
        let placementRow;
        console.log('place by row');
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
  placeOppShips();
});

