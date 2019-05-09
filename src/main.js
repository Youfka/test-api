function setError(err) {
  document.querySelector('.js-error').innerHTML = err;
}

function UserException() {
  setError("Значение должно быть объектом или массивом!");
}

function getJSON(ev) {
  let value = {
    "required": [
        "0",
        "1"
    ],
    "properties": {
        "0": {
            "required": [
                "id",
                "task"
            ],
            "properties": {
                "id": {
                    "type": "number"
                },
                "task": {
                    "type": "string"
                }
            },
            "type": "object"
        },
        "1": {
            "required": [
                "id",
                "task"
            ],
            "properties": {
                "id": {
                    "type": "number"
                },
                "task": {
                    "type": "string"
                }
            },
            "type": "object"
        }
    }
}
  // let value = ev.replace(/'/gi, '"');
  try {
    // value = JSON.parse(value);
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
  writeTests(value);
}

// function checkJSON(value){
//   if(Array.isArray(value)){
//     writeTests(true);
//   }
// }

function writeTests(json){
  let firstType;
  if(json.required[0]=='0'){
    firstType = 'Array';
  } else {
    firstType = 'Object';
  }
  
  let test = `cy.request('GET', '/test').then((response) => {
    expect(response.status).to.eq(200)
    cy.wrap(response.body).its('length').should('be.gt', 1)
    cy.wrap(response.body).should('be.a', ${firstType})
    `;
  let propertiesKeys = json.properties[0].required;
  if(firstType == 'Array') {
    test+= `
    cy.wrap(response.body).each((value, index)=>{
      cy.wrap(value).should('be.a', 'Object')
      expect(value).to.have.all.keys(...propertiesKeys)
      cy.wrap(Object.values(value)).each((item, index)=>{
        cy.wrap(item).should('be.a', ${json.properties[0].properties}[item].type)
      })
    })
  })`
  } else {
    
  }
  // const getItems = () =>
  //   cy.request('/test')
  //     .its('body')
  //   cy.request('/test')
  //     .its('headers')
  //     .its('content-type')
  //     .should('include', 'application/json')
  //   getItems()
  //     .each(value =>
  //       expect(value).to.have.all.keys('id', 'task')
  //     )
  console.log(test);
  return test;
}
