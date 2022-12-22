import mongoose from "mongoose";

const cabinModel = mongoose.Schema({
  name: { type: String, required: true },

  lon: { type: Number, required: true },
  lat: { type: Number, required: true },
  elevation: { type: Number, required: true },

  deviceId: { type: String, default: null },

  waterFull: { type: Number, required: true },
  waterEmpty: { type: Number, required: true },

  tags: { type: [String] },
  link: { type: String },

  water: { type: Number },
  electricity: { type: Number },
  temperature: { type: Number },

  lastUpdated: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var CabinModel = mongoose.model("cabins", cabinModel);
export default CabinModel;
