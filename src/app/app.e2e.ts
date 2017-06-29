import { browser, by, element } from 'protractor/built';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'JetPad';
    expect(subject).toEqual(result);
  });

  it('should have header', () => {
    let subject = element(by.css('h1')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <jp-landing>', () => {
    let subject = element(by.css('jp-landing')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have buttons', () => {
    let subject = element(by.css('.btn-raised')).getText();
    let result  = 'OPEN/CREATE';
    expect(subject).toEqual(result);
  });

});
