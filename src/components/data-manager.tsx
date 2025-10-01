'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  HardDrive,
  FileText,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DataManager() {
  const [stats, setStats] = useState<{
    totalSize: number;
    itemCount: number;
    largestItem: { key: string; size: number } | null;
    cacheHitRate: number;
  }>({
    totalSize: 0,
    itemCount: 0,
    largestItem: null,
    cacheHitRate: 0,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setStats(storage.getStorageStats());
  }, []);

  const refreshStats = () => {
    setStats(storage.getStorageStats());
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const backup = storage.exportData();
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashflicker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Created",
        description: "Your data has been exported successfully.",
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "Failed to create backup file.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup = e.target?.result as string;
        const success = storage.importData(backup);
        
        if (success) {
          toast({
            title: "Import Successful",
            description: "Your data has been restored successfully.",
          });
          refreshStats();
          // Refresh page to reload all components with new data
          window.location.reload();
        } else {
          throw new Error('Import failed');
        }
      } catch {
        toast({
          title: "Import Failed",
          description: "Failed to import backup file. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storage.clear();
      toast({
        title: "Data Cleared",
        description: "All local data has been removed.",
        variant: "destructive",
      });
      refreshStats();
      // Refresh page to reset all components
      window.location.reload();
    }
  };

  const handleCleanup = () => {
    storage.cleanup();
    toast({
      title: "Cleanup Complete",
      description: "Expired and invalid data has been removed.",
    });
    refreshStats();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storageUsagePercent = Math.min((stats.totalSize / (5 * 1024 * 1024)) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Management</h2>
          <p className="text-muted-foreground">
            Manage your local storage, backup data, and monitor performance
          </p>
        </div>
        <Button onClick={refreshStats} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Stats
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.itemCount} items stored
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storageUsagePercent.toFixed(1)}%</div>
                <Progress value={storageUsagePercent} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.cacheHitRate * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Performance metric
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Largest Item</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.largestItem ? formatBytes(stats.largestItem.size) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {stats.largestItem?.key || 'No data'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Storage Health</CardTitle>
              <CardDescription>
                Current status of your local data storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Storage system operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  {storageUsagePercent > 80 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {storageUsagePercent > 80 ? 'Storage usage high' : 'Storage usage normal'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Auto-cleanup enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </CardTitle>
                <CardDescription>
                  Create a backup of all your FlashFlicker data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? 'Exporting...' : 'Download Backup'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Exports notes, flashcards, progress, and settings as JSON
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Data</span>
                </CardTitle>
                <CardDescription>
                  Restore data from a previous backup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      disabled={isImporting}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                  </label>
                  {isImporting && <p className="text-sm text-muted-foreground">Importing...</p>}
                </div>
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Importing will replace all current data. Create a backup first.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cleanup Storage</CardTitle>
                <CardDescription>
                  Remove expired and invalid data entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCleanup} variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Run Cleanup
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Safe operation that only removes expired items
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clear All Data</CardTitle>
                <CardDescription>
                  Permanently delete all stored data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleClearAll} 
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This action cannot be undone. All data will be lost.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}