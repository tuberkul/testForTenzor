document.addEventListener('DOMContentLoaded', () => {
    // создаем массив в который войдут занятые и свободные поля, чтобы скрипт мог "видеть" поле.
    const   man = document.querySelector('.human'), 
            comp = document.querySelector('.ai'),
            startButton = document.querySelector('#startButton'),
            restartButton = document.querySelector('#restartButton'),
            winnigMessage = document.querySelector('.start-message'),
            cells = document.querySelectorAll('.cell'),
            numPool = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], //массив полей для ходов
            scoreManDiv  = document.querySelector('.score-in-message-man'),
            scoreCompDiv  = document.querySelector('.score-in-message-comp'),
            theWinner = document.querySelector('.theWinner');


            let manValue, 
                compValue, 
                counter = 1, 
                scoreMan = 0, 
                scoreAi = 0, 
                itsFirstGame = true, 
                fieldOfGame = [], // Массив основного игрового поля
                excludePool = []; //массив "занятых" полей 


    //Функция определения рандомного числа от 1 до num                    
    function randomInt (num) {
        const rndInt = Math.floor(Math.random() * num) + 1;
        return rndInt;
    }

    //Функция хода компьютера
    function aiTurn(compValue) {
        excludePool = [];
        console.log(compValue);
        const filteredPool = []; //Создаем обнуленный отфильтрованный массив
        fieldOfGame.forEach((e, i) => {
            if (fieldOfGame[i] !== '') {
                excludePool.push(i); //Записываем занятые поля
            }
        })

        numPool.forEach ((e, i) => {
            if (excludePool.indexOf(numPool[i]) === -1) {
                filteredPool.push(numPool[i]); // Записываем свободные поля
            }
        })
        if (counter === 1) { // Первый ход рандомный
            const rand = filteredPool[Math.floor(Math.random() * filteredPool.length)];
            fieldOfGame[rand] = compValue; // Запись в игровое поле
            cells.forEach(e => {
                if(+e.dataset.cell === rand) {
                    e.classList.add(compValue) // Запись в ячейку в HTML
                }
            })
            counter++;
        } else {
            // Если ход не первый - запускаем функцию анализа кода
            revievNextTurn(fieldOfGame, filteredPool, compValue, manValue)
        }
        
            
        
    }

    //начало игры
    function start() {
        excludePool = [];
        fieldOfGame = [   
            '', '', '',
            '', '', '',
            '', '', ''
        ]
        cells.forEach(e => {
            e.classList.remove('x')
            e.classList.remove('circle')
        })
        winnigMessage.classList.remove('show');
        winnigMessage.classList.add('hide');
        if (itsFirstGame) {
            cells.forEach(e => {
                e.addEventListener('click', (event) => {
                    
                    if (e.classList.contains('x') || e.classList.contains('circle')) {   //проверка на свободное поле
                    } else {
                        e.classList.add(manValue); //Запись в выбранное поле в HTML
                        fieldOfGame[+e.dataset.cell] = manValue; // Запись в игровое поле
                        if (winnerChek(compValue, manValue, fieldOfGame, true, false, true) === "man"){ // проверка на победу человека после хода
                            return;
                        }
                        aiTurn(compValue); // Ход компьютера
                        winnerChek(compValue, manValue, fieldOfGame, false, true, true) // проверка на победу компьюьтера после хода
                    }
                    
                })
            })
        }
        
        if (compValue === 'x') { // Если компьютер ходит первым
            aiTurn(compValue); // Ход компьютера
        }
    }

    // Функция анализа следующего хода
    function revievNextTurn(fieldOfGame, filteredPool, compValue, manValue) {
        let winAiCoef = 0, winManCoef = 0, posToMoveinManReview, posToMoveinAiReview;
        for (let i = 0; i < filteredPool.length; i++) { // Перебор по свободным клеткам
            const arrForAi = Array.from(fieldOfGame); // Массив ("игровое поле") для анализа хода компьютера
            const arrForMan = Array.from(fieldOfGame); // Массив ("игровое поле") для анализа хода человека
            arrForAi[filteredPool[i]] = compValue; // Помещаем на "игровое поле" ход компьютера
            arrForMan[filteredPool[i]] = manValue; // Помещаем на "игровое поле" ход человека
            if (winnerChek(compValue, manValue, arrForMan, true, false, false) === 'man') { // Проверяем победит ли человек при следующем ходе 
                posToMoveinManReview = filteredPool[i]; // Если победит, то то записываем позицию, на которую должен походить компьютер, чтобы не победил человек
                winManCoef++; // Если победит, то увеличиваем переменную для будущего сравнения
            } 
            
            if (winnerChek(compValue, manValue, arrForAi, false, true, false) === 'comp') { // Проверяем победит ли компьютер при следующем ходе 
                posToMoveinAiReview = filteredPool[i]; // Если победил, то то записываем позицию, на которую должен походить компьютер, чтобы выиграть
                winAiCoef++; // Если победит, то увеличиваем переменную для будущего сравнения
            } 
  
        }
        
            
        if (winAiCoef > 0) { // В приоритете победа компьюетра, поэтому проверка на его победу - первая
            fieldOfGame[posToMoveinAiReview] = compValue; // Записываем в основное игровое поле ход компьютера
            cells.forEach(e => {
                if(+e.dataset.cell === posToMoveinAiReview) {
                    e.classList.add(compValue) // Записываем в HTML ход компьютера
                }
            })
        } else if (winAiCoef === 0 && winManCoef === 0) { // Проверка на отсутвие угроз или победы
            const rand = filteredPool[Math.floor(Math.random() * filteredPool.length)]; //Ход будет рандомным, поэтому выбираем рандомное поле из доступных
                fieldOfGame[rand] = compValue;// Записываем в основное игровое поле ход компьютера
                cells.forEach(e => {
                    if(+e.dataset.cell === rand) {
                        e.classList.add(compValue)// Записываем в HTML ход компьютера
                    }
            })
        } else if (winAiCoef === 0){ // Проверка на возможную победу человека
            fieldOfGame[posToMoveinManReview] = compValue;// Записываем в основное игровое поле ход компьютера
            cells.forEach(e => {
                if(+e.dataset.cell === posToMoveinManReview) {
                    e.classList.add(compValue)// Записываем в HTML ход компьютера
                }
            })
        } 
    }
    
    // Функция проверки победителя (к сожалению, не смог придумать более оптимизированной проверки)
    function winnerChek(compValue, manValue, arr, manCheckin, aiCheckin, finalCheckin) {
        let winConditions = [               // массив победных комбинаций
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
            [0, 4, 8], [2, 4, 6] // diagonal
        ];

        if(manCheckin && !finalCheckin) { // условие победы человека в анализе следующего хода
            for (let i = 0; i < winConditions.length; i++) {
                let [a, b, c] = winConditions[i];
                if (arr[a] === manValue &&
                    arr[b] === manValue &&
                    arr[c] === manValue) {
                        return 'man';
                }
            }
        }
        else if (aiCheckin && !finalCheckin){ // условие победы компьютера в анализе следующего хода
            for (let i = 0; i < winConditions.length; i++) {
                let [a, b, c] = winConditions[i];
                if (arr[a] === compValue &&
                    arr[b] === compValue &&
                    arr[c] === compValue) {
                        return 'comp';
                }
            }
        }

        if (manCheckin && finalCheckin) { // условие победы человека в финальной проверке
            for (let i = 0; i < winConditions.length; i++) {
                let [a, b, c] = winConditions[i];
                if (arr[a] === manValue &&
                    arr[b] === manValue &&
                    arr[c] === manValue) {
                        scoreMan++;
                        itsFirstGame = false;
                        if (itsFirstGame) {
                            startButton.style.display="block";
                        } else {
                            restartButton.style.display="block"
                        }
                        scoreManDiv.innerHTML = scoreMan;
                        winnigMessage.classList.remove('hide');
                        winnigMessage.classList.add('show');
                        theWinner.innerHTML = "Human"
                        return "man"
                }
            }
        } else if (aiCheckin && finalCheckin) { // условие победы компьютера в финальной проверке
            for (let i = 0; i < winConditions.length; i++) {
                let [a, b, c] = winConditions[i];
                if (arr[a] === compValue &&
                    arr[b] === compValue &&
                    arr[c] === compValue) {
                        scoreAi++;
                        itsFirstGame = false;
                        if (itsFirstGame) {
                            startButton.style.display="block";
                        } else {
                            restartButton.style.display="block"
                        }
                        scoreCompDiv.innerHTML = scoreAi;
                        winnigMessage.classList.remove('hide');
                        winnigMessage.classList.add('show');
                        theWinner.innerHTML = "Computer"
                        return
                } 
            }
        }
        
        if (finalCheckin) {
            console.log(excludePool);
            if (excludePool.length === 9) {
                itsFirstGame = false;
                if (itsFirstGame) {
                    startButton.style.display="block";
                } else {
                    restartButton.style.display="block"
                }
                winnigMessage.classList.remove('hide');
                winnigMessage.classList.add('show');
                theWinner.innerHTML = "Draw"
                return
            }
        }
                        

    }

    // Кнопка старт
    startButton.addEventListener('click', e => {
        console.log(e);
        startButton.style.display="none";
        restartButton.style.display="block";
        // Распределение первого хода (первыми ходят всегда крестики, поэтому распределение, кто чем ходит)
       if (randomInt(2) === 1) {
            man.innerHTML = `X`;
            manValue = `x`;
            comp.innerHTML = `O`;
            compValue = `circle`;
        } else {
            man.innerHTML = `O`;
            manValue = `circle`;
            comp.innerHTML = `X`;
            compValue = `x`;
        }
        // При нажатии на старт запускаем фукнцию "старт".
        start()
    });

    restartButton.addEventListener('click', e => {
        if (manValue === 'x') {
            man.innerHTML = 'O';
            manValue = 'circle';
            comp.innerHTML = 'X';
            manValue = 'x';
            
        } else {
            man.innerHTML = 'X';
            manValue = 'x';
            comp.innerHTML = 'O';
            compValue= 'circle';
        }

        start();
    });
    
});

// 