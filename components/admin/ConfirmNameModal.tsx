'use client';

import { useState } from 'react';

interface ConfirmNameModalProps {
  title: string;
  body: string;
  confirmName: string;
  confirmLabel?: string;
  reasonLabel?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmNameModal({
  title,
  body,
  confirmName,
  confirmLabel = 'Confirm',
  reasonLabel,
  onConfirm,
  onCancel,
  destructive = true,
}: ConfirmNameModalProps) {
  const [input, setInput] = useState('');
  const [reason, setReason] = useState('');
  const matches = input.trim().toUpperCase() === confirmName.trim().toUpperCase();

  return (
    <div className="modal-scrim">
      <div className="modal">
        <div className="mhead">
          {destructive && (
            <div className="lbl" style={{ color: '#8A2E22' }}>● Destructive · Confirm required</div>
          )}
          <h2>{title}</h2>
        </div>
        <div className="mbody">
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.55, margin: '0 0 18px' }}>{body}</p>
          {reasonLabel && (
            <div className="field" style={{ marginBottom: 16 }}>
              <label htmlFor="cnm-reason">{reasonLabel} <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
              <input
                id="cnm-reason"
                className="input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe why…"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="cnm-confirm">
              Type <b style={{ color: 'var(--ink)' }}>{confirmName.toUpperCase()}</b> to confirm
            </label>
            <input
              id="cnm-confirm"
              className="input"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            {matches ? (
              <div className="hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L20 6" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Matches — {confirmLabel} is ready.
              </div>
            ) : input.length > 0 ? (
              <div className="hint" style={{ color: 'var(--clay)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 7v6m0 3v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Doesn&apos;t match yet.
              </div>
            ) : null}
          </div>
        </div>
        <div className="mfoot">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={destructive ? { background: 'var(--clay)' } : {}}
            disabled={!matches}
            onClick={() => onConfirm(reason || undefined)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
