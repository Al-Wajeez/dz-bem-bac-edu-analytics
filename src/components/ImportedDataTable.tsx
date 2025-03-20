import React from 'react';

const ImportedDataTable: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">المديرية</th>
            <th className="border border-gray-300 px-4 py-2">المؤسسة</th>
            <th className="border border-gray-300 px-4 py-2">القسم</th>
            <th className="border border-gray-300 px-4 py-2">تاريخ الميلاد</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{row['المديرية']}</td>
              <td className="border border-gray-300 px-4 py-2">{row['المؤسسة']}</td>
              <td className="border border-gray-300 px-4 py-2">{row['القسم']}</td>
              <td className="border border-gray-300 px-4 py-2">{row['تاريخ الميلاد']}</td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportedDataTable; 