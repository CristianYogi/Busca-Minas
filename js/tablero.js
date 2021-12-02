const tablero = document.getElementById('tablero')


let dificultad = {
    facil:{
        tamaño : 10,
        cantidadMinas :  15
    },
    normal:{
        tamaño : 15,
        cantidadMinas :  40
    },
    dificil:{
        tamaño : 20,
        cantidadMinas :  60
    }
}

let tamaño = dificultad.facil.tamaño
let cont = 0


let matrizTablero = []
let fila = []
for (let i = 0; i < tamaño; i++) {
    fila.push(0)
}
for (let j = 0; j < tamaño; j++) {
    matrizTablero.push(fila.slice())
}


tablero.style.gridTemplateColumns = `repeat(${tamaño}, 40px)`

for (let i = 0; i < tamaño; i++) {
    for (let j = 0; j < tamaño; j++) {
        let cuadrado = document.createElement('div')
        cuadrado.className = 'cuadrado'
        cuadrado.id = cont
        tablero.appendChild(cuadrado)
        cont += 1
        
    }
    
}