import express from "express";
import UserModel from "./model/UserModel.js";
import HospitalModel from "./model/HospitalModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello from Vaccine Searching Machine!!!");
});

const validateVaccine = (vaccine) => {
  if (!Object.values(vaccine).some((x) => x == null || x == ""))
    return vaccine
  else
    return null
}

router.get("/loginUser", async (req, res) => {
  let { id, name } = req.query;
  console.log(id, name)
  const user = await UserModel.findOne({ ID: id, name: name });
  if (user != null)
    res.send({ data: "Success" });
  else
    res.send({ data: "Failed" });

});

router.get("/userData", async (req, res) => {
  console.log("GET user Data query ", req.query);
  let { id, name } = req.query;
  const user = await UserModel.findOne({ ID: id, name: name });
  // Query DB
  if (user != null)
    res.send({ msg: "Success", data: user });
  else
    res.send({ msg: "Failed", data: null });

});

router.get("/addEntry", async (req, res) => {
  let entryData = req.query;
  const { id, usr_name } = entryData;
  const vaccineData = {
    vaccineName: entryData.vaccine_name,
    date: entryData.date,
    duration: entryData.duration,
    count: entryData.count,
    hospitalName: entryData.hospital_name,
    doctorName: entryData.doctor_name,
  }
  console.log(vaccineData)
  const user = await UserModel.findOne({ ID: id, name: usr_name });
  const vaccine = validateVaccine(vaccineData)
  if (vaccine != null) {
    if (user != null) {
      user.Injection.push(vaccine_name);
      await user.save();
    }
    else {
      const newUser = new UserModel({ name: usr_name, ID: id, Injection: [vaccine] });
      await newUser.save();
    }
    res.send({ data: "Success" })
  }
  else
    res.send({ data: "Failed" })
});

router.get("/loginHospital", async (req, res) => {
  const account = await HospitalModel.findOne({ name: req.query.hospital_name });

  if (account && account.validPassword(req.query.pwd)) {
    res.send({ data: "Success" });
    account.save();
  }
  else
    res.send({ data: "Failed" });
});

const generateHospitalAccount = async (name, password) => {
  const a = new HospitalModel({ name: name });
  a.password = a.generateHash(password);
  return await a.save()
}

export default router;
