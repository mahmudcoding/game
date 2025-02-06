// Add these styles to your CSS
const styleSheet = document.createElement('style');

document.head.appendChild(styleSheet);

// Add theme toggle button
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'themeToggle';
    toggle.textContent = '🌞 Light Mode';
    toggle.addEventListener('click', toggleTheme);
    document.body.appendChild(toggle);
}

function toggleTheme() {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    body.classList.toggle('dark-mode');
    toggle.textContent = body.classList.contains('dark-mode') ? '🌙 Dark Mode' : '🌞 Light Mode';
}

// Enhance Problem 4 (Triangle Area)
function enhanceTriangleArea() {
    const areaResult = document.getElementById('areaResult');
    if (areaResult) {
        // Add visual representation of the triangle
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        areaResult.parentElement.insertBefore(canvas, areaResult);

        const ctx = canvas.getContext('2d');
        drawTriangle(ctx, 5, 6, 7);
    }
}

function drawTriangle(ctx, a, b, c) {
    // Convert side lengths to coordinates using cosine law
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const scale = 20;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(50 + c * scale, 150);
    ctx.lineTo(50 + c * scale * Math.cos(angleA), 150 - c * scale * Math.sin(angleA));
    ctx.closePath();

    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
    ctx.stroke();
}

// Enhance Problem 5 (String Rotation)
function enhanceStringRotation() {
    const rotatingString = document.getElementById('rotatingString');
    if (rotatingString) {
        rotatingString.classList.add('rotating-animation');
        
        // Add speed control
        const speedControl = document.createElement('input');
        speedControl.type = 'range';
        speedControl.min = '100';
        speedControl.max = '2000';
        speedControl.value = '1000';
        speedControl.style.display = 'block';
        speedControl.style.marginTop = '10px';
        
        const speedLabel = document.createElement('div');
        speedLabel.textContent = 'Rotation Speed (ms):';
        
        rotatingString.parentElement.appendChild(speedLabel);
        rotatingString.parentElement.appendChild(speedControl);
    }
}

// Enhance Problem 6 (Leap Year)
function enhanceLeapYear() {
    const yearInput = document.getElementById('yearInput');
    const result = document.getElementById('leapYearResult');
    
    if (yearInput && result) {
        // Add real-time validation
        yearInput.addEventListener('input', () => {
            const year = parseInt(yearInput.value);
            if (year && year > 0) {
                yearInput.style.borderColor = '#4CAF50';
            } else {
                yearInput.style.borderColor = '#ff4444';
            }
        });

        // Enhance the result display
        const originalCheckLeapYear = window.checkLeapYear;
        window.checkLeapYear = () => {
            originalCheckLeapYear();
            result.classList.remove('success-animation');
            void result.offsetWidth; // Trigger reflow
            result.classList.add('success-animation');
        };
    }
}

// Enhance Problem 7 (Sunday Years)
function enhanceSundayYears() {
    const sundayYears = document.getElementById('sundayYears');
    if (sundayYears) {
        // Create an interactive calendar view
        const years = findSundayYears();
        sundayYears.textContent = '';

        const calendarContainer = document.createElement('div');
        calendarContainer.style.display = 'flex';
        calendarContainer.style.flexWrap = 'wrap';
        calendarContainer.style.gap = '10px';

        years.forEach(year => {
            const yearBox = document.createElement('div');
            yearBox.textContent = year;
            yearBox.style.padding = '10px';
            yearBox.style.backgroundColor = 'var(--card-bg)';
            yearBox.style.borderRadius = '4px';
            yearBox.style.cursor = 'pointer';
            yearBox.style.transition = 'all 0.3s ease';

            yearBox.addEventListener('mouseover', () => {
                yearBox.style.transform = 'scale(1.1)';
            });

            yearBox.addEventListener('mouseout', () => {
                yearBox.style.transform = 'scale(1)';
            });

            yearBox.addEventListener('click', () => {
                const date = new Date(year, 0, 1);
                alert(`January 1st, ${year} was a Sunday!\nFull date: ${date.toDateString()}`);
            });

            calendarContainer.appendChild(yearBox);
        });

        sundayYears.appendChild(calendarContainer);
    }
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
    createThemeToggle();
    enhanceTriangleArea();
    enhanceStringRotation();
    enhanceLeapYear();
    enhanceSundayYears();
});

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
// Add confetti animation
function createConfetti() {
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.4.0/confetti.browser.min.js';
    document.head.appendChild(confettiScript);
}

