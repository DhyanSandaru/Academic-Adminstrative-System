// client/src/components/HandleBackup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArchiveRestore, RotateCcw, SearchCode, Trash } from 'lucide-react';

function HandleBackup() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  // Change this to match your backend URL
  const API_URL = 'http://localhost:8000/api/backup';

  // Fetch all backups
  const fetchBackups = async () => {
    console.log('🔍 Fetching backups...');
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/list`, {
        timeout: 5000 // 5 second timeout
      });
      console.log('✅ Backups fetched:', res.data);
      setBackups(res.data.backups || []);
    } catch (err) {
      console.error('❌ Failed to fetch backups:', err);
      setError('Failed to load backups: ' + (err.response?.data?.message || err.message));
      setBackups([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    console.log('📦 HandleBackup component mounted');
    fetchBackups();
  }, []); // Empty dependency array - only run once on mount

  // Create new backup
  const handleCreateBackup = async () => {
    if (!window.confirm('Create a new backup? This may take a few moments.')) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/create`,{excludeTable: ""});
      alert(`Backup created successfully!\nBackup ID: ${res.data.backupId}`);
      await fetchBackups();
    } catch (err) {
      console.error('Backup failed:', err);
      alert('Failed to create backup: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Restore from backup
  const handleRestore = async (backupId) => {
    if (!window.confirm(`⚠️ WARNING: This will overwrite all current data!\n\nRestore from backup: ${backupId}?`)) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/restore/${backupId}`);
      alert('Database restored successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Restore failed:', err);
      alert('Failed to restore: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete backup
  const handleDelete = async (backupId) => {
    if (!window.confirm(`Delete backup: ${backupId}?`)) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${backupId}`);
      alert('Backup deleted successfully!');
      await fetchBackups();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete backup: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // View backup details
  const handleViewDetails = async (backupId) => {
    try {
      const res = await axios.get(`${API_URL}/details/${backupId}`);
      setSelectedBackup({ id: backupId, ...res.data });
      setShowDetails(true);
    } catch (err) {
      console.error('Failed to fetch details:', err);
      alert('Failed to load backup details');
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'completed_with_errors': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="p-6 bg-white rounded-xl w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading backups...</p>
        </div>
      </div>
    );
  }

  // Show error state if initial fetch failed
  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBackups}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-6xl mx-auto">
      Header
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Database Backups</h2>
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          {loading ? (
            <div className='flex flex-row'>
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Processing...</p>
            </div>
        ) 
          : (
            <div className='flex flex-row gap-2'>
              <ArchiveRestore/>
              <span>Create Backup</span>
            </div>
        )}
        </button>
      </div>

      {/* Backups List */}
      <div className="space-y-4">
        {backups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No backups found</p>
            <p className="text-sm">Create your first backup to get started</p>
          </div>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.backupId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {backup.backupId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(backup.status)}`}>
                      {backup.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 Created: {formatDate(backup.timestamp)}</p>
                    <p>📊 Tables: {Object.keys(backup.tables || {}).length}</p>
                    {backup.errors && backup.errors.length > 0 && (
                      <p className="text-red-600">⚠️ {backup.errors.length} error(s)</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(backup.backupId)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition flex flex-row gap-2"
                  >
                    <SearchCode/>
                    Details
                  </button>
                  <button
                    onClick={() => handleRestore(backup.backupId)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition flex flex-row gap-2"
                  >
                    <RotateCcw/>
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(backup.backupId)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition flex flex-row gap-2"
                  >
                    <Trash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Backup Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Backup ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded text-black">{selectedBackup.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBackup.status)}`}>
                  {selectedBackup.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="font-semibold text-black">{formatDate(selectedBackup.timestamp)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Tables</p>
                <div className="space-y-2">
                  {Object.entries(selectedBackup.tables || {}).map(([tableName, info]) => (
                    <div key={tableName} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{tableName}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          info.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {info.status}
                        </span>
                      </div>
                      {info.rowCount !== undefined && (
                        <p className="text-sm text-gray-600 mt-1">Rows: {info.rowCount}</p>
                      )}
                      {info.error && (
                        <p className="text-sm text-red-600 mt-1">{info.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedBackup.errors && selectedBackup.errors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Errors</p>
                  <div className="space-y-2">
                    {selectedBackup.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-sm font-semibold text-red-700">
                          {error.table || error.type}
                        </p>
                        <p className="text-sm text-red-600">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandleBackup;