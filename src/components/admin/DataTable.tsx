/* eslint-disable @typescript-eslint/no-explicit-any */
export const DataTable = ({ columns, data }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden bg-white shadow-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col: any) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-6 text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row: any) => (
              <tr key={row.id} className="border-t hover:bg-gray-50 transition">
                {columns.map((col: any) => (
                  <td key={col.key} className="px-4 py-2 text-sm">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-2 text-center">{row.actions}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
