import List from "../models/listingModel.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await List.create(req.body);
    res.status(201).json({
      status: "Success",
      Data: {
        list: newListing,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllListing = async (req, res, next) => {
  try {
    const data = await List.find({ userRef: req.userId });
    res.status(200).json({
      status: "Success",
      Data: {
        list: data,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getListing = async (req, res, next) => {
  try {
    const data = await List.findById(req.params.listingId);
    res.status(200).json({
      status: "Success",
      Data: {
        list: data,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editListing = async (req, res, next) => {
  try {
    const data = await List.findByIdAndUpdate(req.params.listingId, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      Data: {
        list: data,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await List.findByIdAndDelete(req.params.listingId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;

    const startIndex = parseInt(req.query.startIndex) || 0;

    let sell = req.query.sell;

    if (sell === undefined || sell === "false") {
      sell = { $in: [false, true] };
    }

    let rent = req.query.rent;

    if (rent === undefined || rent === "false") {
      rent = { $in: [false, true] };
    }

    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parkingSpot = req.query.parkingSpot;

    if (parkingSpot === undefined || parkingSpot === "false") {
      parkingSpot = { $in: [false, true] };
    }

    const searchTerm = req.query.term || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await List.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parkingSpot,
      rent,
      sell,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
