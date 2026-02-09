import "../styles/globals.css";
import { Head } from "next/document";

export default ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <Head>
        <title>Salary Calculator for 🇵🇱 folks</title>
      </Head>

      <Component {...pageProps} />
    </>,
  );
};
