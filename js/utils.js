import { doneSvg, pinnedSvg, delSvg, editSvg } from "./svg.js";
let sortableInstance = null;

export function getTasksLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

export function setTasksLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function generateUniqueId() {
    const timestamp = Date.now()
    const randomPart = Math.floor(Math.random() * 10000)
    const randomPartTwo = Math.floor(Math.random() * 10000)
    return timestamp + randomPart + randomPartTwo;
}

export function updateListTasks() {
    document.querySelector('.output').textContent = '';
    const arrayTasksLS = getTasksLocalStorage();
    renderTasks(arrayTasksLS);
}

function renderTasks(tasks) {
    if (!tasks || !tasks.length) return;

    tasks.sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }
        if (a.pinned !== b.pinned) {
            return a.pinned ? -1 : 1;
        }
        return a.position - b.position;
    })
    .forEach((value, i) => {
        const { id, task, pinned, done } = value;
        const item = 
            `
            <div class="task ${done ? 'done' : ''} ${pinned ? 'pinned' : ''}" data-task-id="${id}">
                <p class="task__text">${task}</p>
                <span class="task__index ${done ? 'none' : ''}">${i + 1}</span>
                <div class="task__btns">
                    <button class="task__done ${done ? 'active' : ''}">${doneSvg}</button>
                    <button class="task__pinned ${pinned ? 'active' : ''}">${pinnedSvg}</button>
                    <button class="task__edit">${editSvg}</button>
                    <button class="task__del">${delSvg}</button>
                </div>
            </div>
            `
        document.querySelector('.output').insertAdjacentHTML('beforeend', item)
    });

    if (sortableInstance) {
        sortableInstance.destroy();
    }

    sortableInstance = new Sortable(document.getElementById("output"), {
        animation: 150,
        delay: 500,
        onStart: function(event) {
            event.item.classList.add("sortable-dragged");
        },
        onEnd: function(event) {
            event.item.classList.remove("sortable-dragged");
            savePositionTask();
        }
    });
}

function savePositionTask() {
    const arrayTasksLS = getTasksLocalStorage();
    const tasks = [...document.querySelectorAll('.task')];

    tasks.forEach((item, i) => {
        const id = Number(item.dataset.taskId);
        const index = arrayTasksLS.findIndex(value => value.id === id);
        if(index !== -1) {
            arrayTasksLS[index].position = i;
        } 
    });

    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()
}