export interface CountryModel {
  id: number;
  name: string;
  status?: number;
  phoneCode?: string | null;
  label?: string | null;
}
