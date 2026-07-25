const analyzeSituation = async (message) => {
  const text = message.toLowerCase();

  let response = {
    riskLevel: "LOW",
    suggestion: "Situation appears safe.",
    shouldTriggerSOS: false,
    nearbyHelpNeeded: false,
    tips: [],
    actions: [],
  };

  if (
    text.includes("help") ||
    text.includes("follow") ||
    text.includes("danger") ||
    text.includes("attack") ||
    text.includes("kidnap")
  ) {
    response = {
      riskLevel: "HIGH",
      suggestion: "You may be in danger. Move to a crowded place immediately.",
      shouldTriggerSOS: true,
      nearbyHelpNeeded: true,
      tips: [
        "Share your live location",
        "Call a trusted contact",
        "Move towards a public area",
      ],
      actions: ["Trigger SOS", "Find Police Station", "Notify Guardian"],
    };
  } else if (
    text.includes("alone") ||
    text.includes("night") ||
    text.includes("scared")
  ) {
    response = {
      riskLevel: "MEDIUM",
      suggestion: "Stay alert and keep trusted contacts informed.",
      shouldTriggerSOS: false,
      nearbyHelpNeeded: true,
      tips: ["Avoid isolated roads", "Keep phone charged", "Share location"],
      actions: ["View Safe Route", "Find Nearby Help"],
    };
  }

  return response;
};

module.exports = analyzeSituation;
