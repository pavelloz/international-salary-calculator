import Head from "next/head";

export default ({ children }) => {
  return (
    <>
      <Head>
        <title>Salary Calculator for 🇵🇱 folks</title>
      </Head>
      <main className="w-full mx-auto mt-8 prose prose-stone  prose-xl prose-headings:text-gray-600 prose-headings:font-medium prose-hr:my-6">
        <h2 className="text-gray-600 font-medium">
          Salary Calculator for 🇵🇱 folks
        </h2>

        {children}
      </main>
    </>
  );
};
