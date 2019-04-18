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
  let opponentShipsArr = [];
  let playerShipsArr = [];

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

  /**
   * @function handleOpponentTileClick
   * @description Handles the click event for opponent tiles
   * @param {object} e 
   */
  const handleOpponentTileClick = (e) => {
    console.log('Opponent tile clicked', e);
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
});

