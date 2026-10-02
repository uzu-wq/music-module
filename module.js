
const AUDIUS_API = 'https://api.audius.co/v1';

const AUDIUS_MODULE = {
    id: 'audius',
    name: 'Audius',
    version: '1.0.0',
    labels: ['STREAMING', 'FREE'],

    searchTracks: async (query, limit = 20) => {
        const url =
            `${AUDIUS_API}/tracks/search` +
            `?query=${encodeURIComponent(query)}` +
            `&limit=${limit}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Audius search failed: ${response.status}`);
        }

        const data = await response.json();

        const tracks = (data.data || []).map(track => ({
            id: track.id,
            title: track.title,
            artist: track.user?.name || 'Unknown Artist',
            album: track.release_date
                ? 'Audius'
                : 'Unknown Album',
            duration: track.duration,
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

    getTrackStreamUrl: async (trackId, quality = 'HIGH') => {
        const url =
            `${AUDIUS_API}/tracks/${encodeURIComponent(trackId)}/stream`;

        const response = await fetch(url, {
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`Audius stream failed: ${response.status}`);
        }

        return {
            streamUrl: response.url,
            track: {
                id: trackId,
                audioQuality: quality === 'LOSSLESS'
                    ? 'HIGH'
                    : quality
            }
        };
    }
};

return AUDIUS_MODULE;
