"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  var value = ev.replace(/'/gi, '"');

  try {
    value = JSON.parse(value);

    if (_typeof(value) !== 'object') {
      try {
        throw new UserException();
      } catch (e) {
        console.log(e);
      }
    }

    setError('');
  } catch (err) {
    try {
      throw new UserException();
    } catch (e) {
      console.log(e);
    }
  }

  writeTests(value);
} // function checkJSON(value){
//   if(Array.isArray(value)){
//     writeTests(true);
//   }
// }


function writeTests(json) {
  var firstType;

  if (json.required[0] == '0') {
    firstType = 'Array';
  } else {
    firstType = 'Object';
  }

  var test = "cy.request('GET', '/test').then((response) => {\n  expect(response.status).to.eq(200)\n  cy.wrap(response.body).should('be.a', '".concat(firstType, "')\n    ");

  if (firstType == 'Array') {
    var propertiesKeys = Object.keys(json.properties[0].properties);
    var properties = Object.values(json.properties[0].properties);
    test += "\n  cy.wrap(response.body).its('length').should('be.gt', 1)\n  cy.wrap(response.body).each((value, index)=>{\n    cy.wrap(value).should('be.a', 'Object')\n    expect(value).to.have.all.keys(".concat(propertiesKeys.map(function (item) {
      return "'" + item + "'";
    }), ")\n    ");

    for (var i = 0; i < properties.length; i++) {
      test += "cy.wrap(value.".concat(propertiesKeys[i], ").should('be.a', '").concat(properties[i].type, "')\n    "); // if(properties[i].type == 'array') {
      //   test+=
      // `cy.wrap(value.${propertiesKeys[i]}[0]).should('be.a', '${properties[i].items.type}')
      // `
      // }
    }

    test += "\n  })\n})";
  } else {
    var _propertiesKeys = Object.keys(json.properties);

    var _properties = Object.values(json.properties);

    test += "\n  expect(response.body).to.have.all.keys(".concat(_propertiesKeys.map(function (item) {
      return "'" + item + "'";
    }), ")\n  ");

    for (var _i = 0; _i < _properties.length; _i++) {
      test += "cy.wrap(response.body.".concat(_propertiesKeys[_i], ").should('be.a', '").concat(_properties[_i].type, "')\n  ");

      if (_properties[_i].type == 'array') {
        test += "cy.wrap(response.body.".concat(_propertiesKeys[_i], "[0]).should('be.a', '").concat(_properties[_i].items.type, "')\n  ");
      }
    }

    test += "\n})";
  }

  console.log(test);
  document.querySelector('.js-output').value = test;
  return test;
}