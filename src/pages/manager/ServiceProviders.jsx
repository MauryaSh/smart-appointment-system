import { useEffect, useState } from "react";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar";

export default function ServiceProviders() {

const [providers, setProviders] = useState([]);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);

const rowsPerPage = 10;

const fetchProviders = async () => {

const res = await api.get("/manager/approved-providers");
console.log(res.data);
setProviders(res.data);

};

useEffect(() => {
fetchProviders();
}, []);

const filtered = providers.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase())
);

const start = (page - 1) * rowsPerPage;

const visible = filtered.slice(start, start + rowsPerPage);

const totalPages = Math.ceil(filtered.length / rowsPerPage);

return (

<div className="flex">

<Sidebar />

<div className="ml-64 p-8 w-full bg-gray-50 min-h-screen">

<h1 className="text-2xl font-semibold mb-6">
Approved Service Providers
</h1>

<input
placeholder="Search provider..."
value={search}
onChange={(e) => {
setSearch(e.target.value);
setPage(1);
}}
className="border border-gray-300 rounded-md px-3 py-2 mb-6 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

<div className="overflow-x-auto">

<table className="w-full bg-white shadow-md rounded-lg overflow-hidden">

<thead className="bg-gray-100 text-gray-700">

<tr>
<th className="text-left px-6 py-3 font-semibold">Name</th>
<th className="text-left px-6 py-3 font-semibold">Email</th>
<th className="text-left px-6 py-3 font-semibold">Business</th>
<th className="text-left px-6 py-3 font-semibold">Category</th>
</tr>

</thead>

<tbody>

{visible.map((p) => (
<tr
key={p._id}
className="border-t hover:bg-gray-50 transition"
>

<td className="px-6 py-3">{p.name}</td>
<td className="px-6 py-3">{p.email}</td>
<td className="px-6 py-3">{p.businessName}</td>
<td className="px-6 py-3">{p.category}</td>

</tr>
))}

</tbody>

</table>

</div>

{/* Pagination */}

<div className="mt-8 flex justify-center items-center gap-4">

<button
onClick={() => setPage(page - 1)}
disabled={page === 1}
className={`px-4 py-2 rounded-md border
${page === 1
? "bg-gray-200 text-gray-400 cursor-not-allowed"
: "bg-white hover:bg-gray-100"}
`}
>
Prev
</button>

<span className="text-gray-600 text-sm">
Page {page} of {totalPages || 1}
</span>

<button
onClick={() => setPage(page + 1)}
disabled={page >= totalPages}
className={`px-4 py-2 rounded-md border
${page >= totalPages
? "bg-gray-200 text-gray-400 cursor-not-allowed"
: "bg-white hover:bg-gray-100"}
`}
>
Next
</button>

</div>

</div>

</div>

);

}