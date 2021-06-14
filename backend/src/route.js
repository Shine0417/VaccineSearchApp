import express from "express";
import TestModel from "./model/TestModel.js"; // DB schema

const router = express.Router();

router.get("/", async (req, res) => {
  // 接收到 GET "/"路徑的request，除了GET還有POST、PUT....
  res.send("Hello from Vaccine Searching Machine!!!");

  const newMessage = new TestModel({ name: "hello world", score: 99 }); //New 一筆資料
  console.log(await newMessage.save()); // 確認沒問題以後存進DB
});

router.get("/loginUser", async (req, res) => {
  let { id, name } = req.query;

  res.send({ data: "Success" });
});

router.get("/userData", async (req, res) => {
  let { id, name } = req.query;
  console.log(id, name);
  // Query DB
  // res.send()
});

router.get("/addEntry", async (req, res) => {
  let entryData = req.query;
  console.log(entryData)
  res.send({data: "Success"})
});

router.get("/loginHospital", async (req, res) => {
  let { hospital_name, pwd } = req.query;
  console.log(hospital_name, pwd);
  res.send({ data: "Success" });
});
export default router;
