// utils/logProof.js
// Utility to log system activity/audit events to the database.
const ActivityLog = require('../model/ActivityLog');

/**
 * Log a system activity.
 * @param {string} action - The action name.
 * @param {string} details - Detailed description of the action.
 * @returns {Promise<Object>} The saved log entry.
 */
async function logActivity(action, details) {
  try {
    const log = new ActivityLog({ action, details });
    await log.save();
    console.log(`[ACTIVITY LOG] ${action}: ${details}`);
    return log;
  } catch (err) {
    console.error("Failed to save activity log:", err);
  }
}

module.exports = { logActivity };
