"use strict"
//==========================================

import { 
    getTasksLocalStorage,
    setTasksLocalStorage,
    generateUniqueId,
    initSortableList,
    updateListTasks
} from "./utils.js";

const form = document.querySelector('.form');
const textareaForm = document.querySelector('.form__textarea');
const buttonSendForm = document.querySelector('.form__send-btn');
const buttonCancel = document.querySelector('.form__cancel-btn');
const output = document.querySelector('.output');
let editId = null;
let isEditTask = false;

// Отображение задач, при первой загрузке страницы.
updateListTasks();

// All eventListener
form.addEventListener('submit', sendTask);
buttonCancel.addEventListener('click', resetSendForm);
output.addEventListener("dragover", initSortableList);
output.addEventListener("dragenter", event => event.preventDefault());

output.addEventListener('click', event => {
    const taskElement = event.target.closest('.task__btns');
    if (!taskElement) return;

    if (event.target.closest('.task__pinned')) {
        pinnedTask(event);
    } else if (event.target.closest('.task__edit')) {
        editTask(event);
    } else if (event.target.closest('.task__del')) {
        delTask(event);
    } else if (event.target.closest('.task__done')) {
        doneTask(event);
    }
});


// All functions
function sendTask(event) {
    event.preventDefault();

    const task = textareaForm.value.trim().replace(/\s+/g, ' ');
    if (!task) {
        return alert('Поле не должно быть пустым!');
    }

    if(isEditTask) {
        saveEditedTask(task);
        return;
    }

    const arrayTasksLS = getTasksLocalStorage();
    arrayTasksLS.push({
        id: generateUniqueId(),
        task,
        done: false,
        pinned: false,
        position: 1000,
    })
    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()

    form.reset()
}

function doneTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const index = arrayTasksLS.findIndex(task => task.id === id);
    
    if (index === -1) {
        return alert('Такая задача не найдена!');
    }
    
    if (!arrayTasksLS[index].done && arrayTasksLS[index].pinned) {
        arrayTasksLS[index].pinned = false;
    }

    if (arrayTasksLS[index].done) {
        arrayTasksLS[index].done = false;
    } else {
        arrayTasksLS[index].done = true;
    }

    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()
}

function pinnedTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const index = arrayTasksLS.findIndex(task => task.id === id);

    if (index === -1) {
        return alert('Такая задача не найдена!');
    }

    if(!arrayTasksLS[index].pinned && arrayTasksLS[index].done) {
        return alert('Чтобы закрепить задачу, сначало уберите отметку о выполнении!');
    }
    
    if (arrayTasksLS[index].pinned) {
        arrayTasksLS[index].pinned = false;
    } else {
        arrayTasksLS[index].pinned = true;
    }

    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()
}

function delTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const newTasksArr = arrayTasksLS.filter(task => task.id !== id)
    setTasksLocalStorage(newTasksArr)
    updateListTasks()
}

function editTask(event) {
    const task = event.target.closest('.task');
    const text = task.querySelector('.task__text');
    editId = Number(task.dataset.taskId);

    textareaForm.value = text.textContent;
    isEditTask = true;
    buttonSendForm.textContent = 'Сохранить';
    buttonCancel.classList.remove('none');
    form.scrollIntoView({ behavior: 'smooth' });
}

function saveEditedTask(task) {
    const arrayTasksLS = getTasksLocalStorage();
    const editedTaskIndex = arrayTasksLS.findIndex(task => task.id === editId);

    if (editedTaskIndex !== -1) {
        arrayTasksLS[editedTaskIndex].task = task;
        setTasksLocalStorage(arrayTasksLS);
        updateListTasks();
    } else {
        alert('Такая задача не найдена!');
    }

    resetSendForm();
}

function resetSendForm() {
    editId = null;
    isEditTask = false;
    buttonCancel.classList.add('none');
    buttonSendForm.textContent = 'Отправить';
    form.reset();
}



