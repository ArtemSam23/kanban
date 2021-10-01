const draggables = document.querySelectorAll('.list__items')
arrayOfDraggables = [... document.querySelectorAll('.list__items')]
const containers = document.querySelectorAll('.list')
var copyOfDraggable = null
var indexOfDragging = null
var containerFromDrag = null

last = function(arr) {
    return arr[arr.length - 1]
}

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        copyOfDraggable = draggable.cloneNode(true)
        copyOfDraggable.classList.add('copy')
        draggable.classList.add('dragging')
        arrayOfDraggables = [... document.querySelectorAll('.list__items:not(.copy)')]
        indexOfDragging = arrayOfDraggables.indexOf(draggable)
    })

    draggable.addEventListener('dragend', () => {
        copyOfDraggable.remove()
        copyOfDraggable = null
        indexOfDragging = null
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        if (containerFromDrag == null) {
            containerFromDrag = container
            lastElement = last(containerFromDrag.querySelectorAll('.list__items'))
        }
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = copyOfDraggable
        const draggingElemet = document.querySelector('.dragging')
        if ((arrayOfDraggables[indexOfDragging+1] === afterElement ||
            (draggingElemet == lastElement && afterElement == undefined)) &&
            container.contains(draggingElemet)
        ){
            draggable.classList.add('hide')
        } else {
            draggable.classList.remove('hide')
            if (afterElement == null) {
                container.appendChild(draggable)
            } else {
                container.insertBefore(draggable, afterElement)
            }
        }
    })
    
    container.addEventListener('drop', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
        containerFromDrag = null
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list__items:not(.dragging)')]

    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}