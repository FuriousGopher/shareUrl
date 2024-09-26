import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [fileName, setFileName] = useState('one/one.pdf');
  const [doctorId, setDoctorId] = useState('1q0TnQvMiVUjO0eSBHMUk2ZDPfA3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVKQVdrNlR3U0Jib00yTVdTS3laeVN6a3BCUDIiLCJlbWFpbCI6InVlc2VydGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcyNzM0NTUxMywiZXhwIjoxNzI3NjI2MzEzfQ.r3C0-Qef7jecfMkWkRBAlZMzmyzgKeXIx9egzcjbBok';

  const handleDownload = async () => {
    setError('');

    if (!fileName || !doctorId) {
      setError('Please provide both File Name and Doctor ID.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
          'https://europe-central2-rdee-go.cloudfunctions.net/generateShareableUrl',
          { fileName, doctorId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          }
      );

      const contentDisposition = response.headers['content-disposition'];
      let actualFileName = fileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          actualFileName = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', actualFileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError(
          err.response?.data?.message || 'An error occurred while downloading the file.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setError('');

    if (!fileName || !doctorId) {
      setError('Please provide both File Name and Doctor ID.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
          'https://europe-central2-rdee-go.cloudfunctions.net/generateShareableUrl',
          { fileName, doctorId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          }
      );

      const contentDisposition = response.headers['content-disposition'];
      let actualFileName = fileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          actualFileName = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);
    } catch (err) {
      console.error('Error opening file:', err);
      setError(
          err.response?.data?.message || 'An error occurred while opening the file.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
      <>
        <div className="download-section">
          <h2>Download File</h2>
          <div className="input-group">
            <label htmlFor="fileName">File Name:</label>
            <input
                type="text"
                id="fileName"
                value={fileName}
                onChange={(e)=>setFileName(e.target.value)}
                placeholder="Enter file name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="doctorId">Doctor ID:</label>
            <input
                type="text"
                id="doctorId"
                value={doctorId}
                onChange={(e)=>setDoctorId(e.target.value)}
                placeholder="Enter doctor ID"
            />
          </div>
          {error&&<p className="error">{error}</p>}
          <button onClick={handleDownload} disabled={loading}>
            {loading?'Downloading...':'Download'}
          </button>
          <p></p>
          <button onClick={handleOpen} disabled={loading}>
            {loading?'Opening...':'Open File'}
          </button>
        </div>
      </>
  );
}

export default App;
