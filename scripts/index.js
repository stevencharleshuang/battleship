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

let playerShips = {
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
let playerPlacedShips = [];
let playerSelectedTilesArr = [];
let whitePeg = `<div class="peg white-peg"></div>`;
let redPeg = `<div class="peg red-peg"></div>`;
let selectedPlayerShip = '';
let playerPlacementOrientation = 'horizontal';
let utterFail = false;
// Welcome Message displayed at game init
let welcomeMsg = `
  <h4>Welcome to Steve Battleship!</h4>
  <p>Please place your ships</p>
  <button class="change-orientation-btn btn">Change Ship Orientation</button>`;

// jQ Selectors
const 
  $gameArea = $('.game-area'),
  $gameBoard = $('.game-board'),
  $playerBoard = $('#player-board'),
  $opponentBoard = $('#opponent-board'),
  $opponentAvatarsList = $('.opponent-avatars-list'),
  $playerAvatarsList = $('.player-avatars-list'),
  $messages = $('.messages'),
  $shipAvatars = $('.ship-avatars');
  let $playerChangeOrientationBtn;
  let $playerTile;
  let $opponentTile;
  let $tile;

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
          data-alpha="${row}"
          data-row="${i}" 
          data-col="${j}"
          id="player-tile-${i}-${col}">
          </div>`;
          
      let opponentTile = 
        `<div 
          class="tile opponent-tile"
          data-type="opponent"
          data-alpha="${row}"
          data-row="${i}" 
          data-col="${j}"
          id="opponent-tile-${i}-${col}">
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
  $($playerTile)
    .on('mouseenter', handlePlayerPlacementMouseEnter)
    .on('mouseleave', handlePlayerPlacementMouseLeave);

  console.log({ playerBoardArr });
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
      return utterFail = false;
      // If not clear, update coordinates or orientation and re-attempt placement recursively
    } else {
      if (startX <= 5 && startX - 1 > 0) {
        startX -= 1;
        return attemptPlacement(startX, startY, orientation, size, ship);
      } else if (startX > 5 && startX + 1 <= rowMax) {
        startX += 1;
        return attemptPlacement(startX, startY, orientation, size, ship);
      } else {
        orientation = 'vertical';
        // If already attempted recursion with changed orientation, 
        // replace existing start coordinates with new random coordinates
        if (!!utterFail) {
          startX = Math.floor(Math.random() * 9) + 1;
          startY = Math.floor(Math.random() * 9) + 1;
          return attemptPlacement(startX, startY, orientation, size, ship);
        }

        utterFail = true;
        return attemptPlacement(startX, startY, orientation, size, ship);
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
      return utterFail = false;
    } else {
      if (startY <= 5 && startY - 1 > 0) {
        startY -= 1;
        return attemptPlacement(startX, startY, orientation, size, ship);
      } else if (startY > 5 && startY + 1 <= colMax) {
        startY += 1;
        return attemptPlacement(startX, startY, orientation, size, ship);
      } else {
        orientation = 'horizontal';

        if (!!utterFail) {
          startX = Math.floor(Math.random() * 9) + 1;
          startY = Math.floor(Math.random() * 9) + 1;
          return attemptPlacement(startX, startY, orientation, size, ship);
        }

        utterFail = true;
        return attemptPlacement(startX, startY, orientation, size, ship);
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
        updateMsgBox('Sank the Battleship. You win!');
      } else {
        console.log(`Sank the ${opponentShips[oppTargetShip].name}`);
        updateMsgBox(`Sank the ${opponentShips[oppTargetShip].name}`);
      }
    }
  }
};

/**
 * @function handlePlayerPlacementMouseEnter
 * @description
 * Highlights a portion of the player board during placement phase
 * Highlights number of tiles respective of currently selected ship size
 * @param {object} e 
 */
const handlePlayerPlacementMouseEnter = (e) => {
  let col = parseInt(e.target.dataset.col);
  let row = parseInt(e.target.dataset.row);
  let size;
  let start;
  let end;
  // $(e.target).css({ 'border': '3px solid green' });
  if (!!selectedPlayerShip) {
    size = playerShips[selectedPlayerShip].holes;
    // Horizontal placement
    if (playerPlacementOrientation === 'horizontal') {
      start = col;
      end = start + size - 1;

      for (let i = start; i <= end; i += 1) {
        $(`#player-tile-${row}-${i}`).toggleClass('highlight-tile');
      }
    } else if (playerPlacementOrientation === 'vertical') {
      start = row;
      end = start + size - 1;

      for (let i = start; i <= end; i += 1) {
        $(`#player-tile-${i}-${col}`).toggleClass('highlight-tile');
      }
    }
  }
};

/**
 * @function handlePlayerPlacementMouseLeave
 * @description
 * Un-highlights the portion of the player board highlighted from handPlayerPlacementMouseEnter
 * @param {object} e 
 */
const handlePlayerPlacementMouseLeave = (e) => {
  let col = parseInt(e.target.dataset.col);
  let row = parseInt(e.target.dataset.row);
  let size;
  let start;
  let end;
  // $(e.target).css({ 'border': '1px solid gray' });
  if (!!selectedPlayerShip) {
    size = playerShips[selectedPlayerShip].holes

    // Horizontal placement
    if (playerPlacementOrientation === 'horizontal') {
      start = col;
      end = start + size - 1;

      for (let i = start; i <= end; i += 1) {
        $(`#player-tile-${row}-${i}`).toggleClass('highlight-tile');
      }
    } else if (playerPlacementOrientation === 'vertical') {
      start = row;
      end = start + size - 1;

      for (let i = start; i <= end; i += 1) {
        $(`#player-tile-${i}-${col}`).toggleClass('highlight-tile');
      }
    }
  }
};

