import express from 'express'
import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"
import ProductManager from "./productManager.js";

const app = express();
const productManager = new ProductManager("../data/products.json");

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//BIENVENIDA
app.get('/', (req, res) => {
  res.send("Bievenido")
})

//ROUTES
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use(express.static("public"));

//PORT LISTEN
const port = 8800;
app.listen(port, () => {
  console.log(`Servidor activo http://localhost: ${port}`)
})