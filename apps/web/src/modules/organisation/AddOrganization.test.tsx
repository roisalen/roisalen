import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n/i18n';
import { OrganizationProvider } from '../../context/OrganizationContext';
import AddOrganization from './AddOrganization';

describe('AddOrganization', () => {
  it('labels every text field so it can be found by its label', async () => {
    await i18n.changeLanguage('nb');
    render(
      <OrganizationProvider>
        <MemoryRouter>
          <AddOrganization />
        </MemoryRouter>
      </OrganizationProvider>,
    );

    expect(screen.getByLabelText('Organisasjonsnavn')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Kort navn')).toHaveAttribute('maxlength', '11');
    expect(screen.getByLabelText('E-postadresse for kontakt')).toHaveAttribute('type', 'email');
  });
});