// Add floating progress indicator
function createProgressIndicator() {
    const progress = document.createElement('div');
    progress.id = 'progressIndicator';
    progress.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--card-bg);
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: var(--shadow);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(progress);
    updateProgress();
}

function updateProgress() {
    const total = document.querySelectorAll('.problem').length;
    const completed = document.querySelectorAll('.problem.completed').length;
    const progress = document.getElementById('progressIndicator');
    if (progress) {
        progress.textContent = `Progress: ${completed}/${total} Problems`;
    }
}

// Add interactive triangle playground
function createTrianglePlayground() {
    const problem4 = document.querySelector('.problem:nth-child(1)');
    const playground = document.createElement('div');
    playground.className = 'triangle-playground';
    playground.innerHTML = `
        <h3>Triangle Playground</h3>
        <div class="controls">
            <label>Side A: <input type="range" min="1" max="10" value="5" id="sideA"></label>
            <label>Side B: <input type="range" min="1" max="10" value="6" id="sideB"></label>
            <label>Side C: <input type="range" min="1" max="10" value="7" id="sideC"></label>
        </div>
        <canvas id="triangleCanvas" width="300" height="200"></canvas>
        <div id="triangleInfo"></div>
    `;
    problem4.appendChild(playground);

    // Add event listeners
    ['sideA', 'sideB', 'sideC'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateTriangle);
    });
}

function updateTriangle() {
    const a = Number(document.getElementById('sideA').value);
    const b = Number(document.getElementById('sideB').value);
    const c = Number(document.getElementById('sideC').value);

    // Check if triangle is possible
    if (a + b > c && b + c > a && a + c > b) {
        const area = calculateTriangleArea(a, b, c);
        const canvas = document.getElementById('triangleCanvas');
        const ctx = canvas.getContext('2d');
        drawTriangle(ctx, a, b, c);
        
        document.getElementById('triangleInfo').innerHTML = `
            <div style="color: var(--text-primary)">
                Area: ${area.toFixed(2)} square units<br>
                Perimeter: ${(a + b + c).toFixed(2)} units
            </div>
        `;
    } else {
        document.getElementById('triangleInfo').innerHTML = `
            <div style="color: #ff4444">
                These side lengths cannot form a triangle!
            </div>
        `;
    }
}

// Add interactive string rotation visualizer
function enhanceStringRotationVisualizer() {
    const problem5 = document.querySelector('.problem:nth-child(2)');
    const visualizer = document.createElement('div');
    visualizer.className = 'string-visualizer';
    visualizer.innerHTML = `
        <div class="controls">
            <input type="text" id="customString" placeholder="Enter custom string" value="w3resource">
            <button id="startRotation">Start/Stop</button>
        </div>
        <div class="visualization-area"></div>
    `;
    problem5.appendChild(visualizer);

    let isRotating = true;
    let rotationInterval;

    document.getElementById('startRotation').addEventListener('click', () => {
        isRotating = !isRotating;
        if (isRotating) {
            startRotation();
        } else {
            clearInterval(rotationInterval);
        }
    });

    document.getElementById('customString').addEventListener('input', (e) => {
        if (isRotating) {
            clearInterval(rotationInterval);
            startRotation();
        }
    });

    function startRotation() {
        let str = document.getElementById('customString').value;
        const area = problem5.querySelector('.visualization-area');
        clearInterval(rotationInterval);
        
        rotationInterval = setInterval(() => {
            str = str[str.length - 1] + str.slice(0, -1);
            area.textContent = str;
        }, 1000);
    }

    startRotation();
}

