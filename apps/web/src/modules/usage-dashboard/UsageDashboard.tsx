import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchUsageSummary,
  getStoredAdminSecret,
  setStoredAdminSecret,
  type UsageSummary,
} from './usageApi';

const UsageDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [secretInput, setSecretInput] = useState('');
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (secret: string) => {
    if (!secret) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsageSummary(secret);
      setSummary(data);
      setStoredAdminSecret(secret);
    } catch (e) {
      setSummary(null);
      if (e instanceof Error) {
        if (e.message === 'UNAUTHORIZED') {
          setError(t('USAGE_DASHBOARD_ERROR_AUTH'));
        } else if (e.message === 'NOT_CONFIGURED') {
          setError(t('USAGE_DASHBOARD_ERROR_NOT_CONFIGURED'));
        } else {
          setError(t('USAGE_DASHBOARD_ERROR_GENERIC'));
        }
      } else {
        setError(t('USAGE_DASHBOARD_ERROR_GENERIC'));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const stored = getStoredAdminSecret();
    if (stored) {
      setSecretInput(stored);
      void load(stored);
    }
  }, [load]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void load(secretInput.trim());
  };

  const handleLogout = () => {
    setStoredAdminSecret('');
    setSecretInput('');
    setSummary(null);
    setError(null);
  };

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <Container className="py-4">
      <h1>{t('USAGE_DASHBOARD_TITLE')}</h1>
      <p className="text-muted">{t('USAGE_DASHBOARD_INTRO')}</p>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label htmlFor="usage-admin-secret">{t('USAGE_DASHBOARD_SECRET_LABEL')}</Form.Label>
          <Form.Control
            id="usage-admin-secret"
            type="password"
            autoComplete="off"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder={t('USAGE_DASHBOARD_SECRET_PLACEHOLDER')}
          />
          <Form.Text className="text-muted">
            {t('USAGE_DASHBOARD_SECRET_HELP')}
          </Form.Text>
        </Form.Group>
        <Button type="submit" disabled={loading || !secretInput.trim()}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {t('LOADING')}
            </>
          ) : (
            t('USAGE_DASHBOARD_LOAD')
          )}
        </Button>
        {getStoredAdminSecret() && (
          <Button variant="outline-secondary" className="ms-2" type="button" onClick={handleLogout}>
            {t('USAGE_DASHBOARD_CLEAR_SECRET')}
          </Button>
        )}
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {summary && (
        <>
          <p className="small text-muted">
            {t('USAGE_DASHBOARD_GENERATED')}: {fmtDate(summary.generatedAt)}
          </p>

          <h2 className="h4 mt-4">{t('USAGE_DASHBOARD_ACTIVE')}</h2>
          <p className="text-muted small">{t('USAGE_DASHBOARD_ACTIVE_HELP')}</p>
          {summary.activeMeetings.length === 0 ? (
            <p>{t('USAGE_DASHBOARD_NONE_ACTIVE')}</p>
          ) : (
            <Table striped bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>{t('ORGANIZATION_NAME')}</th>
                  <th>{t('USAGE_DASHBOARD_SHORT_NAME')}</th>
                  <th>{t('USAGE_DASHBOARD_QUEUE_LEN')}</th>
                  <th>{t('USAGE_DASHBOARD_CURRENT_SPEAKER')}</th>
                </tr>
              </thead>
              <tbody>
                {summary.activeMeetings.map((row) => (
                  <tr key={row.organisation}>
                    <td>{row.organisationName}</td>
                    <td>{row.organisation}</td>
                    <td>{row.queueLength}</td>
                    <td>{row.currentSpeakerLabel ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <h2 className="h4 mt-4">{t('USAGE_DASHBOARD_RECENT_30D')}</h2>
          <p className="text-muted small">{t('USAGE_DASHBOARD_RECENT_HELP')}</p>
          {summary.recentMeetingsLast30Days.length === 0 ? (
            <p>{t('USAGE_DASHBOARD_NONE_RECENT')}</p>
          ) : (
            <Table striped bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>{t('ORGANIZATION_NAME')}</th>
                  <th>{t('USAGE_DASHBOARD_SHORT_NAME')}</th>
                  <th>{t('USAGE_DASHBOARD_EVENTS')}</th>
                  <th>{t('USAGE_DASHBOARD_LAST_ACTIVITY')}</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentMeetingsLast30Days.map((row) => (
                  <tr key={row.organisation}>
                    <td>{row.organisationName}</td>
                    <td>{row.organisation}</td>
                    <td>{row.eventCount}</td>
                    <td>{fmtDate(row.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      <p className="mt-4">
        <Link to="/">{t('BACK_TO_HOME')}</Link>
      </p>
    </Container>
  );
};

export default UsageDashboard;
