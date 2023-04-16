const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const date = $('.date')
const prev = $('.prev')
const next = $('.next')
const daysContainer = $('.days')
const gotoBtn = $('.goto-btn')
const todayBtn = $('.today-btn')
const dateInput = $('.date-input')
const taskDay = $('.todo_header-day')
const taskDate = $('.todo_header-date')
const addTaskBtn = $('.todo_footer i')
const addTask = $('.add_task-wrap')
const addTaskCloseBtn = $('.add_task-close')
const notiTask = $('.todo_body-notask')
const todoBody = $('.todo_body')

let today = new Date()
let activeDay;
let month = today.getMonth()
let year = today.getFullYear()

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June', 
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
let events = []
getEvents()

const days = ['Mon', 'Tue', 'Wed', 'Thu','Fri', 'Sat', 'Sun']

// add current month, year & days in days------------------------------------------------
function initCalendar(){
    date.innerHTML = `${months[month]} ${year}`

    const day = (new Date(year, month, 1)).getDay()             // Thứ của ngày 1
    const prevDate = (new Date(year, month, 0)).getDate()       // ngày cuối tháng trước
    const lastDate = (new Date(year, month +1, 0)).getDate()    // ngày cuối tháng này
    const nextDays = 7-(new Date(year, month +1, 0)).getDay()-1 // số ngày của tháng mới trong tuần hiện tại

    let days = ""
    // add days of prev month
    for ( let x = day; x >0; x--){
        days+=`<div class="day prev-day">${prevDate - x +1}</div>`
    }
    // add date of current month
    for ( let y = 1; y<= lastDate; y++){
        let event = false
        events.forEach((eventObj)=>{
            if(
                eventObj.date === y &&
                eventObj.month === month +1 &&
                eventObj.year === year){
                    event = true
                }
        })
        // if day is today, add class today
        if (y === new Date().getDate() && 
            year === new Date().getFullYear() &&
            month === new Date().getMonth()){
                activeDay=y
                getActiveDay(y)
                updateEvents(y)
                //if event found
                if(event){
                    days += `<div class="day today event active">${y}</div>`
                } else {days += `<div class="day today active">${y}</div>`}
            } else 
             if (event){
                { days += `<div class="day event">${y}</div>`}
            }else { days += `<div class="day">${y}</div>`}
    }
    // add days of next month
    for (let z = 1; z<= nextDays; z++){
        days += `<div class="day next-day">${z}</div>`
    }
    // render 
    daysContainer.innerHTML = days
    // add event function 
    addEvent()
}
initCalendar()
// add enventlistener on prev & next month 
function prevMonth() {
    month--
    if (month < 0){
        month = 11
        year --
    }
    initCalendar()
}
function nextMonth() {
    month++
    if (month > 11){
        month = 0
        year ++
    }
    initCalendar()
}
prev.addEventListener('click', prevMonth)
next.addEventListener('click', nextMonth)
// set & get date value 
dateInput.addEventListener('input', (e) =>{
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "")   // regex
    //add slash
    if (dateInput.value.length === 2){
        dateInput.value += "/"
    }
    // maximum 7 number
    if (dateInput.value.length >7){
        dateInput.value = dateInput.value.slice(0,7)
    }
    // delete slash when press backspace                                // console.log(e.inputType) to watch inputType of key
    if (e.inputType === 'deleteContentBackward'){
        if( dateInput.value.length===3){
            dateInput.value = dateInput.value.slice(0,2)
        }
    }
    // if user just press 1 number of month
    if (dateInput.value.length === 3 && dateInput.value[1]==='/'){
        dateInput.value = '0' + dateInput.value.slice(0,2)
    }
}) 

// add event for goto-btn
gotoBtn.addEventListener('click', gotoDate)
function gotoDate(date){
    let dateArr = dateInput.value.split('/')
    // get month and year (validation)
    if (dateArr[0] >0 && dateArr[0] < 13 && dateArr[1].length === 4){
        month = dateArr[0] -1
        year = dateArr[1]
        initCalendar()
        dateInput.value =''
        return
    }
    alert('Invalid date')
}
// today
todayBtn.addEventListener('click',()=> {
    today = new Date()
    month = today.getMonth()
    year = today.getFullYear()
    initCalendar()
})
// addTaskBtn 
addTaskBtn.addEventListener('click',(e)=>{
    addTask.classList.toggle('active')
})
addTaskCloseBtn.addEventListener('click',(e)=>{
    addTask.classList.remove('active')
})

