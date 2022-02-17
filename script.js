const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');


// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let checkDrag=false;

// image btn
let body = document.querySelector("body");
let imgBtn = document.querySelector(".change-img");
let imgArray = [6762796,4799073,11493548,483251,885016,1319040,583204,956313,907185,83771190,9951162,4704199,1424340,4466406,'_c8AwsKRa5o',54557840,4473399,139338,148982,9621243,7353049,4654731,1988205,1872496,1649237,'OOP-PWWi5rc',32077960,8253979,1061798];
let count =0;
// Math.floor(Math.random()*imgArray.length)
const setImg=()=>{
    body.style.background=`url(https://source.unsplash.com/collection/${imgArray[count]}/1920x1080)`;
    count = count===imgArray.length - 1?0:count+1;
};

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray,progressListArray,completeListArray,onHoldListArray];
  localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// filter array - empty
filterArray=(arr)=>{
  const filteredArray = arr.filter(item=>item!==null);
  return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart','drag(event)');
  listEl.contentEditable=true;
  listEl.id=index;
  listEl.setAttribute('onfocusout',`updateItem(${index},${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // emptying list
  for(let item of listColumns){
    item.textContent='';
  }
  // Backlog Column
  backlogListArray.forEach((backlogItem,index)=>{
    createItemEl(backlogList,0,backlogItem,index);
  })
  backlogListArray=filterArray(backlogListArray);
  // Progress Column
  progressListArray.forEach((progressItem,index)=>{
    createItemEl(progressList,1,progressItem,index);
  })
  progressListArray=filterArray(progressListArray);
  // Complete Column
  completeListArray.forEach((completeItem,index)=>{
    createItemEl(completeList,2,completeItem,index);
  })
  completeListArray=filterArray(completeListArray);
  // On Hold Column
  onHoldListArray.forEach((onHoldItem,index)=>{
    createItemEl(onHoldList,3,onHoldItem,index);
  })
  onHoldListArray=filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad=true;
  updateSavedColumns();
}

//  update item - del if blank
updateItem=(id,col)=>{
  const selectedArray=listArrays[col];
  const selectedColumnEl = listColumns[col].children;
  if(!checkDrag){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    } else{
      selectedArray[id]=selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// add to col, reset 
addToColumn=(col)=>{
  if(addItems[col].textContent){
  const itemText=addItems[col].textContent;
  const selectedArray = listArrays[col];
  selectedArray.push(itemText);
  addItems[col].textContent='';
  updateDOM();
  }
}

// show input box
showInputBox=(col)=>{
  addBtns[col].style.visibility='hidden';
  saveItemBtns[col].style.display='flex';
  addItemContainers[col].style.display='flex';
}

// hide input box
hideInputBox=(col)=>{
  addBtns[col].style.visibility='visible';
  saveItemBtns[col].style.display='none';
  addItemContainers[col].style.display='none';
  addToColumn(col);
}


// allow array to reflect drag drop
rebuildArrays=()=>{
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);

  updateDOM();
}


//  when item starts dragding
drag=(e)=>{
  draggedItem = e.target;
  checkDrag=true;
}

// col allows for item to drop
allowDrop=(e)=>{
  e.preventDefault();
}

// drop item in col
drop=(e)=>{
  e.preventDefault();
  listColumns.forEach((column)=>{
    column.classList.remove('over');
  });
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  checkDrag=false;
  rebuildArrays();
}

// when item enters col area
dragEnter=(e)=>{
  listColumns[e].classList.add('over');
  currentColumn = e;
}

// when item leave col area
dragLeave=(e)=>{
  listColumns[e].classList.remove('over');
}

updateDOM();
