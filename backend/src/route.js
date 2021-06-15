import express from "express";
import UserModel from "./model/UserModel.js";
import HospitalModel from "./model/HospitalModel.js";
import crypto from 'crypto'
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello from Vaccine Searching Machine!!!");
});

const validateSignature = (publicKey, entryData) => {
  if (publicKey == null)
    return false
  const signature = Buffer.from(entryData.signature, 'base64');
  delete entryData["signature"]
  const publicPEM = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

  const verify = crypto.createVerify('SHA256');
  verify.write(JSON.stringify(entryData));
  verify.end();
  const messageIsValid = verify.verify(publicPEM, signature);
  // const messageIsValid = verify('sha256', JSON.stringify(entryData), publicKey, signature);
  console.log("Signature verification: ", messageIsValid);
  return messageIsValid
}

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
    signature: entryData.signature,
  }
  console.log(vaccineData)
  const user = await UserModel.findOne({ ID: id, name: usr_name });
  const vaccine = validateVaccine(vaccineData);
  const hospital = await HospitalModel.findOne({ name: vaccineData.hospitalName })
  if (vaccine != null && hospital && validateSignature(hospital.publicKey, entryData)) {
    if (user != null) {
      user.Injection.push(vaccine);
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
    if (account.publicKey != null) {
      res.send({ data: "Success" });
    }
    else {
      res.send({ data: "Public Key Empty" })
    }
    account.save();
  }
  else
    res.send({ data: "Failed" });
});

router.post("/setPublicKey", async (req, res) => {
  let { hospital_name, pwd, public_key } = req.body;

  const account = await HospitalModel.findOne({ name: hospital_name });
  if (account && account.validPassword(pwd) && public_key != null) {
    account.publicKey = public_key;
    await account.save()
    res.send("Success")
  }
  else
    res.send("Failed")
})

router.get("/addHospital", async (req, res) => {
  await generateHospitalAccount(req.query.name, req.query.password)
  res.send("OK")
});
const generateHospitalAccount = async (name, password) => {
  const a = new HospitalModel({ name: name });
  a.password = a.generateHash(password);
  return await a.save()
}

export default router;
