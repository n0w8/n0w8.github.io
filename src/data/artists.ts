// Zentrale Artist-Daten. Artikel referenzieren nur `artistKey`,
// alle Links/Embeds werden hier aufgelöst → ein Ort für Änderungen.
// Spotify-Artist-Embeds spielen die Top-Tracks (= "diverse Songs") direkt im Player.

export interface Artist {
  name: string;
  tagline: { de: string; en: string };
  spotifyId: string;
  spotifyEmbed: string; // Player mit Top-Tracks
  spotifyUrl: string;   // Profil-Backlink
  youtubeUrl: string;   // Kanal-Backlink
}

export const artists = {
  domsgard: {
    name: 'Domsgard',
    tagline: {
      de: 'Epische nordische Klänge – Trommeln, Chöre und die Wucht der Schlacht.',
      en: 'Epic Nordic soundscapes – drums, choirs and the thunder of battle.',
    },
    spotifyId: '4bw38ajepdedya70ivRX35',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/4bw38ajepdedya70ivRX35?utm_source=nordweg',
    spotifyUrl: 'https://open.spotify.com/artist/4bw38ajepdedya70ivRX35',
    youtubeUrl: 'https://www.youtube.com/@Domsgard',
  },
  eldruna: {
    name: 'Eldruna',
    tagline: {
      de: 'Atmosphärische Viking-Musik zwischen Nebel, Runen und weitem Fjord.',
      en: 'Atmospheric Viking music between mist, runes and the open fjord.',
    },
    spotifyId: '0PrMrTqRGT4rQanBp2mlco',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/0PrMrTqRGT4rQanBp2mlco?utm_source=nordweg',
    spotifyUrl: 'https://open.spotify.com/artist/0PrMrTqRGT4rQanBp2mlco',
    youtubeUrl: 'https://www.youtube.com/@Eldruna1337',
  },
} satisfies Record<string, Artist>;

export type ArtistKey = keyof typeof artists;
