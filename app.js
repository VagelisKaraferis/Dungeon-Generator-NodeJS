const { Random } = require("random-js");

const configureMap = require('./mapConfig');
let placedRoomsIndexPositions = []; 

const initializeMap = (mapWidth, mapHeight) => {
    return Array(mapHeight).fill().map(() => Array(mapWidth).fill('#'));
};

// Check if a room overlaps with existing rooms
const canPlaceRoom = (room, rooms) => {
    for (const other of rooms) {
        if (
            room.x < other.x + other.width + 1 &&
            room.x + room.width + 1 > other.x &&
            room.y < other.y + other.height + 1 &&
            room.y + room.height + 1 > other.y
        ) {
            return true;
        }
    }
    return false;
}

const generateRoom = (map, room) => {
    for (let y = room.y; y < room.y + room.height; y++) {
        if (y < 0 || y >= map.length) continue; // Check if room's height size is end out of bounds

        for (let x = room.x; x < room.x + room.width; x++) {
            if (x < 0 || x >= map[0].length) continue; // Check if room's width size is end out of bounds

            if (y === room.y || y === room.y + room.height - 1 || x === room.x || x === room.x + room.width - 1) {
                map[y][x] = y === room.y || y === room.y + room.height - 1 ? "_" : "|";
            } else {
                map[y][x] = ".";
            }
        }
    }

    // Store the position of the slot for room index
    placedRoomsIndexPositions.push([room.x + 1, room.y + 1]);
};

const displayMap = (map) => {
    console.log(map.map(row => row.join("")).join("\n"));
}

const isRoomWithinBounds = (room, mapWidth, mapHeight) => {
    return (
        room.x >= 0 &&
        room.y >= 0 &&
        room.x + room.width <= mapWidth &&
        room.y + room.height <= mapHeight
    );
};

// MAIN
(async () => {

    const config = await configureMap(); // Get user configuration
    const {mapWidth, mapHeight, mapArea, minRoomArea,maxRoomArea, maxRooms} = config;
    let map = initializeMap(mapWidth, mapHeight);

    console.log(`
        ==================== CONFIGURATION ====================
        Map Width     : ${mapWidth}
        Map Height    : ${mapHeight}
        Min Room Area : ${minRoomArea}
        Max Room Area : ${maxRoomArea}
        Max Rooms     : ${maxRooms}
        =======================================================
    `);

    let roomCount = 0;
    const placedRooms = [];
    let maxFails = 50
    
    while (roomCount < maxRooms || maxFails == 0) {
        const random = new Random();
        let x = random.integer(1, mapWidth);
        let y = random.integer(1, mapHeight);

        let roomArea = random.integer(minRoomArea, maxRoomArea);
        let roomWidth = Math.floor(Math.sqrt(roomArea));
        let roomHeight = Math.ceil(roomArea / roomWidth);

        while (true) {
            roomArea = random.integer(minRoomArea, maxRoomArea);
            roomWidth = Math.floor(Math.sqrt(roomArea));
            roomHeight = Math.ceil(roomArea / roomWidth);

            if (roomHeight * roomWidth > minRoomArea && roomHeight * roomWidth < maxRoomArea) {
              break
            }
           
        }

        const newRoom = { x, y, width: roomWidth, height: roomHeight };

        if (isRoomWithinBounds(newRoom, mapWidth, mapHeight) && !canPlaceRoom(newRoom, placedRooms)) {
            generateRoom(map, newRoom);
            placedRooms.push(newRoom);
            roomCount++;
        }
        maxFails--
    }

    // Sort number positions top 2 bottom --> left 2 right
    placedRoomsIndexPositions.sort((a, b) => {
        let x1 = a[0];
        let x2 = b[0];
        let y1 = a[1];
        let y2 = b[1];

        if (y1 == y2) {
            return x1 - x2 
        } else {
            return y1 - y2
        }
    });
    
    placedRoomsIndexPositions.forEach((pos, index) => {
        let [x, y] = pos;
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
            map[y][x] = String(index + 1);
        } else {
            console.error(`Invalid position [${x}, ${y}] in placedRoomsIndexPositions`);
        }
    });

    displayMap(map);
})();

