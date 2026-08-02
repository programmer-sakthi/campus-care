import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}