import React, { useState } from "react";
import { CSVLink } from "react-csv";
import TablePreview from "./components/PreviewTable";

const CoordinateInput = () => {
  const [startTime, setStartTime] = useState("00:00:00");
  const [data, setData] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        const parsedData = csvData.split("\n").map((row) => row.split(","));
        const validData = parsedData.filter(
          (row) => row.length === 3 && row[0] && row[1] && row[2]
        );

        setUploadedData(validData.slice(1));
      };

      reader.readAsText(file);
    }
  };

  const handleGenerateCoordinates = () => {
    const points = uploadedData.map((point, index) => {
      const startTimeArray = startTime.split(":");
      let currentTime = new Date(
        0,
        0,
        0,
        startTimeArray[0],
        startTimeArray[1],
        startTimeArray[2]
      );
      currentTime.setSeconds(currentTime.getSeconds() + index * 2);

      const timeString = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return {
        latitude: point[0],
        longitude: point[1],
        depth: point[2],
        time: timeString,
      };
    });

    setData(points);

    const previewWithTime = points.map((point) => [
      point.latitude,
      point.longitude,
      point.depth,
      point.time,
    ]);

    setPreviewData(previewWithTime);
  };

  const handeClearPage = () => {
    window.location.reload();
  };

  return (
    <section className="section has-content-centered">
      <div className="container">
        <div className="columns is-multiline is-centered">
          <div className="column is-half" style={{ width: "14em" }}>
            <div className="file has-name is-boxed">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    {fileName.length > 0 ? fileName : "Choose a file…"}
                  </span>
                </span>
                <span className="file-name">
                  {uploadedData.length > 0 &&
                    uploadedData.length + " rows uploaded"}
                </span>
              </label>
            </div>

            <div className="field">
              <label className="label" htmlFor="startTime">
                Start Time:
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="startTime"
                  name="startTime"
                  value={startTime}
                  disabled={!uploadedData.length}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button
                  className="button is-primary is-fullwidth"
                  disabled={!uploadedData.length}
                  onClick={handleGenerateCoordinates}
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="field">
              <div className="control">
                {data.length > 0 && (
                  <CSVLink
                    data={data}
                    filename={fileName}
                    className="button is-info is-fullwidth"
                    disabled={!data.length}
                  >
                    Download CSV
                  </CSVLink>
                )}
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button
                  className="button is-danger is-fullwidth"
                  disabled={!uploadedData.length}
                  onClick={handeClearPage}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="column is-half">
            {data.length > 0 && (
              <>
                <h3 className="subtitle">Preview:</h3>
                <TablePreview previewData={previewData} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoordinateInput;
