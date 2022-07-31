import { useEffect } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(
    () =>
      document
        .querySelector("body")
        .classList.add(
          "bg-gray-200",
          "font-sans",
          "leading-normal",
          "tracking-normal"
        ),
    []
  );

  return <Component {...pageProps} />;
}

export default MyApp;
