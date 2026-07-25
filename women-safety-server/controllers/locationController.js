const Location = require("../models/Location");
const User = require("../models/User");
exports.trackLocation = async (req, res) => {
  try {

    const { token } = req.params;

    const user = await User.findOne({
      trackingToken: token,
      trackingEnabled: true,
      liveLocationEnabled: true,
    }).select(
      "name latitude longitude address online lastSeen profileImage battery sosActive"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tracking session expired.",
      });
    }

    if (
      user.latitude === null ||
      user.longitude === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Location unavailable.",
      });
    }

    res.json({
      success: true,
      woman: {
        name: user.name,
        profileImage: user.profileImage,
        battery: user.battery,
        online: user.online,
        lastSeen: user.lastSeen,
        sosActive: user.sosActive,
      },
      location: {
        latitude: user.latitude,
        longitude: user.longitude,
        address: user.address,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

exports.updateGuardianLocation = async (req, res) => {
    try {
        const { guardianId, latitude, longitude } = req.body;

        if (!guardianId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        let location = await Location.findOne({ guardianId });

        if (location) {
            location.latitude = latitude;
            location.longitude = longitude;
            location.updatedAt = new Date();

            await location.save();
        } else {
            location = await Location.create({
                guardianId,
                latitude,
                longitude,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Guardian location updated",
            location,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateWomanLocation = async (req, res) => {
    console.log("updateWoman called");
    console.log(req.body);
    try {
        const { womanId, latitude, longitude } = req.body;

        if (!womanId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        let location = await Location.findOne({ womanId });

        if (location) {
            location.latitude = latitude;
            location.longitude = longitude;
            location.updatedAt = new Date();

            await location.save();
        } else {
            location = await Location.create({
                womanId,
                latitude,
                longitude,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Woman location updated",
            location,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getWomanLocation = async (req, res) => {
  try {

    const { womanId } = req.params;

    const woman = await User.findById(womanId);

    if (!woman) {
      return res.status(404).json({
        success: false,
        message: "Woman not found",
      });
    }

    if (!woman.liveLocationEnabled) {
      return res.status(403).json({
        success: false,
        message: "Woman is not sharing location",
      });
    }

    const location = await Location.findOne({
      womanId,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      location,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
exports.deleteWomanLocation = async (req, res) => {

  try {

    await Location.deleteOne({
      womanId: req.params.womanId,
    });

    res.json({
      success: true,
    });

  }

  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

exports.getGuardianLocation = async  (req, res) => {
    try {
        const { guardianId } = req.params;

        const location = await Location.findOne({ guardianId });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }

        return res.status(200).json({
            success: true,
            location,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};