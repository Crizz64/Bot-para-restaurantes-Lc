const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const productosValidos = ["hamburguesa", "pizza", "ensalada"];
const bebidasValidas = ["agua", "jugo", "cocacola"];

const valoresProductos = {
  hamburguesa: 20000,
  pizza: 9000,
  ensalada: 8000,
  pasta: 15000,
};

const valoresBebidas = {
  agua: 2000,
  jugo: 5000,
  cocacola: 4000,
};

function validateProduct(producto) {
  return productosValidos.includes(producto);
}

function validateBebida(bebida) {
  return bebidasValidas.includes(bebida);
}

function calculateTotalValor(producto, bebida) {
  const valorProducto = valoresProductos[producto];
  const valorBebida = valoresBebidas[bebida];
  return valorProducto + valorBebida;
}

app.post("/", (req, res) => {
  try {
    const data = req.body.inputs;
    console.log(data); // Log the data object here
    if (!data) {
      return res.status(400).json({ error: "No se proporcionaron datos" });
    }

    const nombre = data.nombre;
    const celular = data.celular;
    const correo = data.email;
    const envio = data.envio;
    const ciudad = data.ciudad;
    const valor = data.valor;
    const producto = data.dinamicos.dinamico32P0O11.trim().toLowerCase();
    const bebida = data.dinamicos.dinamicoHpOQt12.trim().toLowerCase();
    const direccion = data.dinamicos.dinamicoR2Ic113.trim().toLowerCase();

    if (!validateProduct(producto) || !validateBebida(bebida)) {
      const acciones = [
        {
          type: "sendText",
          text: `El producto "${producto && bebida}" no existe en nuestro catálogo, escribe la palabra *"Volver"* e inténtalo de nuevo, recuerda que tenemos "${productosValidos.join(", ")}" y "${bebidasValidas.join(", ")}"`,
        },
      ];
      return res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: acciones,
        },
      });
    }

    const totalValor = calculateTotalValor(producto, bebida);
    const acciones = [
      {
        type: "sendText",
        text: `*Este es tu pedido*: 
        - La comida es <b>${producto}</b>, el valor es <b>${valoresProductos[producto]} COP</b> 
        - Tu bebida es <b>${bebida}</b> y el valor es de <b>${valoresBebidas[bebida]} COP</b> 
        - El total será de <b>${totalValor}</b> 
        - será enviado a la ciudad de <b>${ciudad}</b>, en la dirección <b>${direccion}</b>.`,
      },
      {
        type: "sendText",
        text: `*Datos del usuario*: 
      Nombre: ${nombre}
      Celular: ${celular}
      dirección: ${direccion}`,
      },
    ];

    return res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: acciones,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error interno del servidor: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// This code is a simple Express server that handles a POST request to process restaurant orders.
// It validates the product and beverage, calculates the total value, and responds with the order details