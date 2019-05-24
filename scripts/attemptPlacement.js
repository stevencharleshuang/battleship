$(document).ready(() => {
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
    let end;
    let isClear = true;

    // Split logic by orientation
    // Attempt horizontal placement
    if (orientation === 'horizontal') {
      // Check if there is suffient columns to fully place the ship
      let colDiff = Math.abs(colMax - startY)
      if (colDiff < size) {
        startY = colMax - size;
        console.log('Updated startY', startY);
      }
      end = startY + size;
      // iterate the board arr by column arr[i][j]
      for (let i = startY; i < end; i += 1) {
        if (opponentBoardArr[startX][i] !== null) {
          isClear = false;
        }
      }
      // if the row from startY to startY + size === null, place the ship
      if (isClear === true) {
        for (let i = startY; i < end; i += 1) {
          opponentBoardArr[startX][i] = ship;
        }
      } else {
        if (startX <= 5 && startX - 1 > 0) {
          startX -= 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else if (startX > 5 && startX + 1 <= rowMax) {
          startX += 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else {
          console.log('Placement failed. Failed ship: ', ship, { startY });
          return;
        }
      }
    // Attempt vertical placement
    } else {
      let rowDiff = Math.abs(rowMax - startX)
      if (rowDiff < size) {
        startX = rowMax - size;
      }
      end = startX + size;
      for (let i = startY; i < end; i += 1) {
        if (opponentBoardArr[startY][i] !== null) {
          isClear = false;
        }
      }
      if (isClear === true) {
        // If there is no ship overlap, place the ship
        for (let i = startX; i < end; i += 1) {
          opponentBoardArr[startY][i] = ship;
        }
      } else {
        if (startY <= 5 && startY - 1 > 0) {
          startY -= 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else if (startY > 5 && startX + 1 <= colMax) {
          startY += 1;
          attemptPlacement(startX, startY, orientation, size, ship);
        } else {
          console.log('Placement failed. Failed ship: ', ship, { startY });
          return;
        }
      }
    }
  };
});