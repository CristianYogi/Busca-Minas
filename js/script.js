const botonOpciones = document.getElementById('boton-opciones')
const menuOpciones = document.getElementById('menu-opciones')
const cuadrados = document.getElementsByClassName('cuadrado')
const botonDificultad = document.getElementsByClassName('boton-dificultad')
const dificultadMensaje = document.getElementById('dificultad-mensaje')
const cantidadMinasMensaje = document.getElementById('cantidad-minas')
const botonReiniciar = document.getElementById('boton-reiniciar')
const cartelFinal = document.getElementById('cartel-final')
const botonCerrar = document.getElementById('cerrar')


cantidadMinasMensaje.innerText = dificultad.facil.cantidadMinas
const mina = "*"

let listaBanderas = []

let direcciones = [[-1, 0], [0, 1], [1, 0], [0, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]]
let direccionSinDiagonal = [[-1, 0], [0, 1], [1, 0], [0, -1]]

let coloresNumeros = {
    0 : "black",
    1 : "#02c39a",
    2 : "#f8961e",
    3 : "#f3722c",
    4 : "#003049",
    5 : "#ff002b",
    6 : "#001524",
    7 : "#202020",
    8 : "#000814"
}


let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let interval = setInterval(setTime, 1000);

let tamañoMinas = 1
let cantidadMinas = dificultad.facil.cantidadMinas
let islasMinas = []

let primerIsla = []
let primerClick = true
let primerIslaTamaño = 10

let islasVacias = []

let dificultadSeleccionada = 'facil'

let termino = false


//------------------------------EVENTOS------------------------------

let botonCartelFinal = cartelFinal.lastElementChild

botonCerrar.addEventListener('click', () => {
    cartelFinal.style.display='none'
})



botonCartelFinal.addEventListener('click', (evento) =>{
    reahacerTablero()
    reiniciar()
    cartelFinal.style.display='none'
})

botonReiniciar.addEventListener('click', (evento) => {
    reahacerTablero()
    reiniciar()
})

for (let i = 0; i < cuadrados.length; i++) {
    cuadrados[i].addEventListener('click', clickIzquierdo, false)
    cuadrados[i].addEventListener('contextmenu', clickDerecho, false);
    
}

botonOpciones.addEventListener('click',(elemento) => {
    if (menuOpciones.style.display == 'flex'){
        menuOpciones.style.display = 'none'   
        botonOpciones.style.backgroundColor = '' 
    }else{
        menuOpciones.style.display = 'flex'
        botonOpciones.style.backgroundColor = '#dcdfe5'
    }

})

for (let i = 0; i < botonDificultad.length; i++) {
    botonDificultad[i].addEventListener('click', eventoDificultad, false)
}

//------------------------------FUNCIONES UTILIDAD------------------------------

function obtenerIndices(id){
    let i =  Math.floor(id / matrizTablero.length)
    let j = id - (i * tamaño)

    return [i,j]
}

function obtenerId(posicion){
    let id = (posicion[0] * matrizTablero.length) + posicion[1]
    return id
}

function sumarIndices(indice1, indice2){
    let resultado = []
    resultado = [indice1[0] + indice2[0], indice1[1] + indice2[1]]

    return resultado
}

function indicesToString(indices){
    return "" + indices[0].toString() + "," + indices[1].toString()
}

function stringToindices(indice){
    let aux = ""
    let indices = []
    for (let i = 0; i < indice.length; i++) {
            if(indice[i] == ',' ){
                indices.push(parseInt(aux))
                aux = ""
                continue
            }
            aux += indice[i]
            
    }
    indices.push(parseInt(aux))
    return indices
}

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function auxColorear(isla, color){
    
    for (let i = 0; i < isla.length; i++) {
           let id = obtenerId(stringToindices(isla[i]))
           let cuadrado = document.getElementById(id)
           cuadrado.style.backgroundColor= color
    }
}

function eliminarElementoLista(array, id){
    
    const index = array.indexOf(id);
    
    if (index > -1) {
    array.splice(index, 1);
    }

    return array
}

//---------------------------------FUNCIONES-------------------------------------

function eventoDificultad(elemento){
    dificultadSeleccionada = elemento.target.id
    
    menuOpciones.style.display='none'
    botonOpciones.style.backgroundColor = '' 

    dificultadMensaje.innerText = elemento.target.id
    reiniciar()
    reahacerTablero()
}

