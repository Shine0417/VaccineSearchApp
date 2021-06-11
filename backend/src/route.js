import express from 'express'
import TestModel from './model/TestModel.js'; // DB schema

const router = express.Router()

router.get('/', async (req, res) => { // 接收到 GET "/"路徑的request，除了GET還有POST、PUT....
    res.send('Hello from Vaccine Searching Machine!!!');

    const newMessage = new TestModel({name: "hello world", score: 99}); //New 一筆資料
    console.log(await newMessage.save()); // 確認沒問題以後存進DB
});
  
router.get('/addTestData', async (req, res) => { // 接收到 GET "/addTestData"路徑的request
    res.send('請不要一直進來這個網頁');

    const newMessage = new TestModel({name: "=Test Deploy=", score: 1}); // New 一筆資料
    console.log(await newMessage.save()); // 確認沒問題以後存進DB
});
  
export default router