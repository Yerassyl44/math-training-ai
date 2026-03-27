const FORMULA_DATA = {
    'Площадь': 'S=a², S=ab, S=πr²',
    'Объем': 'V=a³, V=πr²h, V=abc',
    'Линейное уравнение': 'ax + b = 0',
    'Квадратное уравнение': 'ax² + bx + c = 0',
    'Процент': 'Часть / Целое * 100%'
};

const TASK_GENERATORS = [
    {
    name: "Алгебра",
    tasks: [
        () => {
            const num = Math.floor(Math.random() * 9) + 1;
            return {
                question: `Решите уравнение относительно x: ax + ${num} = 0`,
                options: [
                    `При a≠0, x = -${num}/a; при a=0, корней нет`,
                    `При a≠0, x = ${num}/a; при a=0, x = 0`,
                    `Всегда x = -${num}/a`,
                    `При a=0, x любое число`
                ],
                correct: `При a≠0, x = -${num}/a; при a=0, корней нет`,
                formulaKey: 'Линейное уравнение',
                hint: `Если a=0, уравнение превращается в 0 = -${num}, что невозможно.`
            };
        }
    ]
},
    {
    name: "Квадратные",
    tasks: [
        () => {
            const k = Math.floor(Math.random() * 5) + 1;
            return {
                question: `При каких значениях параметра 'a' уравнение x² - 2ax + ${k*k} = 0 имеет ровно один корень?`,
                options: [
                    `a = ${k} или a = -${k}`,
                    `только a = ${k}`,
                    `при любом a > 0`,
                    `a = ${k*k}`
                ],
                correct: `a = ${k} или a = -${k}`,
                formulaKey: 'Квадратное уравнение',
                hint: `Уравнение имеет один корень, когда дискриминант D = 0. D = (-2a)² - 4*1*${k*k}.`
            };
        }
    ]
},
    {
        name: "Проценты",
        tasks: [
            () => {
                const total = [100, 200, 300, 400, 500, 1000][Math.floor(Math.random() * 6)];
                const pct = [5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 6)];
                const res = (total * pct) / 100;
                return {
                    question: `Найдите ${pct}% от числа ${total}`,
                    options: [res, res + 5, res / 2, pct * 2],
                    correct: res,
                    formulaKey: 'Процент',
                    hint: `Чтобы найти часть, умножьте число на процент и разделите на 100: (${total} * ${pct}) / 100`
                };
            },
            () => {
                const res = [10, 20, 50, 100][Math.floor(Math.random() * 4)];
                const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
                const total = (res * 100) / pct;
                return {
                    question: `Число ${res} — это ${pct}% от неизвестного числа. Найдите это число.`,
                    options: [total, total - 10, total + 50, res * 2],
                    correct: total,
                    formulaKey: 'Процент',
                    hint: `Чтобы найти целое, разделите известную часть на процент и умножьте на 100: (${res} / ${pct}) * 100`
                };
            },
            () => {
                const total = [50, 100, 200, 500][Math.floor(Math.random() * 4)];
                const part = total / [2, 4, 5, 10][Math.floor(Math.random() * 4)];
                const res = (part / total) * 100;
                return {
                    question: `Сколько процентов составляет число ${part} от числа ${total}?`,
                    options: [`${res}%`, `${res + 5}%`, `${res / 2}%`, `15%`],
                    correct: `${res}%`,
                    formulaKey: 'Процент',
                    hint: `Разделите часть на целое и умножьте на 100: (${part} / ${total}) * 100`
                };
            }
        ]
    }
]

const App = {
    init() {
        this.cacheDOM();
        if (!this.topicSelect) return console.error("Ошибка: topic-select не найден!");
        this.bindEvents();
        this.renderFormulaBook();
    },

    cacheDOM() {
        this.questionEl = document.getElementById('question');
        this.optionsContainer = document.getElementById('options-container');
        this.hintContainer = document.getElementById('ai-hint-container');
        this.hintText = document.getElementById('ai-hint-text');
        this.generateBtn = document.getElementById('generate-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.formulaBox = document.getElementById('formula-reference');
        this.topicSelect = document.getElementById('topic-select');
    },

    bindEvents() {
        this.generateBtn.onclick = () => this.generateTask();
        this.nextBtn.onclick = () => this.generateTask();
    },

    renderFormulaBook() {
        let html = '<h3>Справочник Формул</h3>';
        Object.entries(FORMULA_DATA).forEach(([key, val]) => {
            html += `<div class="formula-item" data-key="${key}"><strong>${key}</strong><br><small>${val}</small></div>`;
        });
        this.formulaBox.innerHTML = html;
    },

    generateTask() {
        const val = this.topicSelect.value;
        const cat = val === 'all' ? TASK_GENERATORS[Math.floor(Math.random() * TASK_GENERATORS.length)] : TASK_GENERATORS.find(c => c.name === val);
        
        const task = cat.tasks[Math.floor(Math.random() * cat.tasks.length)]();
        this.currentTask = task;

        this.questionEl.innerText = task.question;
        this.optionsContainer.innerHTML = '';
        task.options.sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = (e) => this.checkAnswer(opt, e.target);
            this.optionsContainer.appendChild(btn);
        });

        this.hintContainer.classList.add('hidden');
        this.nextBtn.classList.add('hidden');
        this.generateBtn.classList.add('hidden');
        this.highlightFormula(task.formulaKey);
    },

    checkAnswer(selected, btn) {
        this.optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        if (selected === this.currentTask.correct) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('wrong');
            this.hintText.innerText = this.currentTask.hint;
            this.hintContainer.classList.remove('hidden');
        }
        this.nextBtn.classList.remove('hidden');
    },

    highlightFormula(key) {
        document.querySelectorAll('.formula-item').forEach(i => i.classList.remove('active'));
        const item = document.querySelector(`.formula-item[data-key="${key}"]`);
        if (item) item.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());