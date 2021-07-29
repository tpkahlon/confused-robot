let movementTimer;
let rotationTimer;

function makeGrid(rows, columns) {
  let markup = "";
  for (let row = 0; row < rows; row++) {
    markup += `<div class="row">`;
    for (let column = 0; column < columns; column++) {
      markup += `<div class="column" data-column=${row}${column}></div>`;
    }
    markup += "</div>";
  }
  return markup;
}

function makeControls() {
  return `<button class="move">Move</button><button class="rotate">Rotate</button><button class="refresh">Refresh</button><button class="auto">Auto</button><button class="stop">Stop</button>`;
}

function renderGrid(rows, columns) {
  const app = document.getElementById("app");
  const main = document.createElement("main");
  const aside = document.createElement("aside");
  app.appendChild(main);
  app.appendChild(aside);
  const grid = makeGrid(rows, columns);
  const controls = makeControls();
  main.innerHTML = grid;
  aside.innerHTML = controls;
}

function createPlayer(direction) {
  const player = document.createElement("div");
  player.classList.add("player", `player--${direction}`);
  player.dataset.direction = direction;
  return player;
}

function renderPlayer() {
  const randomList = generateRandomOrder();
  const randomPosition = randomItemFromArray(randomList);
  const randomDirection = randomItemFromArray([0, 1, 2, 3]);
  const allColumns = document.querySelectorAll(".column");
  const filterTargetBlock = (column) =>
    column.dataset.column === randomPosition;
  const [targetBlock] = Array.from(allColumns).filter(filterTargetBlock);
  const player = createPlayer(randomDirection);
  targetBlock.appendChild(player);
}

function handleMovement() {
  const currentPlayer = document.querySelector(".player");
  const parentElement = currentPlayer.parentElement;
  let direction = Number(currentPlayer.dataset.direction);
  let location = parentElement.dataset.column;
  let locationArray = location.split("").map(Number);
  const getPlayerLocationNorthbound = () => {
    let newArray = [...locationArray];
    newArray[0] = newArray[0] - 1;
    return newArray.map(String).join("");
  };
  const getPlayerLocationEastbound = () => {
    let newArray = [...locationArray];
    newArray[1] = newArray[1] + 1;
    return newArray.map(String).join("");
  };
  const getPlayerLocationWestbound = () => {
    let newArray = [...locationArray];
    newArray[1] = newArray[1] - 1;
    return newArray.map(String).join("");
  };
  const getPlayerLocationSouthbound = () => {
    let newArray = [...locationArray];
    newArray[0] = newArray[0] + 1;
    return newArray.map(String).join("");
  };
  const movePlayer = (currentPlayer, direction, newLocation) => {
    const newPlayer = createPlayer(direction);
    const placement = document.querySelector(
      `.column[data-column="${newLocation}"]`
    );
    if (placement === null) {
      handleRotation();
      handleRotation();
    } else {
      parentElement.innerHTML = "";
      placement.appendChild(currentPlayer);
    }
  };
  switch (direction) {
    case 0:
      movePlayer(currentPlayer, direction, getPlayerLocationNorthbound());
      break;
    case 1:
      movePlayer(currentPlayer, direction, getPlayerLocationEastbound());
      break;
    case 2:
      movePlayer(currentPlayer, direction, getPlayerLocationSouthbound());
      break;
    case 3:
      movePlayer(currentPlayer, direction, getPlayerLocationWestbound());
      break;
    default:
      return null;
  }
}

function handleRotation() {
  const player = document.querySelector(".player");
  let playerDirection = Number(player.dataset.direction);
  playerDirection = playerDirection === 3 ? 0 : playerDirection + 1;
  player.dataset.direction = playerDirection;
  player.removeAttribute("class");
  player.classList.add("player", `player--${playerDirection}`);
}

function handleAuto() {
  movementTimer = setInterval(() => {
    handleMovement();
  }, 300);
  rotationTimer = setInterval(() => {
    handleRotation();
  }, 1000);
}

function handleStop() {
  clearInterval(movementTimer);
  clearInterval(rotationTimer);
}

function controlEvents() {
  const move = document.querySelector(".move");
  const rotate = document.querySelector(".rotate");
  const refresh = document.querySelector(".refresh");
  const auto = document.querySelector(".auto");
  const stop = document.querySelector(".stop");
  move.addEventListener("click", handleMovement);
  rotate.addEventListener("click", handleRotation);
  refresh.addEventListener("click", refreshApp);
  auto.addEventListener("click", handleAuto);
  stop.addEventListener("click", handleStop);
}

function refreshApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  handleStop();
  renderApp();
}

function generateRandomOrder() {
  let result = [];
  for (let i = 0; i < 100; i++) {
    result.push(("0" + i).slice(-2));
  }
  return result;
}

function randomItemFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function handleAppleOSFix() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
}

function renderApp() {
  renderGrid(10, 10);
  renderPlayer();
  controlEvents();
  handleAuto();
  handleAppleOSFix();
}

renderApp();
