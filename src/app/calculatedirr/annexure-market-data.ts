export interface AnnexureStatCard {
  value: string;
  label: string;
  tone: 'green' | 'blue' | 'purple';
}

export interface AnnexureRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface AnnexureOutlookCard {
  title: string;
  bodyHtml: string;
}

export interface AnnexureNewsCard {
  title: string;
  body: string;
}

export interface AnnexureComparableRow {
  city: string;
  yield: string;
  growth: string;
  price: string;
  rating: string;
  highlight?: boolean;
  ratingTone?: 'green' | 'dim';
}

export interface CityAnnexureData {
  executiveStats: AnnexureStatCard[];
  executiveParagraphs: string[];
  boeRows: AnnexureRow[];
  boeNote: string;
  mortgageRows: AnnexureRow[];
  mortgageNote: string;
  outlookTitle: string;
  outlookSub: string;
  outlookCards: AnnexureOutlookCard[];
  financialNewsSub: string;
  financialNewsLeft: AnnexureNewsCard[];
  financialNewsRight: AnnexureNewsCard[];
  comparablesSub: string;
  comparables: AnnexureComparableRow[];
}
export interface CityAnnexureDataMap {
  [key: string]: CityAnnexureData;
}
