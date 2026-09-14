/** Vrai pour une base locale (Docker), faux pour une base managée distante (Supabase...). */
export function isLocalDatabase(connectionString: string | undefined): boolean {
  if (!connectionString) return true;
  return connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
}
