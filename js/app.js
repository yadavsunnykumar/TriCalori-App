class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit()
    this._totalCalories = Storage.getTotalCalories(0)
    this._meals = Storage.getMeals()
    this._workout = Storage.getWorkouts()

    this._displayCalorieLimit()
    this._displayConsumedCalorie()
    this._displayBurntCalorie()
    this._displayCalorieRemaining()
    this._displayCalorieProgress()

    this._displayCalorieTotal()

    document.getElementById('limit').value = this._calorieLimit
    // this._render()
  }

  addMeal(meal) {
    this._meals.push(meal)
    this._totalCalories += meal.calories
    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveMeal(meal)
    this._displayNewMeal(meal)
    this._render()
    // this._displayCalorieTotal()
  }

  addWorkout(workout) {
    this._workout.push(workout)
    this._totalCalories -= workout.calories
    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveWorkout(workout)
    this._displayNewWorkout(workout)
    this._render()
    // this._displayCalorieTotal()
  }

  removeMeal(id) {
    const index = this._meals.findIndex((m) => m.id === id)
    if (index !== -1) {
      const meal = this._meals[index]
      this._totalCalories -= meal.calories
      Storage.updateTotalCalories(this._totalCalories)
      this._meals.splice(index, 1)
      Storage.removeMeal(id)
      this._render()
    }
  }
  removeWorkout(id) {
    const index = this._workout.findIndex((w) => w.id === id)
    if (index !== -1) {
      const workout = this._workout[index]
      this._totalCalories += workout.calories
      Storage.updateTotalCalories(this._totalCalories)
      this._workout.splice(index, 1)
      Storage.removeWorkout(id)
      this._render()
    }
  }
  reset() {
    this._totalCalories = 0
    this._meals = []
    this._workout = []
    Storage.clearAll()
    this._render()
  }
  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit
    Storage.setCalorieLimit(calorieLimit)
    this._displayCalorieLimit()
    this._render()
  }

  loadItems() {
    this._meals.forEach((meal) => {
      this._displayNewMeal(meal)
    })
    this._workout.forEach((workout) => {
      this._displayNewWorkout(workout)
    })
  }

  _displayCalorieTotal() {
    const totalCalorieEl = document.getElementById('calories-total')
    totalCalorieEl.innerHTML = this._totalCalories
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById('calories-limit')
    calorieLimitEl.innerHTML = this._calorieLimit
  }

  _displayConsumedCalorie() {
    const consumedCalorieEl = document.getElementById('calories-consumed')
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    )
    consumedCalorieEl.innerHTML = consumed
  }

  _displayBurntCalorie() {
    const burntCalorieEl = document.getElementById('calories-burned')
    const consumed = this._workout.reduce(
      (total, workout) => total + workout.calories,
      0
    )
    burntCalorieEl.innerHTML = consumed
  }

  _displayCalorieRemaining() {
    const remainingCalorieEl = document.getElementById('calories-remaining')
    const progressEle = document.getElementById('calorie-progress')
    const remaining = this._calorieLimit - this._totalCalories
    remainingCalorieEl.innerHTML = remaining

    if (remaining <= 0) {
      remainingCalorieEl.parentElement.parentElement.classList.remove(
        'bg-light'
      )
      remainingCalorieEl.parentElement.parentElement.classList.add('bg-danger')
      progressEle.classList.remove('bg-success')
      progressEle.classList.add('bg-danger')
    } else {
      remainingCalorieEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      )
      remainingCalorieEl.parentElement.parentElement.classList.add('bg-light')
      progressEle.classList.remove('bg-danger')
      progressEle.classList.add('bg-success')
    }
  }

  _displayCalorieProgress() {
    const progressEle = document.getElementById('calorie-progress')
    const percentage = (this._totalCalories / this._calorieLimit) * 100
    const width = Math.min(percentage, 100)
    progressEle.style.width = `${width}%`
  }

  _displayNewMeal(meal) {
    const mealsL = document.getElementById('meal-items')
    const mealL = document.createElement('div')
    mealL.classList.add('card', 'my-2')
    mealL.setAttribute('data-id', meal.id)
    mealL.innerHTML = `<div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${meal.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`
    mealsL.appendChild(mealL)
  }
  _displayNewWorkout(workout) {
    const workoutsL = document.getElementById('workout-items')
    const workoutL = document.createElement('div')
    workoutL.classList.add('card', 'my-2')
    workoutL.setAttribute('data-id', workout.id)
    workoutL.innerHTML = `<div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`
    workoutsL.appendChild(workoutL)
  }

  _render() {
    this._displayCalorieTotal()
    this._displayConsumedCalorie()
    this._displayBurntCalorie()
    this._displayCalorieRemaining()
    this._displayCalorieProgress()
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.calories = calories
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.calories = calories
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit')
    }
    return calorieLimit
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit)
  }
  static getTotalCalories(defaultCalories = 0) {
    let totalCalories
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories
    } else {
      totalCalories = +localStorage.getItem('totalCalories')
    }
    return totalCalories
  }
  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories)
  }

  static getMeals() {
    let meals
    if (localStorage.getItem('meals') === null) {
      meals = []
    } else {
      meals = JSON.parse(localStorage.getItem('meals'))
    }
    return meals
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals()
    meals.push(meal)
    localStorage.setItem('meals', JSON.stringify(meals))
  }
  static removeMeal(id) {
    const meals = Storage.getMeals()
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1)
      }
    })
    localStorage.setItem('meals', JSON.stringify(meals))
  }
  static removeWorkout(id) {
    const workouts = Storage.getWorkouts()
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1)
      }
    })
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }

  static getWorkouts() {
    let workouts
    if (localStorage.getItem('workouts') === null) {
      workouts = []
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'))
    }
    return workouts
  }
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts()
    workouts.push(workout)
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }
  static clearAll() {
    localStorage.removeItem('totalCalories')
    localStorage.removeItem('meals')
    localStorage.removeItem('workouts')
  }

  //if you want to clear all
  // static clearAll() {
  //   localStorage.clear()
  // }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker()
    this._loadEventListeners()
    this._tracker.loadItems()
  }
  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this.newItem.bind(this, 'meal'))
    document
      .getElementById('workout-form')
      .addEventListener('submit', this.newItem.bind(this, 'workout'))
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'))
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'))
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'))
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'))
    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this))
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this))
  }

  newItem(type, e) {
    e.preventDefault()
    const name = document.getElementById(`${type}-name`)
    const calories = document.getElementById(`${type}-calories`)

    // Validate Inputs

    if (name.value === '' || calories.value === '') {
      alert('Please fill all fields')
      return
    }
    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value)
      this._tracker.addMeal(meal)
    } else {
      const workout = new Workout(name.value, +calories.value)
      this._tracker.addWorkout(workout)
    }
    name.value = ''
    calories.value = ''
    const collapseItem = document.getElementById(`collapse-${type}`)
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    })
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id')
        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id)

        e.target.closest('.card').remove()
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }
  _reset() {
    this._tracker.reset()
    document.getElementById('meal-items').innerHTML = ''
    document.getElementById('workout-items').innerHTML = ''
    document.getElementById('filter-meals').value = ''
    document.getElementById('filter-workouts').value = ''
  }
  _setLimit(e) {
    e.preventDefault()
    let limit = parseInt(document.getElementById('limit').value)
    if (limit === '') {
      alert('Please Add a Limit')
      return
    }
    this._tracker.setLimit(limit)
    limit = ''

    const modalEl = document.getElementById('limit-modal')
    const modal = bootstrap.Modal.getInstance(modalEl)
    modal.hide()
  }
}
const app = new App()
