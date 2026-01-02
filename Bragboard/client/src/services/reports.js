import api from './api';

export const reports = {
    create: (data) => api.post('/reports/', data),
    getMyReports: () => api.get('/reports/my'),
    getAllReports: (status = null) => {
        const query = status ? `?status=${status}` : '';
        return api.get(`/reports/admin${query}`);
    },
    resolve: (id, data) => api.put(`/reports/admin/${id}/resolve`, data),
};
