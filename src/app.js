import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "../src/routes/carts.routes.js";
import productsRouter from "../src/routes/products.routes.js";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import ProductManager from "./utils/productManager.js";

const app = express();
const productManagerInstance = new ProductManager("/data/products.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Estefania Pizarro</title>
  <link rel="stylesheet" href="../public/css/style.css" />
</head>

<body>
  <main>
    <h1>Agregar Productos</h1>
    <div class="box">
      <br />
        <label>Nombre del Producto</label><br />
        <input type="text" name="title" id="title" /><br />
        <label>Descripción del producto</label><br />
        <input type="description" name="description" id="description" /><br />
        <label>Precio</label><br />
        <input type="price" name="price" id="price" /><br />
        <label class="file-label" for="thumbnail">Cargar una imagen</label><br />
        <input type="file" name="thumbnail" id="thumbnail" /><br />
        <label>Codigo</label><br />
        <input type="code" name="code" id="code" /><br />
        <label>Cantidad</label><br />
        <input type="stock" name="stock" id="stock" /><br />
        <input id="button" type="submit" value="Agregar Producto" />
      </form>
    </div>
    <div class="box">
      <br />
        <input id="checkCartButton" type="submit" value="Ver Carrito" />
      </form>
    </div>
  </main>
</body>
</html>`);
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "style.css",
    layout: "products",
  });
});

const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado -----> ", socket.id);

  socket.on("addProduct", async (productData) => {
    await productManagerInstance.addProduct(productData);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManagerInstance.deleteProduct(productId);
  });

  socket.on("getProducts", async () => {
    const products = await productManagerInstance.getProducts();
    socket.emit("receiveProducts", products);
  });
});