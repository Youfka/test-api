"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function setError(err) {
  document.querySelector('.js-error').innerHTML = err;
}

function UserException() {
  setError("Значение должно быть объектом или массивом!");
}

function getJSON(ev) {
  var value = {
    "required": ["0", "1"],
    "properties": {
      "0": {
        "required": ["id", "task"],
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
        "required": ["id", "task"],
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
    } // let value = ev.replace(/'/gi, '"');

  };

  try {
    // value = JSON.parse(value);
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
  var _console;

  var firstType;

  if (json.required[0] == '0') {
    firstType = 'Array';
  } else {
    firstType = 'Object';
  }

  var test = "cy.request('GET', '/test').then((response) => {\n    expect(response.status).to.eq(200)\n    cy.wrap(response.body).its('length').should('be.gt', 1)\n    cy.wrap(response.body).should('be.a', ".concat(firstType, ")\n    ");

  if (firstType == 'Array') {
    var propertiesKeys = json.properties[0].required;
    var properties = Object.values(json.properties[0].properties);
    test += "\n    cy.wrap(response.body).each((value, index)=>{\n      cy.wrap(value).should('be.a', 'Object')\n      expect(value).to.have.all.keys(".concat(_toConsumableArray(propertiesKeys), ")\n      ");

    for (var i = 0; i < properties.length; i++) {
      test += "cy.wrap(item).should('be.a', '".concat(properties[i].type, "')\n      ");
    }

    test += "\n    })\n  })";
  } else {
    var _propertiesKeys = Object.values(json.properties);

    var _properties = Object.values(json.properties);

    test += "\n    cy.wrap(response.body).should('be.a', 'Object')\n    expect(response.body).to.have.all.keys(".concat(_toConsumableArray(_propertiesKeys), ")\n    ");

    for (var _i = 0; _i < _properties.length; _i++) {
      test += "cy.wrap(item).should('be.a', '".concat(_properties[_i].type, "')\n      ");
    }

    test += "\n    })\n  })";
  } // const getItems = () =>
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


  (_console = console).log.apply(_console, [test].concat(_toConsumableArray(json.properties[0].required)));

  document.querySelector('.js-output').value = test;
  return test;
}