function modificarContadorMinas(sumar){
    if(sumar){
        cantidadMinasMensaje.innerText = parseInt(cantidadMinasMensaje.innerText) + 1
    }else{
        cantidadMinasMensaje.innerText = parseInt(cantidadMinasMensaje.innerText) - 1
    }
}


function clickDerecho(elemento){
    elemento.preventDefault();
    
    if(termino){
        return 0
    }

    
    let cuadrado = elemento.target
    
    if(cuadrado.innerText){
        return 0
    }

    if(cuadrado.style.backgroundImage){
        listaBanderas = eliminarElementoLista(listaBanderas, cuadrado.id)
        cuadrado.style.backgroundImage= ''
        modificarContadorMinas(true)

    }else{

        let minas = parseInt(cantidadMinasMensaje.innerText)
       
        if(minas > 0){
            modificarContadorMinas(false)
            minas -= 1
            listaBanderas.push(cuadrado.id)
            cuadrado.style.backgroundImage = 'url(./img/bandera.svg)'
        }
        
        if(minas == 0){
               
            let gano = comprobarVictoria()
            if(gano){
                termino = true
                cartelFinal.style.display='flex'
                let h1 = cartelFinal.firstElementChild
                h1.innerText = 'GANASTE'
                clearInterval(interval);
            }
        }
    }

}



function clickIzquierdo(elemento){
    
    let cuadrado = elemento.target
    let indices = obtenerIndices(cuadrado.id)

    if(matrizTablero[indices[0]][indices[1]] == mina){
        clearInterval(interval);
        termino = true
        cartelFinal.style.display='flex'
        let h1 = cartelFinal.firstElementChild
        h1.innerText = 'PERDISTE'
        revelarMinas()
    }

    if(termino){
        
        return 0
    }

    if(cuadrado.style.backgroundColor == 'red'){
        cuadrado.style.backgroundColor = ''
        modificarContadorMinas(true)
    }

    if(primerClick){

        primerIsla.push(indicesToString(obtenerIndices(cuadrado.id)))
        primerIsla = crearPrimerIsla(obtenerIndices(cuadrado.id), primerIsla)
        agrandarPrimerIsla()
        primerClick = false
        llenarTableroMinas()
        ponerNumeros()
        crearIslasVacias()

        
    }
    let posicion = obtenerIndices(cuadrado.id)
    let isla = encontrarIslaVacia(indicesToString(posicion))
    
    if(isla){
        revelarIsla(isla)
        
    }else{
        revelarCuadrado(cuadrado)
    }
    
    
}

//PRIMER ISLA


function agrandarPrimerIsla(){
    let bordes = []
    for (let i = 0; i < primerIsla.length; i++) {
        
        for (let j = 0; j < direcciones.length; j++) {
            let posiciones = stringToindices(primerIsla[i])
            let suma = sumarIndices(posiciones, direcciones[j])
            
            if(suma[0] < 0 || suma[0] >= tamaño || suma[1] < 0 || suma[1] >= tamaño){
                continue
            }

            let posicionString = indicesToString(suma)
            if(!primerIsla.includes(posicionString) && !bordes.includes(posicionString)){
                bordes.push(posicionString)
            }
        }
        
    }

    bordes.forEach(elemento => {
        primerIsla.push(elemento)
    });
}

function crearPrimerIsla(posicion, isla){

    let posicionesDisponibles = []
    for (let i = 0; i < direccionSinDiagonal.length; i++) {
        let nuevaPosicion = sumarIndices(posicion, direccionSinDiagonal[i])

        let nuevaPosicionString = indicesToString(nuevaPosicion)
 
        if((nuevaPosicion[0] >= 0 && nuevaPosicion[0] < tamaño) && (nuevaPosicion[1] >= 0 && nuevaPosicion[1] < tamaño) && !isla.includes(nuevaPosicionString)){
    
            posicionesDisponibles.push(nuevaPosicion)
            
        }
    
    }
    
    let numRandom = random(0, posicionesDisponibles.length - 1)

    if(posicionesDisponibles.length <= 0){
        return isla
    }

    isla.push(indicesToString(posicionesDisponibles[numRandom]))

    
    if(isla.length < primerIslaTamaño){
        
        isla = crearPrimerIsla(posicionesDisponibles[numRandom], isla)

    }

    return isla
}

