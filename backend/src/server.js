import express from 'express';
import mongo from './mongo.js';
import route from './route.js'

const app = express();
app.use(express.json());

app.use('/', route) // 把HTTP Request導向 './route.js'

mongo.connect(); // 和 mongoDB連線


const PORT = process.env.PORT || 8080; //設定PORT
app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port ${PORT}...`);
});


