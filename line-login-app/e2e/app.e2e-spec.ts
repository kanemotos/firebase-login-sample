import { LineLoginAppPage } from './app.po';

describe('line-login-app App', () => {
  let page: LineLoginAppPage;

  beforeEach(() => {
    page = new LineLoginAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