//MINAS


function revelarMinas(){
    islasMinas.forEach(mina => {
        let posicion = stringToindices(mina)
        let id = obtenerId(posicion)
        let cuadrado = document.getElementById(id)
        cuadrado.style.backgroundImage='url(./img/minas.svg)'
    });
}

function posicionRandom(){
    let disponible = false
    let i 
    let j
    while(!disponible){
        i = random(0, tamaño - 1)
        j = random(0, tamaño - 1)
        if(i >= 0 && i < tamaño && j >= 0 && j < tamaño){
            let indices = [] 
            indices = indicesToString([i,j])
            if(!primerIsla.includes(indices) && !islasMinas.includes(indices)){
                disponible = true
            }
        }
    }
    
    return [i,j]
}


function encontrarPosicionesDisponibles(isla){
    let posicionesDisponiblesTablero = []
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            let aux = indicesToString([i, j])
            if(matrizTablero[i][j] == 0 && !isla.includes(aux) && !primerIsla.includes(aux)){
                posicionesDisponiblesTablero.push([i,j])
            }
            
        }
        
    }
    
    let numRandom = random(0, posicionesDisponiblesTablero.length - 1)
    return posicionesDisponiblesTablero[numRandom]

}

function crearIslaMinas(posicion, isla, tamaño_minas){
    
    let posicionesDisponibles = []
    for (let i = 0; i < direcciones.length; i++) {
        let nuevaPosicion = sumarIndices(posicion, direcciones[i])

        let nuevaPosicionString = indicesToString(nuevaPosicion)

        if((nuevaPosicion[0] >= 0 && nuevaPosicion[0] < tamaño) && (nuevaPosicion[1] >= 0 && nuevaPosicion[1] < tamaño) && !isla.includes(nuevaPosicionString) &&!islasMinas.includes(nuevaPosicionString) && !primerIsla.includes(nuevaPosicionString)){
    
            posicionesDisponibles.push(nuevaPosicion)
            
        }
    
    }
    

    
    if(isla.length < tamaño_minas){

        if(posicionesDisponibles.length <= 0){
        
            let posicionNuevaDisponible = encontrarPosicionesDisponibles(isla)
            
            if(!posicionNuevaDisponible){
                
                return isla
            }
            
            matrizTablero[posicionNuevaDisponible[0]][posicionNuevaDisponible[1]] = mina
            isla.push(indicesToString(posicionNuevaDisponible))
            isla = crearIslaMinas(posicionNuevaDisponible, isla, tamaño_minas)
    
            return isla
        }

        let numRandom = random(0, posicionesDisponibles.length - 1)
        matrizTablero[posicionesDisponibles[numRandom][0]][posicionesDisponibles[numRandom][1]] = mina
        isla.push(indicesToString(posicionesDisponibles[numRandom]))
        isla = crearIslaMinas(posicionesDisponibles[numRandom], isla, tamaño_minas)
        
    }
    
    return isla

}




function llenarTableroMinas(){

    let contadorMinas = 0
    

    while(contadorMinas < cantidadMinas){
        let tamaño_minas = tamañoMinas
        let suma = contadorMinas + tamañoMinas
        
        if(suma > cantidadMinas){
        
            tamaño_minas = cantidadMinas - contadorMinas
        }
        
        contadorMinas += tamaño_minas
        
        let posicionRng = posicionRandom()
        
        let islaMina = []
        islaMina.push(indicesToString(posicionRng))
        matrizTablero[posicionRng[0]][posicionRng[1]] = mina
        islaMina = crearIslaMinas(posicionRng, islaMina, tamaño_minas)

        islaMina.forEach(elemento => {
            islasMinas.push(elemento)
        });       

    }

    // console.log(islasMinas)
    // auxColorear(islasMinas,'red')
    // auxColorear(primerIsla,'green')
    
}

//TIMER
//STACK OVERWLOW https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript



function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

//REINICIAR

function reahacerTablero(){
    tablero.innerHTML =""
    let cont = 0
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

    for (let i = 0; i < cuadrados.length; i++) {
        cuadrados[i].addEventListener('click', clickIzquierdo, false)
        cuadrados[i].addEventListener('contextmenu', clickDerecho, false);
    }

    tablero.appendChild(menuOpciones)
    tablero.appendChild(cartelFinal)
}

