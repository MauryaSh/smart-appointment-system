import { useEffect, useState } from "react";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar";
import {
  FaUsers,
  FaUserFriends,
  FaUserTie,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import CategoryPieChart from "../../components/CategoryPieChart";

export default function ManagerDashboard() {

  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // SEARCH FILTERS
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* Fetch providers */
  const fetchProviders = async () => {
    const res = await api.get("/manager/providers");
    console.log(res.data);
    setProviders(res.data);
  };

  /* Fetch dashboard stats */
  const fetchStats = async () => {
    const res = await api.get("/manager/stats");
    setStats(res.data);
  };

  // fetch category stats
  const fetchCategoryStats = async () => {

 const res = await api.get("/manager/category-stats");

 setCategoryData(res.data);

};

  useEffect(() => {

 fetchStats();
 fetchProviders();
 fetchCategoryStats();

}, []);

  /* Approve provider */
  const approveProvider = async (id) => {
    await api.put(`/manager/approve/${id}`);

    fetchProviders();
  };

  /* Reject provider */
  const rejectProvider = async (id) => {
    await api.put(`/manager/reject/${id}`
    );

    fetchProviders();
  };

  /* Pagination logic */
  const start = (page - 1) * rowsPerPage;
  const filteredProviders = providers.filter((p)=>{

return (
p.name.toLowerCase().includes(search.toLowerCase()) &&
(categoryFilter === "" || p.category === categoryFilter) &&
(statusFilter === "" || p.status === statusFilter)
);

});

const visibleProviders = filteredProviders.slice(start,start+rowsPerPage);

const totalPages = Math.ceil(filteredProviders.length / rowsPerPage);



  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="ml-64 w-full p-8">

        <h1 className="text-3xl font-bold mb-8">
          Manager Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-yellow-100 p-6 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-gray-500">Total Visitors</p>
              <h2 className="text-3xl font-bold">
                {stats.totalVisitors || 0}
              </h2>
            </div>
            <FaUsers className="text-3xl text-blue-500" />
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-3xl font-bold">
                {stats.totalUsers || 0}
              </h2>
            </div>
            <FaUserFriends className="text-3xl text-green-500" />
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-gray-500">Total Service Providers</p>
              <h2 className="text-3xl font-bold">
              {stats.totalSP || 0}
              </h2>
            </div>
            <FaUserTie className="text-3xl text-purple-500" />
          </div>

        </div>

        {/* Charts Section */}
<div className="grid grid-cols-2 gap-6 mb-10">

  {/* Visitor Graph */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-4">
      Daily Visitor Registrations
    </h2>

    <div className="h-48 flex items-center justify-center text-gray-400">
      Graph will appear here
    </div>
  </div>

  {/* Category Pie Chart */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-4">
      Service Categories
    </h2>

    <CategoryPieChart data={categoryData} />
  </div>

</div>


<div className="flex gap-4 mb-4">

<input
type="text"
placeholder="Search provider..."
className="border p-2 rounded"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="border p-2 rounded"
value={categoryFilter}
onChange={(e)=>setCategoryFilter(e.target.value)}
>
<option value="">All Categories</option>
<option value="Food">Food</option>
<option value="Medical">Medical</option>
<option value="Salon">Salon</option>
<option value="Spa">Spa</option>
<option value="Consultancy">Consultancy</option>
</select>

<select
className="border p-2 rounded"
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>
<option value="">All Status</option>
<option value="pending">Pending</option>
<option value="approved">Approved</option>
<option value="rejected">Rejected</option>
</select>

</div>

        {/* Providers Table */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Service Providers
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b text-left bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Business</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>

                {visibleProviders.map((p) => (
                  <tr key={p._id} className="border-b">

                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.businessName}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 break-words">{p.address}</td>
                    <td className="p-3">
                       <span className={`px-3 py-1 rounded-full text-white text-sm
                       ${p.status === "pending" && "bg-yellow-500"}
                       ${p.status === "approved" && "bg-green-500"}
                       ${p.status === "rejected" && "bg-red-500"}`}>
                      {p.status}
                      </span>
                    </td>

                    <td className="p-3">

                      {p.status === "pending" && (
                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              approveProvider(p._id)
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1"
                          >
                            <FaCheck />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              rejectProvider(p._id)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                          >
                            <FaTimes />
                            Reject
                          </button>

                        </div>
                      )}

                      {p.status === "approved" && (
                        <span className="text-green-600 font-medium">
                          Approved
                        </span>
                      )}

                      {p.status === "rejected" && (
                        <span className="text-red-600 font-medium">
                          Rejected
                        </span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Previous
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}