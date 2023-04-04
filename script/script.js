document.addEventListener('DOMContentLoaded', () => {
    // создаем массив в который войдут занятые и свободные поля, чтобы скрипт мог "видеть" поле.
    const   fieldOfGame = [   
                            '', '', '',
                            '', '', '',
                            '', '', ''
                        ], // Массив основного игрового поля
            man = document.querySelector('.human'), 
            comp = document.querySelector('.ai'),
            startButton = document.querySelector('#startButton'),
            restartButton = document.querySelector('#restartButton'),
            winnigMEssage = document.querySelector('.winning-message'),
            cells = document.querySelectorAll('.cell'),
            numPool = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], //массив полей для ходов
            excludePool = []; //массив "занятых" полей
            
            let manValue, compValue, counter = 1

            

    //Функция определения рандомного числа от 1 до num                    
    function randomInt (num) {
        const rndInt = Math.floor(Math.random() * num) + 1;
        return rndInt;
    }

    //Функция хода компьютера
    function aiTurn(compValue) {
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
        cells.forEach(e => {
            e.addEventListener('click', (event) => {
                
                if (e.classList.contains('x') || e.classList.contains('circle')) {   //проверка на свободное поле
                } else {
                    e.classList.add(manValue); //Запись в выбранное поле в HTML
                    fieldOfGame[+e.dataset.cell] = manValue; // Запись в игровое поле
                    aiTurn(compValue); // Ход компьютера
                }
                
            })
        })
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
            if (winnerChek(compValue, manValue, arrForMan) === 'man') { // Проверяем победит ли человек при следующем ходе 
                posToMoveinManReview = filteredPool[i]; // Если победит, то то записываем позицию, на которую должен походить компьютер, чтобы не победил человек
                winManCoef++; // Если победит, то увеличиваем переменную для будущего сравнения
                
            } 
            
            if (winnerChek(compValue, manValue, arrForAi) === 'comp') { // Проверяем победит ли компьютер при следующем ходе 
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
    function winnerChek(compValue, manValue, arr) {

    
        if (arr[0] === compValue && arr[1] === compValue && arr[2] === compValue) { // Участок проверки победы компьютера 
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[3] === compValue && arr[4] === compValue && arr[5] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[6] === compValue && arr[7] === compValue && arr[8] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[0] === compValue && arr[4] === compValue && arr[8] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[2] === compValue && arr[4] === compValue && arr[6] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[0] === compValue && arr[3] === compValue && arr[6] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[1] === compValue && arr[4] === compValue && arr[7] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[2] === compValue && arr[5] === compValue && arr[8] === compValue) {
            // console.log('Победил компьютер');
            return 'comp';
        } else if (arr[0] === manValue && arr[1] === manValue && arr[2] === manValue) { // Участок проверки победы человека 
            // console.log('Победил человек');
            return 'man';
        } else if (arr[3] === manValue && arr[4] === manValue && arr[5] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[6] === manValue && arr[7] === manValue && arr[8] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[0] === manValue && arr[4] === manValue && arr[8] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[2] === manValue && arr[4] === manValue && arr[6] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[0] === manValue && arr[3] === manValue && arr[6] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[1] === manValue && arr[4] === manValue && arr[7] === manValue) {
            // console.log('Победил человек');
            return 'man';
        } else if (arr[2] === manValue && arr[5] === manValue && arr[8] === manValue) {
            // console.log('Победил человек');
            return 'man';
        }
    }

    // Кнопка старт
    startButton.addEventListener('click', e => {
        console.log(e);
        startButton.style.display="none";
        restartButton.style.display="block";
        winnigMEssage.classList.remove('show');
        winnigMEssage.classList.add('hide');
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

    // restartButton.addEventListener('click', e => {
    //     if (manValue === 'x') {
    //         man.innerHTML = 'O';
    //         manValue = 'circle';
    //         comp.innerHTML = 'X';
            
    //     } else {
    //         man.innerHTML = 'X';
    //         manValue = 'x';
    //         comp.innerHTML = 'O';
    //         compValue= 'circle';
    //     }
    // });
    
});

// 