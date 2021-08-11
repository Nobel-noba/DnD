// New import

let containers = document.querySelectorAll(".contain");
let draggables = document.querySelectorAll(".draggable");
let selectedElement = "div";
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
// function resize(item) {
//   item.style.resize = "both";
// }

// function to make the text inside it to be editable
function editable(element) {
  element.setAttribute("contenteditable", "true");
}

function mouseMove(item) {
  item.classList.add("hovered");
}
function mouseOut(item) {
  item.classList.remove("hovered");
}

// function setOnmouse() {
//   document.querySelectorAll("#workspace *").forEach((item) => {
//     item.addEventListener("mousemove", (event) => {
//       // event.preventDefault();
//       event.stopPropagation();
//       item.classList.add("hovered");
//       // console.log(item.className);
//     });
//     item.addEventListener("mouseout", (event) => {
//       item.classList.remove("hovered");

//       event.preventDefault();
//       event.stopPropagation();
//     });
//   });
// }
// setOnmouse();
// used to drag Elements

// call this function when updating the dragging elements should be updated
function addingEvent() {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
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
  container.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add("hovered");
  });
  container.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("hovered");
  });
  containerDragOver(container);
  container.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    var miniMenu = document.createElement("div");
    var moveMenu = document.createElement("span");
    var resizeMenu = document.createElement("span");
    var styleMenu = document.createElement("span");
    var editMenu = document.createElement("span");
    var removeMenu = document.createElement("span");

    miniMenu.classList.add("moveStyle");
    moveMenu.classList.add("moveChild", "bx", "bx-move");
    resizeMenu.classList.add("moveChild", "bx", "bx-screenshot");
    styleMenu.classList.add("moveChild", "bx", "bxl-css3");
    editMenu.classList.add("moveChild", "bx", "bx-pencil");
    removeMenu.classList.add("moveChild", "bx", "bx-trash");
    // miniMenu.style.display = "flex";
    // miniMenu.style.flexDirection = "horizontal";
    miniMenu.setAttribute("id", "miniMenu");
    miniMenu.setAttribute("draggable", "true");
    miniMenu.addEventListener("dragstart", () => {
      miniMenu.parentNode.classList.remove("contain");
      miniMenu.parentNode.classList.add("draggable");
      miniMenu.parentNode.setAttribute("draggable", "true");
    });
    miniMenu.addEventListener("dragend", () => {
      miniMenu.parentNode.classList.add("contain");
      miniMenu.parentNode.setAttribute("draggable", "false");
    });

    resizeMenu.setAttribute("onclick", "resize()");
    removeMenu.setAttribute("onclick", "deleteNode()");
    editMenu.setAttribute("onclick", "editElement()");
    miniMenu.setAttribute("contenteditable", "false");
    // miniMenu.setAttribute("onClick", "changeColor()");
    var menu = document.getElementById("miniMenu");
    if (menu !== null) {
      menu.parentNode.style.resize = "none";
      menu.parentNode.removeAttribute("contenteditable");
      menu.remove();
    }
    // miniMenu.parentNode.style.position = "relative";
    console.log(selectedElement);
    selectedElement.appendChild(miniMenu);
    miniMenu.appendChild(moveMenu);
    miniMenu.appendChild(resizeMenu);
    miniMenu.appendChild(styleMenu);
    miniMenu.appendChild(editMenu);
    miniMenu.appendChild(removeMenu);
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentdragging !== "notContentCreator") {
      addContent(currentdragging + "Temp", container);
    }
    draggables = document.querySelectorAll(".draggable");
    addingEvent();
    containers = document.querySelectorAll(".contain");
    // setOnmouse();
  });
}

function changeColor() {
  selectedElement.setAttribute("style", "background-color : black;");
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
    if (!element.classList.contains("contain")) {
      // element.setAttribute("draggable", "true");
      // element.classList.add("draggable");
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
  containers.forEach((container) => {
    containerDragOver(container);
  });
  if (tag == "gridTemp") {
    if (element.children.length > 1) {
      containerDragOver(element);
      for (let i = 0; i < element.children.length; i++) {
        containerDragOver(element.children[i]);
        element.children[i].classList.add("row");
        for (let j = 0; j < element.children[i].children.length; j++) {
          containerDragOver(element.children[i].children[j]);
          element.children[i].children[j].classList.add(`col`);
          element.children[i].children[j].setAttribute(
            "onclick",
            "getId(this)"
          );
          element.children[i].children[j].setAttribute(
            "ondblclick",
            "editable(this)"
          );
          element.children[i].children[j].setAttribute(
            "onmousemove",
            "mouseMove(this)"
          );
          element.children[i].children[j].setAttribute(
            "onmouseout",
            "mouseOut(this)"
          );
        }
      }
    }
    // containerDragOver(element);
  }
}

// Old script

let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");
let searchBtn = document.querySelector(".bx-search-alt");
let expand = document.querySelectorAll(".ElementUl");

btn.onclick = function () {
  sidebar.classList.toggle("active");
  let isActive = sidebar.classList.contains("active");

  if (!isActive) {
    expand.forEach((item) => {
      item.style.display = "none";
    });
  }
};

searchBtn.onclick = function () {
  sidebar.classList.add("active");
};

document.querySelectorAll(".accordion").forEach((item) => {
  item.addEventListener("click", (event) => {
    var sibling = item.nextElementSibling;
    sibling.classList.toggle("collapse");
    sidebar.classList.add("active");

    if (sibling.style.display === "block") {
      sibling.style.transition = "0.5s";
      sibling.style.display = "none";
    } else {
      sibling.style.transition = "0.5s";
      sibling.style.display = "block";
    }
  });
});

document.querySelectorAll(".accordiond").forEach((item) => {
  item.addEventListener("click", (event) => {
    var sibling = item.nextElementSibling;
    var icon = item.children[0];
    // icon.classList.add("bx");

    if (sibling.style.display === "grid") {
      sibling.style.transition = "0.5s";
      sibling.style.display = "none";
      icon.classList.remove("bx-down-arrow");
      icon.classList.add("bx-right-arrow");
    } else {
      sibling.style.transition = "0.5s";
      sibling.style.display = "grid";
      icon.classList.remove("bx-right-arrow");
      icon.classList.add("bx-down-arrow");
    }
  });
});

function getId(itemId) {
  selectedElement = itemId;
}

function resize() {
  selectedElement.style.resize = "both";
}

function deleteNode() {
  selectedElement.remove();
}

function editElement() {
  selectedElement.setAttribute("contenteditable", "true");
}
/**
 * How to Set Up
 */

/**
 * Create a new ColorPicker instance, which takes 2 parameters
 *
 * Parameter 1 [HTMLElement]: the button you want to launch the editor
 * Parameter 2 [String] (Optional): A color
 */

const button = document.getElementById("picker_launcher");
let picker = new ColorPicker(button, "#4c0082");

/**
 * What do you want to do after you have chosen the color?
 *
 * You can specify this in an EventListener, assigned to your button
 */

button.addEventListener("colorChange", function (event) {
  // This will give you the color you selected
  const color = event.detail.color.hexa;

  // Change the color of the background
  selectedElement.style.backgroundColor = color;
  button.innerText = color;
});

function generateId() {
  // var station = getElementById("workspace");

  document.querySelectorAll("#workspace *").forEach((item) => {
    item.setAttribute("id", Math.floor(Math.random() * 100000000));
    item.setAttribute("onclick", "getId(this);event.cancelBubble=true;event.preventDefault()");
    item.style.position = "relative";
  });
}

generateId();

window.addEventListener("load", (e) => {
  e.preventDefault;
  e.stopImmediatePropagation;
});
