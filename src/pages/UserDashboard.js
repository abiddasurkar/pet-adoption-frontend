import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle, Trash2, User, Heart, AlertCircle, Search } from 'lucide-react';

export default function UserDashboard() {
  const { userApplications, isLoading, getUserApplications, withdrawApplication } = useContext(ApplicationsContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getUserApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'Rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    }
  };

  const handleWithdraw = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      await withdrawApplication(appId);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your adoption applications and find your perfect companion
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{userApplications.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Heart size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {userApplications.filter(app => app.status === 'Pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Approved</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {userApplications.filter(app => app.status === 'Approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart size={28} className="text-purple-600" />
              My Adoption Applications
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading your applications...</p>
              </div>
            </div>
          ) : userApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Applications Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md">
                You haven't applied to adopt any pets yet. Start your adoption journey today!
              </p>
              <Link
                to="/"
                className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Search size={20} />
                Browse Available Pets
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Pet Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hidden lg:table-cell">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hidden md:table-cell">
                      Admin Notes
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/pet/${app.petId}`}
                          className="group-hover:text-purple-600 transition-colors duration-200"
                        >
                          <div className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                            {app.petName}
                          </div>
                          <div className="text-sm text-gray-500 lg:hidden mt-1">
                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                        {new Date(app.appliedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                        {app.adminNotes ? (
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2">{app.adminNotes}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {app.status === 'Pending' && (
                          <button
                            onClick={() => handleWithdraw(app._id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-all duration-200 group/btn p-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                            <span className="font-medium">Withdraw</span>
                          </button>
                        )}
                        {app.status !== 'Pending' && (
                          <span className="text-gray-400 text-sm font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Ready to find your next furry friend?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Search size={20} />
            Browse All Pets
          </Link>
        </div>
      </div>
    </div>
  );
}