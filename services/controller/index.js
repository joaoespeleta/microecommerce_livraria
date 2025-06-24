const express = require('express');
const cors = require('cors');
const inventory = require('./inventory');
const shipping = require('./shipping');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/products', (req, res) => {
  inventory.SearchAllProducts({}, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.products);
  });
});

app.get('/shipping/:cep', (req, res) => {
  shipping.GetShippingRate({ cep: req.params.cep }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

// Nova rota para buscar produto por ID
app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  inventory.SearchProductByID({ id }, (err, product) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'something failed :(' });
    }
    res.json(product);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Controller Service running on http://localhost:${port}`);
});
