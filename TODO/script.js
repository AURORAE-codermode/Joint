// Simple Todo app logic
const STORAGE_KEY = 'mytasks.todos.v1'

let todos = []
let filter = 'all'

const newTaskInput = document.getElementById('newTask')
const addBtn = document.getElementById('addBtn')
const taskList = document.getElementById('taskList')
const tabs = document.querySelectorAll('.tab')
const itemsLeft = document.getElementById('itemsLeft')
const clearCompleted = document.getElementById('clearCompleted')

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    todos = raw ? JSON.parse(raw) : []
  } catch (e) {
    todos = []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function render() {
  // clear
  taskList.innerHTML = ''

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  if (filtered.length === 0) {
    taskList.classList.add('empty')
    const li = document.createElement('li')
    li.className = 'empty-state'
    li.innerHTML = '<div class="empty-icon">📋</div><div class="empty-text">No tasks here yet</div>'
    taskList.appendChild(li)
  } else {
    taskList.classList.remove('empty')
    filtered.forEach(task => {
      const li = document.createElement('li')
      li.className = 'task-item'
      if (task.done) li.classList.add('done')

      const checkbox = document.createElement('button')
      checkbox.className = 'check'
      checkbox.setAttribute('aria-pressed', task.done)
      checkbox.innerHTML = task.done ? '✔' : ''
      checkbox.addEventListener('click', () => toggle(task.id))

      const label = document.createElement('div')
      label.className = 'label'
      label.textContent = task.text

      li.appendChild(checkbox)
      li.appendChild(label)

      taskList.appendChild(li)
    })
  }

  const left = todos.filter(t => !t.done).length
  itemsLeft.textContent = left + (left === 1 ? ' item left' : ' items left')
}

function addTask(text) {
  const t = { id: Date.now() + Math.random(), text: text.trim(), done: false }
  if (!t.text) return
  todos.unshift(t)
  save()
  render()
}

function toggle(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
  save()
  render()
}

function setFilter(f) {
  filter = f
  tabs.forEach(tb => tb.classList.toggle('active', tb.dataset.filter === f))
  render()
}

function clearDone() {
  todos = todos.filter(t => !t.done)
  save()
  render()
}

// events
function flashAddButton() {
  addBtn.classList.add('highlight')
  // remove after animation duration
  setTimeout(() => addBtn.classList.remove('highlight'), 300)
}

function handleAdd() {
  const text = newTaskInput.value
  addTask(text)
  newTaskInput.value = ''
  newTaskInput.focus()
  flashAddButton()
}

addBtn.addEventListener('click', () => handleAdd())

newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleAdd()
  }
})

tabs.forEach(tb => tb.addEventListener('click', () => setFilter(tb.dataset.filter)))
clearCompleted.addEventListener('click', clearDone)

// init
load()
// set brand date to today's date
function setTodayDate() {
  let el = document.querySelector('.brand__date')
  if (!el) return
  const now = new Date()
  const opts = { weekday: 'long', month: 'short', day: 'numeric' }
  const locale = navigator.language || 'en-US'
  const text = now.toLocaleDateString(locale, opts)

  // set text
  el.textContent = text

  // if it's a <time>, set datetime attribute for semantics
  if (el.tagName && el.tagName.toLowerCase() === 'time') {
    el.setAttribute('datetime', now.toISOString().slice(0, 10))
  }
}

setTodayDate()
render()

// Expose for debug in console
window.__todos = todos
