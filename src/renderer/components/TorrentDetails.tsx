import React, { useState, useEffect } from 'react';

interface TorrentDetailed {
  id: number;
  name: string;
  progress: number;
  download_rate: number;
  upload_rate: number;
  state: number;
  totalSize?: number;
  numFiles?: number;
  files?: { path: string, size: number }[];
}

const TorrentDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [torrent, setTorrent] = useState<TorrentDetailed | null>(null);

  const tabs = ['Overview', 'Files', 'Peers', 'Trackers', 'Pieces', 'Networks', 'Logs'];

  useEffect(() => {
    // For demonstration/UI completeness we grab the first torrent available.
    // In a full routing setup, this would take an ID from the URL or selection context.
    const torrentApi = (window as unknown as { torrentApi?: { getTorrents: () => Promise<TorrentDetailed[]> } }).torrentApi;
    if (torrentApi) {
      torrentApi.getTorrents().then(torrents => {
        if (torrents.length > 0) {
          setTorrent(torrents[0]);
        }
      }).catch(console.error);
    }
  }, []);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Torrent Details</h2>
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded p-4 overflow-y-auto">
        {!torrent ? (
          <p className="text-gray-500">No torrent selected or active.</p>
        ) : (
          <>
            {activeTab === 'Overview' && (
              <div className="space-y-2">
                <h3 className="font-bold mb-2 text-lg">{torrent.name}</h3>
                <p><strong>Status:</strong> State {torrent.state}</p>
                <p><strong>Progress:</strong> {(torrent.progress * 100).toFixed(2)}%</p>
                <p><strong>Download Rate:</strong> {(torrent.download_rate / 1024).toFixed(2)} KB/s</p>
                <p><strong>Upload Rate:</strong> {(torrent.upload_rate / 1024).toFixed(2)} KB/s</p>
                <p><strong>Total Size:</strong> {torrent.totalSize !== undefined ? `${(torrent.totalSize / (1024*1024)).toFixed(2)} MB` : 'Not exposed by engine'}</p>
                <p><strong>File Count:</strong> {torrent.numFiles !== undefined ? torrent.numFiles : 'Not exposed by engine'}</p>
              </div>
            )}
            {activeTab === 'Files' && (
              <div>
                <h3 className="font-bold mb-2">Files</h3>
                {torrent.files === undefined ? (
                   <p className="text-gray-500 italic">File list not exposed by engine.</p>
                ) : (
                  <ul className="space-y-1">
                    {torrent.files.map((f, i) => (
                      <li key={i} className="text-sm">{f.path} - {(f.size / 1024).toFixed(2)} KB</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'Peers' && (
              <div>
                <h3 className="font-bold mb-2">Peers</h3>
                <p className="text-gray-500 italic">Detailed peer list not currently exposed by native engine bindings.</p>
              </div>
            )}
            {activeTab === 'Trackers' && (
              <div>
                <h3 className="font-bold mb-2">Trackers</h3>
                <p className="text-gray-500 italic">Tracker statuses not currently exposed by native engine bindings.</p>
              </div>
            )}
            {activeTab === 'Pieces' && (
              <div>
                <h3 className="font-bold mb-2">Pieces</h3>
                <p className="text-gray-500 italic">Piece map visualization not currently exposed by native engine bindings.</p>
              </div>
            )}
            {activeTab === 'Networks' && (
              <div>
                <h3 className="font-bold mb-2">Networks</h3>
                <p className="text-gray-500 italic">Per-torrent network aggregation stats are handled globally by the engine and not exposed individually per-torrent via this binding.</p>
              </div>
            )}
            {activeTab === 'Logs' && (
              <div>
                <h3 className="font-bold mb-2">Logs</h3>
                <p className="text-gray-500 italic">No specific logs available for this torrent.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TorrentDetails;
