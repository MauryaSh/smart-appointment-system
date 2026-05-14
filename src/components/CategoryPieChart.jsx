import {
PieChart,
Pie,
Cell,
Tooltip,
ResponsiveContainer
} from "recharts";

const COLORS = [
"#3b82f6",
"#10b981",
"#f59e0b",
"#ef4444",
"#8b5cf6"
];

// darker colors for bottom layer
const SHADOW_COLORS = [
"#1e40af",
"#047857",
"#b45309",
"#991b1b",
"#6d28d9"
];

export default function CategoryPieChart({data}){

return(

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-lg font-semibold mb-4">
Service Provider Categories
</h2>

<ResponsiveContainer width="100%" height={260}>

<PieChart>

{/* Bottom layer (3D depth) */}
<Pie
data={data}
dataKey="value"
cx="50%"
cy="53%"   // slightly lower
outerRadius={90}
isAnimationActive={false}
>

{data.map((entry,index)=>(
<Cell
key={index}
fill={SHADOW_COLORS[index % SHADOW_COLORS.length]}
/>
))}

</Pie>

{/* Top layer */}
<Pie
data={data}
dataKey="value"
nameKey="name"
cx="50%"
cy="50%"
outerRadius={90}
label
>

{data.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

)

}