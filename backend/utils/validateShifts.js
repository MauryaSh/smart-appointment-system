function isOverlap(shifts) {
  const sorted = shifts
    .map(s => ({
      start: s.startTime,
      end: s.endTime
    }))
    .sort((a, b) => a.start.localeCompare(b.start));

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end > sorted[i + 1].start) {
      return true;
    }
  }

  return false;
}

module.exports = isOverlap;