const TablePreview = ({ previewData }) => {
  return (
    <div className="preview-table-container">
      <table className="preview-table">
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Depth</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {previewData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
