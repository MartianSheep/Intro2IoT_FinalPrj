import DeviceModel from "../models/deviceModel.js";

export const getDevices = async (req, res) => {
  try {
    const data = await DeviceModel.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

export const createDevice = async (req, res) => {
  try {
    const deviceInfo = req.body;
    const newDevice = new DeviceModel(deviceInfo);
    await newDevice.save();

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};
