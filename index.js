document.addEventListener('DOMContentLoaded', () => {
    fetchData()
});
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        pintarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error);
    }
}
const contenedorProductos = document.querySelector('#contenedor-productos');
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
    //console.log(template)
    data.forEach(producto => {
        //console.log(producto)
        template.querySelector('img').setAttribute('src', producto.imgUrl)
        template.querySelector('h5').textContent = producto.titulo
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contenedorProductos.appendChild(fragment)
}
let carrito = {}


const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad
            }
            carrito[producto.id] = { ...producto }
            pintarCarrito()
        })
    })

}
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

const items = document.querySelector('#items')
const pintarCarrito = () => {
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        //console.log(producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.titulo
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id


        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    
    items.appendChild(fragment)
    
    pintarFooter()
    accionBotones()
   localStorage.setItem('carrito', JSON.stringify(carrito))
    
}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''
    if (Object.keys(carrito).lenght === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacio con innerHtml</th>`
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    //sumar cantidad y total
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    //console.log(nPrecio);



   

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio


    const clone = template.cloneNode(true)

    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        Swal.fire({
            title: '¿Está seguro de eliminar los productos seleccionados?',
            icon: 'warning',
            showCancelButtom: true,
            confirmButtomText: 'Si, estoy seguro',
            cancelButtomText: 'No, no quiero eliminar',

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Has vaciado el carrito',
                    icon: 'success',

                })
            } carrito = {}
            pintarCarrito()

        })
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(btn.dataset.id)
            const producto = carrito[btn.dataset.id]
            producto.cantidad++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito()

        })
    })


    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            //console.log('...eliminando')
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]

            } else {
                carrito[btn.dataset.id] = { ...producto }

            }
            pintarCarrito()
        })
    })

    



}



