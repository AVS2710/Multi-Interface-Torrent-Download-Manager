import lt from '@porla/libtorrent';

export class TorrentService {
  public session: any; // using any temporarily to bypass ESM structural checking
  private torrents: Map<number, any> = new Map();
  private onStateUpdateCb?: (torrents: any[]) => void;

  constructor() {
    this.session = new lt.Session();

    this.session.on('state_update', (data: any) => {
        if (this.onStateUpdateCb) {
          const torrentList = Array.from(this.torrents.values()).map(t => {
            const status = t.status();
            return {
              id: t.id(),
              name: status.name,
              progress: status.progress,
              download_rate: status.download_rate,
              upload_rate: status.total_upload, // Mock shape
              state: status.state
            };
          });
          this.onStateUpdateCb(torrentList);
        }
    });
  }

  public onStateUpdate(cb: (torrents: any[]) => void) {
    this.onStateUpdateCb = cb;
  }

  public addTorrent(magnet: string, savePath: string): number {
    const params = lt.parse_magnet_uri(magnet);
    params.save_path = savePath;
    this.session.add_torrent(params);
    return 0; // Mock ID
  }

  public pauseTorrent(id: number) {
    const handle = this.torrents.get(id);
    if (handle) {
      handle.pause();
    }
  }

  public resumeTorrent(id: number) {
    const handle = this.torrents.get(id);
    if (handle) {
      handle.resume();
    }
  }

  public removeTorrent(id: number) {
    const handle = this.torrents.get(id);
    if (handle) {
      this.session.remove_torrent(handle);
      this.torrents.delete(id);
    }
  }
}