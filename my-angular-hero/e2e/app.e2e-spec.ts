import { MyAngularHeroPage } from './app.po';

describe('my-angular-hero App', () => {
  let page: MyAngularHeroPage;

  beforeEach(() => {
    page = new MyAngularHeroPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
