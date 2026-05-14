import {useState} from "react";
import Sidebar from "../../components/Sidebar";

export default function Settings(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleSave = ()=>{

alert("Profile Updated")

}

return(

<div className="flex">

<Sidebar/>

<div className="ml-64 p-8 w-full">

<h1 className="text-2xl font-bold mb-6">
Manager Settings
</h1>

<div className="bg-white p-6 rounded shadow w-96">

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="border p-2 w-full mb-3"
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-2 w-full mb-3"
/>

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 w-full mb-4"
/>

<button
onClick={handleSave}
className="bg-blue-500 text-white px-4 py-2 rounded"
>
Save
</button>

</div>

</div>

</div>

)

}