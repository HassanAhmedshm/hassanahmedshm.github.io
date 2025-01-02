const rock = document.getElementById('rock')
const paper = document.getElementById('paper')
const scissors = document.getElementById('scissors')
const result = document.getElementById('result')
const winner = document.getElementById('winner')

let draw =  0
let win = 0
let lose = 0

rock.addEventListener('click',()=>{
    let i = Math.floor(Math.random() * 3)
    if (i == 0) {
        draw += 1
        winner.innerText = `draw`
        winner.style = `padding: 2%; background-color: rgb(199, 199, 0);`
    } else if (i == 1) { 
        lose += 1
        winner.innerText = `PC paper won against USER rock`
        winner.style = `padding: 2%; background-color: red;`
    }else {
        win += 1
        winner.innerText = `USER rock won against PC scissors`
        winner.style = `padding: 2%; background-color: green;`
    }
    result.innerHTML = (`win ${win} , draw ${draw} , lose ${lose}`)

})

paper.addEventListener('click',()=>{
    let i= Math.floor(Math.random() * 3)
    if (i == 1) {
        draw += 1
        winner.innerText = `draw`
        winner.style = `padding: 2%; background-color: rgb(199, 199, 0);`
    } else if (i == 0) { 
        lose += 1
        winner.innerText = `PC scissors won against USER paper`
        winner.style = `padding: 2%; background-color: red;`
    }else {
        win += 1
        winner.innerText = `USER paper won against PC rock`
        winner.style = `padding: 2%; background-color: green;`
    }
    result.innerHTML = (`win ${win} , draw ${draw} , lose ${lose}`)

})

scissors.addEventListener('click',()=>{
    let i= Math.floor(Math.random() * 3)
    if (i == 2) {
        draw += 1
        winner.innerText = `draw`
        winner.style = `padding: 2%; background-color: rgb(199, 199, 0);`
    } else if (i == 0) { 
        lose += 1
        winner.innerText = `PC rock won against USER scissors`
        winner.style = `padding: 2%; background-color: red;`
    }else {
        win += 1
        winner.innerText = `USER scissors won against PC paper`
        winner.style = `padding: 2%; background-color: green;`
    }
    result.innerHTML = (`win ${win} , draw ${draw} , lose ${lose}`)

})