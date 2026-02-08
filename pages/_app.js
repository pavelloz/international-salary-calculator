import "../styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <SpeedInsights />
    </>
  );
};