// add event function 
function addEvent(){
    const days = $$('.day')

    days.forEach((day)=>{
        day.addEventListener('click', (e)=>{
            // set current day as active day 
            activeDay = Number(e.target.innerHTML)
            getActiveDay(activeDay)
            updateEvents(activeDay)

            // remove active from already active day
            days.forEach((day)=>{
                day.classList.remove('active')
            })
            
            // if click on prev month, goto prev month and add active
            if (e.target.classList.contains('prev-day')){
                prevMonth()
                const days = $$('.day')
                days.forEach((day)=>{
                    if (day.innerHTML === e.target.innerHTML && !day.classList.contains('prev-day')){
                        day.classList.add('active')
                    }   
                })
            } else {day.classList.add('active')}
            // same with next month
            if (e.target.classList.contains('next-day')){
                nextMonth()
                const days = $$('.day')
                days.forEach((day)=>{
                    if (day.innerHTML === e.target.innerHTML && !day.classList.contains('next-day')){
                        day.classList.add('active')
                    }   
                })
            } else {day.classList.add('active')}
        })
    })
}
// add event date on task

function getActiveDay(date){
    let today = new Date(year, month, date)
    
    taskDay.innerHTML = today.toString().split(' ')[0]
    taskDate.innerHTML = date+' '+ months[month]+' ' + year
}
// show events of that day

function updateEvents(date){
    let html =''
    events.forEach(event => {
        if (event.date === date&& event.month === month +1 && event.year === year){
            event.tasks.forEach((task,index)=>{
                
                 html +=`<div class="todo_task" >
                    <i class="fa-sharp fa-regular fa-circle-dot"></i>
                    <div class="todo_task-info">
                    <h1 class="todo_task-name">${task.name}</h1>
                    <p class="todo_task_desc">${task.desc}</p>
                    </div>
                    <i class="fa-solid fa-check delete" data-index =${index}></i>
                    </div>`
                
            })
        }
    })
    if(html ===''){
        html = `<div class="todo_body-notask"> 
                <span>Have 0 task today.<br>Add now! </span>              
                </div>`
    }
    todoBody.innerHTML = html
    // save events 
    saveEvent()
}
// add new tasks from form 
const addTaskSubmit = $('.add_task-btn')
const taskName = $('.add_task-name')
const taskDesc = $('.add_task-desc')
addTaskSubmit.addEventListener('click', (event) => {
    let newTask = {
        name : taskName.value,
        desc : taskDesc.value
    }
    if (newTask.name.length >0 && newTask.desc.length >0){
        let taskAdd = false
        if(events.length>0){
            events.forEach((event) => {
                //if already exists task on activeDay
                if (event.date === activeDay &&
                    event.month === month +1&&
                    event.year === year){
                        event.tasks.push(newTask)
                        taskAdd = true    
                    }
            })
        }
        // if events is empty of current day have 0 task
        if (!taskAdd){
            events.push({
                date: activeDay,
                month: month +1,
                year: year,
                tasks: [newTask]
            })
            console.log(123)
        }
        addTask.classList.remove('active')
        taskName.value = ''
        taskDesc.value = ''
    
        updateEvents(activeDay)
        // add event class to day
        const activeElem = $('.day.active')
        if (!activeElem.classList.contains('event')){
            activeElem.classList.add('event')
        }
    }
})

// function remove task
todoBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')){
        const name = e.target.parentElement.children[1].children[0].innerHTML
        events.forEach((event,index) => {
            if(event.date=== activeDay &&
               event.month=== month +1 &&
               event.year=== year){
                event.tasks.forEach((task,index)=>{
                    if(task.name===name){
                        event.tasks.splice(index,1)
                    }
                })
               }
            //if no task exists remove event on active day
            if(event.tasks.length===0){
                events.splice(index, 1)
                // then remove event on active day
                const activeElem = $('.day.active')
                if (activeElem.classList.contains('event')){
                    activeElem.classList.remove('event')
                }
            }
        })
    }
    updateEvents(activeDay)
})
// store event in local storage get from there
function saveEvent(){
    localStorage.setItem('events', JSON.stringify(events))
}
function getEvents(){
    if(localStorage.getItem('events'=== null)){
        return 
    }
    events.push(...JSON.parse(localStorage.getItem('events')))
}