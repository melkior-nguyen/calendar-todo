

// add event on add task icon 
const addTaskIcon = $('.todo_footer i')
const addTask = $('.add_task-wrap')
const closeBtn = $('.add_task-close')
const notiTask = $('.todo_body-notask')
// notification task 
addTaskIcon.addEventListener('click',()=> {
    addTask.classList.toggle('active') 
    notiTask.classList.toggle('hide')
})
// close add task when click on close icon 
closeBtn.addEventListener('click',(e)=> {
    e.stopPropagation()
    addTask.classList.remove('active')
    notiTask.classList.toggle('hide')
})
// add task handler 
const addName = $('.add_task-name')
const addDesc = $('.add_task-desc')
const addTaskBtn = $('.add_task-btn')
const todoBody = $('.todo_body')
const todoTask = $('.todo_task')
const delBtn = $('.delete')
renderTask()
//add
addTaskBtn.addEventListener('click', addtask )
function addtask(){
    let tasks =localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : []
    let task = {
        name: addName.value,
        desc: addDesc.value
    }
    tasks.push(task)
    localStorage.setItem('todo', JSON.stringify(tasks))  

    renderTask()
}
//del
todoBody.addEventListener('click', delTask)
function delTask(e){
    const delBtn = e.target.closest('.delete')
    if (delBtn){
        if(confirm('Delete current task?')){
            delIndex = delBtn.dataset.index
            let tasks =localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : []
            tasks.splice(delIndex,1)
            localStorage.setItem('todo', JSON.stringify(tasks))
            renderTask()
        }
    }
}
//edit
todoBody.addEventListener('click',editTask)
const updateTask = $('.update_task-wrap')
const closeUpdateBtn = $('.update_task-close')
const updateBtn = $('.update_task-btn')

function editTask(e){
    const editBtn = e.target.closest('.todo_task-info')
    if (editBtn){
        addTask.classList.remove('active')
        updateTask.classList.add('active')
        let updateName = $('.update_task-name')
        let updateDesc = $('.update_task-desc')

        const tasks = localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : []
        let index = (editBtn.parentElement).querySelector('.delete').dataset.index
        let task = tasks[index]
        updateName.value = task.name
        updateDesc.value = task.desc

        updateBtn.addEventListener('click',(e)=>{
            task.name = updateName.value
            task.desc = updateDesc.value
            localStorage.setItem('todo', JSON.stringify(tasks))
            renderTask()
            updateTask.classList.remove('active')
        })  

    }
}
// close update task when click on close icon 
closeUpdateBtn.addEventListener('click',(e)=> {
    e.stopPropagation()
    updateTask.classList.remove('active')
})

//redertask
function renderTask(){
    let tasks =localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : []
    let html = tasks.map((task, index )=>{
        return `<div class="todo_task" >
                    <i class="fa-sharp fa-regular fa-circle-dot"></i>
                    <div class="todo_task-info">
                        <h1 class="todo_task-name">${task.name}</h1>
                        <p class="todo_task_desc">${task.desc}</p>
                    </div>
                    <i class="fa-solid fa-xmark delete" data-index =${index}></i>
                    <i class="fa-solid fa-check check" data-index =${index}></i>
            </div>`
    })
    html.push(`<div class="add_task-wrap active">
            <div class="add_task">
                <div class="add_task-header">
                    <h1>Add task</h1>
                    <i class="fa-solid fa-x add_task-close"></i>
                </div>
                <input type="text" placeholder="Task Name" class="add_task-name">
                <textarea name="" id="" cols="10" rows="1" class="add_task-desc" placeholder="Task Description"></textarea>
                <button class="add_task-btn">Add task</button>
            </div>
        </div>`)

        todoBody.innerHTML=html.join("")    
                    addName.value = ''
                    addDesc.value = ''
}

//checked handle
todoBody.addEventListener('click', (e)=>{
    const checkIcon = e.target.closest('.check')
    let index = checkIcon.dataset.index
    console.log(index)
    
    if (checkIcon){
        checkIcon.classList.toggle('checked')
        console.log(todoBody.chidren)
    }
})