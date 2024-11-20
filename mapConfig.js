const readline = require('readline');

const isInteger = (value) => !isNaN(value) && Number.isInteger(parseFloat(value));

const promptUser = (rl, question) => {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
};

const configureMap = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let mapWidth, mapHeight, minRoomArea, maxRoomArea, maxRooms;

  while (true) {
    mapWidth = await promptUser(rl, 'Enter Map Width (integer, >= 7): ');
    mapWidth = parseInt(mapWidth);
    if (isInteger(mapWidth) && mapWidth >= 7) break;
    console.log('Invalid input: Map Width must be an integer and at least 7.');
  }

  while (true) {
    mapHeight = await promptUser(rl, 'Enter Map Height (integer, >= 6): ');
    mapHeight = parseInt(mapHeight);
    if (isInteger(mapHeight) && mapHeight >= 6) break;
    console.log('Invalid input: Map Height must be an integer and at least 6.');
  }

  // Subtracting 2 to acommodate padding obligations (maximum available space with at least one "#" distance from the all edges)
  let mapArea = (mapHeight - 2) * (mapWidth - 2 )

  while (true) {
    minRoomArea = await promptUser(rl, `Enter Min Room Area (integer, >= 9 && <= ${mapArea}): `);
    minRoomArea = parseInt(minRoomArea);
    if (isInteger(minRoomArea) && minRoomArea >= 9 && minRoomArea <= mapArea) break;
    console.log('Invalid input: Min Room Area must be an integer and at least 9.');
  }

  if (minRoomArea == mapArea) {
    maxRoomArea = minRoomArea
    console.log('Automatically set Max Room Area the same as Min Rooom Area since the last one is equal to Total Map Area Available')
  } else {
      while (true) {
      maxRoomArea = await promptUser(rl, `Enter Max Room Area (integer, >= Min Room Area ${minRoomArea} && <= ${mapArea}): `);
      maxRoomArea = parseInt(maxRoomArea);
      if (isInteger(maxRoomArea) && maxRoomArea >= minRoomArea && maxRoomArea <= mapArea) break;
      console.log(`Invalid input: Max Room Area must be an integer and at least ${minRoomArea}.`);
    }
  }
  
  while (true) {
    maxRooms = await promptUser(rl, 'Enter Max Rooms (integer): ');
    maxRooms = parseInt(maxRooms);
    if (isInteger(maxRooms)) break;
    console.log('Invalid input: Max Rooms must be an integer.');
  }

  console.log(`Configuration Successful!
    Map Size: ${mapWidth} x ${mapHeight} = ${mapArea} Blocks
    Room Area Range: Min ${minRoomArea}, Max ${maxRoomArea}
    Max Rooms: ${maxRooms}`);

  rl.close();

  return {
    mapWidth,
    mapHeight,
    mapArea,
    minRoomArea,
    maxRoomArea,
    maxRooms,
  };
};

module.exports = configureMap;
