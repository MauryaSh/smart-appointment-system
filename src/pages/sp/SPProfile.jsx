import SPSidebar from "../../components/SPSidebar";

export default function SPProfile() {
  return (
    <div className="flex">
      <SPSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
    </div>
  );
}