/**
 * @function isPlayerPlacementValid
 * @description Checks if a selected tile's placement range is valid, returns a Boolean 
 * @param {number} startX 
 * @param {number} startY 
 * @param {string} orientation 
 * @param {number} size 
 */
const isPlayerPlacementValid = (startX, startY, orientation, size, ship) => {
  let end;

  // Check if ship has already been placed
  if (playerPlacedShips.indexOf(ship) > -1) {
    console.log('Current selected ship already placed');
    return false;
  }
  if (orientation === 'horizontal') {
    end = startY + size;
    for (let i = startY; i < end; i += 1) {
      // Check if the target placement range is clear (null)
      if (playerBoardArr[startX][i] !== null) {
        return false;
      }
      // Check if the target placement range exceeds the player board
    }
    return true;
  } else if (orientation === 'vertical') {
    end = startX + size;
    for (let i = startX; i < end; i += 1) {
      // Check if the target placement range exceeds the player board
      if (playerBoardArr[i][startY] !== null) {
        return false;
      }
    }
    return true;
  }
  return false;
};

/**
 * @function placePlayerShips
 * @description Places the selected ship into the player's board arr
 * @param {number} startX 
 * @param {number} startY 
 * @param {string} orientation 
 * @param {number} size 
 * @param {string} ship 
 */
const placePlayerShips = (startX, startY, orientation, size, ship) => {
  let end;

  if (orientation === 'horizontal') {
    end = startY + size;
    for (let i = startY; i < end; i += 1) {
      playerBoardArr[startX][i] = ship;
      $(`#player-tile-${startX}-${i}`).toggleClass('placed-ship-tile');
    }
  } else if (orientation === 'vertical') {
    end = startX + size;
    for (let i = startX; i < end; i += 1) {
      playerBoardArr[i][startY] = ship;
      $(`#player-tile-${i}-${startY}`).toggleClass('placed-ship-tile');
    }
  }

  playerPlacedShips.push(ship);
  if (playerPlacedShips.length === 5) {
    setTimeout(() => updateMsgBox(`All player ships placed. Let's begin!`), 1500);
  }
}

/**
 * @function handlePlayerTileClick
 * @description Handles the click event for player tiles
 * @param {object} e 
 */
const handlePlayerTileClick = (e) => {
  let targetRow = parseInt(e.target.dataset.row);
  let targetCol = parseInt(e.target.dataset.col);
  let targetOrientation = playerPlacementOrientation;
  let targetShipSize = parseInt(playerShips[selectedPlayerShip].holes);
  
  // Validate intended placement
  if (!!isPlayerPlacementValid(targetRow, targetCol, targetOrientation, targetShipSize, selectedPlayerShip)) {
    updateMsgBox(`Placed the ${selectedPlayerShip}!`, true, 500, true);
    setTimeout(() => updateMsgBox(welcomeMsg), 500);
    setTimeout(() => $('.change-orientation-btn').on('click', handleChangeOrientation), 1000);
    placePlayerShips(targetRow, targetCol, targetOrientation, targetShipSize, selectedPlayerShip);
  } else {
    updateMsgBox('Invalid placement', true, 500, true);
    setTimeout(() => updateMsgBox(welcomeMsg), 500);
    setTimeout(() => $('.change-orientation-btn').on('click', handleChangeOrientation), 1000);
  }

  console.log({ playerBoardArr });
};

/**
 * @function addShipAvatars
 * @description 
 * Dynamically adds ship avatars to the ship avatars screen
 * Adds an event listener to handle player ship avatar click event
 */
const addShipAvatars = () => {
  Object.keys(opponentShips).forEach((ship) => {
    $($opponentAvatarsList).append(`<li 
      class="opponent-ship-avatar ship-avatar"
      data-ship="${ship}"
      >${ship}</li>`);
  });
  Object.keys(playerShips).forEach((ship) => {
    $($playerAvatarsList).append(`<li 
      class="player-ship-avatar ship-avatar"
      id="player-ship-avatar-${ship}"
      data-ship="${ship}"
      >${ship}</li>`);
  });
  // Handle player ship avatar selection
  let prevSelected;
  $('.player-ship-avatar').on('click', (e) => {
    if (!!prevSelected) $(prevSelected).toggleClass('selected-player-ship-avatar');

    selectedPlayerShip = e.target.dataset.ship;
    $(`#player-ship-avatar-${e.target.dataset.ship}`).toggleClass('selected-player-ship-avatar');
    prevSelected = `#player-ship-avatar-${e.target.dataset.ship}`;
  });
};

const handleChangeOrientation = () => {
  console.log('changed orientation');
  playerPlacementOrientation === 'horizontal' ? 
    playerPlacementOrientation = 'vertical' : 
    playerPlacementOrientation = 'horizontal';   
}



createBoards();
placeOppShips();
addShipAvatars();
updateMsgBox(welcomeMsg);

$playerChangeOrientationBtn = $('.change-orientation-btn');
$($playerChangeOrientationBtn).on('click', handleChangeOrientation);