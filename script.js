const containers = document.querySelectorAll('.container')
let draggables = document.querySelectorAll('.draggable')
const contentCreatorButtons = document.querySelectorAll('.contentCreatorButton')

let currentdragging;

contentCreatorButtons.forEach(contentCreatorButton =>  {
    contentCreatorButton.addEventListener('dragstart', () =>{
        contentCreatorButton.classList.add('moving')
        currentdragging = contentCreatorButton.id
    })
})

// used to drag Elements

// call this function when updating the dragging elements should be updated
function addingEvent(){
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart',() => {
            draggable.classList.add('dragging')
            currentdragging = "notContentCreator"
        })
        draggable.addEventListener('dragend', () =>{
            draggable.classList.remove('dragging')
        })
    })
}

// initial call for existing dragging elements
addingEvent()
    

// loop through the containers to place the element in any hovering container
containers.forEach(container => {
    container.addEventListener('dragenter' , () =>{
        container.classList.add('hovered')
    })
    container.addEventListener('dragleave' , () =>{
        container.classList.remove('hovered')
    })
    container.addEventListener('dragover' , e =>{
        e.preventDefault()
        e.stopPropagation()
        const afterElement = getDragAfterElement(container,e.clientY)
        const draggable = document.querySelector('.dragging')
        if(afterElement === null ){
            container.appendChild(draggable)
        }
        else if(draggable !== null){
            container.insertBefore(draggable,afterElement)
        }
        
    })
    container.addEventListener('drop',(e) =>{
        e.preventDefault()
        e.stopPropagation()
        if(currentdragging !== "notContentCreator")
        {
            addContent(currentdragging+"Temp",container)
        }
        draggables = document.querySelectorAll('.draggable')
        addingEvent()

    })
})



// this function will check where to put the element after in the same container
function getDragAfterElement(container,y){
    // avoiding the dragging class while selecting all draggable classes
    const draggableElements =[...container.querySelectorAll('.draggable:not(.dragging)')]
    return draggableElements.reduce((closest,child) => {
        const box =child.getBoundingClientRect()
        const offset = y - box.top - box.height/ 2
        if(offset < 0 && offset > closest.offset){
            return{offset:offset,element :child}
        }else{
            return closest
        }
    },{offset : Number.NEGATIVE_INFINITY}).element
}

// Add new Content

function addContent(tag,place) {
    
    var template = document.getElementById(tag);
    var cloned = template.content.cloneNode(true) ;
        for (let i = 0; i < cloned.children.length; i++) {
            var element = cloned.children[i];
            var rand = Math.floor(Math.random()*10000);
            var newId = element.id+rand;
            element.setAttribute('id',newId);
            element.style.float="left";
            element.style.margin= "1%";
            element.setAttribute('draggable','true');
            element.classList.add("draggable")
            
        }

    place.appendChild(cloned);


}