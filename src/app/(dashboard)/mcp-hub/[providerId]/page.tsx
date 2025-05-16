'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiAlertCircle, FiLoader, FiStar, FiBox, FiDownloadCloud, FiSettings, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MCPProvider, fetchMCPProviderAPI } from '@/data/mockMcpServers';
import { MCPTool, fetchMCPToolsByProviderAPI } from '@/data/mockMcpTools';
import Image from 'next/image';

const MCPProviderDetailPage = () => {
  const params = useParams();
  const providerId = params.providerId as string;
  
  const [provider, setProvider] = useState<MCPProvider | null>(null);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // 处理设置按钮点击
  const handleSettings = () => {
    setShowSettingsModal(true);
  };
  
  // 关闭设置模态框
  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const providerData = await fetchMCPProviderAPI(providerId);
        if (!providerData) {
          throw new Error('MCP provider not found');
        }
        setProvider(providerData);
        
        const toolsData = await fetchMCPToolsByProviderAPI(providerId);
        setTools(toolsData);
        if (toolsData.length > 0) {
          setActiveToolId(toolsData[0].id);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data. Please try again later');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [providerId]);

  // Get the active tool details
  const activeTool = tools.find(tool => tool.id === activeToolId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="ml-2">Loading MCP provider information...</p>
      </div>
    );
  }
  
  if (error || !provider) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-4xl text-error mb-4" />
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
        <p className="text-base-content/80">{error || 'MCP provider not found'}</p>
        <Link href="/mcp-hub" className="btn btn-primary mt-4">
          <FiArrowLeft className="mr-2" />
          Back to MCP Hub
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      {/* Back button */}
      <Link href="/mcp-hub" className="btn btn-outline mb-4">
        <FiArrowLeft className="mr-2" />
        Back to MCP Hub
      </Link>
      
      {/* Provider info */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Image src={provider.icon} alt={`${provider.name} icon`} width={48} height={48} className="rounded-lg" />
                  <h1 className="text-3xl font-bold text-base-content">{provider.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge badge-lg badge-primary flex items-center gap-1">
                    <FiStar /> {provider.rating.toFixed(1)}
                  </div>
                  <span className="badge badge-lg badge-outline">{provider.version}</span>
                </div>
              </div>
              
              <p className="mt-4 text-base-content/80 text-lg">{provider.description}</p>
              
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <FiBox className="text-primary" />
                  <span>MCP Tools: {tools.length}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {provider.categories.map(category => (
                  <span key={category} className="badge badge-outline">{category}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Server Description</h2>
            <p className="text-base-content/80">{provider.longDescription}</p>
          </div>

          <div className="mt-8 flex justify-end">
            {provider.installed ? (
              <div className="flex items-center gap-3">
                <div className="badge badge-lg badge-success py-4 px-4">
                  ✓ Installed
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleSettings}
                >
                  <FiSettings className="mr-2" /> Settings
                </button>
              </div>
            ) : (
              <button className="btn btn-primary">
                <FiDownloadCloud className="mr-2" /> Get Server
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* MCP Tools Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-6">Available MCP Tools</h2>
          
          {tools.length === 0 ? (
            <div className="text-center py-12 bg-base-200/30 rounded-lg border border-base-300">
              <p className="text-base-content/70">No MCP tools available from this server</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tool list sidebar */}
              <div className="bg-base-200/30 border border-base-300 rounded-lg p-4 h-min">
                <h3 className="font-medium mb-3 text-lg">Tools</h3>
                <ul className="menu menu-sm p-0">
                  {tools.map(tool => (
                    <li key={tool.id} className={activeToolId === tool.id ? 'bg-base-200 rounded-lg' : ''}>
                      <button
                        className="py-3"
                        onClick={() => setActiveToolId(tool.id)}
                      >
                        {tool.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Tool details */}
              {activeTool && (
                <div className="bg-base-200/30 border border-base-300 rounded-lg p-6 lg:col-span-3">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{activeTool.name}</h3>
                    </div>
                    <p className="mt-2 text-base-content/80">{activeTool.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeTool.categories.map(category => (
                        <span key={category} className="badge badge-ghost badge-sm">{category}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Input Parameters */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Input Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="table table-sm table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Required</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeTool.inputParams.map((param, index) => (
                            <tr key={index}>
                              <td className="font-mono text-sm">{param.name}</td>
                              <td className="font-mono text-sm">{param.type}</td>
                              <td>{param.description}</td>
                              <td>{param.required ? 'Yes' : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Output Example */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Response Format</h4>
                    <div className="mockup-code bg-neutral text-neutral-content text-sm max-h-96 overflow-y-auto">
                      <pre><code>{activeTool.outputExample}</code></pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 设置模态框 */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Settings - {provider.name}</h3>
              <button 
                className="btn btn-error btn-sm btn-circle"
                onClick={closeSettingsModal}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="divider"></div>
            
            {/* 设置内容 */}
            <div className="space-y-6">
              {/* 连接设置 */}
              <div className="bg-base-200/30 rounded-lg p-4 border border-base-300">
                <h4 className="font-medium text-lg mb-3">Connection Settings</h4>
                
                <div className="form-control w-full mb-3">
                  <label className="label">
                    <span className="label-text font-medium">Server URL</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    defaultValue={`https://api.mcp-servers.com/${provider.id}`} 
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/70">The URL to connect to this MCP server</span>
                  </label>
                </div>
                
                <div className="form-control w-full mb-3">
                  <label className="label">
                    <span className="label-text font-medium">API Key</span>
                  </label>
                  <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    defaultValue="••••••••••••••••" 
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/70">Your API key for authentication</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input type="checkbox" className="toggle toggle-primary mr-3" defaultChecked />
                    <span className="label-text">Enable Automatic Updates</span>
                  </label>
                </div>
              </div>
              
              {/* 性能设置 */}
              <div className="bg-base-200/30 rounded-lg p-4 border border-base-300">
                <h4 className="font-medium text-lg mb-3">Performance Settings</h4>
                
                <div className="form-control w-full mb-3">
                  <label className="label">
                    <span className="label-text font-medium">Max Concurrent Requests</span>
                  </label>
                  <input 
                    type="number" 
                    className="input input-bordered w-full" 
                    defaultValue="10" 
                    min="1"
                    max="100"
                  />
                </div>
                
                <div className="form-control w-full mb-3">
                  <label className="label">
                    <span className="label-text font-medium">Request Timeout (ms)</span>
                  </label>
                  <input 
                    type="number" 
                    className="input input-bordered w-full" 
                    defaultValue="5000" 
                    min="1000"
                    step="1000"
                  />
                </div>
              </div>
              
              {/* 权限设置 */}
              <div className="bg-base-200/30 rounded-lg p-4 border border-base-300">
                <h4 className="font-medium text-lg mb-3">Permission Settings</h4>
                
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input type="checkbox" className="checkbox checkbox-primary mr-3" defaultChecked />
                    <span className="label-text">Allow Agents to Access This Server</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input type="checkbox" className="checkbox checkbox-primary mr-3" defaultChecked />
                    <span className="label-text">Require Explicit Approval for Each Tool</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="btn btn-outline"
                onClick={closeSettingsModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // 保存设置
                  closeSettingsModal();
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPProviderDetailPage; 