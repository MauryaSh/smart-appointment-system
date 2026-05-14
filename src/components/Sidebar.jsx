import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {

return (

<div className="
w-64 h-screen fixed
bg-gradient-to-b from-green-500/40 to-green-800/30
backdrop-blur-2xl
border-r border-white/20
shadow-2xl
">

<div className="p-6 text-xl font-bold text-white border-b border-white/20 tracking-wide">
Manager Panel
</div>

<nav className="flex flex-col p-4 gap-3">

<NavLink
to="/manager/dashboard"
className={({isActive}) =>
`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-md
${isActive
? "bg-green-700/70 text-white shadow-lg"
: "bg-green-900/20 text-gray-100 hover:bg-green-400/40 hover:text-black"}`
}
>
<FaHome/> Dashboard
</NavLink>

<NavLink
to="/manager/providers"
className={({isActive}) =>
`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-md
${isActive
? "bg-green-700/70 text-white shadow-lg"
: "bg-green-900/20 text-gray-100 hover:bg-green-400/40 hover:text-black"}`
}
>
<FaUsers/> Service Providers
</NavLink>

<NavLink
to="/manager/settings"
className={({isActive}) =>
`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-md
${isActive
? "bg-green-700/70 text-white shadow-lg"
: "bg-green-900/20 text-gray-100 hover:bg-green-400/40 hover:text-black"}`
}
>
<FaCog/> Settings
</NavLink>

<NavLink
to="/login"
className="
flex items-center gap-3 px-4 py-3 rounded-xl mt-6
bg-red-500/80 hover:bg-red-600
text-white transition-all duration-300 shadow
"
>
<FaSignOutAlt/> Logout
</NavLink>

</nav>

</div>

)

}