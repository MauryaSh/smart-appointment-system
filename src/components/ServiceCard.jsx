export default function ServiceCard({ service }) {
  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      
      <h3>{service.name}</h3>
      <p>₹ {service.price}</p>

      {/* ⭐ RATING DISPLAY */}
      <p>
        ⭐ {service.avgRating || 0} ({service.totalReviews || 0} reviews)
      </p>

      <p>{service.spId?.name}</p>
      <p>{service.spId?.address}</p>

    </div>
  );
}