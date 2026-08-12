
// 🔹 Normalized base priority mapping
const TAG_BASE_PRIORITY = {
  electricity: 'HIGH',
  water: 'HIGH',
  internet: 'MEDIUM',
  plumber: 'MEDIUM',
  plumbing: 'MEDIUM',
  carpenter: 'LOW',
  cleaning: 'LOW',
  other: 'LOW'
};

// 🔹 Normalize tag safely
function normalizeTag(tag) {
  if (!tag) return 'other';
  return tag.toString().toLowerCase().trim();
}

// 🔹 Calculate days pending
function calculateDaysPending(createdAt) {
  if (!createdAt) return 0;

  const createdDate = new Date(createdAt);
  const today = new Date();

  const diffTime = today - createdDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// 🔹 Escalate priority based on time
function escalatePriority(basePriority, daysPending) {
  if (basePriority === 'LOW' && daysPending >= 3) {
    return 'MEDIUM';
  }

  if (basePriority === 'MEDIUM' && daysPending >= 3) {
    return 'HIGH';
  }

  return basePriority;
}

// 🔹 Determine priority + explanation
function getComplaintPriority(complaint) {
  const normalizedTag = normalizeTag(complaint.tag);

  const basePriority =
    TAG_BASE_PRIORITY[normalizedTag] || 'LOW';

  const daysPending = calculateDaysPending(complaint.createdAt);

  const finalPriority = escalatePriority(basePriority, daysPending);

  const reason =
    basePriority === finalPriority
      ? `Tagged as "${complaint.tag}" (base priority: ${basePriority})`
      : `Tagged as "${complaint.tag}" and escalated after ${daysPending} day(s)`;

  return {
    priority: finalPriority,
    reason
  };
}

// 🔹 Enrich complaints list
function enrichComplaintsWithPriority(complaints) {
  return complaints.map((complaint) => {
    const { priority, reason } = getComplaintPriority(complaint);

    const plain = complaint.toJSON();
    return {
      ...plain,
      roomNo: plain.student?.room?.roomNo ?? null,
      priority,
      priorityReason: reason
    };
  });
}

module.exports = {
  enrichComplaintsWithPriority
};
