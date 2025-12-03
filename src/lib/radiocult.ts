import ky, { type KyInstance } from "ky";

const RADIOCULT_API_BASE_URL = "https://api.radiocult.fm";

export interface TipTapNode {
  type: string;
  text?: string;
  content?: TipTapNode[];
  marks?: Array<{ type: string }>;
}

export interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}

export interface ArtistLogo {
  "1024x1024": string;
  "512x512": string;
  "256x256": string;
  "128x128": string;
  "64x64": string;
  "32x32": string;
  default: string;
}

export interface ArtistSocials {
  instagramHandle?: string;
  soundcloud?: string;
  site?: string;
}

export interface Artist {
  id: string;
  stationId: string;
  slug?: string;
  name: string;
  description?: TipTapDocument;
  logo?: ArtistLogo;
  socials: ArtistSocials;
  shareableLinkId: string;
  scheduleIds: string[];
  country?: string;
  tags: string[];
  genres: string[];
  created: string;
  modified: string;
}

export const getTipTapPlainText = (doc?: TipTapDocument): string => {
  if (!doc?.content) return "";

  const extractText = (node: TipTapNode): string => {
    if (node.text) return node.text;
    if (node.content) {
      const text = node.content.map(extractText).join("");
      // Add newlines after block-level elements
      if (node.type === "paragraph" || node.type === "heading") {
        return `${text}\n`;
      }
      return text;
    }
    return "";
  };

  return doc.content.map(extractText).join("").trim();
};

export interface ScheduleItem {
  id: string;
  stationId: string;
  title: string;
  description?: TipTapDocument;
  start: string;
  end: string;
  artistIds: string[];
  timezone: string;
  created: string;
  modified: string;
}

interface ApiResponse<_T> {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface RadioCultClientOptions {
  apiKey: string;
  stationId: string;
}

export class RadioCultClient {
  private client: KyInstance;
  private stationId: string;

  constructor(options: RadioCultClientOptions) {
    this.stationId = options.stationId;
    this.client = ky.create({
      prefixUrl: RADIOCULT_API_BASE_URL,
      headers: {
        "x-api-key": options.apiKey,
      },
    });
  }

  private async request<T>(response: Promise<ApiResponse<T> & T>): Promise<T> {
    const data = await response;
    if (!data.success) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  async getArtists(): Promise<Artist[]> {
    const data = await this.request(
      this.client
        .get(`api/station/${this.stationId}/artists`)
        .json<ApiResponse<{ artists: Artist[] }> & { artists: Artist[] }>(),
    );
    return data.artists;
  }

  async getArtistBySlug(slug: string): Promise<Artist> {
    const data = await this.request(
      this.client
        .get(`api/station/${this.stationId}/artists/${slug}`)
        .json<ApiResponse<{ artist: Artist }> & { artist: Artist }>(),
    );
    return data.artist;
  }

  async getArtistSchedule(
    artistId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ScheduleItem[]> {
    const data = await this.request(
      this.client
        .get(`api/station/${this.stationId}/artists/${artistId}/schedule`, {
          searchParams: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        })
        .json<
          ApiResponse<{ schedules: ScheduleItem[] }> & {
            schedules: ScheduleItem[];
          }
        >(),
    );
    return data.schedules;
  }
}
