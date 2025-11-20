import React, { useContext, useEffect } from 'react';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { userApplications, isLoading, getUserApplications, withdrawApplication } = useContext(ApplicationsContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getUserApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-600" />;
      case 'Rejected':
        return <XCircle className="text-red-600" />;
      default:
        return <Clock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-success';
      case 'Rejected':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const handleWithdraw = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      await withdrawApplication(appId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Track your adoption applications here</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="spinner w-12 h-12"></div>
          </div>
        ) : userApplications.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-md">
            <p className="text-gray-600 text-lg mb-4">No applications yet</p>
            <a href="/" className="btn btn-primary">
              Browse Pets
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pet Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applied Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Admin Notes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <a href={`/pet/${app.petId}`} className="text-purple-600 font-semibold hover:underline">
                        {app.petName}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span className={`badge ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {app.adminNotes || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'Pending' && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={18} /> Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
