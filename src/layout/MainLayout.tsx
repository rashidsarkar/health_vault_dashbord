import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="mx-auto">
      <Outlet></Outlet>
    </div>
  );
}
