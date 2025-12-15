import React, { useState } from 'react';
import axios from 'axios';

export default function ExportReports() {
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'http://127.0.0.1:8000/export_reports';

  const handleExport = async (format) => {
    if (!department || !fromDate || !toDate) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.get(BASE_URL, {
        params: { department, from_date: fromDate, to_date: toDate, format },
        responseType: 'blob'
      });

      const blob = new Blob([resp.data], { type: resp.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shoutouts_${department}_${fromDate}_${toDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed. Check backend or console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Page heading */}
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Export Reports</h1>

      {/* Card */}
      <div
        style={{
          width: '800px',
          height: '250px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="field">
          <label>Department</label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="">-- Select Department --</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="date-fields" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>From Date</label>
            <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            style={{ width: '90%', padding: '8px', marginTop: '4px' }}
            />
          </div>
         <div style={{ flex: 1 }}>
          <label>To Date</label> 
          <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          style={{ width: '90%', padding: '8px', marginTop: '3px' }} 
          />
         </div>
        </div>


        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <button
            className="btn btn-primary"
            onClick={() => handleExport('csv')}
            disabled={loading}
            style={{ flex: 1, marginRight: 8 }}
          >
            {loading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleExport('pdf')}
            disabled={loading}
            style={{ flex: 1, marginLeft: 8 }}
          >
            {loading ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
} 