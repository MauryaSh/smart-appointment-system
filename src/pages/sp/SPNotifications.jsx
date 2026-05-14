import { useEffect, useState } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";

export default function SPNotifications() {

  const [notifications, setNotifications] = useState([]);
  const spId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/sp/${spId}`);
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <SPSidebar />

      <div className="ml-64 w-full p-10">

        <h1 className="text-3xl font-bold mb-8">
          Notifications
        </h1>

        <div className="bg-white rounded-xl shadow">

          {notifications.length === 0 ? (
            <p className="p-8 text-gray-400">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="border-b p-4 hover:bg-gray-50"
              >
                <p className="font-bold">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}