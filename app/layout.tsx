export const metadata = {
  title: "Salary Calculator for 🇵🇱 folks",
  description: "Calculate salaries on B2B from different currencies to PLN, with different tax regimes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-gray-100 pt-8">
        <main className="xl:w-2/3 lg:w-9/12 w-full px-4 mx-auto prose-stone prose-xl prose-headings:text-gray-600 prose-headings:font-medium prose-hr:my-6">
          <h2 className="text-gray-600 font-medium">Salary Calculator for 🇵🇱 folks</h2>

          {children}
        </main>
      </body>
    </html>
  );
}
