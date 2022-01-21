import FetchWrapper from "./fetch-wrapper.js";
import {capitalize, calculateCalories} from "./helpers.js";
import Snackbar from "./node_modules/snackbar/src/snackbar.js";
import AppData from "./app-data.js";
import "./node_modules/chart.js/dist/chart.js";


const API = new FetchWrapper(`https://firestore.googleapis.com/v1`);
const form = document.querySelector("#create-form");
const food = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const foodList = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");
const snackbar = new Snackbar;
const appData = new AppData;
let chartInstance = null;


const displayCard = (document) => {
    appData.addFood(document.name ,document.fields.carbs.integerValue, document.fields.protein.integerValue, document.fields.fat.integerValue);

    foodList.insertAdjacentHTML("beforeend", ` 
        <li class="card" data-id="${document.name}">
            <div>
                <h3 class="name">${capitalize(document.fields.name.stringValue)}</h3>
                <div class="calories">${calculateCalories(document.fields.carbs.integerValue, document.fields.protein.integerValue, document.fields.fat.integerValue)} calories</div>
                <ul class="macros">
                    <li class="carbs">
                        <p>Carbs</p>
                        <p class="value">${document.fields.carbs.integerValue} g</p>                            
                    </li>
                    <li class="protein">
                        <p>Protein</p>
                        <p class="value">${document.fields.protein.integerValue} g</p>                            
                    </li>
                    <li class="fat">
                        <p>Fat</p>
                        <p class="value">${document.fields.fat.integerValue} g</p>                            
                    </li>
                </ul>
            </div>
            <button id="dlt-btn" class="delete-btn">x</button>
        </li>`);
}

// Chart
const renderChart = () => {
    chartInstance?.destroy();
    const context = document.querySelector("#app-chart").getContext("2d");

    chartInstance = new Chart(context, {
      type: "bar",
      data: {
          labels: ["Carbs", "Protein", "Fat"],
          datasets: [{
              label: "Macronutrients",
              data: [
                appData.getTotalCarbs(),
                appData.getTotalProtein(),
                appData.getTotalFat()
              ],
              backgroundColor: [
                "#498108",
                "#0b6092", 
                "#8b0828"               
              ],
          }],
      },
  });
};

// function for rendering chart and total calories 
const render = () => {
    renderChart();
    totalCalories.textContent = appData.getTotalCalories();
}

// GET
const getDataFromFirestore = () => {
    API.get(`/projects/test-project-5dd25/databases/(default)/documents/food-list?&key=AIzaSyBZZIBwRfgc6rkopgG1peqwbQX7x78BZUE/?pageSize=30`)
    .then(data => {
        data.documents?.forEach(document => {
            displayCard(document);
    });
    render();
});
}

// POST
form.addEventListener("submit", (e) => {
    e.preventDefault();
    API.post(`/projects/test-project-5dd25/databases/(default)/documents/food-list?&key=AIzaSyBZZIBwRfgc6rkopgG1peqwbQX7x78BZUE`, {
        fields: {
            name: { stringValue: food.value },
            carbs: { integerValue: carbs.value },
            protein: { integerValue: protein.value },
            fat: { integerValue: fat.value }
          }
    }).then(data => {
        if (data.error) {       
            snackbar.show("Some data is missing.");
            return;       
        }
        snackbar.show("Food added successfully");
        
        const dataArr = [];
        dataArr.push(data);
        dataArr.forEach(document => {
            displayCard(document);    
        });
        render();        
    });
    
    food.value = "please select";
    carbs.value = "";
    protein.value = "";
    fat.value = "";    
});

// DELETE
foodList.addEventListener("click", (e) => {
    e.preventDefault();
    let item = e.target;
    let delButtonPressed = item.id === "dlt-btn";
    let dataId = item.parentElement.dataset.id;

    if(delButtonPressed) {        
        API.delete(`/${dataId}`, {

        }).then(() => {
            snackbar.show("Food deleted succesfully");
            item.parentElement.style.opacity = 0;
            item.parentElement.addEventListener("transitionend", () => {
                item.parentElement.remove();
            });            
        });        
        appData.removeFood(dataId);                 
        render();
    }
});

getDataFromFirestore();

