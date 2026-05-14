'use client';

import { useEffect, useState } from 'react';

export interface MemberRecord {
  id: string;
  displayName: string;
  squad: string | null;
}

export function useMembers() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => setMembers(data))
      .finally(() => setLoading(false));
  }, []);

  return { members, loading };
}
