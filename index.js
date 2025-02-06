document.addEventListener('DOMContentLoaded', () => {
    const problemsContainer = document.getElementById('problemsContainer');

    // Problem 4: Calculate Area of Triangle
    const problem4 = createProblem4();
    problemsContainer.appendChild(problem4);

    // Problem 5: Rotate String
    const problem5 = createProblem5();
    problemsContainer.appendChild(problem5);

    // Problem 6: Leap Year
    const problem6 = createProblem6();
    problemsContainer.appendChild(problem6);

    // Problem 7: January 1st Sundays
    const problem7 = createProblem7();
    problemsContainer.appendChild(problem7);
});

function createProblem4() {
    const container = document.createElement('div');
    container.className = 'problem';

    const title = document.createElement('h2');
    title.textContent = 'Problem 4: Calculate Area of Triangle (Sides: 5, 6, 7)';
    
    const description = document.createElement('p');
    description.textContent = "Calculate the area of a triangle using Heron's formula where three sides are 5, 6, and 7 units.";
    
    const codeBlock = document.createElement('pre');
    codeBlock.textContent = 
`function calculateTriangleArea(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
const area = calculateTriangleArea(5, 6, 7).toFixed(2);`;
    
    const demo = document.createElement('div');
    demo.className = 'demo';
    
    const strong = document.createElement('strong');
    strong.textContent = 'Result:';
    
    const areaResult = document.createElement('div');
    areaResult.id = 'areaResult';
    areaResult.className = 'result';
    areaResult.textContent = `Area: ${calculateTriangleArea(5, 6, 7).toFixed(2)} square units`;
    
    demo.appendChild(strong);
    demo.appendChild(areaResult);
    container.append(title, description, codeBlock, demo);
    
    return container;
}

function createProblem5() {
    const container = document.createElement('div');
    container.className = 'problem';

    const title = document.createElement('h2');
    title.textContent = "Problem 5: Rotate String 'w3resource'";
    
    const description = document.createElement('p');
    description.textContent = "Watch as the string 'w3resource' rotates right by one character every second.";
    
    const codeBlock = document.createElement('pre');
    codeBlock.textContent = 
`function rotateString(str) {
    return str[str.length-1] + str.substring(0, str.length-1);
}`;
    
    const demo = document.createElement('div');
    demo.className = 'demo';
    
    const strong = document.createElement('strong');
    strong.textContent = 'Live Rotation:';
    
    const rotatingString = document.createElement('div');
    rotatingString.id = 'rotatingString';
    rotatingString.className = 'result';
    rotatingString.textContent = 'w3resource';
    
    demo.appendChild(strong);
    demo.appendChild(rotatingString);
    container.append(title, description, codeBlock, demo);
    
    // Set up rotation interval
    let rotatingStr = 'w3resource';
    setInterval(() => {
        rotatingStr = rotatingStr[rotatingStr.length-1] + rotatingStr.substring(0, rotatingStr.length-1);
        rotatingString.textContent = rotatingStr;
    }, 1000);
    
    return container;
}

function createProblem6() {
    const container = document.createElement('div');
    container.className = 'problem';

    const title = document.createElement('h2');
    title.textContent = 'Problem 6: Check Leap Year';
    
    const description = document.createElement('p');
    description.textContent = "Enter a year to check if it's a leap year according to the Gregorian calendar.";
    
    const codeBlock = document.createElement('pre');
    codeBlock.textContent = 
`function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}`;
    
    const demo = document.createElement('div');
    demo.className = 'demo';
    
    const strong = document.createElement('strong');
    strong.textContent = 'Test a Year:';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'yearInput';
    input.placeholder = 'Enter year';
    input.min = '1';
    
    const button = document.createElement('button');
    button.id = 'checkLeapYearButton';
    button.textContent = 'Check';
    button.addEventListener('click', checkLeapYear);
    
    const result = document.createElement('div');
    result.id = 'leapYearResult';
    result.className = 'result';
    
    demo.append(strong, input, button, result);
    container.append(title, description, codeBlock, demo);
    
    return container;
}

function createProblem7() {
    const container = document.createElement('div');
    container.className = 'problem';

    const title = document.createElement('h2');
    title.textContent = 'Problem 7: Find January 1st Sundays (2014–2050)';
    
    const description = document.createElement('p');
    description.textContent = 'Display all years between 2014 and 2050 where January 1st falls on a Sunday.';
    
    const codeBlock = document.createElement('pre');
    codeBlock.textContent = 
`function findSundayYears() {
    const years = [];
    for (let year = 2014; year <= 2050; year++) {
        if (new Date(year, 0, 1).getDay() === 0) {
            years.push(year);
        }
    }
    return years;
}`;
    
    const demo = document.createElement('div');
    demo.className = 'demo';
    
    const strong = document.createElement('strong');
    strong.textContent = 'Years with Sunday January 1st:';
    
    const result = document.createElement('div');
    result.id = 'sundayYears';
    result.className = 'result';
    result.textContent = findSundayYears().join(', ');
    
    demo.append(strong, result);
    container.append(title, description, codeBlock, demo);
    
    return container;
}

// Utility functions
function calculateTriangleArea(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function checkLeapYear() {
    const yearInput = document.getElementById('yearInput');
    const year = parseInt(yearInput.value);
    const resultElement = document.getElementById('leapYearResult');
    
    if (!yearInput.value) {
        resultElement.textContent = 'Please enter a year';
        return;
    }
    
    if (isNaN(year) || year < 1) {
        resultElement.textContent = 'Please enter a valid year';
        return;
    }
    
    const isLeap = isLeapYear(year);
    resultElement.textContent = `${year} is ${isLeap ? '' : 'not '}a leap year`;
}

function findSundayYears() {
    const years = [];
    for (let year = 2014; year <= 2050; year++) {
        if (new Date(year, 0, 1).getDay() === 0) {
            years.push(year);
        }
    }
    return years;
}