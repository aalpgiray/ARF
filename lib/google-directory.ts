import { google } from 'googleapis';

export interface DirectoryUser {
  googleUserId: string;
  displayName: string;
  email: string;
}

export async function fetchWorkspaceUsers(): Promise<DirectoryUser[]> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');

  const credentials = JSON.parse(raw);
  const domain = process.env.CLUB_DOMAIN;
  if (!domain) throw new Error('CLUB_DOMAIN not set');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    // Impersonate an admin account for domain-wide delegation
    clientOptions: {
      subject: credentials.impersonate_user ?? `admin@${domain}`,
    },
  });

  const admin = google.admin({ version: 'directory_v1', auth });

  const users: DirectoryUser[] = [];
  let pageToken: string | undefined;

  do {
    const res = await admin.users.list({
      domain,
      maxResults: 500,
      orderBy: 'givenName',
      pageToken,
      projection: 'basic',
    });

    for (const u of res.data.users ?? []) {
      if (!u.id || !u.primaryEmail) continue;
      users.push({
        googleUserId: u.id,
        displayName: u.name?.fullName ?? u.primaryEmail,
        email: u.primaryEmail,
      });
    }

    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return users;
}
