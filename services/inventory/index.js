const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const products = require('./products.json');

const packageDefinition = protoLoader.loadSync('../proto/inventory.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(inventoryProto.InventoryService.service, {
  SearchAllProducts: (_, callback) => {
    callback(null, { products });
  },

  SearchProductByID: (payload, callback) => {
    const product = products.find((p) => p.id === payload.request.id);
    callback(null, product || {});
  },
});

server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Inventory Service running at http://127.0.0.1:3002');
  server.start();
});
