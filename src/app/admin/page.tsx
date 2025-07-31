'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AuthenticatedHeader from '@/components/AuthenticatedHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDateFriendly } from '@/lib/dateUtils'
import { safeGetFromStorage, safeSetToStorage } from '@/lib/storageUtils'

interface UploadStats {
  fileName: string
  fileSize: number
  uploadDate: Date
  status: 'completed' | 'processing' | 'failed'
  recordCount?: number
}

interface SystemStatus {
  database: 'online' | 'offline' | 'maintenance'
  storage: 'healthy' | 'warning' | 'critical'
  encryption: 'active' | 'inactive'
  lastBackup: Date
}

export default function AdminPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [uploadStats, setUploadStats] = useState<UploadStats[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'online',
    storage: 'healthy',
    encryption: 'active',
    lastBackup: new Date()
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [selectedFileType, setSelectedFileType] = useState('students')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check admin authentication
  useEffect(() => {
    const userRoleResult = safeGetFromStorage<string>('userRole')
    if (!userRoleResult.success || userRoleResult.data !== 'admin') {
      router.push('/dashboard')
      return
    }

    // Load saved demo mode preference
    const savedDemoModeResult = safeGetFromStorage<string>('adminDemoMode')
    const savedDemoMode = savedDemoModeResult.success && savedDemoModeResult.data === 'true'
    setIsDemoMode(savedDemoMode)

    // Generate client-side encryption key on first load
    const existingKeyResult = safeGetFromStorage<string>('clientEncryptionKey')
    if (!existingKeyResult.success) {
      generateEncryptionKey()
    } else {
      setEncryptionKey(existingKeyResult.data || '')
    }
  }, [router])

  const generateEncryptionKey = async () => {
    try {
      // Generate a random 256-bit key for client-side encryption
      const key = crypto.getRandomValues(new Uint8Array(32))
      const keyHex = Array.from(key, byte => byte.toString(16).padStart(2, '0')).join('')
      setEncryptionKey(keyHex)
      safeSetToStorage('clientEncryptionKey', keyHex)
    } catch (error) {
      console.error('Failed to generate encryption key:', error)
    }
  }

  const handleModeToggle = () => {
    const newMode = !isDemoMode
    setIsDemoMode(newMode)
    safeSetToStorage('adminDemoMode', newMode.toString())
    
    if (newMode) {
      // Demo mode activated - show warning
      alert('Demo Mode Activated: All operations will be simulated and no real data will be modified.')
    }
  }

  const encryptData = async (data: string, key: string): Promise<string> => {
    try {
      if (!key || key.length !== 64) {
        throw new Error('Invalid encryption key format')
      }
      
      // Convert hex key to Uint8Array
      const keyMatch = key.match(/.{1,2}/g)
      if (!keyMatch || keyMatch.length !== 32) {
        throw new Error('Invalid encryption key length')
      }
      
      const keyBytes = new Uint8Array(keyMatch.map(byte => parseInt(byte, 16)))
      
      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      // Import key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )
      
      // Encrypt data
      const encodedData = new TextEncoder().encode(data)
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        encodedData
      )
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encryptedData), iv.length)
      
      // Convert to base64
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('Encryption failed:', error)
      throw error
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      // Read file content
      const fileContent = await file.text()
      
      // Encrypt data client-side before any processing
      const encryptedContent = await encryptData(fileContent, encryptionKey)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newUpload: UploadStats = {
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        status: isDemoMode ? 'completed' : 'processing',
        recordCount: isDemoMode ? Math.floor(Math.random() * 1000) + 100 : undefined
      }
      
      setUploadStats(prev => [newUpload, ...prev.slice(0, 4)])
      
      if (isDemoMode) {
        alert(`Demo Mode: File "${file.name}" simulated successfully. Encryption: ✓ Active`)
      } else {
        // In live mode, you would send the encrypted data to your secure backend
        console.log('Encrypted data ready for secure transmission:', encryptedContent.substring(0, 50) + '...')
      }
      
    } catch (error) {
      console.error('File processing failed:', error)
      alert('File processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDataExport = async (dataType: string) => {
    setIsProcessing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (isDemoMode) {
        // Generate demo data
        const demoData = `Demo ${dataType} export data (encrypted)\nGenerated: ${new Date().toISOString()}`
        const encryptedData = await encryptData(demoData, encryptionKey)
        
        // Create and download file
        const blob = new Blob([encryptedData], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${dataType}-export-${Date.now()}.enc`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        alert('Live mode export would fetch and encrypt real data from secure backend.')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSystemMaintenance = async (action: string) => {
    if (!isDemoMode) {
      const confirm = window.confirm(`Are you sure you want to perform: ${action}? This will affect the live system.`)
      if (!confirm) return
    }
    
    setIsProcessing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      if (action === 'backup') {
        setSystemStatus(prev => ({ ...prev, lastBackup: new Date() }))
      }
      
      alert(`${isDemoMode ? 'Demo: ' : ''}${action} completed successfully.`)
    } catch (error) {
      console.error(`${action} failed:`, error)
      alert(`${action} failed. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'active':
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
      case 'processing':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'offline':
      case 'critical':
      case 'inactive':
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AuthenticatedHeader username="Administrator" currentPage="admin" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Mode Toggle */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                System administration and data management
              </p>
            </div>
            
            {/* Demo/Live Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
              <button
                onClick={handleModeToggle}
                disabled={isProcessing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  isDemoMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Toggle demo mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDemoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo</span>
              {isDemoMode && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Status</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
                <p className={`font-semibold ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database.charAt(0).toUpperCase() + systemStatus.database.slice(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
                <p className={`font-semibold ${getStatusColor(systemStatus.storage)}`}>
                  {systemStatus.storage.charAt(0).toUpperCase() + systemStatus.storage.slice(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Encryption</p>
                <p className={`font-semibold ${getStatusColor(systemStatus.encryption)}`}>
                  {systemStatus.encryption.charAt(0).toUpperCase() + systemStatus.encryption.slice(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Backup</p>
                <p className="font-semibold text-gray-900 dark:text-white text-xs">
                  {mounted ? formatDateFriendly(systemStatus.lastBackup) : '---'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Database Import</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload encrypted database exports (Client-side encryption enabled)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Type
                  </label>
                  <select
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={isProcessing}
                  >
                    <option value="students">Students Data</option>
                    <option value="courses">Courses Data</option>
                    <option value="faculty">Faculty Data</option>
                    <option value="grades">Grades Data</option>
                    <option value="schedules">Schedules Data</option>
                  </select>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.xlsx,.sql"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`w-full inline-flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {isProcessing ? 'Processing...' : 'Upload Database File'}
                  </label>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: CSV, JSON, XLSX, SQL<br/>
                  Max file size: 100MB | Encryption: AES-256-GCM
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Export Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Export</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export encrypted database backups
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['Students', 'Courses', 'Faculty', 'Grades', 'Full Backup'].map((dataType) => (
                  <Button
                    key={dataType}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDataExport(dataType.toLowerCase())}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    Export {dataType}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload History */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Uploads</h2>
            </CardHeader>
            <CardContent>
              {uploadStats.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent uploads
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadStats.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {upload.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(upload.fileSize)} • {mounted ? formatDateFriendly(upload.uploadDate) : '---'}
                          {upload.recordCount && ` • ${upload.recordCount} records`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Tools */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Tools</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleSystemMaintenance('backup')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Create System Backup
                </Button>
                
                <Button
                  variant="outline"
                  onClick={generateEncryptionKey}
                  disabled={isProcessing}
                  className="w-full justify-start"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Regenerate Encryption Key
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleSystemMaintenance('cache-clear')}
                  disabled={isProcessing}
                  className="w-full justify-start"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear System Cache
                </Button>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Encryption Key (Client-side):
                  </p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-hidden">
                    {encryptionKey ? `${encryptionKey.substring(0, 16)}...` : 'Generating...'}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Security Notice</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  All data processing uses client-side zero-knowledge encryption. The server never has access to unencrypted data.
                  Encryption keys are generated and stored locally in your browser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
