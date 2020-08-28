'use strict';

//global variables
var hours = ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm'];
var allStores = [];
var table = document.getElementById('table');
var allHourlyTotalArray = [];
var grandTotal = 0;
var form = document.getElementById('form');
var tfoot = document.createElement('tfoot');
var tbody = document.createElement('tbody');  // Ryan - if this is a global, you only create one tbody. which is appropriate

//store constructor
function Store(name, min, max, avg) {
  this.name = name;
  this.minCust = min;
  this.maxCust = max;
  this.avgSales = avg;
  this.avgSalesArray = [];
  this.dailyTotal = 0;
  allStores.push(this);
}

//prototype methods and calculate customers per hour from WC schools
Store.prototype.calcCustPerHour = function () {
  return Math.floor(Math.random() * (this.maxCust - this.minCust + 1) + this.minCust);
};

//calculate sales per hour
Store.prototype.calcAvgCookieSales = function () {
  for ( var i = 0; i < hours.length; i++) {
    var hourlyTotal = Math.ceil(this.calcCustPerHour() * this.avgSales);
    console.log(hourlyTotal);
    this.avgSalesArray.push(hourlyTotal);
    this.dailyTotal += hourlyTotal;
  }
};

//render method for each table
Store.prototype.render = function () {
  this.calcAvgCookieSales();
  // var tbody = document.createElement('tbody'); -should be global otherwise too many table bodies created.  should only be 1
  var trEl = document.createElement('tr');
  createElement('td',this.name, trEl);
  for ( var i = 0; i < hours.length; i++) {
    createElement('td', this.avgSalesArray[i], trEl);
  }
  createElement('td', this.dailyTotal, trEl);
  tbody.appendChild(trEl);
  table.appendChild(tbody);
};

//render header
function renderHeader () {
  var thead = document.createElement('thead');
  var trEl = document.createElement('tr');
  createElement('th','Location\\Hours', trEl);
  for ( var i = 0; i < hours.length; i++) {
    console.log(i);
    createElement('th', hours[i], trEl);
  }
  createElement('th','total', trEl);
  thead.appendChild(trEl);
  table.appendChild(thead);
}

//render all rows
function renderAllRows () {
  for (var i = 0; i < allStores.length; i++){
    allStores[i].render();
  }
}

//render footer
function renderFooter () {
  allHourlyTotalArray = [];  // RYan- this resets array and it will re-calculate totals normally
  grandTotal = 0;
  //tfoot.innerHTML = '';
  // table.deleteRow(-1); // Ryan -???? shouldn't be necessary
  calcTotals();  // Ryan -was called twice, this is why you had twice as many numbers at begginning
  var trEl = document.createElement('tr');
  createElement('td', 'Totals', trEl);
  for ( var i = 0; i < allHourlyTotalArray.length; i++) {
    createElement('td', allHourlyTotalArray[i], trEl);
  }
  createElement('td', grandTotal, trEl);
  // //tfoot.appendChild(trEl);
  // table.appendChild(trEl);  Ryan - this likely changed with TA during troubleshooting.   having in tfoot is convenient, because then it always glues to bottom of table
   tfoot.appendChild(trEl);
  table.appendChild(tfoot); 
}

//create element function to DRY out code
function createElement (childString, textContent, parentElement) {
  var childElement = document.createElement(childString);
  childElement.textContent = textContent;
  parentElement.appendChild(childElement);
}

//calculate totals for footer
function calcTotals () {
  for ( var i = 0; i < hours.length; i++){
    var hourlyTotal = 0;
    for ( var j = 0; j < allStores.length; j++) {
      hourlyTotal += allStores[j].avgSalesArray[i];
    }
    allHourlyTotalArray.push(hourlyTotal); // Ryan - this function was being called twice, so the array of numbers was just TOOOOOO big
    grandTotal += hourlyTotal;
  }
}

//event handler
function handleSubmit(event){
  event.preventDefault();
  var name = event.target.name.value;
  var min = parseInt(event.target.min.value);
  var max = parseInt(event.target.max.value);
  var avg = parseInt(event.target.avg.value);
  var newStore = new Store (name, min, max, avg);
  newStore.render();
  tfoot.innerHTML = '';  // Ryan - must clear out the footer each time
  renderFooter();
}

//store objects
new Store ('Seattle', 23, 65, 6.3);
new Store ('Tokyo', 3, 24, 1.2);
new Store ('Dubai', 11, 38, 3.7);
new Store ('Paris', 20, 38, 2.3);
new Store ('Lima', 2, 16, 4.6);

//render header, all rows, footer and total
renderHeader();
renderAllRows();
// calcTotals(); Ryan call only once (is salso called in renderFooter function).  I recommend calling in the render footer method.  this way you can clear out your totals as well.  and it happens every time you render a new footer
renderFooter();

//addEventListener
form.addEventListener('submit', handleSubmit);

