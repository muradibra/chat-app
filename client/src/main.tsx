import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { Toaster } from "react-hot-toast";
// import { Provider } from "react-redux";
// import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  // <Provider store={store}>
  <div>
    <Toaster />
    <RouterProvider router={router} />
  </div>
  // </Provider>
);
