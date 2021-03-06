
let containers = document.querySelectorAll(".container");
let draggables = document.querySelectorAll(".draggable");
const contentCreatorButtons = document.querySelectorAll(
  ".contentCreatorButton"
);

let currentdragging;

contentCreatorButtons.forEach((contentCreatorButton) => {
  contentCreatorButton.addEventListener("dragstart", () => {
    contentCreatorButton.classList.add("moving");
    currentdragging = contentCreatorButton.id;
  });
});


// function used to resize the element clicked
function resize(item) {
    item.style.resize = "both"
}


// function to make the text inside it to be editable
function editable(element){
    element.setAttribute("contenteditable","true");
    
  }

// used to drag Elements

// call this function when updating the dragging elements should be updated
function addingEvent() {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
      currentdragging = "notContentCreator";
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });
}

// initial call for existing dragging elements
addingEvent();

function containerDragOver(container) {
  container.addEventListener("dragover", (e) => {

    e.preventDefault();
    e.stopPropagation();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement === null) {
      container.appendChild(draggable);
    } else if (draggable !== null) {
      container.insertBefore(draggable, afterElement);
    }
  });
}

function workingContainer(container) {
  container.addEventListener("dragenter", () => {
    container.classList.add("hovered");
  });
  container.addEventListener("dragleave", () => {
    container.classList.remove("hovered");
  });
  containerDragOver(container);

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentdragging !== "notContentCreator") {
      addContent(currentdragging + "Temp", container);
    }
    draggables = document.querySelectorAll(".draggable");
    addingEvent();
    containers = document.querySelectorAll(".container");
  });
}

// loop through the containers to place the element in any hovering container
function setContainerEvents() {
  containers.forEach((container) => {
    workingContainer(container);
  });
}

setContainerEvents();

// this function will check where to put the element after in the same container
function getDragAfterElement(container, y) {
  // avoiding the dragging class while selecting all draggable classes
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Add new Content

function addContent(tag, place) {
  var template = document.getElementById(tag);
  var cloned = template.content.cloneNode(true);
  for (let i = 0; i < cloned.children.length; i++) {
    var element = cloned.children[i];
    var rand = Math.floor(Math.random() * 10000);
    var newId = element.id + rand;
    element.setAttribute("id", newId);
    if (
      !element.classList.contains("container") &&
      !element.classList.contains("row")
    ) {
      element.setAttribute("draggable", "true");
      element.classList.add("draggable");
    }
  }

  var rows = 2;
  var colomns = 2;

  if (tag == "gridTemp") {
    for (let j = 0; j < rows; j++) {
      var childRow = document.createElement("div");
      childRow.classList.add("container");
      element.appendChild(childRow);
      for (let i = 0; i < colomns; i++) {
        var childCol = document.createElement("div");
        childCol.classList.add("container");
        childCol.innerHTML = "number";
        element.children[j].appendChild(childCol);
      }
    }
  }

  place.appendChild(cloned);
//   containerDragOver(document.getElementById(newId))
  if (tag == "gridTemp") {
    if (element.children.length > 1) {
        containerDragOver(element)
      for (let i = 0; i < element.children.length; i++) {
            containerDragOver(element.children[i])
            element.children[i].classList.add("row");
        for (let j = 0; j < element.children[i].children.length; j++) {
          containerDragOver(element.children[i].children[j]);
          element.children[i].children[j].classList.add(`col`);
          element.children[i].children[j].setAttribute("onclick","resize(this)");
          element.children[i].children[j].setAttribute("ondblclick","editable(this)");
          element.children[i].children[j].setAttribute("ondblclick","editable(this)");
        }
      }
    }
    // containerDragOver(element);
  }
}

