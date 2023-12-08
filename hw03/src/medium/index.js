const floor1Container = document.getElementById("container1");
const floor2Container = document.getElementById("container2");
const point1f = document.getElementById("point1f");
const point2f = document.getElementById("point2f");

const toggleImage = (floorId) => {
  console.log(floorId);
  const floorElement = document.getElementById(floorId);
  const checkbox = floorElement.querySelector(".show-image");
  const img = floorElement.querySelector("img");

  if (checkbox.checked) {
    img.src = `../svg/new${floorId.slice(-1)}F.svg`; // Change to new image
  } else {
    img.src = `../svg/no${floorId.slice(-1)}F.svg`; // Change to initial image
  }
};

const getJson = async (path) => {
  const response = await fetch(path);
  const data = await response.json();
  return data;
};

const calculatePosition = (x, y) => {
  const minX = 10.45;
  const maxX = 60.47;
  const minY = -11.64;
  const maxY = 15.91;
  const iconX = ((x - minX) / (maxX - minX)) * 100;
  const iconY = ((y - minY) / (maxY - minY)) * 100;

  return { x: iconX, y: iconY };
};

const renderHistoryPosition = async (data, time) => {
  const currentPositon = data[time];
  const targetContainer =
    currentPositon.Floor === "1F" ? floor1Container : floor2Container;
  // get targetPoint position
  const { x: iconX, y: iconY } = calculatePosition(
    currentPositon.X,
    currentPositon.Y
  );
  // create new point
  const newPoint = document.createElement("div");
  newPoint.classList.add("history-point");
  newPoint.style.left = `${iconX}%`;
  newPoint.style.top = `${iconY}%`;
  // add point to container
  targetContainer.appendChild(newPoint);
};

const renderPosition = async (data, time) => {
  const currentPositon = data[time];
  const targetPoint = currentPositon.Floor === "1F" ? point1f : point2f;
  const unActivePoint = currentPositon.Floor === "1F" ? point2f : point1f;
  const { x: iconX, y: iconY } = calculatePosition(
    currentPositon.X,
    currentPositon.Y
  );
  unActivePoint.style.display = "none";
  targetPoint.style.display = "block";

  targetPoint.style.left = `${iconX}%`;
  targetPoint.style.top = `${iconY}%`;

  console.log(iconX, iconY);
};

const renderInfo = async (data, time) => {
  const currentPositon = data[time];
  const timeInfo = document.getElementById("time-info");
  const distanceInfo = document.getElementById("distance-info");
  const calorieInfo = document.getElementById("calories-info");

  timeInfo.textContent = `Time: ${time} seconds`;
  distanceInfo.textContent = `Distance: ${currentPositon.Distance} meters`;
  calorieInfo.textContent = `Calories: ${currentPositon.Calorie} calories`;
};

const init = async () => {
  const AerobicData = await getJson("../json/AerobicData.json");
  const userLocationData = await getJson("../json/userLocationData.json");

  let time = 0;
  let maxTime = userLocationData.length - 1;
  setInterval(() => {
    renderPosition(userLocationData, time);
    renderInfo(AerobicData, time);
    renderHistoryPosition(userLocationData, time);
    time = time === maxTime ? 0 : time + 1;
  }, 1000);

  document.addEventListener("change", function (event) {
    if (event.target.classList.contains("show-image")) {
      const floorId = event.target.closest(".grid-item").id;
      toggleImage(floorId);
    }
  });
};

init();
