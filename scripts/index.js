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

  /**
   * @function createBoards
   * @description Creates the Player and Opponent boards and fills with tiles
   */
  const createBoards = () => {
    for (let i = 0; i < 100; i += 1) {
      let playerTile = 
        `<div 
          class="tile player-tile"
          data-type="player" 
          data-tile="${i}" 
          data-id="${i}" 
          id="player-${i}">
        </div>`;

      let opponentTile = 
        `<div 
          class="tile opponent-tile"
          data-type="opponent" 
          data-tile="${i}" 
          data-id="${i}" 
          id="opponent-${i}">
        </div>`;

      $($opponentBoard).append(opponentTile);
      $($playerBoard).append(playerTile);
    }
    
    // Update jQ Selector Vars
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