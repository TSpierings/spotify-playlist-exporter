export interface SimplifiedPlaylist {
  id: string;
  description: string;
  images: Array<any>;
  name: string;
  tracks: {
    href: string;
    total: number;
  };
}