// Add leap year calendar visualization
function createLeapYearCalendar() {
    const problem6 = document.querySelector('.problem:nth-child(3)');
    const calendar = document.createElement('div');
    calendar.className = 'leap-year-calendar';
    calendar.innerHTML = `
        <h3>Century View</h3>
        <div class="century-grid"></div>
    `;
    problem6.appendChild(calendar);

    const grid = calendar.querySelector('.century-grid');
    const startYear = 2000;
    const endYear = 2100;

    for (let year = startYear; year <= endYear; year++) {
        const cell = document.createElement('div');
        cell.className = 'year-cell';
        cell.textContent = year;
        if (isLeapYear(year)) {
            cell.classList.add('leap-year');
        }
        cell.addEventListener('click', () => {
            if (isLeapYear(year)) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        });
        grid.appendChild(cell);
    }
}

// Add Sunday calendar heatmap
function createSundayHeatmap() {
    const problem7 = document.querySelector('.problem:nth-child(4)');
    const heatmap = document.createElement('div');
    heatmap.className = 'sunday-heatmap';
    heatmap.innerHTML = `
        <h3>First Day Distribution (2014-2050)</h3>
        <div class="heatmap-grid"></div>
    `;
    problem7.appendChild(heatmap);

    const grid = heatmap.querySelector('.heatmap-grid');
    const years = findSundayYears();
    
    for (let year = 2014; year <= 2050; year++) {
        const cell = document.createElement('div');
        cell.className = 'year-cell';
        cell.textContent = year;
        
        const date = new Date(year, 0, 1);
        const dayOfWeek = date.getDay();
        cell.style.backgroundColor = `hsl(${dayOfWeek * 51}, 70%, 60%)`;
        
        if (years.includes(year)) {
            cell.classList.add('sunday-year');
        }
        
        cell.addEventListener('mouseover', () => {
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
            cell.setAttribute('title', `January 1st, ${year} was a ${dayName}`);
        });
        
        grid.appendChild(cell);
    }
}

// Add these styles
const newStyles = `
    .triangle-playground, .string-visualizer, .leap-year-calendar, .sunday-heatmap {
        margin-top: 20px;
        padding: 15px;
        background: var(--demo-bg);
        border-radius: 8px;
    }

    .controls {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        flex-wrap: wrap;
    }

    .controls label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .century-grid, .heatmap-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 5px;
        margin-top: 15px;
    }

    .year-cell {
        padding: 5px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .leap-year {
        background-color: var(--button-bg);
        color: white;
    }

    .year-cell:hover {
        transform: scale(1.1);
    }

    .sunday-year {
        border: 2px solid var(--button-bg);
    }

    .visualization-area {
        font-family: monospace;
        font-size: 1.2rem;
        margin-top: 10px;
        padding: 10px;
        background: var(--card-bg);
        border-radius: 4px;
        text-align: center;
    }

    #progressIndicator:hover {
        transform: scale(1.1);
    }

    .completed {
        border-left: 4px solid var(--button-bg);
    }
`;

// Initialize all new features
document.addEventListener('DOMContentLoaded', () => {
    // Add new styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = newStyles;
    document.head.appendChild(styleSheet);

    // Initialize features
    createConfetti();
    createProgressIndicator();
    createTrianglePlayground();
    enhanceStringRotationVisualizer();
    createLeapYearCalendar();
    createSundayHeatmap();

    // Mark problems as completed when interacted with
    document.querySelectorAll('.problem').forEach(problem => {
        problem.addEventListener('click', () => {
            if (!problem.classList.contains('completed')) {
                problem.classList.add('completed');
                updateProgress();
            }
        });
    });
});