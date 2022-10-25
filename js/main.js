
//variables globales
const contenidoTienda = document.getElementById("contenidoTienda");
let inputBusq = document.getElementById("searchterm");
const verCarrito = document.getElementById("contenido-carrito");
const productos = [
    { id: "LS", nombre: "Luis Segundo", variedad: "Malbec", precio: 2964, img:"./imágenes/LS.jpg", encarrito: 0},
    { id: "LAOC", nombre: "Las Acequias Oak", variedad: "Cabernet Sauvignon", precio: 987, img:"./imágenes/LAOC.jpg", encarrito: 0},
    { id: "LAOM", nombre: "Las Acequias Oak", variedad: "Malbec", precio: 987, img:"./imágenes/LAOM.jpg", encarrito: 0},
    { id: "LACAC", nombre: "Las Acequias Clase A", variedad: "Chardonnay", precio: 823, img:"./imágenes/LACAC.jpg", encarrito: 0},
    { id: "LACAM", nombre: "Las Acequias Clase A", variedad: "Malbec", precio: 900, img:"./imágenes/LACAM.jpg", encarrito: 0},
    { id: "LACAS", nombre: "Las Acequias Clase A", variedad: "Syrah", precio: 900, img:"./imágenes/LACAS.jpg", encarrito: 0},
    { id: "LACAB", nombre: "Las Acequias Clase A", variedad: "Bonarda", precio: 900, img:"./imágenes/LACAB.jpg", encarrito: 0},
    { id: "ECT", nombre: "El Ciprés", variedad: "Torrontés", precio: 618, img:"./imágenes/ECT.jpg", encarrito: 0},
    { id: "ECB", nombre: "El Ciprés", variedad: "Bonarda", precio: 650, img:"./imágenes/ECB.jpg", encarrito: 0},
    { id: "ECM", nombre: "El Ciprés", variedad: "Malbec", precio: 650, img:"./imágenes/ECM.jpg", encarrito: 0},
    { id: "ECS", nombre: "El Ciprés", variedad: "Sangiovese", precio: 650, img:"./imágenes/ECS.jpg", encarrito: 0},
    { id: "ECC", nombre: "El Ciprés", variedad: "Cabernet Sauvignon", precio: 650, img:"./imágenes/ECC.jpg", encarrito: 0}
];
var carrito = [];
let productosAgregados = localStorage.getItem("productosEnCarrito");
productosAgregados = JSON.parse(productosAgregados);
if (productosAgregados != null) {
    carrito = productosAgregados
};

//---------------FUNCIONES----------------//

//funcion para buscar productos
inputBusq.addEventListener("keyup", buscarProductos);
function buscarProductos () {
    let filtrarValor = inputBusq.value.toUpperCase();
    let producto = document.querySelectorAll(".image");
    for (let i=0; i<producto.length; i++){
        let span = (producto[i].querySelector("h2"));
        if (span.innerHTML.toLocaleUpperCase().indexOf(filtrarValor) > -1){
            producto[i].style.display = "initial";
        }else {
            producto[i].style.display="none";
        }
    }
};

//funcion para pintar los productos de la tienda
productos.forEach((producto)=> {
     const content = document.createElement("div");
     content.classList.add("image");
     content.innerHTML = `
         <img src="./imágenes/${producto.id}.jpg">
         <h2>${producto.nombre}<br>${producto.variedad}</h2>
         <h3>$${producto.precio}</h3>
         <button class="agregar ${producto.id}" id="agregar${producto.id}">Agregar al Carrito</button>
     `;
    contenidoTienda.appendChild(content);
});

//funcion para agregar productos al array carrito
let productosCarr = document.querySelectorAll(".agregar");
let agregarAlCarrito = (producto) => { 
    if (!carrito.find(({id}) => id === producto.id)) {
    carrito.push({ id: producto.id, 
        nombre: producto.nombre, 
        variedad: producto.variedad, 
        precio: producto.precio, 
        img: producto.img,
        encarrito: producto.encarrito})
    };   
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
    let costoCarrito = localStorage.getItem("costoTotal");
    costoCarrito = carrito.reduce((acc, cur) => cur.precio + acc, 0);
    localStorage.setItem("costoTotal", costoCarrito);
};

//funcion para pintar los productos del carrito y el costo total del mismo
function displayCarrito() {
    let productosAgregados = localStorage.getItem("productosEnCarrito");
    productosAgregados = JSON.parse(productosAgregados);
    let costoCarrito = localStorage.getItem("costoTotal");

    if (productosAgregados && verCarrito) {
        verCarrito.innerHTML = '';
        verCarrito.innerHTML += `
            <div><button class="vaciar-carrito" id="vaciar-carrito">Vaciar Carrito</button></div>
            <p>Costo Total: $${costoCarrito}</p>
        `;
        Object.values(productosAgregados).map(item => {
            verCarrito.innerHTML +=
            `<div class="agregado">
                <img src="./imágenes/${item.id}.jpg">
                <div class="datosProducto">
                    <p>${item.nombre}</p>
                    <p>${item.variedad}</p>
                    <p>$${item.precio}</p>
                    <p>${item.encarrito}</p>
                    <button class="quitar" id="${item.id}">Eliminar</button>
                </div>
            </div>
            `;
        //evento para eliminar un solo producto del Carrito.
        const botonEliminar = document.querySelectorAll(".quitar")
        botonEliminar.forEach(btn => {
            btn.addEventListener("click", () => {
                carrito = carrito.filter(item => item.id != btn.id);
                localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
                localStorage.setItem("costoTotal", costoCarrito - item.precio);
                displayCarrito();    
                });
            });
        //evento para vaciar el Carrito.
        const botonVaciar = document.getElementById("vaciar-carrito");
        botonVaciar.addEventListener("click", () => {
            carrito = [];
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            localStorage.setItem("costoTotal", 0);
            displayCarrito();
            });
        });    
    }
};

let costoCarrito = localStorage.getItem("costoTotal");
costoCarrito = carrito.reduce((acc, cur) => cur.precio + acc, 0);
localStorage.setItem("costoTotal", costoCarrito);

//evento para seleccionar productos
for (let i=0; i < productosCarr.length; i++) {
    productosCarr[i].addEventListener ("click", () => {
        agregarAlCarrito(productos[i]);
        displayCarrito(productos[i]);
    })
};

displayCarrito();
