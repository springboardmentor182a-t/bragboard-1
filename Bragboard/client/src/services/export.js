import api from './api';

export const exportData = {
    // Returns a blob for file download
    downloadReport: (filters = {}) => api.get('/export/report', {
        params: filters,
        responseType: 'blob'
    }),
};
