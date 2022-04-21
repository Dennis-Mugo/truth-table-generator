const variablesMap = {};
const variablesMapOrder = [];

const compare = (arr1, arr2, sign) => {
  if (!arr1 || !arr1.length) {
    return arr2;
  }
  let res = [];
  if (sign === "^" || sign === String.fromCharCode(8743)) {
    for (let i = 0; i < arr1.length; i++) {
      res.push(arr1[i] && arr2[i]);
    }
  } else if (
    sign === "v" ||
    sign === "V" ||
    sign === String.fromCharCode(8744)
  ) {
    for (let i = 0; i < arr1.length; i++) {
      res.push(arr1[i] || arr2[i]);
    }
  } else if (sign === ">" || sign === String.fromCharCode(8594)) {
    for (let i = 0; i < arr1.length; i++) {
      res.push(arr1[i] === true && arr2[i] === false ? false : true);
    }
  } else if (sign === String.fromCharCode(8596) || sign === "<") {
    for (let i = 0; i < arr1.length; i++) {
      res.push(arr1[i] === arr2[i]);
    }
  } else if (sign === String.fromCharCode(8853) || sign === "+") {
    for (let i = 0; i < arr1.length; i++) {
      res.push(arr1[i] !== arr2[i]);
    }
  } else {
    res = arr2;
  }

  return res;
};

const negate = (col) => {
  return col.map((val) => !val);
};

const negationSym = (sym) => sym === "~" || sym === "¬";

const createTable = (position, numVariables) => {
  let changeCount = 2 ** (numVariables - position);
  let [boolean, size] = [true, 2 ** numVariables];
  let res = [];

  for (let i = 1; i <= size; i++) {
    res.push(boolean);
    if (i % changeCount === 0) {
      boolean = !boolean;
    }
  }

  return [res, negate(res)];
};

const evaluate = (expression) => {
  let propositionStack = [];

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];
    if (char === ")") {
      let newProposition;
      if (
        propositionStack.length > 0 &&
        propositionStack[propositionStack.length - 1] !== "("
      ) {
        newProposition = propositionStack.pop();
      }

      while (
        propositionStack.length > 0 &&
        propositionStack[propositionStack.length - 1] !== "("
      ) {
        let sign = propositionStack.pop();

        if (sign === "(" || sign instanceof Array) {
          propositionStack.push(sign);
          break;
        }

        if (negationSym(sign)) {
          newProposition = negate(newProposition);
        } else {
          newProposition = compare(
            propositionStack.pop(),
            newProposition,
            sign
          );
        }
      }

      if (
        propositionStack.length &&
        propositionStack[propositionStack.length - 1] === "("
      ) {
        propositionStack.pop();
      }

      if (propositionStack.length) {
        let peek = propositionStack[propositionStack.length - 1];
        if (negationSym(peek)) {
          newProposition = negate(newProposition);
          propositionStack.pop();
        }
      }

      propositionStack.push(newProposition);
    } else {
      propositionStack.push(char);
    }
  }

  
  return propositionStack;
};

const isLetter = (char) =>
  char.toUpperCase() != char.toLowerCase() && char != "v" && char != "V";

const tabulate = (expression, numVariables) => {
  let newExpression = ["("];
  let position = 1;
  for (let i = 0; i < expression.length; i++) {
    let elem = expression[i];
    if (isLetter(elem)) {
      let variableTable;
      if (!variablesMap[elem]) {
        let variableTables = createTable(position, numVariables);
        variableTable =
          i > 0 && negationSym(expression[i - 1])
            ? variableTables[1]
            : variableTables[0];
        variablesMap[elem] = variableTables[0];
        variablesMapOrder.push(elem);
        position++;
      } else {
        variableTable =
          i > 0 && negationSym(expression[i - 1])
            ? negate(variablesMap[elem])
            : variablesMap[elem];
      }

      newExpression.push(variableTable);
    } else {
      if (
        newExpression.length &&
        negationSym(elem) &&
        negationSym(newExpression[newExpression.length - 1])
      ) {
        newExpression.pop();
      } else {
        newExpression.push(elem);
      }
    }
  }

  for (let i = newExpression.length - 1; i >= 0; i--) {
    let char = newExpression[i];
    if (negationSym(char) && newExpression[i + 1] instanceof Array) {
      newExpression.splice(i, 1);
    }
  }
  newExpression.push(")");
  return newExpression;
};

const cleanData = (expression) => {
  if (!expression) return [];
  expression = expression.trim().split(" ").join("");
  let numVariables = 0;
  let cache = new Set();
  for (let elem of expression) {
    if (isLetter(elem) && !cache.has(elem)) {
      cache.add(elem);
      numVariables++;
    }
  }
  expression = tabulate(expression, numVariables);
  return expression;
};

const formatResult = () => {
  for (let key in variablesMap) {
    for (let i = 0; i < variablesMap[key].length; i++) {
      variablesMap[key][i] = variablesMap[key][i] === true ? "T" : "F";
    }
  }
};

export const evaluateTable = (proposition) => {
  variablesMap = {};
  variablesMapOrder = [];
  let tabulatedProposition = cleanData(proposition);
  let result = evaluate(tabulatedProposition);
  
  if (!variablesMap.hasOwnProperty(proposition.trim())) {
    variablesMapOrder.push(proposition);
  }
  
  variablesMap[proposition.trim()] = result[0];

  formatResult();
  return [variablesMap, variablesMapOrder];
};
