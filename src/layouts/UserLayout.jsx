import UserSidebar from "../components/UserSidebar";

export default function UserLayout({ children }) {

  return (
    <div style={{ display: "flex" }}>

      <UserSidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

    </div>
  );
}