function reiniciar(){
    matrizTablero = []
    fila = []
    
    totalSeconds = 0;

    clearInterval(interval);
    interval = setInterval(setTime, 1000);
    secondsLabel.innerHTML = "00"
    minutesLabel.innerHTML = "00"
    
    listaBanderas = []
    termino = false
    islasMinas = []
    islasVacias = []
    primerIsla = []
    primerClick = true
    // primerIslaTamaño = 10

    cantidadMinas = dificultad[dificultadSeleccionada].cantidadMinas
    tamaño = dificultad[dificultadSeleccionada].tamaño

    cantidadMinasMensaje.innerText = cantidadMinas

    for (let i = 0; i < tamaño; i++) {
        fila.push(0)
    }
    for (let j = 0; j < tamaño; j++) {
        matrizTablero.push(fila.slice())
    }

    


}


//CREAR ESPACIOS VACIOS Y NUMEROS

function revelarIsla(isla){
    isla.forEach(elemento => {
        let posicion = stringToindices(elemento)
        let id = obtenerId(posicion)
        let cuadrado = document.getElementById(id)
        revelarCuadrado(cuadrado)
    });
}




function revelarCuadrado(cuadrado){

    let indices = obtenerIndices(cuadrado.id)

    
    cuadrado.innerText = matrizTablero[indices[0]][indices[1]]
    cuadrado.style.color=coloresNumeros[matrizTablero[indices[0]][indices[1]]]
}

function encontrarSiguienteParte(posicion, islaVacia){

    for (let i = 0; i < direcciones.length; i++) {
        let suma = sumarIndices(posicion, direcciones[i])

        if(suma[0] < 0 || suma[0] >= tamaño || suma[1] < 0 || suma[1] >= tamaño){
            continue
        }

        if(matrizTablero[suma[0]][suma[1]] == mina){
            continue
        }

        let indiceString = indicesToString(suma)


        
        if(islaVacia.includes(indiceString) || encontrarIslaVacia(indiceString) != false){
            continue
        }

 

        if(matrizTablero[suma[0]][suma[1]] > 0){
            islaVacia.push(indiceString)
            continue
        }

        islaVacia.push(indiceString)

        islaVacia = encontrarSiguienteParte(suma, islaVacia)
        
    }

    return islaVacia

}

function encontrarIslaVacia(posicion){

    for (let i = 0; i < islasVacias.length; i++) {
        if(islasVacias[i].includes(posicion)){
            return islasVacias[i]
        }
        
    }

    return false
    
}

function crearIslasVacias(){
    for (let i = 0; i < matrizTablero.length; i++) {
        for (let j = 0; j < matrizTablero.length; j++) {
            
            if(matrizTablero[i][j] != 0){
                continue
            }
            
            let islaVacia = []
            islaVacia.push(indicesToString([i,j]))
            islaVacia = encontrarSiguienteParte([i,j],islaVacia)
            
            islasVacias.push(islaVacia)
            // islaVacia.forEach(elemento => {
            //     islasVacias.push(elemento)
            // });
        }
        
    }
}

function ponerNumeros(){
    for (let i = 0; i < matrizTablero.length; i++) {
        for (let j = 0; j < matrizTablero.length; j++) {
            let contador = 0
            if(matrizTablero[i][j] == mina){
                continue
            }

            for (let k = 0; k < direcciones.length; k++) {
                let suma = 0
                suma = sumarIndices([i,j], direcciones[k])
                if((suma[0] < 0 || suma[0] >= tamaño) || (suma[1] < 0 || suma[1] >= tamaño)){
                    continue
                }
                if(matrizTablero[suma[0]][suma[1]] == mina){
                    contador += 1
                }
            }
            
            matrizTablero[i][j] = contador
        }
        
    }
}

//COMPROBAR VICTORIA

function comprobarVictoria(){
    let gano = true
    for (let i = 0; i < listaBanderas.length; i++) {
        let indices = obtenerIndices(listaBanderas[i])
        if(matrizTablero[indices[0]][indices[1]] != mina){
            gano = false
            break
        }        

    }
    return gano
}   