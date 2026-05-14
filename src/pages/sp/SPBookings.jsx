import { useEffect, useState } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";

export default function SPBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/sp", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/status/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings(); // refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex">
      <SPSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="bg-white p-5 rounded-xl shadow mb-4">

              {/* TOKEN */}
              <p className="text-sm text-gray-400">Token</p>
              <h2 className="text-xl font-bold text-green-600">
                {b.tokenNumber}
              </h2>

              {/* SERVICE */}
              <h3 className="text-lg font-semibold mt-2">
                {b.serviceId?.name}
              </h3>

              {/* USER */}
              <p className="text-gray-600">
                User: {b.userId?.name}
              </p>

              {/* DATE + TIME */}
              <p className="text-gray-500 mt-2">
                {new Date(b.date).toLocaleDateString()} | {b.startTime} - {b.endTime}
              </p>

              {/* STATUS */}
              <p className="mt-2 font-semibold">
                Status: {b.status}
              </p>

              {/* ACTION BUTTONS */}
              {b.status === "booked" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(b._id, "completed")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => updateStatus(b._id, "absent")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Absent
                  </button>

                  <button
                    onClick={() => updateStatus(b._id, "cancelled")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}