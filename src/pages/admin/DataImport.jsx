import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download, File, Trash2, RefreshCw } from 'lucide-react';

const DataImport = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImport = () => {
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      setImporting(false);
      setImportResults({
        total: 150,
        success: 142,
        failed: 5,
        skipped: 3,
        errors: [
          { row: 23, field: 'phone', message: 'Invalid phone format' },
          { row: 45, field: 'email', message: 'Duplicate email address' },
          { row: 67, field: 'hours', message: 'Invalid hours format' },
          { row: 89, field: 'cuisine', message: 'Unknown cuisine type' },
          { row: 102, field: 'location', message: 'Missing required field' },
        ],
      });
      setUploadedFiles(uploadedFiles.map(f => ({ ...f, status: 'completed' })));
    }, 3000);
  };

  const importTemplates = [
    { name: 'Restaurants Template', description: 'Import restaurant listings with all details', filename: 'restaurants_template.csv' },
    { name: 'Cuisines Template', description: 'Import or update cuisine categories', filename: 'cuisines_template.csv' },
    { name: 'Delivery Providers Template', description: 'Import delivery provider data', filename: 'providers_template.csv' },
    { name: 'Users Template', description: 'Bulk import user accounts', filename: 'users_template.csv' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-600 mt-1">Bulk import restaurants, users, and other data from CSV files</p>
      </div>

      {/* Import Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Download Templates</h2>
        <p className="text-gray-600 mb-4">Use these templates to ensure your data is formatted correctly for import.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {importTemplates.map((template) => (
            <div key={template.name} className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                </div>
              </div>
              <button className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-900">
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-500 mt-1">or click to browse</p>
          <p className="text-sm text-gray-400 mt-2">Supports CSV, XLSX, XLS (max 10MB)</p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium text-gray-900">Uploaded Files</h3>
            {uploadedFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <File className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'pending' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  )}
                  {file.status === 'completed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setUploadedFiles([])}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={handleImport}
                disabled={importing || uploadedFiles.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Start Import
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Import Results</h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            <div className="p-6 text-center border-r border-gray-200">
              <p className="text-3xl font-bold text-gray-900">{importResults.total}</p>
              <p className="text-sm text-gray-500 mt-1">Total Records</p>
            </div>
            <div className="p-6 text-center border-r border-gray-200">
              <p className="text-3xl font-bold text-green-600">{importResults.success}</p>
              <p className="text-sm text-gray-500 mt-1">Successful</p>
            </div>
            <div className="p-6 text-center border-r border-gray-200">
              <p className="text-3xl font-bold text-red-600">{importResults.failed}</p>
              <p className="text-sm text-gray-500 mt-1">Failed</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">{importResults.skipped}</p>
              <p className="text-sm text-gray-500 mt-1">Skipped</p>
            </div>
          </div>

          {/* Errors */}
          {importResults.errors.length > 0 && (
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Errors ({importResults.errors.length})
              </h3>
              <div className="space-y-2">
                {importResults.errors.map((error, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 bg-red-50 rounded-lg text-sm"
                  >
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-red-700">
                      <strong>Row {error.row}</strong> - {error.field}: {error.message}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary hover:underline flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download Error Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">Import Instructions</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium shrink-0">1</span>
            <span>Download the appropriate template for the data you want to import</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium shrink-0">2</span>
            <span>Fill in the template with your data, ensuring all required fields are complete</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium shrink-0">3</span>
            <span>Save the file as CSV or keep it as Excel format</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium shrink-0">4</span>
            <span>Upload the file and review any errors before finalizing the import</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataImport;
