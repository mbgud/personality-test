export const metadata = {
  title: "Yourway Live Personality Survey",
  description: "Live personality survey board, participant flow, and admin sessions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
