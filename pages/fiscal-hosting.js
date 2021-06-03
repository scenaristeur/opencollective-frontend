import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import APlaceToGrowAndThrive from '../components/fiscal-hosting/APlaceToGrowAndThriveSection';
import ApplyToFiscalHosts from '../components/fiscal-hosting/ApplyToFiscalHostSection';
import FindTheRightFiscalHost from '../components/fiscal-hosting/FindTheRightFiscalHostSection';
import HowCanAFiscalHostHelp from '../components/fiscal-hosting/HowCanAFiscalHostHelpSection';
import WhatAreTheBenefits from '../components/fiscal-hosting/WhatAreTheBenefitsSection';
import WhatIsFiscalHost from '../components/fiscal-hosting/WhatIsFiscalHostSection';
import WhoIsFiscalHosting from '../components/fiscal-hosting/WhoIsFiscalHostingForSection';
import JoinUs from '../components/home/sections/JoinUs';
import Page from '../components/Page';

const menuItems = { pricing: true, howItWorks: true };

const messages = defineMessages({
  defaultTitle: {
    id: 'OC.tagline',
    defaultMessage: 'Make your community sustainable. Collect and spend money transparently.',
  },
});

const FiscalHosting = () => {
  const { formatMessage } = useIntl();
  return (
    <Page menuItems={menuItems} description={formatMessage(messages.defaultTitle)}>
      <APlaceToGrowAndThrive />
      <WhatIsFiscalHost />
      <WhatAreTheBenefits />
      <HowCanAFiscalHostHelp />
      <WhoIsFiscalHosting />
      <ApplyToFiscalHosts />
      <FindTheRightFiscalHost />
      <JoinUs page="fiscalHosting" />
    </Page>
  );
};

export default FiscalHosting;