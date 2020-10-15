module.exports = {
  beforeEach: (browser, done) => {
    browser
      .url('https://sede.administracionespublicas.gob.es/icpco/index')
      .setCookie({
        name: 'viewed_cookie_policy',
        value: 'yes',
        path: '/',
        domain: 'sede.administracionespublicas.gob.es'
      })
      .perform(done);
  },

  'Open policy website': browser => {
    const checkAppointments = (browser) => {
      browser
        .refresh()
        .waitForElementVisible('body')
        .assert.containsText('p[class="mf-msg__info"]', 'En este momento no hay citas disponibles.')
    };

    browser
      .url('https://sede.administracionespublicas.gob.es/icpco/index')
      .waitForElementVisible('body')
      .assert.containsText('#divProvincias', "PROVINCIAS DISPONIBLES")
      .click('select[id="form"] option[value="/icpco/citar?p=38&locale=es"]')
      .click('input[id="btnAceptar"]')
      .waitForElementVisible('body')
      .click('select[id="tramiteGrupo[1]"] option[value="4010"]')
      .click('input[id="btnAceptar"]')
      .waitForElementVisible('input[id="btnEntrar"]')
      .click('input[id="btnEntrar"]')
      .setValue('input[id="txtIdCitado"]', process.env.NIE)
      .setValue('input[id="txtDesCitado"]', process.env.NAME)
      .click('select[id="txtPaisNac"] option[value="149"]')
      .assert.not.attributeContains('input[id="btnEnviar"]', 'disabled', 'true')
      .click('input[id="btnEnviar"]')
      .waitForElementVisible('body')
      .click('input[id="btnEnviar"]')
      .waitForElementVisible('body', undefined, undefined, undefined, () => {
        browser.assert.containsText('p[class="mf-msg__info"]', 'En este momento no hay citas disponibles.')
        setInterval(() => checkAppointments(browser), Math.random() * Math.floor(5)*60*1000)
      })
      .pause(7200000)
  }
};