import CabinModel from "../models/cabinModel.js";

export const getCabins = async (req, res) => {
  try {
    const data = await CabinModel.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

export const createCabin = async (req, res) => {
  try {
    const cabinInfo = req.body;

    const existedCabin = await CabinModel.findOne({ name: cabinInfo.name });
    if (existedCabin) {
      return res.status(403).send("Cabin name exists!");
    }

    const newCabin = new CabinModel(cabinInfo);
    await newCabin.save();

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};
