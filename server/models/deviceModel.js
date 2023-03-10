import mongoose from "mongoose";

const deviceModel = mongoose.Schema({
  deviceId: { type: String, required: true },
  name: { type: String, required: true },

  lon: { type: Number, required: true },
  lat: { type: Number, required: true },
  elevation: { type: Number, required: true },

  emergency: { type: Boolean, default: false },

  lastActive: { type: Date },
  battery: { type: Number },
  type: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var DeviceModel = mongoose.model("devices", deviceModel);
export default DeviceModel;
