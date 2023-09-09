describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Visits, Log in to the system and explore the applicaiton', () => {
    //cy.contains('app is running!')
    //email verificaiton
    cy.get('#email').type('Hello');
    cy.get('#email').type('moon@bisdfn.io');
    //password verification
    cy.get('#password').type('Hello');
    cy.get('#password').type('Helloqaz');

    //user not found
    cy.get('#btnSignIn').click();

    //incorrect password
    cy.get('#email').clear();
    cy.get('#email').type('moon@bin.io');
    cy.get('#btnSignIn').click();

    //login to the app
    cy.get('#password').clear();
    cy.get('#password').type('qazxsw');
    cy.get('#btnSignIn').click();

    //go to my account
    cy.get('#lnkMyAccount').click();

    //go to groups
    cy.get('#lnkGroups').click();

    //Log out
    cy.get('#lnkSingOut').click();
  });

  // it('Email Validation', () => {
  //   cy.get('#email').type('Hello');
  //   cy.get('#email').type('moon@bin.io');
  // });
  // it('Password Validation', () => {
  //   cy.get('#password').type('Hello');
  //   cy.get('#password').type('moon@bin.io');
  // });

  // it('should get incorrect password message', () => {
  //   cy.get('#email').type('moon@bin.io');
  //   cy.get('#password').type('qwerty');
  //   cy.get('#btnSignIn').click();
  // });

  // it('should sign in to the app', () => {
  //   cy.get('#email').type('moon@bin.io');
  //   cy.get('#password').type('qazxsw');
  //   cy.get('#btnSignIn').click();
  // });
});
