import MessageModel from "../models/messageModel.js";
import CabinModel from "../models/cabinModel.js";
import DeviceModel from "../models/deviceModel.js";

export const getMessages = async (req, res) => {
  try {
    const data = await MessageModel.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

export const createMessage = async (req, res) => {
  try {
    const messageInfo = req.body;

    console.log("===== Create Message =====");
    console.log(messageInfo);

    // update devices
    for (let i = 0; i < messageInfo.path.length; i = i + 1) {
      const foundDevice = await DeviceModel.findOne({
        deviceId: messageInfo.path[i],
      });
      console.log(foundDevice);
      if (!foundDevice) {
        return res.status(403).send("Contains unknown device id");
      }
    }
    // messageInfo.path.forEach(async (deviceId) => {
    //   const test = await DeviceModel.findOne({});
    // });
    if (messageInfo.path[0] !== messageInfo.senderId) {
      return res.status(403).send("Sender id is not the first id in path");
    }

    for (let i = 0; i < messageInfo.path.length; i = i + 1) {
      await DeviceModel.findOneAndUpdate(
        { deviceId: messageInfo.path[i] },
        { lastActive: Date.now() }
      );
    }

    // messageInfo.path.forEach(async (deviceId) => {
    //   await DeviceModel.findOneAndUpdate(
    //     { deviceId: deviceId },
    //     { lastActive: Date.now() }
    //   );
    // });

    if (messageInfo.messageType === 0) {
      // measurement
      const senderId = messageInfo.senderId;
      let cabin = await CabinModel.findOne({ deviceId: senderId });
      if (!cabin) {
        return res.status(404).send("Cabin not found");
      }
      cabin.water = messageInfo.water;
      cabin.temperature = messageInfo.temperature;
      cabin.electricity = messageInfo.electricity;
      cabin.lastUpdated = Date.now();

      await CabinModel.findByIdAndUpdate(cabin._id, cabin);
      const newMessage = new MessageModel(messageInfo);
      await newMessage.save();
      return res.status(200).send();
    } else if (messageInfo.messageType === 1) {
      // alive
      const newMessage = new MessageModel(messageInfo);
      await newMessage.save();
      return res.status(200).send();
    } else if (messageInfo.messageType === 2) {
      // emergency
      await DeviceModel.findOneAndUpdate(
        { deviceId: messageInfo.senderId },
        { emergency: true }
      );
      const newMessage = new MessageModel(messageInfo);
      await newMessage.save();
      return res.status(200).send();
    } else {
      return res.status(403).send("Unknown message type!");
    }

    // return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};
