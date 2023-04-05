document.addEventListener('DOMContentLoaded', () => {
    // создаем массив в который войдут занятые и свободные поля, чтобы скрипт мог "видеть" поле.
    const   startButton = document.querySelector('#startButton'),
            restartButton = document.querySelector('#restartButton'),
            winnigMessage = document.querySelector('.start-message'),
            cells = document.querySelectorAll('.cell'),
            scoreManDiv  = document.querySelectorAll('.score-in-message-man span'),
            scoreCompDiv  = document.querySelectorAll('.score-in-message-comp span'),
            theWinner = document.querySelector('.theWinner'),
            changeFigure = document.querySelector('#changeButton'),
            resetScore = document.querySelector('#resetButton'),
            humanFigure = document.querySelector('.human-turn span'),
            aiFigure = document.querySelector('.ai-turn span'),
            numPool = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]; //массив полей для ходов
           
    let manValue, // чем играет человек
        compValue, // чем играет компьютер
        counter = 0, // счетчик
        scoreMan = 0, // очки человека
        scoreAi = 0, // очки компьютера
        itsFirstGame = true, // переменная первой игры
        fieldOfGame = [], // Массив основного игрового поля
        excludePool = [], //массив "занятых" полей 
        counterForOntableWriteResult = 0;


    //Функция определения рандомного числа от 1 до num                    
    function randomInt (num) {
        const rndInt = Math.floor(Math.random() * num) + 1;
        return rndInt;
    }

    //Функция хода компьютера
    function aiTurn(compValue) {
            excludePool = []; // при ходе компьютера каждый раз обнуляем массив с занятыми полями
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
            if (counter === 0) { // Первый ход рандомный
                const rand = filteredPool[Math.floor(Math.random() * filteredPool.length)]; //ищем рандомное число из доступных ходов
                fieldOfGame[rand] = compValue; // Запись в игровое поле
                cells.forEach(e => {
                    if(+e.dataset.cell === rand) {
                        e.classList.add(compValue); // Запись в ячейку в HTML
                    }
                })
                counter++;
            } else {
                // Если ход не первый - запускаем функцию анализа кода
                revievNextTurn(fieldOfGame, filteredPool, compValue, manValue);
            }      
    }

    //начало игры
    function start() {
        counter++; 
        excludePool = []; // при старте обнуляем массив с исключениями
        fieldOfGame = [   
            '', '', '',
            '', '', '',
            '', '', ''
        ] // обнуляем поле игры
        cells.forEach(e => { // обнуляем поля в html
            e.classList.remove('x');
            e.classList.remove('circle');
        }) 
        winnigMessage.classList.remove('show'); 
        winnigMessage.classList.add('hide'); // прячем winningmessage
        if (itsFirstGame) { //если первая игра то проходимся по этому алгоритму
            
            cells.forEach(e => {
                e.addEventListener('click', (event) => {
                    
                    if (e.classList.contains('x') || e.classList.contains('circle')) {   // проверка на свободное поле
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
                    e.classList.add(compValue); // Записываем в HTML ход компьютера
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
                    e.classList.add(compValue); // Записываем в HTML ход компьютера
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
                        scoreMan++; //счетчик очков
                        itsFirstGame = false;
                        if (itsFirstGame) {
                            startButton.style.display="block";
                        } else {
                            restartButton.style.display="block";
                        }
                        scoreManDiv.forEach(e => {
                            e.innerHTML = scoreMan;
                        })
                        winnigMessage.classList.remove('hide');
                        winnigMessage.classList.add('show');
                        theWinner.innerHTML = "Human";//вывод победителя
                        ontableWriteResult("Human", counter) 
                        return "man";
                }
            }
        } else if (aiCheckin && finalCheckin) { // условие победы компьютера в финальной проверке
            for (let i = 0; i < winConditions.length; i++) {
                let [a, b, c] = winConditions[i];
                if (arr[a] === compValue &&
                    arr[b] === compValue &&
                    arr[c] === compValue) {
                        scoreAi++;//счетчик очков
                        itsFirstGame = false;
                        if (itsFirstGame) {
                            startButton.style.display="block";
                        } else {
                            restartButton.style.display="block";
                        }
                        scoreCompDiv.forEach(e => {
                            e.innerHTML = scoreAi;
                        })
                        winnigMessage.classList.remove('hide');
                        winnigMessage.classList.add('show');
                        theWinner.innerHTML = "Computer"; //вывод победителя
                        ontableWriteResult("Computer", counter); 
                        return;
                } 
            }
        } 
        
        if (finalCheckin) { //проверка ничьи
            let i = 0;
            fieldOfGame.forEach(e => {
                if (e !== '') {
                    i++;
                }
            }); // если все поля не пустые (9), и не сработала ни одна из верхних проверок - то ничья
            if (i === 9) { 
                ontableWriteResult("Draw", counter)
                itsFirstGame = false;
                if (itsFirstGame) {
                    startButton.style.display="block";
                } else {
                    restartButton.style.display="block";
                }
                winnigMessage.classList.remove('hide');
                winnigMessage.classList.add('show');
                theWinner.innerHTML = "Draw"; //вывод ничьи
                return;
            }
        }
                        

    }

    // функция сброса очков
    function resetScoreBtn() {
        counter = 0;
        scoreMan = 0;
        scoreAi = 0;
        scoreManDiv.forEach(e => {
            e.innerHTML = scoreAi;
        });
        scoreCompDiv.forEach(e => {
            e.innerHTML = scoreAi;
        });

        table = document.querySelector('.scoreboard-table tbody');
        table.innerHTML = `
            <tr>
                <td>№</td>
                <td>Result</td>
            </tr>
        `;
    }


    // функция рестарта и изменения фигуры (в обоих случаях игра будет начата сначала (счет сохранится))
    function restartChangeBtn() {
        if (manValue === 'x') {
            humanFigure.innerHTML = 'O';
            manValue = 'circle';
            aiFigure.innerHTML = 'X';
            compValue = 'x';
            
        } else {
            humanFigure.innerHTML = 'X';
            manValue = 'x';
            aiFigure.innerHTML = 'O';
            compValue= 'circle';
        }
        start();
    }

    // Фунция записи в таблицу
    function ontableWriteResult(winner, counter) {
        
        // код до 293 строки является костылем, так как функция вызывалась 2 раза, а у меня не оставалось времени на переписывание кода
        if (winner === 'Draw') {
            counterForOntableWriteResult++;
        }
        if (counterForOntableWriteResult > 1) {
            counterForOntableWriteResult = 0;
            return
        }
        
        table = document.querySelector('.scoreboard-table tbody');
        table.innerHTML += `
            <tr>
                <td>${counter}.</td>
                <td>${((winner === 'Draw') ? winner : `Winner ${winner}`)}</td>
            </tr>
        `;
    }

    
    // Кнопка старт
    startButton.addEventListener('click', e => {
        startButton.style.display="none";
        restartButton.style.display="block";
        // Распределение первого хода (первыми ходят всегда крестики, поэтому распределение, кто чем ходит)
       if (randomInt(2) === 1) {
            humanFigure.innerHTML = `X`;
            manValue = `x`;
            aiFigure.innerHTML = `O`;
            compValue = `circle`;
        } else {
            humanFigure.innerHTML = `O`;
            manValue = `circle`;
            aiFigure.innerHTML = `X`;
            compValue = `x`;
        }
        // При нажатии на старт запускаем фукнцию "старт".
        start();
    });



    restartButton.addEventListener('click', restartChangeBtn);
    changeFigure.addEventListener('click', restartChangeBtn);
    resetScore.addEventListener('click', resetScoreBtn);
});
