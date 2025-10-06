import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Upload, Download, Trash2, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ZipFile {
  name: string;
  path: string;
  url: string;
  size?: number;
  created_at?: string;
}

const ZipStash: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [files, setFiles] = useState<ZipFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<File | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDeletePath, setFileToDeletePath] = useState<string | null>(null);

  const BUCKET_NAME = 'zip-stash';

  // Auto-clear status messages after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

const fetchFiles = async () => {
  console.log("Fetching files...");
  setLoadingFiles(true);
  try {
    const { data: fileList, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 100, offset: 0 });

    if (error) {
      console.error('Fetch error:', error);
      setFiles([]);
      return;
    }

    console.log("fileList:", fileList);

    // Filter out the empty folder placeholder
    const filteredFileList = fileList.filter(file => file.name !== '.emptyFolderPlaceholder');

    const zipFiles = await Promise.all(
      filteredFileList.map(async (file) => {
        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);

        const publicUrl = data?.publicUrl || 'N/A';

        return {
          name: file.name,
          path: file.name,
          url: publicUrl,
          size: file.metadata?.size || undefined,
          created_at: file.created_at || undefined,
        };
      })
    );

    console.log("ZIPFILES:", zipFiles);
    setFiles(zipFiles);
  } catch (error) {
    console.error('Error in fetchFiles:', error);
    setFiles([]);
  } finally {
    setLoadingFiles(false);
  }
};

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchFiles();
    }
  }, [isUnlocked]);

  const handleUnlock = async () => {
    if (!password.trim()) {
      setErrorMessage('Please enter a password');
      return;
    }

    try {
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'silent',
          mode: 'zip-stash',
          pass: password,
        }),
      });

      const responseText = await response.text();

      if (responseText.trim() === 'Accepted') {
        setIsUnlocked(true);
        setShowPasswordModal(false);
        setErrorMessage('');
        setStatusMessage('Unlocked 🔓');
        setStatusType('success');
        setPassword('');
        await fetchFiles();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage('');
          setStatusType('');
        }, 3000);
      } else if (responseText.trim() === 'Rejected') {
        setErrorMessage('Access Denied ❌');
        setStatusMessage('Access Denied ❌');
        setStatusType('error');
        setPassword('');
      } else {
        setErrorMessage('Connection error. Please try again.');
        setStatusMessage('Connection error. Please try again.');
        setStatusType('error');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during unlock:', error);
      setErrorMessage('Connection error. Please try again.');
      setStatusMessage('Connection error. Please try again.');
      setStatusType('error');
      setPassword('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear any existing status messages
    setStatusMessage('');
    setStatusType('');
    
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setSelectedFileForUpload(file);
    } else {
      setStatusMessage('Please select a .zip file');
      setStatusType('error');
      event.target.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFileForUpload) {
      setStatusMessage('Please select a file first');
      setStatusType('error');
      return;
    }

    setUploadingFile(true);
    try {
      const timestamp = Date.now();
      const filePath = `${timestamp}-${selectedFileForUpload.name}`;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFileForUpload);

      if (error) {
        setStatusMessage('Upload failed: ' + error.message);
        setStatusType('error');
      } else {
        setStatusMessage('File uploaded successfully!');
        setStatusType('success');
        setSelectedFileForUpload(null);
        // Reset the file input
        const fileInput = document.getElementById('zip-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        await fetchFiles();
      }
    } catch (error) {
      setStatusMessage('Upload failed. Please try again.');
      setStatusType('error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = (filePath: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    setFileToDeletePath(filePath);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!fileToDeletePath) return;

    const filePath = fileToDeletePath;
    setDeletingFile(filePath);
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        setStatusMessage('Delete failed: ' + error.message);
        setStatusType('error');
      } else {
        setStatusMessage('File deleted successfully!');
        setStatusType('success');
        await fetchFiles();
      }
    } catch (error) {
      setStatusMessage('Delete failed. Please try again.');
      setStatusType('error');
    } finally {
      setDeletingFile(null);
      setShowDeleteConfirm(false);
      setFileToDeletePath(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFileToDeletePath(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getCleanFileName = (fileName: string) => {
    // Remove timestamp prefix (e.g., "1753838676209-sweepFINAL.zip" -> "sweepFINAL.zip")
    const match = fileName.match(/^\d+-(.+)$/);
    return match ? match[1] : fileName;
  };
  return (
    <div className="relative">
      {/* Main ZipStash Container */}
      <div 
        className="bg-slate-800/60 border border-slate-400/30 backdrop-blur-sm p-6 relative"
        style={{
          boxShadow: '0 0 30px rgba(148, 163, 184, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.8)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
            <h2 className="text-slate-300 font-mono text-xl font-bold tracking-wider">
              ZIPSTASH: SECURE FILE VAULT
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-slate-400/60 font-mono text-sm">
            <span>{files.length} FILES</span>
            <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span>{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
          </div>
        </div>

        {/* Loading State */}
        {loadingFiles && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-slate-400/40 border-t-slate-300 rounded-full animate-spin"></div>
              <span className="text-slate-300 font-mono text-sm">SCANNING VAULT...</span>
            </div>
          </div>
        )}

        {/* Files List */}
        {!loadingFiles && (
          <div className="flex space-x-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {files.map((file, index) => (
              <div 
                key={file.path}
               className="flex-shrink-0 w-64 p-4 bg-slate-700/40 border border-slate-500/30 backdrop-blur-sm content-fade-in-up hover-lift"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-blue-400 font-mono text-3xl">📦</div>
                  <div className="w-full">
                    <div className="text-slate-300 font-mono text-sm font-bold truncate">
                      {getCleanFileName(file.name)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full justify-center">
                  {isUnlocked ? (
                    <>
                      <a
                        href={file.url}
                        download={file.name}
                          className="group p-2 border border-green-500/40 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 flex-1 flex justify-center button-press"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
                      >
                        <Download className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                      </a>
                      <button
                        onClick={(e) => handleDelete(file.path, e)}
                        disabled={deletingFile === file.path}
                          className="group p-2 border border-red-500/40 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 disabled:opacity-50 flex-1 flex justify-center button-press"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
                      >
                        {deletingFile === file.path ? (
                          <div className="w-4 h-4 border border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                        )}
                      </button>
                    </>
                  ) : (
                      <div className="text-slate-400/40 font-mono text-xs px-3 py-1 border border-slate-500/20 w-full text-center">
                      LOCKED
                    </div>
                  )}
                </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Section (Only visible when unlocked) */}
        {isUnlocked && (
          <div 
            className="border-t border-slate-500/30 pt-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-mono text-sm font-bold">UPLOAD NEW FILE</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                id="zip-upload"
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="flex-1 bg-slate-700/40 border border-slate-500/40 rounded-sm px-3 py-2 text-slate-300 font-mono mobile-input focus:border-slate-400 focus:outline-none transition-colors duration-300 input-focus-glow"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFileForUpload || uploadingFile}
                className="group px-4 py-2 border border-blue-500/40 bg-blue-900/20 hover:bg-blue-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm button-press hover-lift"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <div className="flex items-center space-x-2">
                  {uploadingFile ? (
                    <div className="w-4 h-4 border border-blue-400/40 border-t-blue-300 rounded-full enhanced-spinner"></div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span className="text-blue-400 group-hover:text-blue-300">
                    {uploadingFile ? 'UPLOADING...' : 'UPLOAD'}
                  </span>
                </div>
              </button>
            </div>
            
            {selectedFileForUpload && (
              <div className="mt-3 text-slate-400/60 font-mono text-xs">
                Selected: {selectedFileForUpload.name} ({formatFileSize(selectedFileForUpload.size)})
              </div>
            )}
          </div>
        )}

        {/* Lock Icon Button - Bottom Right */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="absolute bottom-4 right-4 group p-3 border border-slate-400/40 bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-300 backdrop-blur-sm"
          style={{
            boxShadow: '0 0 15px rgba(148, 163, 184, 0.3)',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          }}
        >
          {isUnlocked ? (
            <Unlock className="w-5 h-5 text-green-400 group-hover:text-green-300" />
          ) : (
            <Lock className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          )}
          <div className="absolute inset-0 border border-slate-300/0 group-hover:border-slate-300/20 transition-all duration-300"
               style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}></div>
        </button>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-slate-400/40 animate-pulse"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-slate-400/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-slate-400/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-slate-800 border border-slate-400/50 p-6 w-full max-w-md mx-4"
            style={{
              boxShadow: '0 0 50px rgba(148, 163, 184, 0.4), inset 0 0 50px rgba(0, 0, 0, 0.8)',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-slate-300 font-mono text-lg font-bold">CONFIRM DELETION</h3>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="mb-6">
              <p className="text-slate-300 font-mono text-sm mb-2">
                Are you sure you want to delete this file?
              </p>
              <div className="bg-slate-700/40 border border-slate-500/30 p-3 rounded-sm">
                <p className="text-slate-400 font-mono text-xs truncate">
                  {fileToDeletePath ? getCleanFileName(fileToDeletePath) : ''}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 group px-4 py-3 border border-slate-500/40 bg-slate-700/40 hover:bg-slate-600/40 transition-all duration-300 font-mono text-sm button-press"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <span className="text-slate-400 group-hover:text-slate-300">
                  CANCEL
                </span>
              </button>
              <button
                onClick={executeDelete}
                disabled={deletingFile === fileToDeletePath}
                className="flex-1 group px-4 py-3 border border-red-500/40 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 disabled:opacity-50 font-mono text-sm button-press"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  {deletingFile === fileToDeletePath ? (
                    <div className="w-4 h-4 border border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="text-red-400 group-hover:text-red-300">
                    {deletingFile === fileToDeletePath ? 'DELETING...' : 'DELETE'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Message Display */}
      {statusMessage && (
        <div className={`mt-4 flex items-center space-x-2 p-3 border rounded-sm ${
          statusType === 'success' 
            ? 'bg-green-900/20 border-green-500/40' 
            : 'bg-red-900/20 border-red-500/40'
        }`}>
          <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
            statusType === 'success' ? 'text-green-400' : 'text-red-400'
          }`} />
          <span className={`font-mono text-sm ${
            statusType === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>{statusMessage}</span>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-slate-800 border border-slate-400/50 p-6 w-full max-w-md mx-4"
            style={{
              boxShadow: '0 0 50px rgba(148, 163, 184, 0.4), inset 0 0 50px rgba(0, 0, 0, 0.8)',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-slate-400" />
                <h3 className="text-slate-300 font-mono text-lg font-bold">VAULT ACCESS</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setErrorMessage('');
                  setPassword('');
                }}
                className="group p-2 border border-slate-500/40 bg-slate-700/40 hover:bg-slate-600/40 transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
              >
                <X className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
              </button>
            </div>

            {/* Password Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">Enter Access Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                  className="w-full bg-slate-700/60 border border-slate-500/40 rounded-sm px-4 py-3 text-slate-300 font-mono mobile-input focus:border-slate-400 focus:outline-none transition-colors duration-300 input-focus-glow"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/40 rounded-sm">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 font-mono text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className={`flex items-center space-x-2 p-3 border rounded-sm ${
                  statusType === 'success' 
                    ? 'bg-green-900/20 border-green-500/40' 
                    : 'bg-red-900/20 border-red-500/40'
                }`}>
                  <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                    statusType === 'success' ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <span className={`font-mono text-sm ${
                    statusType === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>{statusMessage}</span>
                </div>
              )}
              {/* Submit Button */}
              <button
                onClick={handleUnlock}
                className="w-full group px-4 py-3 border border-green-500/40 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 font-mono text-sm font-bold button-press hover-lift"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Unlock className="w-4 h-4" />
                  <span className="text-green-400 group-hover:text-green-300">
                    UNLOCK VAULT
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipStash;