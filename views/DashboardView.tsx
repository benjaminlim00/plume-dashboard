import Image from "next/image"

const DashboardView: React.FC = () => {
  const transactions = [
    {
      transactionId: "0x3cdd...a0b7",
      from: "0x5e3f...9b4d",
      to: "0x8631...0bfD",
      amount: "1.50",
      date: "Jul 22, 2025, 4:45 PM",
    },
    {
      transactionId: "0x86bf...f9a8",
      from: "0x772e...c6d1",
      to: "0x8631...0bfD",
      amount: "1.75",
      date: "Jun 15, 2025, 2:30 PM",
    },
    {
      transactionId: "0x6b3c...e4d2",
      from: "0x8631...0bfD",
      to: "0x58de...b5ef",
      amount: "2.00",
      date: "May 10, 2025, 11:15 AM",
    },
    {
      transactionId: "0x5af1...d3e9",
      from: "0x8631...0bfD",
      to: "0x47fa...c9de",
      amount: "1.25",
      date: "Apr 24, 2025, 9:41 AM",
    },
    {
      transactionId: "0x5af1...d3b8",
      from: "0x8631...0bfD",
      to: "0x47fa...c9de",
      amount: "1.25",
      date: "Apr 23, 2025, 9:41 AM",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-2 md:px-0">
      <nav
        className="fixed top-6 left-1/2 container flex -translate-x-1/2 transform items-center justify-between rounded-3xl bg-white p-4"
        style={{
          backdropFilter: "blur(40px)",
        }}
      >
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nest Icon"
            width={84}
            height={30}
            className="mx-auto"
          />
        </div>
        <div className="flex items-center rounded-lg border border-[#F0F0F0] p-2">
          <div className="mr-2 h-6 w-6 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium">0x8631...0bfD</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl pt-[120px] md:pt-[192px]">
        {/* Balance Section */}
        <div
          className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-[#09090B]"
          style={{
            boxShadow: "0px 1px 3px 0px #0000000D",
          }}
        >
          <h3 className="font-medium">Your Nest Balance</h3>
          <div className="mt-4 flex items-center">
            <div className="mr-2 h-6 w-6">
              <svg viewBox="0 0 24 24" className="h-full w-full">
                <circle cx="12" cy="12" r="10" fill="#0D9488" />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  $
                </text>
              </svg>
            </div>
            <span className="text-3xl font-bold">10,000</span>
          </div>
          <p className="mt-2 text-sm text-[#71717A]">$1M</p>
        </div>

        {/* Transaction History */}
        <div
          className="mt-8 rounded-xl border border-[#E5E7EB] bg-white p-6 text-[#09090B]"
          style={{
            boxShadow: "0px 1px 3px 0px #0000000D",
          }}
        >
          <h3 className="mb-6 font-medium">Transaction history</h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                    Transaction
                  </th>
                  <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                    From
                  </th>
                  <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                    To
                  </th>
                  <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                    Amount
                  </th>
                  <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.transactionId}
                    </td>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.from}
                    </td>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.to}
                    </td>
                    <td className="py-3 text-sm text-[#09090B]">
                      {txn.amount}
                    </td>
                    <td className="py-3 text-sm text-[#09090B]">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
