// Fetch Block
/*
var xmlhttp = new XMLHttpRequest();
var url = "http://127.0.0.1:5500/data.json";
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var apiData = JSON.parse(this.responseText);
    date = apiData.date_population.map(function (el) {
      return el.population;
    });

    population = apiData.date_population.map(function (el) {
      return el.date;
    });

    const ctx = document.querySelector("#myChart").getContext("2d");
    let delayed;

    //Gradient Fill
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(58,123,213,1)");
    gradient.addColorStop(1, "rgba(0,210,255,0.3)");

    //const labels = date;
    const data = {
      labels: date,
      datasets: [
        {
          data: population,
          label: "Population",
          fill: true,
          backgroundColor: gradient,
          borderColor: "#ddd",
          pointBackgroundColor: "rgb(189, 195, 199)",
          tension: 0,
        },
      ],
    };
    const config = {
      type: "line",
      data: data,
      options: {
        radius: 5,
        hitRadius: 30,
        hoverRadius: 12,
        responsive: true,

        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return "$" + value + "m";
              },
            },
          },
        },
      },
    };

    const myChart = new Chart(ctx, config);
  }
};
*/
/*
  fetch("https://api.covidtracking.com/v1/us/daily.json")
    .then((response) => response.json())
    .then(
      (coronadata) =>
        (loop = coronadata.splice(0, 10).forEach((item) => {
          dateData.push(item.date);
          deathData.push(item.death);
        }))
    );
    */
//* asenkron bir fonksiyon kullandığımız için fetch ve dönen datayı
//* json haline getirm işlemlerinin önüne await koyduk
let dateData = [];
let deathData = [];

//? Date String Function
let arrangeDate = (date) => {
  return date.slice(6, 8) + "." + date.slice(4, 6) + "." + date.slice(0, 4);
};

async function getData() {
  const response = await fetch(
    "https://api.covidtracking.com/v1/us/daily.json"
  );
  const apiData = await response.json();

  let first10ArraysOfData = apiData.splice(0, 10);

  first10ArraysOfData.forEach((data) => {
    //? Date Change Start */
    let editedDate = data.date + "";
    //? Converting Data to String for being able to use String Methods
    editedDate = arrangeDate(editedDate);
    //? Date Change Start */

    dateData.push(editedDate);
    deathData.push(data.death);
  });
}

//!Immediately Invoked Function Expression
(async () => {
  apiData = await getData();
  createGraph();
})();

function createGraph() {
  const ctx = document.querySelector("#myChart").getContext("2d");
  let delayed;
  //* Gradient Fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(58,123,213,1)");
  gradient.addColorStop(1, "rgba(0,210,255,0.3)");
  const data = {
    labels: dateData,
    datasets: [
      {
        data: deathData,
        label: "Corona Virus Deaths By Date",
        fill: true,
        backgroundColor: gradient,
        borderColor: "#ddd",
        pointBackgroundColor: "rgb(189, 195, 199)",
        tension: 0,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      radius: 5,
      hitRadius: 30,
      hoverRadius: 12,
      responsive: true,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return (value + "").slice(0, 3) + "k";
            },
          },
        },
      },
    },
  };
  const myChart = new Chart(ctx, config);
}
