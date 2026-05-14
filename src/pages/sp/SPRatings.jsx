import { useEffect, useState } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { Star } from "lucide-react";

export default function SPRatings() {

  const [ratings, setRatings] = useState([]);
  const spId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/sp/${spId}`);
      setRatings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) /
          ratings.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <SPSidebar />

      <div className="ml-64 w-full p-10">

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Star className="text-yellow-500" />
          Customer Ratings
        </h1>

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold">Average Rating</h2>
          <p className="text-4xl text-emerald-600 font-bold">{avgRating}</p>
          <p className="text-gray-400">{ratings.length} reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
              </tr>
            </thead>

            <tbody>
              {ratings.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-4">{r.customerName}</td>
                  <td className="p-4">{r.rating} ⭐</td>
                  <td className="p-4">{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}