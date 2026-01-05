import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useOrganization } from './src/context/OrganizationContext';
import Organization from './src/modules/organisation/Organization';
import AddOrganization from './src/modules/organisation/AddOrganization';
import SpeakerList from './src/modules/speaker-list/SpeakerList';
import LanguageSelector from './src/modules/internationalization/LanguageSelector';
import ErrorPage from './src/components/error/ErrorPage';
import config from './src/config/config';
import './src/components/navbar/Navbar.css';
import LeadMeeting from './src/modules/lead-meeting/LeadMeeting';
import AdminRepresentatives from './src/modules/admin-representatives/AdminRepresentatives';
import Statistics from './src/modules/statistics/Statistics';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { organizationName, urlIdentifier } = useOrganization();
  
  return (
    <BrowserRouter>
      <Navbar className="navbar-static-top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            {organizationName || 'Ro i salen'}
            <span className="glyphicon glyphicon-bullhorn"></span>
          </Navbar.Brand>
          
          {organizationName && urlIdentifier && (
            <Nav className="me-auto nav-links">
              <Nav.Link as={Link} to={`/${urlIdentifier}/speaker-list`}>
                {t('SPEAKER_LIST')}
              </Nav.Link>
              <Nav.Link as={Link} to={`/${urlIdentifier}/admin-representatives`}>
                {t('ADMIN_REPRESENTATIVES')}
              </Nav.Link>
              <Nav.Link as={Link} to={`/${urlIdentifier}/lead-meeting`}>
                {t('LEAD_MEETING')}
              </Nav.Link>
              <Nav.Link as={Link} to={`/${urlIdentifier}/statistics`}>
                {t('STATISTICS')}
              </Nav.Link>
            </Nav>
          )}
          <LanguageSelector />
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Organization />} />
          <Route path="/choose-organisation" element={<Organization />} />
          <Route path="/add-organisation" element={<AddOrganization />} />
          <Route path="/:shortName" element={<OrganizationLoader />}>
            <Route path="speaker-list" element={<SpeakerList />} />
            <Route path="admin-representatives" element={<AdminRepresentatives />} />
            <Route path="lead-meeting" element={<LeadMeeting />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

// OrganizationLoader component
const OrganizationLoader: React.FC = () => {
  const { shortName } = useParams();
  const { organizationName, setOrganization } = useOrganization();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);


  React.useEffect(() => {
    if (organizationName && hasLoaded) {
        setIsLoading(false);
        return;
      }
    
    const loadOrganization = async () => {
      if (!shortName) {
        setError('No organization specified');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Include hidden organizations when loading by URL (for direct access)
        const response = await fetch(`${config.apiUrl}/organisations?includeHidden=true`);
        
        if (!response.ok) {
          throw new Error('Failed to load organizations');
        }

        const organizations = await response.json();
        // Try to find by slug first (for obscure URLs), then fall back to shortName
        const organization = organizations.find(
          (org: { shortName: string; slug?: string }) => 
          (org.slug && org.slug.toLowerCase() === shortName.toLowerCase()) ||
          org.shortName.toLowerCase() === shortName.toLowerCase()
        );

        if (!organization) {
          throw new Error('Organization not found');
        }

        setOrganization({
          name: organization.name,
          shortName: organization.shortName,
          slug: organization.slug
        });
        setHasLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganization();
  }, [shortName, setOrganization, organizationName, hasLoaded]);

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return <Outlet />;
};

export default App; 