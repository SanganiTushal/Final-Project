import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String, required: true },
    address: {
      type: String,
      required: true,
    },
    sell: {
      type: Boolean,
      required: true,
    },
    rent: {
      type: Boolean,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parkingSpot: {
      type: Boolean,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
