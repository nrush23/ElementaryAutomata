const text = document.getElementById("text");
const fill = "\u2588\u2588";
const blank = "\u0020\u0020";

var rules;
var rows;

//If you want to add custom values to the first row,
//fill them inside that array
var customFirstRow = [];

displayRule(8, customFirstRow);

//Main function that sets up the program. Last time I worked on this,
//I was in the middle of changing it so it could work for 16 rules,
//but I forgot to finish
function displayRule(ruleAmount, customFirstRow) {

    //rules is actually an array that contains the true/false values for the number
    //the prompts get the specifications to display the output
    //binary is the automata number turned into 0's and 1's
    rules = setRules(ruleAmount);
    var automata = prompt("Please enter a number between 0 and 255");
    var cells = prompt("How many cells would you like?");
    customFirstRow = JSON.parse("["+ prompt("Enter comma separated values for custom input. Leave blank for default") + "]");
    var iterations = prompt("How many iterations?");
    var binary = convertToBinary(automata, ruleAmount);

    //Create our columns and initalize them to have false values
    rows = setRows(cells, customFirstRow);

    //print the first row and then print the rest of the rows
    printFirstRow();
    for (let i = 1; i < iterations; i++) {
        text.innerHTML += setValues(binary);
        text.innerHTML += "<br>";
    }

}


//Function to set the rules array we're going to use
//to iterate over our cells
function setRules(num) {

    var rules = new Array(num);
    var binaryLength = Math.log2(num);

    for (let i = 0; i < num; i++) {

        var bin = convertToBinary(i, binaryLength);
        var rule = new Array(binaryLength);

        for (let j = 0; j < binaryLength; j++) {
            if (bin.charAt(j) == 1) {
                rule[j] = true;
            } else {
                rule[j] = false;
            }
        }

        rules[i] = rule;
    }

    return rules;

}

function setRows(cells, customFirstRow){

    var tempRows = new Array(2);
    tempRows[0] = createRow(cells);
    tempRows[1] = createRow(cells);

    //set the middle value to true if no array is given
    if(customFirstRow.length == 0){
        tempRows[0][Math.floor(tempRows[0].length / 2) - 1] = true;
    }else{
        for(let i = 0; i < customFirstRow.length; i++){
            tempRows[0][customFirstRow[i]] = true;
        }
    }

    return tempRows;
}

//Function to convert to binary by getting the binary number
//and cushioning with zeroes if necessary
function convertToBinary(number, digits) {

    var binary = getBinary(number);

    if (binary.length < digits) {
        binary = leadingZeroes(binary, digits);
    }

    console.log(binary);

    return binary;

}

//Function to turn a integer into binary by figuring out if it's
//even (last digit is even or odd) and then dividing by two

//You can do this with a bit shift
function getBinary(number) {

    var num = number.toString();
    var temp = "";

    while (number != 0) {

        var lastChar = num.charAt(num.length - 1);

        if (lastChar == "0" || lastChar == "2" || lastChar == "4" || lastChar == "6" || lastChar == "8") {
            temp = "0" + temp;
        } else {
            temp = "1" + temp;
        }

        number = Math.floor(number / 2);
        num = number.toString();
    }

    return temp;

}

//Function to print the first row, if the value is true fill
//otherwise leave the blank character
function printFirstRow() {

    text.innerHTML = "";

    for (let i = 0; i < rows[0].length; i++) {

        if (rows[0][i]) {
            text.innerHTML += fill;
        } else {
            text.innerHTML += blank;
        }

    }

    text.innerHTML += "<br>";

}

//Cushions a binary number with the correct amount of zeros if it's
//missing any
function leadingZeroes(number, length) {

    while (number.length < length) {

        number = "0" + number;

    }
    return number;

}

//Function to apply the rules and get the correct string fill
function setValues(binary) {

    var tempString = "";
    var match;
    var rule;

    //For each cell in the row, see if it matches any rule
    //0 through 8 and check if it matches
    for (let i = 0; i < rows[0].length; i++) {

        match = false;
        rule = 0;

        while (rule < 8 && !match) {

            //If the cell is 0, wrap around with the last cell
            //If the cell is the last one, wrap around with the first cell
            if (i == 0) {
                match = checkMatch(rows[0].length - 1, 0, 1, rule);
            } else if (i == rows[0].length - 1) {
                match = checkMatch(rows[0].length - 2, rows[0].length - 1, 0, rule);
            } else {
                match = checkMatch(i - 1, i, i + 1, rule);
            }

            if (!match) {
                rule++;
            }

        }

        //If a match was not found, add blank otherwise fill
        if (binary.charAt(7 - rule) == 0) {
            //blank
            tempString += blank;
            rows[1][i] = false;
        } else {
            //fill
            tempString += fill;
            rows[1][i] = true;
        }

    }

    rows[0] = rows[1];
    rows[1] = createRow(rows[0].length);

    return tempString;

}

//function to check if a rule works by comparing the left, mid, and right positions
//with the corresponding rule positions
function checkMatch(left, mid, right, rule) {

    if (rows[0][left] == rules[rule][0] && rows[0][mid] == rules[rule][1] && rows[0][right] == rules[rule][2]) {
        return true;
    } else {
        return false;
    }

}

//How to create a row and set its values to false
function createRow(length) {

    var temp = new Array(length);

    for (let i = 0; i < length; i++) {
        temp[i] = false;
    }

    return temp;

}

//Generate new rule
function makeNewRule(){
    text.innerHTML = "";
    displayRule(8, customFirstRow);
}