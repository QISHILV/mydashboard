import { RouterProvider } from "react-router";
import { router } from "./routes";
import { DashboardProvider } from "./components/DashboardContext";

export default function App() {
  return (
    <DashboardProvider>
      <RouterProvider router={router} />
    </DashboardProvider>
  );
}
