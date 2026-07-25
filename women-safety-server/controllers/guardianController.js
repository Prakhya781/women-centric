const GuardianLink = require("../models/GuardianLink");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Incident = require("../models/Incident");
const EmergencyContact = require("../models/EmergencyContact");
const Report = require("../models/Report");  
exports.getMyWoman = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    }).populate("womanId");

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

    return res.status(200).json({
      success: true,
      womanId: link.womanId._id,
      woman: {
        _id: link.womanId._id,
        name: link.womanId.name,
        email: link.womanId.email,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GUARDIAN NOTIFICATIONS =================

exports.getGuardianNotifications = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

    const notifications = await Notification.find({
      userId: link.womanId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GUARDIAN INCIDENT REPORTS =================

exports.getGuardianIncidents = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

    const incidents = await Report.find({
      user: link.womanId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      incidents,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GUARDIAN SAFETY STATUS =================

exports.getGuardianSafetyStatus = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

   const woman = await User.findById(link.womanId).select(
  "name profileImage battery online liveLocationEnabled safetyStatus sosActive locationUpdatedAt currentLocation latitude longitude lastSeen guardianLinked"
);

    if (!woman) {
      return res.status(404).json({
        success: false,
        message: "Woman not found",
      });
    }
     const womanObj = woman.toObject();

    if (womanObj.sosActive) {
      womanObj.safetyStatus = "EMERGENCY";
    }

    return res.status(200).json({
      success: true,
      status: woman,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GUARDIAN EMERGENCY CONTACTS =================

exports.getGuardianEmergencyContacts = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

    const contacts = await EmergencyContact.find({
      userId: link.womanId,
    });

    const woman = await User.findById(link.womanId).select(
      "name emergencyContact1 emergencyContact2 bloodGroup"
    );

    return res.status(200).json({
      success: true,
      contacts,
      woman,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ================= GUARDIAN SOS =================

exports.getGuardianSOS = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      status: "Accepted",
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No linked woman found",
      });
    }

    const woman = await User.findById(link.womanId).select(
      "name profileImage phone sosActive sosStartedAt currentLocation latitude longitude address locationUpdatedAt online lastSeen"
    );

    if (!woman) {
      return res.status(404).json({
        success: false,
        message: "Woman not found",
      });
    }

    return res.status(200).json({
      success: true,
      sos: {
        womanId: woman._id,
        name: woman.name,
        profileImage: woman.profileImage,
        phone: woman.phone,
        sosActive: woman.sosActive,
        sosStartedAt: woman.sosStartedAt,
        online: woman.online,
        lastSeen: woman.lastSeen,
        location: {
          latitude: woman.latitude,
          longitude: woman.longitude,
          address: woman.address,
          currentLocation: woman.currentLocation,
          updatedAt: woman.locationUpdatedAt,
        },
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getGuardianDashboard = async (req, res) => {
  try {

    const guardianId = req.user.id;

    const link = await GuardianLink.findOne({
      guardianId,
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        message: "No woman linked with this guardian.",
      });
    }

    const woman = await User.findById(link.womanId);
    const notifications = await Notification.find({
      userId: woman._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!woman) {
      return res.status(404).json({
        message: "Woman not found.",
      });
    }

    let safetyStatus = woman.safetyStatus;

    if (woman.sosActive) {
      safetyStatus = "EMERGENCY";
    }

    res.json({
      womanName: woman.name,
      profileImage: woman.profileImage,
      battery: woman.battery,
      location: woman.currentLocation,
      safetyStatus,              // ✅ ab ye local variable ko refer karta hai, koi crash nahi
      sos: woman.sosActive,
      online: woman.online,
      lastSeen: woman.lastSeen,
      notifications,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};
const sendEmail = require("../utils/sendEmail");

exports.sendGuardianRequest = async (req, res) => {
  try {
    const { guardianEmail } = req.body;

    const womanId = req.user.id;

    const woman = await User.findById(womanId);

    if (!woman) {
      return res.status(404).json({
        message: "Woman not found",
      });
    }

    const guardian = await User.findOne({
      email: guardianEmail,
      role: "guardian",
    });

    if (!guardian) {
      return res.status(404).json({
        message: "Guardian not found",
      });
    }
const existing = await GuardianLink.findOne({
  womanId,
  guardianId: guardian._id,
});

if (existing) {

  // Pending hai
  if (existing.status === "Pending") {
    return res.status(400).json({
      message: "Request already pending."
    });
  }

  // Already linked
  if (existing.status === "Accepted") {
    return res.status(400).json({
      message: "Guardian already linked."
    });
  }

  // Reject hua tha
  if (existing.status === "Rejected") {

    existing.status = "Pending";
    existing.isActive = false;
    existing.requestedAt = new Date();

    await existing.save();

    return res.json({
      success: true,
      message: "Guardian request sent again."
    });

  }

}

    const request = await GuardianLink.create({
      womanId,
      guardianId: guardian._id,
      status: "Pending",
      isActive: false,
    });

    // Mail to Guardian
    await sendEmail(
      guardian.email,
      "SafeHer Guardian Request",
      `
      <h2>Hello ${guardian.name}</h2>

      <p><b>${woman.name}</b> wants to add you as her Guardian.</p>

      <p>Please login into SafeHer and accept/reject the request.</p>

      <br/>

      <p>Regards</p>
      <h3>SafeHer Team</h3>
      `
    );

    // Mail to Woman
    await sendEmail(
      woman.email,
      "Guardian Request Sent",
      `
      <h2>Hello ${woman.name}</h2>

      <p>Your guardian request has been sent successfully.</p>

      <p>Status : <b>Pending</b></p>

      <p>Please wait until your Guardian accepts it.</p>

      <br/>

      <h3>SafeHer Team</h3>
      `
    );

    res.json({
      success: true,
      message: "Guardian request sent successfully.",
      request,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.getGuardianStatus = async (req, res) => {

    const womanId = req.user.id;

    const link = await GuardianLink.findOne({
        womanId
    }).populate("guardianId","name email");

    if(!link){

        return res.json({
            status:"Not Linked"
        });

    }

    res.json({
        status:link.status,
        guardian:link.guardianId
    });

}
exports.getGuardianRequests = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const requests = await GuardianLink.find({
      guardianId,
      status: "Pending",
    })
      .populate("womanId", "name email profileImage")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.rejectGuardianRequest = async (req, res) => {
  try {
    const request = await GuardianLink.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Rejected";
    request.isActive = false;

    await request.save();

    const woman = await User.findById(request.womanId);
    const guardian = await User.findById(request.guardianId);

    await sendEmail(
      woman.email,
      "Guardian Request Rejected",
      `
<h2>Hello ${woman.name}</h2>

<p>Unfortunately, your guardian request has been rejected by <b>${guardian.name}</b>.</p>
`
    );

    res.json({
      success: true,
      message: "Rejected Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.acceptGuardianRequest = async (req, res) => {
  try {
    const request = await GuardianLink.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Accepted";
    request.isActive = true;

    await request.save();

    const woman = await User.findById(request.womanId);
    const guardian = await User.findById(request.guardianId);

    woman.guardianLinked = true;
    woman.linkedGuardian = guardian._id;

    await woman.save();

    if (!guardian.linkedWomen.includes(woman._id)) {
      guardian.linkedWomen.push(woman._id);
    }

    await guardian.save();

    await sendEmail(
      guardian.email,
      "Guardian Request Accepted",
      `
<h2>Hello ${guardian.name}</h2>

<p>You have accepted <b>${woman.name}</b>'s guardian request.</p>

<p>You can now monitor her safety.</p>
`
    );

    await sendEmail(
      woman.email,
      "Guardian Connected",
      `
<h2>Hello ${woman.name}</h2>

<p>Your guardian <b>${guardian.name}</b> accepted your request.</p>
`
    );

    res.json({
      success: true,
      message: "Accepted Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getMyGuardianStatus = async (req, res) => {

  try {

    const womanId = req.user.id;

    const request = await GuardianLink.findOne({
      womanId
    }).populate("guardianId", "name email");

    if (!request) {

      return res.json({
        status: "Not Linked"
      });

    }

    res.json({
      status: request.status,
      guardian: request.guardianId
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};