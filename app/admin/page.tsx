'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminChrome from '@/components/AdminChrome';

interface MemberStats {
  total: number;
  active: number;
  inactive: number;
}

interface BoatStats {
  total: number;
  active: number;
  retired: number;
}

export default function AdminPage() {
  const [members, setMembers] = useState<MemberStats | null>(null);
  const [boats, setBoats] = useState<BoatStats | null>(null);

  useEffect(() => {
    fetch('/api/admin/members')
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: { members: { isActive: boolean }[] }) => {
        const list = data.members;
        const active = list.filter((m) => m.isActive).length;
        setMembers({ total: list.length, active, inactive: list.length - active });
      })
      .catch(() => setMembers({ total: 0, active: 0, inactive: 0 }));

    fetch('/api/admin/boats')
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: { isActive: boolean }[]) => {
        const active = data.filter((b) => b.isActive).length;
        setBoats({ total: data.length, active, retired: data.length - active });
      })
      .catch(() => setBoats({ total: 0, active: 0, retired: 0 }));
  }, []);

  return (
    <>
      <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin' }]} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Admin</div>
            <h1>What needs tending to?</h1>
          </div>
        </div>

        <div className="admin-tiles">
          <Link href="/admin/members" className="admin-tile">
            <div>
              <div className="lbl">Members</div>
            </div>
            <div className="v">
              {members ? members.active : '—'} <small>active</small>
            </div>
            <p className="desc">
              The roster the kiosk shows. Add new rowers, deactivate when they leave the club, or import a fresh list via CSV.
            </p>
            <div className="footrow">
              <div className="sublist">
                {members && (
                  <>
                    <span><b>{members.inactive}</b> inactive · hidden from sign-out</span>
                  </>
                )}
              </div>
              <span className="arrow">→</span>
            </div>
          </Link>

          <Link href="/admin/boats" className="admin-tile">
            <div>
              <div className="lbl">Boats</div>
            </div>
            <div className="v">
              {boats ? boats.active : '—'} <small>active</small>
            </div>
            <p className="desc">
              The fleet. Add new shells, retire damaged ones, mark boats for workshop. Boats can be imported with the same CSV flow.
            </p>
            <div className="footrow">
              <div className="sublist">
                {boats && (
                  <span><b>{boats.retired}</b> retired · hidden from boat picker</span>
                )}
              </div>
              <span className="arrow">→</span>
            </div>
          </Link>
        </div>

        <div className="arf-foot">
          <Link href="/" className="btn btn-ghost btn-lg">← Back to kiosk</Link>
        </div>
      </div>
    </>
  );
}
