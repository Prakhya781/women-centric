const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  
  {
    
    battery: {
    type: Number,
    default: 100
},

currentLocation: {
    type: String,
    default: "Unknown"
},

safetyStatus: {
    type: String,
    default: "SAFE"
},

sosActive: {
    type: Boolean,
    default: false
},

online: {
    type: Boolean,
    default: false
},
guardianLinked: {
    type:Boolean,
    default:false
},

linkedGuardian:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
},
// ================= AI PROTECTION STATUS FIELDS =================

keywordAlertActive: {
  type: Boolean,
  default: false,
},
lastKeywordAlertAt: {
  type: Date,
  default: null,
},

shakeDetectionActive: {
  type: Boolean,
  default: false,
},
lastShakeAlertAt: {
  type: Date,
  default: null,
},

movementTrackingActive: {
  type: Boolean,
  default: false,
},
movementAlertActive: {
  type: Boolean,
  default: false,
},
lastMovementCheck: {
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  timestamp: { type: Date, default: null },
},
linkedWomen:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],
lastSeen: {
    type: String,
    default: "Just Now"
},

profileImage: {
    type: String,
    default: ""
},
    sosActive: {
      type: Boolean,
      default: false,
    },

    sosStartedAt: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "guardian"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    fakeCallName: {
      type: String,
      default: "Mom",
    },

    fakeCallNumber: {
      type: String,
      default: "9876543210",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    emergencyContact1: {
      type: String,
      default: "",
    },

    emergencyContact2: {
      type: String,
      default: "",
    },

    guardianEmail: {
      type: String,
      default: "",
    },

    guardianPhone: {
      type: String,
      default: "",
    },

    relationship: {
      type: String,
      default: "",
    },

    guardianLinked: {
      type: Boolean,
      default: false,
    },

    linkedGuardian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    linkedWomen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    liveLocationEnabled: {
      type: Boolean,
      default: false,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    locationUpdatedAt: {
      type: Date,
      default: null,
    },
    locationStartedAt: {
      type: Date,
      default: null,
    },

    locationSharingEndTime: {
      type: Date,
      default: null,
    },
    trackingToken: {
  type: String,
  default: null,
},

trackingEnabled: {
  type: Boolean,
  default: false,
},

trackingStartedAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
