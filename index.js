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
            if(carrito.hasOwnProperty(producto.id)) {
              producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }
            pintarCarrito()
        })
    })

 }
 const items = document.querySelector('#items')
 const pintarCarrito = () => {
    items.innerHTML = ''
    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()
    Object.values(carrito).forEach(producto => {
        console.log(producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
 }
  localStorage.setItem('obejto', JSON.stringify(carrito))


