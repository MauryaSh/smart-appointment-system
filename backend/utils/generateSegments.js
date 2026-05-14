function generateSegments(startTime, endTime, service) {

  const segments = []

  const duration = service.duration
  const gap = service.schedulingType === "slot" ? service.slotDuration : 0

  let start = toMinutes(startTime)
  const end = toMinutes(endTime)

  while (start + duration <= end) {

    const segmentEnd = start + duration

    segments.push({
      startTime: toTime(start),
      endTime: toTime(segmentEnd)
    })

    // move to next slot
    start = segmentEnd + gap
  }

  return segments
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function toTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`
}

module.exports = generateSegments