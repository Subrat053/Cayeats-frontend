import { useState, useEffect } from "react";
import {
  getAllReports,
  updateReportStatus,
  replyToReport,
  deleteReport,
  getReportsByStatus,
} from "../../api/adminService";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyData, setReplyData] = useState({
    adminReply: "",
    adminNotes: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const statusColors = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-blue-100 text-blue-800",
    closed: "bg-green-100 text-green-800",
  };

  const statusIcons = {
    open: AlertCircle,
    "in-progress": Clock,
    resolved: MessageSquare,
    closed: CheckCircle2,
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let data;
      if (filterStatus === "all") {
        data = await getAllReports();
      } else {
        data = await getReportsByStatus(filterStatus);
      }
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setReplyData({
      adminReply: report.adminReply || "",
      adminNotes: report.adminNotes || "",
    });
    setShowModal(true);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      setActionLoading(true);
      await updateReportStatus(reportId, newStatus);
      fetchReports();
      if (selectedReport?._id === reportId) {
        setSelectedReport((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert("Failed to update status: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyData.adminReply.trim()) {
      alert("Reply message is required");
      return;
    }

    try {
      setActionLoading(true);
      const updated = await replyToReport(
        selectedReport._id,
        replyData.adminReply,
        replyData.adminNotes,
      );
      setSelectedReport(updated);
      setReports((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r)),
      );
      alert("Reply sent successfully!");
    } catch (error) {
      alert("Failed to send reply: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      setActionLoading(true);
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      if (selectedReport?._id === reportId) {
        setShowModal(false);
        setSelectedReport(null);
      }
    } catch (error) {
      alert("Failed to delete report: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Reports & Issues
        </h1>
        <p className="text-gray-600">
          Manage user reports and provide support responses
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Reports</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <span className="text-sm text-gray-600 ml-auto">
          Total: {reports.length} report{reports.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reports found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Issue Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => {
                  const StatusIcon = statusIcons[report.status] || AlertCircle;
                  return (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {report.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {report.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {report.issueType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[report.status] || statusColors.open
                            }`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1).replace("-", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Report Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Reporter Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Reporter Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issue Type</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.issueType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedReport.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Issue Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              {/* Status & Controls */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Status & Controls
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedReport.status}
                    onChange={(e) =>
                      handleStatusChange(selectedReport._id, e.target.value)
                    }
                    disabled={actionLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  {selectedReport.repliedAt && (
                    <p className="text-xs text-gray-600">
                      Last reply:{" "}
                      {new Date(selectedReport.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Existing Reply */}
              {selectedReport.adminReply && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Response
                  </h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {selectedReport.adminReply}
                  </p>
                  {selectedReport.adminNotes && (
                    <div className="text-sm">
                      <p className="text-gray-600 font-medium">
                        Internal Notes:
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedReport.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {selectedReport.status !== "closed" && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Send Response to User
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Response Message *
                      </label>
                      <textarea
                        value={replyData.adminReply}
                        onChange={(e) =>
                          setReplyData((prev) => ({
                            ...prev,
                            adminReply: e.target.value,
                          }))
                        }
                        placeholder="Write your response to the user..."
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Internal Notes (optional)
                      </label>
                      <textarea
                        value={replyData.adminNotes}
                        onChange={(e) =>
                          setReplyData((prev) => ({
                            ...prev,
                            adminNotes: e.target.value,
                          }))
                        }
                        placeholder="Internal notes for admin reference only..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleReply}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
                      >
                        {actionLoading ? "Sending..." : "Send Response"}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedReport._id, "closed")
                        }
                        disabled={actionLoading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                      >
                        Mark as Closed
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedReport._id)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Report
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
