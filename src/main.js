function setError(err) {
  document.querySelector('.js-error').innerHTML = err;
}

function UserException() {
  setError("Значение должно быть объектом или массивом!");
}

function getJSON(ev) {
//   let value = {
//     "required": [
//         "id",
//         "name",
//         "price",
//         "testBool",
//         "tags"
//     ],
//     "properties": {
//         "id": {
//             "type": "number"
//         },
//         "name": {
//             "type": "string"
//         },
//         "price": {
//             "type": "number"
//         },
//         "testBool": {
//             "type": "boolean"
//         },
//         "tags": {
//             "type": "array",
//             "items": {
//                 "type": "string"
//             }
//         }
//     }
// }
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
  
  let test = 
`cy.request('GET', '/test').then((response) => {
  expect(response.status).to.eq(200)
  cy.wrap(response.body).should('be.a', '${firstType}')
    `;
  
  if(firstType == 'Array') {
    let propertiesKeys = Object.keys(json.properties[0].properties);
    let properties = Object.values(json.properties[0].properties);
    test+= `
  cy.wrap(response.body).its('length').should('be.gt', 1)
  cy.wrap(response.body).each((value, index)=>{
    cy.wrap(value).should('be.a', 'Object')
    expect(value).to.have.all.keys(${propertiesKeys.map((item)=>{return "'"+item+"'";})})
    `;
    for(let i=0; i<properties.length; i++){
      test+=
    `cy.wrap(value.${propertiesKeys[i]}).should('be.a', '${properties[i].type}')
    `
    }
    test+= `
  })
})`
  } else {
    let propertiesKeys = Object.keys(json.properties);
    let properties = Object.values(json.properties);
    test+= `
  expect(response.body).to.have.all.keys(${propertiesKeys.map((item)=>{return "'"+item+"'";})})
  `
    for(let i=0; i<properties.length; i++){
      test+=
  `cy.wrap(response.body.${propertiesKeys[i]}).should('be.a', '${properties[i].type}')
  `
    }
    test+= `
})`
  }
  console.log(test);
  document.querySelector('.js-output').value = test;
  return test;
}
