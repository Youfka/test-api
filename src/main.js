function setError(err) {
  document.querySelector('.js-error').innerHTML = err;
}

function UserException() {
  setError("Значение должно быть объектом или массивом!");
}

function getJSON(ev) {
  let value = ev.replace(/'/gi, '"');
  try {
    value = JSON.parse(value);
    if(typeof value !== 'object') {
      try { throw new UserException(); } 
      catch(e){
        console.log(e);
      }
    } 
    setError('');
  } catch(err){
    try { throw new UserException(); }
    catch(e){
      console.log(e);
    }
  }
  checkJSON(value);
}

function checkJSON(value){
  if(Array.isArray(value)){
    writeTests(true);
  }
}

function writeTests(array){
  let test;
  if(array){
    test = `cy.request('GET', 'http://test.site/test').then((response) => {
      expect(response.status).to.eq(200)
      cy.wrap(response.body).its('length').should('be.gt', 1)
      cy.wrap(response.body).should('be.a', 'Array')
      cy.wrap(response.body).each((value)=>{
        cy.wrap(value).should('be.a', 'Object')
      })
    })`;
  }
  return test;
}
