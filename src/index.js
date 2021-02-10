// write your code here
// getSingleSpice().then(addSpiceToDom)
getAllSpices().then(renderAllImages)

const detailImage = document.querySelector('.detail-image')
const spiceHeader = document.querySelector('.title')
const ingredientsList = document.querySelector('.ingredients-list')
const updateForm = document.querySelector('#update-form')
const ingredientsForm = document.querySelector('#ingredient-form')
const spiceImage = document.querySelector('#spice-images')


updateForm.addEventListener('submit', collectUpdateInfo)
ingredientsForm.addEventListener('submit', collectIngredientsInfo)
spiceImage.addEventListener('click', handleImgClick)

function handleImgClick(e) {
  if(e.target.className === 'top-image'){
    const id = e.target.dataset.id 
    getSingleSpice(id).then(addSpiceToDom)
  }
}

function getAllSpices(){
  return fetch(`http://localhost:3000/spiceblends`)
  .then(res => res.json())
}

function getSingleSpice(id){
  return fetch(`http://localhost:3000/spiceblends/${id}`)
  .then(res => res.json())
}

function updateSpice(spiceObj, id){
  return fetch(`http://localhost:3000/spiceblends/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(spiceObj)
  })
  .then(res => res.json())
  // .then(addTitleToDom)
}

function createIngredient(ingredientObj){
  fetch(`http://localhost:3000/ingredients`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(ingredientObj)
  })
}


function renderAllImages(spiceArray){
  spiceArray.forEach(spice => {
    spiceImage.innerHTML += `
      <img data-id=${spice.id} class='top-image' src=${spice.image} alt=${spice.title}/>
    `
  })

  const firstSpiceId = spiceArray[0].id
  getSingleSpice(firstSpiceId).then(addSpiceToDom)
}




function addSpiceToDom(spice){
  detailImage.src = spice.image
  detailImage.alt = spice.title
  // spiceHeader.textContent = spice.title
  addTitleToDom(spice)

  updateForm.dataset.id = spice.id
  ingredientsForm.dataset.id = spice.id

  addIngredientToList(spice.ingredients)
}

function addTitleToDom(spice){
  spiceHeader.textContent = spice.title
}

function addIngredientToList(ingredients){  
  ingredientsList.innerHTML = ""

  ingredients.forEach(ingredient => {
    const li = document.createElement('li')
    li.textContent = ingredient.name
    ingredientsList.append(li)
  })
}


function collectUpdateInfo(e){
  e.preventDefault()
  
  const title = e.target.title.value
  const id = e.target.dataset.id
  
  const spiceObj = {title}
  
  updateSpice(spiceObj, id).then(addTitleToDom)
  
  e.target.reset()
}

function collectIngredientsInfo(e){
  e.preventDefault()
  
  const name = e.target.name.value 
  const spiceblendId = parseInt(e.target.dataset.id)
  
  const ingredientObj = {name, spiceblendId}
  
  addIngredientToList([ingredientObj])
  createIngredient(ingredientObj)
}