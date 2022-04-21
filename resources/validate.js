const upper = new Set("ABCDEFGHIJKLMNOPQRSTUWXYZ");
const lower = new Set("abcdefghijklmnopqrstuwxyz");
const beginEndChars = new Set("abcdefghijklmnopqrstuwxyz()");
const validCharacters = new Set("abcdefghijklmnopqrstuvVwxyz()~¬^∧∨⊕+><→↔ ");
const operators = new Set("^∧∨⊕+><→↔");


const invalidParentheses = (text) => {
    let brackets = new Set("()");
    let bracketsText = "";
    for (let char of text) {
        if (brackets.has(char)) {
            bracketsText += char;
        }
    }
    let [openCount, closeCount] = [0, 0];
    for (let bracket of bracketsText) {
        if (bracket === "(") {
            openCount += 1;
        } else {
            closeCount += 1;
        }
        if (closeCount > openCount) {
            return true;
        }
        
    }
    return closeCount !== openCount;


}

const invalidOperationOrder = (text) => {
    let textToCheck = text.trim().split(" ").join("");
    for (let i = 0; i < textToCheck.length; i++) {
        let char = textToCheck[i];
        if (i > 0 && operators.has(char) && !lower.has(textToCheck[i - 1]) && textToCheck[i - 1] !== ")") {
            return true;
        }
    }
    return false;
}


const containsInvalidChars = (text) => {
    for (let char of text) {
        if (!validCharacters.has(char)) {
            return char;
        }
    }
    return false;
}

const doubleChars = (text) => {
    let textToCheck = text.trim().split(" ").join("");
    for (let i = 0; i < textToCheck.length; i++) {
        let char = textToCheck[i];
        if (i > 0 && lower.has(char) && lower.has(textToCheck[i - 1])) {
            return true;
        }
        if (i > 0 && operators.has(char) && operators.has(textToCheck[i - 1])) {
            return true;
        }
    }
    return false;
}



const upperCaseLetter = (text) => {
    for (let char of text) {
        if (upper.has(char) ) {
            return true;
        }
    }
    return false;
}

const invalidBeginEnd = (text) => {
    text = text.split(")").join("").split("(").join("");

    let lastChar = text[text.length - 1];
    if (text[0] !== "~" && text[0] !== "¬" && !beginEndChars.has(text[0])) {
        return "Invalid beginning character: " + text[0];
    }
    if (!beginEndChars.has(lastChar)) {
        return "Invalid ending character: " + lastChar;
    }
    return false;
}

export const validateInput = (text) => {
    text = text.trim();
    
    
    if (!text.length) {
        return true;
    }

    if (upperCaseLetter(text)) {
        return "Propositions take only lowercase letters!";
    }

    let invalidBegEnd = invalidBeginEnd(text);
    if (invalidBegEnd) {
        return invalidBegEnd;
    } 


    let invalidChars = containsInvalidChars(text);
    if (invalidChars) {
        return "Invalid character: " + invalidChars;
    } 
    

    if (doubleChars(text) || invalidOperationOrder(text)) {
        return "Invalid input!";
    }

    if (invalidParentheses(text)) {
        return "Brackets do not match!";
    }
    
    return false;
}