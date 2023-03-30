import { environment } from '../../../../environments/environment';

export function apiUrl(url: string | null) {
  let result = environment.apiUrl + (url ?? '');
  return result;
}
