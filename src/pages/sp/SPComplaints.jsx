import { useEffect, useState } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { CheckCircle, XCircle } from "lucide-react";

export default function SPComplaints() {
  const [complaints, setComplaints] = useState([]);
  const spId = localStorage.getItem("userId");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`/complaints/sp/${spId}`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/update/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      alert("Failed");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SPSidebar />

      <div className="ml-64 w-full p-10">
        <h1 className="text-3xl font-bold mb-8">Customer Complaints</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {complaints.length === 0 ? (
            <p className="p-6 text-gray-400">No complaints</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-4">{c.customerId?.name}</td>
                    <td className="p-4">{c.category}</td>
                    <td className="p-4">{c.message}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                        {c.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => updateStatus(c._id, "Resolved")}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => updateStatus(c._id, "Rejected")}
                        className="p-2 bg-red-100 text-red-600 rounded"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}