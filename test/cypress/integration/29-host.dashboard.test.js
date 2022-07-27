import { Sections } from '../../../components/collective-page/_constants';

import { randomSlug } from '../support/faker';

const scrollToSection = section => {
  // Wait for collective page to load before disabling smooth scroll
  cy.get('[data-cy=collective-page-main]');
  cy.get(`#section-${section}`).scrollIntoView();
};

describe('host dashboard', () => {
  let user;

  before(() => {
    cy.signup({ redirect: '/brusselstogetherasbl' }).then(u => (user = u));
  });

  describe('pending applications', () => {
    it('mark pending application approved', () => {
      const collectiveSlug = randomSlug();
      cy.get('[data-cy="host-apply-btn"]:visible').click();
      cy.getByDataCy('host-apply-modal-next').click();
      cy.getByDataCy('host-apply-collective-picker').click();
      cy.getByDataCy('host-apply-new-collective-link').click();
      cy.get(`input[name="name"]`).type('Cavies United');
      cy.get(`input[name="slug"]`).type(`{selectall}${collectiveSlug}`);
      cy.get(`input[name="description"]`).type('We will rule the world with our cute squeaks');
      cy.getByDataCy('checkbox-tos').click();
      cy.wait(300);
      cy.get('button[type="submit"]').click();
      cy.contains('Cavies United has been created!');
      cy.login({ redirect: '/brusselstogetherasbl/admin' });
      cy.get('[data-cy="menu-item-pending-applications"]').click();
      cy.get(`[data-cy="${collectiveSlug}-approve"]`).click();
      cy.contains(`[data-cy="host-application"]`, 'Approved');
    });
  });

  describe('Orders', () => {
    it('edit order and mark as paid', () => {
      cy.login({ redirect: '/brusselstogetherasbl/admin/orders' });
      cy.get('[data-cy="MARK_AS_PAID-button"]:first').click();
      cy.get('[data-cy="amount-received"]').type('10.23');
      cy.get('[data-cy="platform-tip"]').type('1.20');
      cy.getByDataCy('order-confirmation-modal-submit').click();
      cy.contains('span', '9.03');
      cy.contains('[data-cy="order-status-msg"]:first', 'Paid');
    });
  });

  describe('expenses tab', () => {
    let expense;

    before(() => {
      // 207 - BrusselsTogether
      cy.createExpense({
        userEmail: user.email,
        account: { legacyId: 207 },
        payee: { legacyId: user.CollectiveId },
      }).then(e => (expense = e));
    });

    it('Process expense', () => {
      cy.login({ redirect: '/brusselstogetherasbl/admin/expenses' });
      cy.getByDataCy(`expense-container-${expense.legacyId}`).as('currentExpense');

      // Defaults to pending, approve it
      cy.get('@currentExpense').find('[data-cy="expense-status-msg"]').contains('Pending');
      cy.get('@currentExpense').find('[data-cy="approve-button"]').click();
      cy.get('@currentExpense').find('[data-cy="expense-status-msg"]').contains('Approved');

      // Unapprove
      cy.get('@currentExpense').find('[data-cy="unapprove-button"]').click();
      cy.get('@currentExpense').find('[data-cy="expense-status-msg"]').contains('Pending');

      // Approve
      cy.get('@currentExpense').find('[data-cy="approve-button"]').click();
      cy.get('@currentExpense').find('[data-cy="admin-expense-status-msg"]').contains('Approved');

      // Pay
      cy.get('@currentExpense').find('[data-cy="pay-button"]').click();
      cy.getByDataCy('pay-expense-modal').as('payExpenseModal');
      cy.get('@payExpenseModal').find('[data-cy="pay-type-MANUAL"]').click();
      cy.get('@payExpenseModal').find('[data-cy="mark-as-paid-button"]').click();
      cy.get('@currentExpense').find('[data-cy="admin-expense-status-msg"]').contains('Paid');

      // Mark as unpaid
      cy.get('@currentExpense').find('[data-cy="admin-expense-status-msg"]').click();
      cy.getByDataCy('mark-as-unpaid-button').click();
      cy.getByDataCy('mark-expense-as-unpaid-modal').as('markAsUnpaidModal');
      cy.get('@markAsUnpaidModal').find('[data-cy="confirmation-modal-continue"]').click();
      cy.get('@currentExpense').find('[data-cy="admin-expense-status-msg"]').contains('Approved');

      // Unapprove
      cy.get('@currentExpense').find('[data-cy="unapprove-button"]').click();
      cy.get('@currentExpense').find('[data-cy="expense-status-msg"]').contains('Pending');

      // Reject
      cy.get('@currentExpense').find('[data-cy="reject-button"]').click();
      cy.get('@currentExpense').find('[data-cy="admin-expense-status-msg"]').contains('Rejected');
    });
  });

  describe('Add funds modal', () => {
    it('Cannot submit incomplete form', () => {
      cy.login({ redirect: '/brusselstogetherasbl/admin/hosted-collectives' });
      cy.get('[data-cy="hosted-collective-add-funds-btn"]').first().click();
      cy.getByDataCy('add-funds-submit-btn').click();
      cy.contains('[data-cy="add-funds-form"]', 'This field is required');
    });

    it.skip('Can add funds and platform tip as collective host', () => {
      cy.login({ redirect: '/brusselstogetherasbl/admin/hosted-collectives' });
      cy.get('[data-cy="hosted-collective-add-funds-btn"]').first().click();
      cy.wait(300);
      cy.get('[data-cy="add-funds-amount"]').type('20');
      cy.get('[data-cy="add-funds-description"]').type('cypress test - add funds');
      cy.get('[data-cy="add-funds-source"]').click();
      cy.get('[data-cy="collective-type-picker-USER"]').click();
      cy.get('[data-cy="mini-form-email-field"]').type('cypress-test@funds.com');
      cy.get('[data-cy="mini-form-name-field"]').type('cypress user');
      cy.get('[data-cy="collective-mini-form-scroll"]').scrollTo('bottom', { duration: 5000 });
      cy.get('[data-cy="mini-form-save-button"]').click();
      cy.wait(1000);
      cy.get('[data-cy="add-funds-submit-btn"]').click();
      cy.wait(300);
      cy.get('[data-cy="funds-added"]').contains('Funds Added ✅');
      cy.contains('[data-cy="donation-percentage"]', 'No thank you').click();
      cy.contains('[data-cy="select-option"]', '€2.00').click();
      cy.get('[data-cy="add-platform-tip-btn"]').contains('Tip and Finish');
      cy.get('[data-cy="add-platform-tip-btn"]').click();
      cy.wait(300);
      cy.get('[data-cy="collective-avatar"]').first().click();
      scrollToSection(Sections.BUDGET);
      cy.get('[data-cy="section-budget"]').contains('cypress test - add funds');
      cy.visit('opencollectivehost');
      scrollToSection(Sections.TRANSACTIONS);
      cy.get('[data-cy="section-transactions"]').contains('Financial contribution to Open Collective');
    });
  });
});
