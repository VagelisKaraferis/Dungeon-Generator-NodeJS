const configureMap = require('./mapConfig');
const _ = require('lodash');

const initializeMap = (mapWidth, mapHeight) => {
  return Array(mapHeight).fill().map(() => Array(mapWidth).fill('#'));
};

const getRandomRoomDimensions = (minRoomArea, maxRoomArea) => {
  const randomInt = _.random(minRoomArea, maxRoomArea);
  let dimensions = getRandomFactorPair(randomInt)
  return dimensions[0],dimensions[1]
}

const isInteger = (value) => !isNaN(value) && Number.isInteger(parseFloat(value));

const getRandomFactorPair = (num) => {
  if (num <= 0 || typeof num !== 'number') {
      throw new Error("Input must be a positive integer.");
  }
  const factors = [];
  for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
          factors.push([i, num / i]);
      }
  }
  // Pick a random pair from the factor list
  const randomIndex = Math.floor(Math.random() * factors.length);
  return factors[randomIndex];
}
const displayMap = (map) => {
  map.forEach(row => console.log(row.join('')));
};

const spaceAvailabilityCrawler = (map, startX, startY, roomWidth, roomHeight) => {
  
const mapHeight = map.length;
const mapWidth = map[0].length;

for (let x = startX; x <= (startX + roomWidth); x++) { 
  if ((startX + roomWidth) > mapWidth) {
    return false
  }
  for (let y = startY; y <= (startY + roomHeight); y++) {
    if (map[x][y] !== '#' && (startY + roomHeight) && map[x-1][y-1] !== '#' > mapHeight) {
      return false
    }
  }
}
return true 
};

const roomPlacer = (map, startX, startY, roomHeight, roomWidth, roomNumber) => {
for (let x = startX; x <= (startX + roomWidth); x++) { 
  for (let y = startY; y <= (startY + roomHeight); y++) {
    if (y == 0) { // Draw upfacing wall
       map[x][y] = '_' 
    } else if (y >= 1 && y < (startY + roomHeight) && x == 0) { // Draw left wall 
      map[x][y] = '|'
    } else if (y >= 1 && y < (startY + roomHeight) && x == (startX + roomWidth)) { // Draw right wall
      map[x][y] = '|'
    } else if (y == startY + roomHeight) { // Draw downfacing wall
      map[x][y] = '|'
    } else {
      map[x][y] = '.'
    }
    map[1][1] = roomNumber
  }
}
return map
}


(async () => {

  // const config = await configureMap(); // Get user configuration

  const mapWidth = 10, mapHeight = 10, mapArea = 64 , minRoomArea = 20, maxRoomArea = 60, maxRooms = 5

  let map = initializeMap(mapWidth, mapHeight);

  console.log(`
    ==================== CONFIGURATION ====================
    Map Width     : ${mapWidth}
    Map Height    : ${mapHeight}
    Map Area      : ${mapArea}
    Min Room Area : ${minRoomArea}
    Max Room Area : ${maxRoomArea}
    Max Rooms     : ${maxRooms}
    =======================================================
    `);

    let roomCount = 1
    let roomPlaced = false
    let failedToPlaceRoom = false
    while (true) {
      if (roomCount > maxRooms || failedToPlaceRoom) {
        console.log("Cannot place more rooms")
        break
      } 
      let roomWidth, roomHeight = getRandomRoomDimensions(minRoomArea,maxRoomArea)
      for (let x = 1; x <= roomWidth - 1; x++) {
        for (let y = 1; y <= roomHeight - 1; y++) {  
            let canPlaceRoom = spaceAvailabilityCrawler(map,x,y,roomWidth, roomHeight)
            if (canPlaceRoom) {
              map = roomPlacer(map, x,y, roomWidth,roomHeight, roomCount)
              roomPlaced = true
              break
            } else {
              failedToPlaceRoom = true
            }
        }
        if (roomPlaced) {
          roomPlaced = false 
          break
        }
      }
      roomCount++
    }
  
  displayMap(map);

})();
