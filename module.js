const AUDIUS_API = 'https://api.audius.co/v1';

const AudiusModule = {
    id: 'audius',
    name: 'Audius',
    version: '1.0.0',

    labels: ['FREE', 'STREAMING'],

    async searchTracks(query, limit = 20) {
        const response = await fetch(
            `${AUDIUS_API}/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Audius search failed: ${response.status}`);
        }

        const json = await response.json();

        const tracks = (json.data || []).map(track => ({
            id: track.id,
            title: track.title || 'Unknown Title',

            artist: track.user?.name || 'Unknown Artist',

            album: track.release_date
                ? 'Audius'
                : 'Unknown Album',

            duration: track.duration || 0,

            albumCover:
                track.artwork?.['1000x1000'] ||
                track.artwork?.['480x480'] ||
                track.artwork?.['150x150'] ||
                null
        }));

        return {
            tracks,
            total: tracks.length
        };
    },

    async getTrackStreamUrl(id, quality = 'HIGH') {
        const response = await fetch(
            `${AUDIUS_API}/tracks/${encodeURIComponent(id)}/stream`,
            {
                redirect: 'follow'
            }
        );

        if (!response.ok) {
            throw new Error(`Audius stream failed: ${response.status}`);
        }

        return {
            streamUrl: response.url,

            track: {
                id,
                audioQuality: quality === 'LOSSLESS'
                    ? 'HIGH'
                    : quality
            }
        };
    }
};

return AudiusModule;
