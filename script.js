// ===================================================================
// 1. MODELO DE DATOS CENTRAL (appState)
// ===================================================================

const appState = {
    currentScreen: 'welcome', 
    gameMode: 'individual', // 'individual' o 'group_vs_group' 
    currentLevel: null,
    // NUEVO: Modo de juego: 'limit_questions' (Límite de Preguntas) o 'limit_lives' (Límite de Vidas)
    gameDurationMode: 'limit_lives', 
    maxQuestions: 20, // Usado solo en limit_questions
    maxLives: { // NUEVO: Vidas definidas por dificultad
        normal: 5,
        difficult: 4,
        expert: 2 
    },
    
    currentQuestionIndex: -1,
    currentQuestion: null,
    timer: 15,
    timerInterval: null,
    
    // NUEVO: ESTADO DE GRUPOS
    groups: [],
    currentGroupIndex: 0,
    
    // 6. Feedback y 3. Contador Individual/General
    stats: {
        normal: { correct: 0, incorrect: 0, lives: 5, totalAnswered: 0, questions: [] },
        difficult: { correct: 0, incorrect: 0, lives: 4, totalAnswered: 0, questions: [] },
        expert: { correct: 0, incorrect: 0, lives: 2, totalAnswered: 0, questions: [] },
    },
    shuffledQuestions: [],
};

// ===================================================================
// 2. BANCO DE EJERCICIOS AMPLIADO (200 Preguntas)
// (Este objeto se mantiene intacto con las 200 preguntas previamente generadas)
// ===================================================================

const questionsBank = {
    // Nivel NORMAL: 70 preguntas - Past Simple, Past Continuous, Present Simple, Present Continuous, Used to, Vocabulario Básico
    normal: [
        // MCQS (Multiple Choice) - 20 ejemplos
        { id: 'N-MCQ-001', type: 'mcq', topic: 'Past Simple', prompt: 'Yesterday, I ___ to the supermarket.', correctAnswer: 'went', options: ['go', 'went', 'gone', 'going'] },
        { id: 'N-MCQ-002', type: 'mcq', topic: 'Present Simple', prompt: 'Water ___ at 100 degrees Celsius.', correctAnswer: 'boils', options: ['boil', 'boils', 'boiling', 'boiled'] },
        { id: 'N-MCQ-003', type: 'mcq', topic: 'Present Continuous', prompt: 'Look! The children ___ in the garden.', correctAnswer: 'are playing', options: ['play', 'plays', 'are playing', 'were playing'] },
        { id: 'N-MCQ-004', type: 'mcq', topic: 'Used to', prompt: 'Did you ___ play the piano when you were young?', correctAnswer: 'use to', options: ['use to', 'used to', 'using to', 'uses to'] },
        { id: 'N-MCQ-005', type: 'mcq', topic: 'Past Continuous', prompt: 'While I ___ TV, the phone rang.', correctAnswer: 'was watching', options: ['watch', 'watched', 'was watching', 'were watching'] },
        { id: 'N-MCQ-006', type: 'mcq', topic: 'Present Simple', prompt: 'She rarely ___ sad.', correctAnswer: 'is', options: ['be', 'are', 'is', 'being'] },
        { id: 'N-MCQ-007', type: 'mcq', topic: 'Past Simple', prompt: 'They ___ a house last year.', correctAnswer: 'bought', options: ['buy', 'buyed', 'bought', 'buying'] },
        { id: 'N-MCQ-008', type: 'mcq', topic: 'Present Continuous', prompt: 'We ___ dinner at a restaurant tonight.', correctAnswer: 'are having', options: ['have', 'had', 'are having', 'were having'] },
        { id: 'N-MCQ-009', type: 'mcq', topic: 'Used to', prompt: 'He ___ work here, but he quit.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'N-MCQ-010', type: 'mcq', topic: 'Vocabulario', prompt: 'What is the Spanish word for "Book"?', correctAnswer: 'Libro', options: ['Libre', 'Libro', 'Bibliotecario', 'Librería'] },
        { id: 'N-MCQ-011', type: 'mcq', topic: 'Past Simple', prompt: 'I ___ an email to him this morning.', correctAnswer: 'sent', options: ['send', 'sended', 'sent', 'sending'] },
        { id: 'N-MCQ-012', type: 'mcq', topic: 'Present Simple', prompt: 'The sun ___ in the east.', correctAnswer: 'rises', options: ['rise', 'rises', 'rising', 'rose'] },
        { id: 'N-MCQ-013', type: 'mcq', topic: 'Past Continuous', prompt: 'At 3 PM, she ___ a nap.', correctAnswer: 'was taking', options: ['take', 'taken', 'was taking', 'were taking'] },
        { id: 'N-MCQ-014', type: 'mcq', topic: 'Used to', prompt: 'My grandmother ___ bake cookies every Sunday.', correctAnswer: 'used to', options: ['use to', 'used to', 'using to', 'uses to'] },
        { id: 'N-MCQ-015', type: 'mcq', topic: 'Vocabulario', prompt: 'The opposite of "Happy" is:', correctAnswer: 'Sad', options: ['Joyful', 'Excited', 'Sad', 'Angry'] },
        { id: 'N-MCQ-016', type: 'mcq', topic: 'Present Continuous', prompt: 'I ___ for my keys right now.', correctAnswer: 'am looking', options: ['look', 'looks', 'am looking', 'was looking'] },
        { id: 'N-MCQ-017', type: 'mcq', topic: 'Past Simple', prompt: 'We ___ to the beach last summer.', correctAnswer: 'drove', options: ['drive', 'drived', 'drove', 'driving'] },
        { id: 'N-MCQ-018', type: 'mcq', topic: 'Present Simple', prompt: 'Dogs ___ loud noises.', correctAnswer: 'hate', options: ['hate', 'hates', 'hating', 'hated'] },
        { id: 'N-MCQ-019', type: 'mcq', topic: 'Past Continuous', prompt: 'They ___ arguing when I walked in.', correctAnswer: 'were', options: ['was', 'were', 'is', 'are'] },
        { id: 'N-MCQ-020', type: 'mcq', topic: 'Vocabulario', prompt: 'The Spanish word for "Table" is:', correctAnswer: 'Mesa', options: ['Silla', 'Mesa', 'Cama', 'Puerta'] },

        // FORM (Forma Correcta) - 30 ejemplos
        { id: 'N-FORM-021', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Speak" es:', correctAnswer: 'Spoke', options: ['Speak', 'Spoked', 'Spoken', 'Spoke'] },
        { id: 'N-FORM-022', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "She (study)" es:', correctAnswer: 'Studies', options: ['Study', 'Studies', 'Studying', 'Studys'] },
        { id: 'N-FORM-023', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Write" es:', correctAnswer: 'Wrote', options: ['Write', 'Writed', 'Written', 'Wrote'] },
        { id: 'N-FORM-024', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "I (cook)" es:', correctAnswer: 'Am cooking', options: ['Cook', 'Cooks', 'Is cooking', 'Am cooking'] },
        { id: 'N-FORM-025', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "We (sing)" es:', correctAnswer: 'Were singing', options: ['Was singing', 'Were singing', 'Are singing', 'Sing'] },
        { id: 'N-FORM-026', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "He (teach)" es:', correctAnswer: 'Teaches', options: ['Teach', 'Teaches', 'Teaching', 'Teached'] },
        { id: 'N-FORM-027', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Go" es:', correctAnswer: 'Went', options: ['Go', 'Goes', 'Gone', 'Went'] },
        { id: 'N-FORM-028', type: 'form', topic: 'Used to', prompt: 'La forma negativa de "Used to" es:', correctAnswer: "Didn't use to", options: ["Didn't used to", "Don't used to", "Didn't use to", "Didn't using to"] },
        { id: 'N-FORM-029', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "It (rain)" es:', correctAnswer: 'Rains', options: ['Rain', 'Rains', 'Raining', 'Rained'] },
        { id: 'N-FORM-030', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "See" es:', correctAnswer: 'Saw', options: ['See', 'Sees', 'Seen', 'Saw'] },
        { id: 'N-FORM-031', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "They (run)" es:', correctAnswer: 'Are running', options: ['Run', 'Runs', 'Are running', 'Were running'] },
        { id: 'N-FORM-032', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "He (sleep)" es:', correctAnswer: 'Was sleeping', options: ['Was sleeping', 'Were sleeping', 'Is sleeping', 'Sleeps'] },
        { id: 'N-FORM-033', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "We (read)" es:', correctAnswer: 'Read', options: ['Read', 'Reads', 'Reading', 'Red'] },
        { id: 'N-FORM-034', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Eat" es:', correctAnswer: 'Ate', options: ['Eat', 'Eated', 'Eaten', 'Ate'] },
        { id: 'N-FORM-035', type: 'form', topic: 'Used to', prompt: 'La forma interrogativa de "Used to" es:', correctAnswer: 'Did you use to', options: ['Used you to', 'Do you use to', 'Did you use to', 'Did you used to'] },
        { id: 'N-FORM-036', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "I (work)" es:', correctAnswer: 'Work', options: ['Work', 'Works', 'Working', 'Worked'] },
        { id: 'N-FORM-037', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Give" es:', correctAnswer: 'Gave', options: ['Give', 'Gived', 'Given', 'Gave'] },
        { id: 'N-FORM-038', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "She (wait)" es:', correctAnswer: 'Is waiting', options: ['Wait', 'Waits', 'Is waiting', 'Are waiting'] },
        { id: 'N-FORM-039', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "You (talk)" es:', correctAnswer: 'Were talking', options: ['Was talking', 'Were talking', 'Are talking', 'Talk'] },
        { id: 'N-FORM-040', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The dog (bark)" es:', correctAnswer: 'Barks', options: ['Bark', 'Barks', 'Barking', 'Barked'] },
        { id: 'N-FORM-041', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Know" es:', correctAnswer: 'Knew', options: ['Know', 'Knowed', 'Known', 'Knew'] },
        { id: 'N-FORM-042', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "He" es:', correctAnswer: 'He is used to', options: ['He use to', 'He used to', 'He is used to', 'He was use to'] },
        { id: 'N-FORM-043', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "They (live)" es:', correctAnswer: 'Live', options: ['Live', 'Lives', 'Living', 'Lived'] },
        { id: 'N-FORM-044', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Find" es:', correctAnswer: 'Found', options: ['Find', 'Finded', 'Founded', 'Found'] },
        { id: 'N-FORM-045', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "We (travel)" es:', correctAnswer: 'Are traveling', options: ['Travel', 'Travels', 'Is traveling', 'Are traveling'] },
        { id: 'N-FORM-046', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "I (drive)" es:', correctAnswer: 'Was driving', options: ['Was driving', 'Were driving', 'Am driving', 'Drives'] },
        { id: 'N-FORM-047', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The cats (sleep)" es:', correctAnswer: 'Sleep', options: ['Sleep', 'Sleeps', 'Sleeping', 'Slept'] },
        { id: 'N-FORM-048', type: 'form', topic: 'Past Simple', prompt: 'La forma correcta en pasado simple de "Take" es:', correctAnswer: 'Took', options: ['Take', 'Taked', 'Taken', 'Took'] },
        { id: 'N-FORM-049', type: 'form', topic: 'Used to', prompt: 'La forma correcta de "Be used to" con "They" es:', correctAnswer: 'They are used to', options: ['They use to', 'They used to', 'They are used to', 'They were use to'] },
        { id: 'N-FORM-050', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "He (have)" es:', correctAnswer: 'Has', options: ['Have', 'Has', 'Having', 'Had'] },

        // ORDER (Ordenar Palabras) - 20 ejemplos
        { id: 'N-ORDER-051', type: 'order', topic: 'Present Simple', prompt: 'Ordena: plays / football / often / He', correctAnswer: 'He often plays football', options: ['He often plays football', 'Plays football often He', 'Often He plays football', 'Football He often plays'] },
        { id: 'N-ORDER-052', type: 'order', topic: 'Past Simple', prompt: 'Ordena: yesterday / did / you / What / do / ?', correctAnswer: 'What did you do yesterday?', options: ['What do you did yesterday?', 'Did you do what yesterday?', 'What did you do yesterday?', 'Yesterday what did you do?'] },
        { id: 'N-ORDER-053', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: is / working / She / now / not', correctAnswer: 'She is not working now', options: ['She not is working now', 'Working now She is not', 'She is not working now', 'Not She is working now'] },
        { id: 'N-ORDER-054', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: were / We / reading / all / night', correctAnswer: 'We were reading all night', options: ['We reading were all night', 'Reading all night we were', 'We were reading all night', 'All night we were reading'] },
        { id: 'N-ORDER-055', type: 'order', topic: 'Used to', prompt: 'Ordena: live / used / I / to / Paris / in', correctAnswer: 'I used to live in Paris', options: ['Used to live I in Paris', 'I used to live in Paris', 'Live in Paris I used to', 'To live I used in Paris'] },
        { id: 'N-ORDER-056', type: 'order', topic: 'Present Simple', prompt: 'Ordena: late / never / I / am', correctAnswer: 'I am never late', options: ['I never am late', 'Am never late I', 'I am never late', 'Late I never am'] },
        { id: 'N-ORDER-057', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the window / broke / accident / by / John', correctAnswer: 'John broke the window by accident', options: ['The window John broke by accident', 'Broke John the window by accident', 'John broke the window by accident', 'By accident John broke the window'] },
        { id: 'N-ORDER-058', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: raining / Is / outside / it / ?', correctAnswer: 'Is it raining outside?', options: ['Raining is it outside?', 'It is raining outside?', 'Is it raining outside?', 'Outside is it raining?'] },
        { id: 'N-ORDER-059', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: loudly / were / They / shouting', correctAnswer: 'They were shouting loudly', options: ['Shouting loudly they were', 'They were shouting loudly', 'Loudly were they shouting', 'Were shouting they loudly'] },
        { id: 'N-ORDER-060', type: 'order', topic: 'Used to', prompt: 'Ordena: used / She / travel / to / a lot', correctAnswer: 'She used to travel a lot', options: ['Travel a lot She used to', 'Used to travel She a lot', 'She used to travel a lot', 'A lot she used to travel'] },
        { id: 'N-ORDER-061', type: 'order', topic: 'Present Simple', prompt: 'Ordena: every / We / holiday / go / on', correctAnswer: 'We go on holiday every year', options: ['Every year go on holiday We', 'We go on holiday every year', 'Go on holiday We every year', 'On holiday We go every year'] },
        { id: 'N-ORDER-062', type: 'order', topic: 'Past Simple', prompt: 'Ordena: not / hear / I / did / you', correctAnswer: 'I did not hear you', options: ['I not did hear you', 'Did not hear I you', 'I did not hear you', 'Hear you I did not'] },
        { id: 'N-ORDER-063', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: am / I / watching / a movie', correctAnswer: 'I am watching a movie', options: ['A movie watching I am', 'Watching a movie I am', 'I am watching a movie', 'Am I watching a movie'] },
        { id: 'N-ORDER-064', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: were / studying / They / hard / for the exam', correctAnswer: 'They were studying hard for the exam', options: ['Studying hard They were for the exam', 'They were studying hard for the exam', 'Hard They were studying for the exam', 'For the exam They were studying hard'] },
        { id: 'N-ORDER-065', type: 'order', topic: 'Used to', prompt: 'Ordena: go / to / Did / the beach / you / use / ?', correctAnswer: 'Did you use to go to the beach?', options: ['Did you used to go to the beach?', 'Use to go you did to the beach?', 'Did you use to go to the beach?', 'To the beach did you use to go?'] },
        { id: 'N-ORDER-066', type: 'order', topic: 'Present Simple', prompt: 'Ordena: travel / by train / always / We', correctAnswer: 'We always travel by train', options: ['Always We travel by train', 'We always travel by train', 'Travel by train We always', 'By train We always travel'] },
        { id: 'N-ORDER-067', type: 'order', topic: 'Past Simple', prompt: 'Ordena: was / born / I / in 1990', correctAnswer: 'I was born in 1990', options: ['Born I was in 1990', 'In 1990 I was born', 'I was born in 1990', 'Was born I in 1990'] },
        { id: 'N-ORDER-068', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: is / talking / My sister / on the phone', correctAnswer: 'My sister is talking on the phone', options: ['Talking on the phone My sister is', 'My sister is talking on the phone', 'Is talking My sister on the phone', 'On the phone My sister is talking'] },
        { id: 'N-ORDER-069', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: they / What / doing / were / ?', correctAnswer: 'What were they doing?', options: ['Were doing they what?', 'What they were doing?', 'What were they doing?', 'Doing they were what?'] },
        { id: 'N-ORDER-070', type: 'order', topic: 'Used to', prompt: 'Ordena: like / I / used / to / him / not', correctAnswer: 'I used not to like him', options: ['I not used to like him', 'Used not to like him I', 'I used not to like him', 'Not I used to like him'] },
    ],
    // Nivel DIFÍCIL: 70 preguntas
    difficult: [
        // MCQS (Multiple Choice) - 20 ejemplos
        { id: 'D-MCQ-001', type: 'mcq', topic: 'Present Perfect', prompt: 'I ___ just finished my homework.', correctAnswer: 'have', options: ['has', 'had', 'have', 'am'] },
        { id: 'D-MCQ-002', type: 'mcq', topic: 'Modals', prompt: 'You ___ touch that wire; it\'s dangerous!', correctAnswer: 'mustn\'t', options: ['can\'t', 'may not', 'mustn\'t', 'needn\'t'] },
        { id: 'D-MCQ-003', type: 'mcq', topic: 'Phrasal Verb', prompt: 'She promised to ___ for the weekend.', correctAnswer: 'look after', options: ['look for', 'look after', 'look out', 'look up'] },
        { id: 'D-MCQ-004', type: 'mcq', topic: 'Third Conditional', prompt: 'If I had known, I ___ helped you.', correctAnswer: 'would have', options: ['will have', 'would have', 'had', 'should'] },
        { id: 'D-MCQ-005', type: 'mcq', topic: 'Present Perfect Continuous', prompt: 'He ___ for three hours now.', correctAnswer: 'has been sleeping', options: ['sleeps', 'is sleeping', 'has slept', 'has been sleeping'] },
        { id: 'D-MCQ-006', type: 'mcq', topic: 'Passive Voice', prompt: 'The novel ___ by a famous author.', correctAnswer: 'was written', options: ['wrote', 'written', 'was written', 'was wrote'] },
        { id: 'D-MCQ-007', type: 'mcq', topic: 'Modals', prompt: 'They ___ be home yet; it\'s too early.', correctAnswer: 'can\'t', options: ['mustn\'t', 'can\'t', 'shouldn\'t', 'needn\'t'] },
        { id: 'D-MCQ-008', type: 'mcq', topic: 'Phrasal Verb', prompt: 'I need to ___ smoking.', correctAnswer: 'give up', options: ['give in', 'give out', 'give up', 'give away'] },
        { id: 'D-MCQ-009', type: 'mcq', topic: 'Second Conditional', prompt: 'If I won the lottery, I ___ a mansion.', correctAnswer: 'would buy', options: ['will buy', 'would buy', 'bought', 'buy'] },
        { id: 'D-MCQ-010', type: 'mcq', topic: 'Past Perfect', prompt: 'She ___ never seen snow before she moved here.', correctAnswer: 'had', options: ['has', 'have', 'had', 'was'] },
        { id: 'D-MCQ-011', type: 'mcq', topic: 'Future Perfect', prompt: 'By next year, I ___ my degree.', correctAnswer: 'will have finished', options: ['will finish', 'will be finishing', 'will have finished', 'finish'] },
        { id: 'D-MCQ-012', type: 'mcq', topic: 'Modals', prompt: '___ I borrow your pen?', correctAnswer: 'May', options: ['Can', 'Must', 'Should', 'May'] },
        { id: 'D-MCQ-013', type: 'mcq', topic: 'Phrasal Verb', prompt: 'They decided to ___ their trip.', correctAnswer: 'put off', options: ['put on', 'put off', 'put up', 'put down'] },
        { id: 'D-MCQ-014', type: 'mcq', topic: 'Mixed Conditional', prompt: 'If you had listened to me, you ___ in trouble now.', correctAnswer: "wouldn't be", options: ['won\'t be', 'wouldn\'t be', 'hadn\'t been', 'aren\'t'] },
        { id: 'D-MCQ-015', type: 'mcq', topic: 'Passive Voice', prompt: 'The letters ___ every day.', correctAnswer: 'are delivered', options: ['deliver', 'are delivered', 'delivered', 'are delivering'] },
        { id: 'D-MCQ-016', type: 'mcq', topic: 'Present Perfect', prompt: 'We ___ known each other since childhood.', correctAnswer: 'have', options: ['has', 'had', 'have', 'are'] },
        { id: 'D-MCQ-017', type: 'mcq', topic: 'Modals of Deduction', prompt: 'She ___ be rich; she drives a Ferrari.', correctAnswer: 'must', options: ['can', 'might', 'must', 'should'] },
        { id: 'D-MCQ-018', type: 'mcq', topic: 'Phrasal Verb', prompt: 'I had to ___ my mind and apologize.', correctAnswer: 'make up', options: ['make out', 'make up', 'make over', 'make for'] },
        { id: 'D-MCQ-019', type: 'mcq', topic: 'First Conditional', prompt: 'If it rains, we ___ inside.', correctAnswer: 'will stay', options: ['stay', 'will stay', 'stayed', 'would stay'] },
        { id: 'D-MCQ-020', type: 'mcq', topic: 'Past Perfect Continuous', prompt: 'I was tired because I ___ all day.', correctAnswer: 'had been working', options: ['worked', 'have been working', 'had been working', 'was working'] },

        // FORM (Forma Correcta) - 30 ejemplos
        { id: 'D-FORM-021', type: 'form', topic: 'Gerunds/Infin', prompt: 'La forma correcta para "I enjoy (listen) to music" es:', correctAnswer: 'listening', options: ['to listen', 'listen', 'listening', 'listened'] },
        { id: 'D-FORM-022', type: 'form', topic: 'Reported Speech', prompt: 'Reporta: "I will call you tomorrow" (He said...)', correctAnswer: 'he would call me the next day', options: ['he will call me tomorrow', 'he would call me the next day', 'he called me tomorrow', 'he calls me the next day'] },
        { id: 'D-FORM-023', type: 'form', topic: 'Relative Clause', prompt: 'La palabra para unir: "The woman ___ lives next door..."', correctAnswer: 'who', options: ['which', 'that', 'whom', 'who'] },
        { id: 'D-FORM-024', type: 'form', topic: 'Phrasal Verb', prompt: 'El significado de "Get over" es:', correctAnswer: 'Superar', options: ['Entrar', 'Superar', 'Continuar', 'Empezar'] },
        { id: 'D-FORM-025', type: 'form', topic: 'Causative', prompt: 'La forma correcta: "I had my car (wash)" es:', correctAnswer: 'washed', options: ['wash', 'washing', 'to wash', 'washed'] },
        { id: 'D-FORM-026', type: 'form', topic: 'Passive Voice', prompt: 'La forma en voz pasiva de "They built the house" es: "The house ___"', correctAnswer: 'was built', options: ['built', 'is built', 'was built', 'has built'] },
        { id: 'D-FORM-027', type: 'form', topic: 'Past Perfect', prompt: 'La forma negativa de "had done" es:', correctAnswer: 'had not done', options: ['did not do', 'have not done', 'had not done', 'was not done'] },
        { id: 'D-FORM-028', type: 'form', topic: 'Modals', prompt: 'El pasado de "Must" (obligación) es:', correctAnswer: 'had to', options: ['musted', 'must have', 'had to', 'ought to'] },
        { id: 'D-FORM-029', type: 'form', topic: 'Gerunds/Infin', prompt: 'La forma correcta para "I decided (buy) a new phone" es:', correctAnswer: 'to buy', options: ['buying', 'buy', 'to buy', 'buys'] },
        { id: 'D-FORM-030', type: 'form', topic: 'Reported Speech', prompt: 'Reporta: "Is she coming?" (He asked...)', correctAnswer: 'if she was coming', options: ['if she is coming', 'if she was coming', 'she was coming', 'was she coming'] },
        { id: 'D-FORM-031', type: 'form', topic: 'Relative Clause', prompt: 'La palabra para unir: "The day ___ we met was sunny." es:', correctAnswer: 'when', options: ['where', 'which', 'when', 'that'] },
        { id: 'D-FORM-032', type: 'form', topic: 'Phrasal Verb', prompt: 'El significado de "Run out of" es:', correctAnswer: 'Quedarse sin', options: ['Correr afuera', 'Salir corriendo', 'Quedarse sin', 'Funcionar'] },
        { id: 'D-FORM-033', type: 'form', topic: 'Causative', prompt: 'La forma correcta: "She got him (fix) the lock" es:', correctAnswer: 'to fix', options: ['fix', 'fixing', 'to fix', 'fixed'] },
        { id: 'D-FORM-034', type: 'form', topic: 'Passive Voice', prompt: 'La forma en voz pasiva de "They are selling books" es: "Books ___"', correctAnswer: 'are being sold', options: ['are sold', 'are being sold', 'were sold', 'have sold'] },
        { id: 'D-FORM-035', type: 'form', topic: 'Past Perfect Continuous', prompt: 'La forma de "I (wait) for an hour" es:', correctAnswer: 'had been waiting', options: ['have waited', 'had been waiting', 'was waiting', 'had waiting'] },
        { id: 'D-FORM-036', type: 'form', topic: 'Modals', prompt: 'La forma de posibilidad de "It (rain)" es:', correctAnswer: 'might rain', options: ['must rain', 'can rain', 'might rain', 'should rain'] },
        { id: 'D-FORM-037', type: 'form', topic: 'Gerunds/Infin', prompt: 'La forma correcta para "I miss (go) to the beach" es:', correctAnswer: 'going', options: ['to go', 'go', 'going', 'went'] },
        { id: 'D-FORM-038', type: 'form', topic: 'Reported Speech', prompt: 'Reporta: "Close the door!" (She told him...)', correctAnswer: 'to close the door', options: ['close the door', 'if he closed the door', 'to close the door', 'closed the door'] },
        { id: 'D-FORM-039', type: 'form', topic: 'Relative Clause', prompt: 'La palabra para unir: "The reason ___ I left was simple." es:', correctAnswer: 'why', options: ['which', 'that', 'why', 'what'] },
        { id: 'D-FORM-040', type: 'form', topic: 'Phrasal Verb', prompt: 'El significado de "Take off" (ropa) es:', correctAnswer: 'Quitarse', options: ['Despegar', 'Quitarse', 'Llevar', 'Encender'] },
        { id: 'D-FORM-041', type: 'form', topic: 'Causative', prompt: 'La forma correcta: "She made me (do) it" es:', correctAnswer: 'do', options: ['to do', 'doing', 'do', 'did'] },
        { id: 'D-FORM-042', type: 'form', topic: 'Passive Voice', prompt: 'La forma en voz pasiva de "Someone stole my phone" es: "My phone ___"', correctAnswer: 'was stolen', options: ['stole', 'is stolen', 'was stolen', 'has stolen'] },
        { id: 'D-FORM-043', type: 'form', topic: 'Future Perfect', prompt: 'La forma negativa de "will have finished" es:', correctAnswer: 'will not have finished', options: ['will not finished', 'will not have finished', 'not will have finished', 'won\'t has finished'] },
        { id: 'D-FORM-044', type: 'form', topic: 'Modals', prompt: 'El pasado de "Can" (habilidad) es:', correctAnswer: 'could', options: ['caned', 'could', 'was able to', 'might'] },
        { id: 'D-FORM-045', type: 'form', topic: 'Gerunds/Infin', prompt: 'La forma correcta para "She stopped (smoke)" es:', correctAnswer: 'smoking', options: ['to smoke', 'smoke', 'smoking', 'smoked'] },
        { id: 'D-FORM-046', type: 'form', topic: 'Reported Speech', prompt: 'Reporta: "Where do you live?" (He asked...)', correctAnswer: 'where I lived', options: ['where do I live', 'where I lived', 'where I live', 'where did I live'] },
        { id: 'D-FORM-047', type: 'form', topic: 'Relative Clause', prompt: 'La palabra para unir: "The person ___ I spoke to..." es:', correctAnswer: 'whom', options: ['which', 'that', 'who', 'whom'] },
        { id: 'D-FORM-048', type: 'form', topic: 'Phrasal Verb', prompt: 'El significado de "Call off" es:', correctAnswer: 'Cancelar', options: ['Llamar a', 'Cancelar', 'Visitar', 'Posponer'] },
        { id: 'D-FORM-049', type: 'form', topic: 'Causative', prompt: 'La forma correcta: "We help them (clean) the kitchen" es:', correctAnswer: 'clean', options: ['to clean', 'cleaning', 'clean', 'cleaned'] },
        { id: 'D-FORM-050', type: 'form', topic: 'Passive Voice', prompt: 'La forma en voz pasiva de "They will build a bridge" es: "A bridge ___"', correctAnswer: 'will be built', options: ['will build', 'will be built', 'is built', 'built'] },

        // ORDER (Ordenar Palabras) - 20 ejemplos
        { id: 'D-ORDER-051', type: 'order', topic: 'Present Perfect', prompt: 'Ordena: seen / I / before / never / have / this', correctAnswer: 'I have never seen this before', options: ['I never have seen this before', 'I have never seen this before', 'Before I have never seen this', 'Seen this before I have never'] },
        { id: 'D-ORDER-052', type: 'order', topic: 'Modals', prompt: 'Ordena: must / have / been / You / tired / very', correctAnswer: 'You must have been very tired', options: ['Must have been very tired You', 'You must have been very tired', 'Been very tired You must have', 'Very tired You must have been'] },
        { id: 'D-ORDER-053', type: 'order', topic: 'Phrasal Verb', prompt: 'Ordena: the keys / found / I / looking / for / after', correctAnswer: 'I found the keys after looking for', options: ['I found the keys after looking for', 'Looking for the keys I found after', 'After looking for I found the keys', 'The keys I found after looking for'] },
        { id: 'D-ORDER-054', type: 'order', topic: 'First Conditional', prompt: 'Ordena: you / If / hard / study, / pass / will / you', correctAnswer: 'If you study hard, you will pass', options: ['You study hard if, you will pass', 'If you study hard, you will pass', 'Study hard if you, you will pass', 'You will pass if you study hard'] },
        { id: 'D-ORDER-055', type: 'order', topic: 'Past Perfect', prompt: 'Ordena: left / the train / before / had / We', correctAnswer: 'We had left before the train', options: ['Before the train We had left', 'The train left We had before', 'We had left before the train', 'Had left We before the train'] },
        { id: 'D-ORDER-056', type: 'order', topic: 'Present Perfect Continuous', prompt: 'Ordena: been / has / sleeping / It / since / morning', correctAnswer: 'It has been sleeping since morning', options: ['Sleeping since morning It has been', 'It has been sleeping since morning', 'Has been sleeping It since morning', 'Since morning It has been sleeping'] },
        { id: 'D-ORDER-057', type: 'order', topic: 'Passive Voice', prompt: 'Ordena: built / was / The house / 1900 / in', correctAnswer: 'The house was built in 1900', options: ['Was built in 1900 The house', 'In 1900 The house was built', 'The house was built in 1900', 'Built The house was in 1900'] },
        { id: 'D-ORDER-058', type: 'order', topic: 'Second Conditional', prompt: 'Ordena: buy / I / rich, / would / a boat / If / I / were', correctAnswer: 'If I were rich, I would buy a boat', options: ['If I were rich, I would buy a boat', 'I would buy a boat if I were rich', 'Were rich I, I would buy a boat if', 'A boat I would buy if I were rich'] },
        { id: 'D-ORDER-059', type: 'order', topic: 'Phrasal Verb', prompt: 'Ordena: away / My sister / me / helped / move', correctAnswer: 'My sister helped me move away', options: ['Helped me move away My sister', 'My sister helped me move away', 'Move away My sister helped me', 'Away My sister helped me move'] },
        { id: 'D-ORDER-060', type: 'order', topic: 'Third Conditional', prompt: 'Ordena: listened / had / I / I / wouldn\'t / If / have / failed', correctAnswer: "If I had listened, I wouldn't have failed", options: ["If I wouldn't have failed, I had listened", "I wouldn't have failed if I had listened", "If I had listened, I wouldn't have failed", "Had listened I if, I wouldn't have failed"] },
        { id: 'D-ORDER-061', type: 'order', topic: 'Present Perfect', prompt: 'Ordena: ever / been / Have / you / to Rome / ?', correctAnswer: 'Have you ever been to Rome?', options: ['Ever been to Rome have you?', 'Have you ever been to Rome?', 'To Rome have you ever been?', 'You have ever been to Rome?'] },
        { id: 'D-ORDER-062', type: 'order', topic: 'Modals', prompt: 'Ordena: should / have / told / You / me / sooner', correctAnswer: 'You should have told me sooner', options: ['Told me sooner You should have', 'Have told me sooner You should', 'You should have told me sooner', 'Sooner you should have told me'] },
        { id: 'D-ORDER-063', type: 'order', topic: 'Phrasal Verb', prompt: 'Ordena: in / turned / He / late / his report', correctAnswer: 'He turned in his report late', options: ['He turned in his report late', 'Late He turned in his report', 'Turned in his report He late', 'His report He turned in late'] },
        { id: 'D-ORDER-064', type: 'order', topic: 'Mixed Conditional', prompt: 'Ordena: were / I / If / you, / worry / I / wouldn\'t', correctAnswer: "If I were you, I wouldn't worry", options: ['I wouldn\'t worry if I were you', 'If I were you, I wouldn\'t worry', 'I were you if, I wouldn\'t worry', 'Worry I wouldn\'t if I were you'] },
        { id: 'D-ORDER-065', type: 'order', topic: 'Past Perfect', prompt: 'Ordena: before / met / never / I / had / him', correctAnswer: 'I had never met him before', options: ['I never had met him before', 'Had never met him I before', 'I had never met him before', 'Him I had never met before'] },
        { id: 'D-ORDER-066', type: 'order', topic: 'Future Perfect', prompt: 'Ordena: finished / the project / By / will / Friday / have / we', correctAnswer: 'By Friday, we will have finished the project', options: ['Will have finished the project By Friday we', 'We will have finished the project by Friday', 'By Friday, we will have finished the project', 'The project will have finished we by Friday'] },
        { id: 'D-ORDER-067', type: 'order', topic: 'Passive Voice', prompt: 'Ordena: stolen / The money / has / been', correctAnswer: 'The money has been stolen', options: ['Has been stolen the money', 'Stolen the money has been', 'The money has been stolen', 'Been stolen the money has'] },
        { id: 'D-ORDER-068', type: 'order', topic: 'Phrasal Verb', prompt: 'Ordena: my phone / I / call / will / you / back', correctAnswer: 'I will call you back on my phone', options: ['Call you back I will on my phone', 'I will call you back on my phone', 'On my phone I will call you back', 'Back I will call you on my phone'] },
        { id: 'D-ORDER-069', type: 'order', topic: 'Third Conditional', prompt: 'Ordena: wouldn\'t / have / If / they / seen / us, / known / they', correctAnswer: "If they hadn't seen us, they wouldn't have known", options: ["If they hadn't known, they wouldn't have seen us", "They wouldn't have known if they hadn't seen us", "If they hadn't seen us, they wouldn't have known", "Seen us they hadn't if, they wouldn't have known"] },
        { id: 'D-ORDER-070', type: 'order', topic: 'Present Perfect Continuous', prompt: 'Ordena: working / have / They / hard / been / lately', correctAnswer: 'They have been working hard lately', options: ['Working hard lately They have been', 'They have been working hard lately', 'Have been working hard They lately', 'Lately They have been working hard'] },
    ],
    // Nivel EXPERTO: 60 preguntas
    expert: [
        // MCQS (Multiple Choice) - 20 ejemplos
        { id: 'E-MCQ-001', type: 'mcq', topic: 'Inversion', prompt: 'Hardly ___ the door when the phone rang.', correctAnswer: 'had I opened', options: ['I had opened', 'had I opened', 'I opened', 'did I open'] },
        { id: 'E-MCQ-002', type: 'mcq', topic: 'Subjunctive', prompt: 'It is vital that he ___ the committee.', correctAnswer: 'attend', options: ['attends', 'attended', 'attend', 'is attending'] },
        { id: 'E-MCQ-003', type: 'mcq', topic: 'Vocabulary', prompt: 'The word for "extremely large" is:', correctAnswer: 'colossal', options: ['small', 'great', 'colossal', 'nice'] },
        { id: 'E-MCQ-004', type: 'mcq', topic: 'Cleft Sentence', prompt: 'What I need ___ silence.', correctAnswer: 'is', options: ['are', 'is', 'be', 'was'] },
        { id: 'E-MCQ-005', type: 'mcq', topic: 'Wish/If Only', prompt: 'I wish I ___ play the guitar.', correctAnswer: 'could', options: ['can', 'could', 'would', 'may'] },
        { id: 'E-MCQ-006', type: 'mcq', topic: 'Inversion (Negative)', prompt: 'Not only ___ a genius, but he is also kind.', correctAnswer: 'is he', options: ['he is', 'is he', 'he was', 'was he'] },
        { id: 'E-MCQ-007', type: 'mcq', topic: 'Subjunctive', prompt: 'She insisted that he ___ the contract.', correctAnswer: 'sign', options: ['signs', 'signed', 'sign', 'is signing'] },
        { id: 'E-MCQ-008', type: 'mcq', topic: 'Vocabulary', prompt: 'The quality of being brief and concise:', correctAnswer: 'brevity', options: ['length', 'brevity', 'detail', 'accuracy'] },
        { id: 'E-MCQ-009', type: 'mcq', topic: 'Causative (Have)', prompt: 'We had the roof ___ last week.', correctAnswer: 'repaired', options: ['repair', 'to repair', 'repairing', 'repaired'] },
        { id: 'E-MCQ-010', type: 'mcq', topic: 'Reduced Relative Clause', prompt: 'The man ___ by the police was arrested.', correctAnswer: 'questioned', options: ['questioning', 'questioned', 'who questioned', 'to question'] },
        { id: 'E-MCQ-011', type: 'mcq', topic: 'Inversion (Time)', prompt: 'No sooner had I arrived ___ the party started.', correctAnswer: 'than', options: ['when', 'then', 'than', 'that'] },
        { id: 'E-MCQ-012', type: 'mcq', topic: 'Subjunctive', prompt: 'It is requested that all members ___ present.', correctAnswer: 'be', options: ['are', 'be', 'will be', 'were'] },
        { id: 'E-MCQ-013', type: 'mcq', topic: 'Vocabulary', prompt: 'The word for "to pretend to be affected by a feeling" is:', correctAnswer: 'feign', options: ['act', 'feign', 'show', 'admit'] },
        { id: 'E-MCQ-014', type: 'mcq', topic: 'Participle Clause', prompt: '___ the facts, the judge made a ruling.', correctAnswer: 'Having considered', options: ['Considering', 'To consider', 'Having considered', 'Considered'] },
        { id: 'E-MCQ-015', type: 'mcq', topic: 'Wish/If Only', prompt: 'I wish you ___ stop complaining.', correctAnswer: 'would', options: ['will', 'would', 'did', 'should'] },
        { id: 'E-MCQ-016', type: 'mcq', topic: 'Inversion (Place)', prompt: 'In the corner ___ a strange statue.', correctAnswer: 'stood', options: ['stood', 'did stand', 'was standing', 'it stood'] },
        { id: 'E-MCQ-017', type: 'mcq', topic: 'Subjunctive (Past)', prompt: 'If only he ___ finished the work earlier.', correctAnswer: 'had', options: ['has', 'had', 'did', 'would have'] },
        { id: 'E-MCQ-018', type: 'mcq', topic: 'Vocabulary', prompt: 'The opposite of "obsolete" is:', correctAnswer: 'current', options: ['ancient', 'new', 'current', 'outdated'] },
        { id: 'E-MCQ-019', type: 'mcq', topic: 'Causative (Get)', prompt: 'I must get the heating ___ before winter.', correctAnswer: 'fixed', options: ['fix', 'to fix', 'fixing', 'fixed'] },
        { id: 'E-MCQ-020', type: 'mcq', topic: 'Cleft Sentence', prompt: 'It was Peter ___ discovered the truth.', correctAnswer: 'who', options: ['which', 'that', 'who', 'whom'] },

        // FORM (Forma Correcta) - 20 ejemplos
        { id: 'E-FORM-021', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "Never ___ such poverty" es:', correctAnswer: 'have I seen', options: ['I have seen', 'have I seen', 'I saw', 'did I see'] },
        { id: 'E-FORM-022', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "The proposal is that he ___ immediately" es:', correctAnswer: 'resign', options: ['resigns', 'resigned', 'resign', 'is resigning'] },
        { id: 'E-FORM-023', type: 'form', topic: 'Nominal Clause', prompt: 'La palabra para empezar: "___ the committee decides is final" es:', correctAnswer: 'Whatever', options: ['Whenever', 'However', 'Whatever', 'Wherever'] },
        { id: 'E-FORM-024', type: 'form', topic: 'Causative (Let)', prompt: 'La forma correcta: "She let me (go) home early" es:', correctAnswer: 'go', options: ['to go', 'going', 'go', 'went'] },
        { id: 'E-FORM-025', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "falta de respeto" es:', correctAnswer: 'contempt', options: ['admiration', 'respect', 'contempt', 'awe'] },
        { id: 'E-FORM-026', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "Little ___ about the plan" es:', correctAnswer: 'did he know', options: ['he knew', 'he did know', 'did he know', 'knew he'] },
        { id: 'E-FORM-027', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "It is suggested that she ___ a lawyer" es:', correctAnswer: 'consult', options: ['consults', 'consulted', 'consult', 'is consulting'] },
        { id: 'E-FORM-028', type: 'form', topic: 'Participle Clause', prompt: 'La forma correcta: "___ the book, she went to bed" es:', correctAnswer: 'Having read', options: ['Reading', 'Read', 'Having read', 'To read'] },
        { id: 'E-FORM-029', type: 'form', topic: 'Causative (Help)', prompt: 'La forma correcta: "I helped him (finish) the task" es:', correctAnswer: 'finish', options: ['to finish', 'finishing', 'finish', 'finished'] },
        { id: 'E-FORM-030', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "capaz de adaptarse fácilmente" es:', correctAnswer: 'versatile', options: ['rigid', 'fixed', 'limited', 'versatile'] },
        { id: 'E-FORM-031', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "Only then ___ the seriousness of the situation" es:', correctAnswer: 'did I realize', options: ['I realized', 'did I realize', 'I did realize', 'realized I'] },
        { id: 'E-FORM-032', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "The law requires that he ___ a test" es:', correctAnswer: 'take', options: ['takes', 'took', 'take', 'is taking'] },
        { id: 'E-FORM-033', type: 'form', topic: 'Nominal Clause', prompt: 'La palabra para empezar: "___ I need is a strong coffee" es:', correctAnswer: 'What', options: ['Which', 'That', 'What', 'How'] },
        { id: 'E-FORM-034', type: 'form', topic: 'Causative (Make)', prompt: 'La forma correcta: "The boss made us (work) late" es:', correctAnswer: 'work', options: ['to work', 'working', 'work', 'worked'] },
        { id: 'E-FORM-035', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "extremadamente meticuloso" es:', correctAnswer: 'fastidious', options: ['careless', 'fastidious', 'simple', 'hasty'] },
        { id: 'E-FORM-036', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "So worried ___ that he couldn\'t sleep" es:', correctAnswer: 'was he', options: ['he was', 'was he', 'he were', 'were he'] },
        { id: 'E-FORM-037', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "My advice is that she ___ tomorrow" es:', correctAnswer: 'start', options: ['starts', 'started', 'start', 'is starting'] },
        { id: 'E-FORM-038', type: 'form', topic: 'Participle Clause', prompt: 'La forma correcta: "___ on the bench, he watched the game" es:', correctAnswer: 'Sitting', options: ['To sit', 'Sitting', 'Sat', 'Sit'] },
        { id: 'E-FORM-039', type: 'form', topic: 'Causative (Get)', prompt: 'La forma correcta: "I need to get my hair (cut)" es:', correctAnswer: 'cut', options: ['cut', 'to cut', 'cutting', 'cuts'] },
        { id: 'E-FORM-040', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "una gran cantidad o exceso" es:', correctAnswer: 'plethora', options: ['scarcity', 'lack', 'plethora', 'minimum'] },

        // ORDER (Ordenar Palabras) - 20 ejemplos
        { id: 'E-ORDER-041', type: 'order', topic: 'Inversion', prompt: 'Ordena: had / No sooner / arrived / the rain / than / started', correctAnswer: 'No sooner had I arrived than the rain started', options: ['No sooner had I arrived than the rain started', 'The rain started than no sooner had I arrived', 'Had I arrived no sooner than the rain started', 'No sooner than the rain started had I arrived'] },
        { id: 'E-ORDER-042', type: 'order', topic: 'Inversion', prompt: 'Ordena: did / realize / Little / the danger / he', correctAnswer: 'Little did he realize the danger', options: ['Little he did realize the danger', 'He did little realize the danger', 'Little did he realize the danger', 'The danger little did he realize'] },
        { id: 'E-ORDER-043', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: that / be / He / present / demanded', correctAnswer: 'He demanded that he be present', options: ['He demanded he be present that', 'That he be present he demanded', 'He demanded that he be present', 'He demanded that he is present'] },
        { id: 'E-ORDER-044', type: 'order', topic: 'Cleft Sentence', prompt: 'Ordena: the lock / was / It / broke', correctAnswer: 'It was the lock that broke', options: ['The lock that broke it was', 'It was the lock that broke', 'Broke the lock it was that', 'That broke the lock it was'] },
        { id: 'E-ORDER-045', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: the instructions, / the user / followed / carefully / the steps', correctAnswer: 'Following the instructions carefully, the user followed the steps', options: ['Followed the steps the user the instructions carefully', 'Following the instructions carefully, the user followed the steps', 'The instructions carefully following, the user followed the steps', 'The user followed the steps following the instructions carefully'] },
        { id: 'E-ORDER-046', type: 'order', topic: 'Inversion', prompt: 'Ordena: only / Not / a musician, / is / he / also / a writer', correctAnswer: 'Not only is he a musician, but he is also a writer', options: ['Not only he is a musician, but he is also a writer', 'Is he not only a musician, but he is also a writer', 'Not only is he a musician, but he is also a writer', 'A musician not only is he, but he is also a writer'] },
        { id: 'E-ORDER-047', type: 'order', topic: 'Inversion', prompt: 'Ordena: arrived / Only after / was / the problem / solved / the technician', correctAnswer: 'Only after the technician arrived was the problem solved', options: ['The problem solved only after the technician arrived was', 'Only after the technician arrived was the problem solved', 'Was the problem solved only after the technician arrived', 'Only after arrived the technician was the problem solved'] },
        { id: 'E-ORDER-048', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: that / He / important / is / apologize / it', correctAnswer: 'It is important that he apologize', options: ['That he apologize is important it', 'He apologize that it is important', 'It is important that he apologize', 'It is important that he apologizes'] },
        { id: 'E-ORDER-049', type: 'order', topic: 'Cleft Sentence', prompt: 'Ordena: happened / It / was / yesterday', correctAnswer: 'It was yesterday that it happened', options: ['Yesterday it was that it happened', 'That it happened it was yesterday', 'It was yesterday that it happened', 'Happened it was yesterday that it'] },
        { id: 'E-ORDER-050', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: finished / the painting, / the artist / sighed / happily / Having', correctAnswer: 'Having finished the painting, the artist sighed happily', options: ['The painting finished, the artist sighed happily Having', 'Having finished the painting, the artist sighed happily', 'Sighed happily the artist having finished the painting', 'Finished the painting having, the artist sighed happily'] },
        { id: 'E-ORDER-051', type: 'order', topic: 'Inversion', prompt: 'Ordena: never / been / before / such / I / was / chaos', correctAnswer: 'Never before was I in such chaos', options: ['I was never before in such chaos', 'Was I in such chaos never before', 'Never before was I in such chaos', 'Chaos I was never before in such'] },
        { id: 'E-ORDER-052', type: 'order', topic: 'Inversion', prompt: 'Ordena: did / Only by / the truth / we / manage / to find / chance', correctAnswer: 'Only by chance did we manage to find the truth', options: ['Did we manage to find the truth only by chance', 'Only by chance did we manage to find the truth', 'We manage to find the truth only by chance did', 'To find the truth only by chance did we manage'] },
        { id: 'E-ORDER-053', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: that / He / demand / the documents / release', correctAnswer: 'He demand that he release the documents', options: ['He demand that he release the documents', 'That he release the documents he demand', 'Release the documents he demand that he', 'He demand that he releases the documents'] },
        { id: 'E-ORDER-054', type: 'order', topic: 'Cleft Sentence', prompt: 'Ordena: John / It / was / helped / who / me', correctAnswer: 'It was John who helped me', options: ['John it was who helped me', 'Who helped me it was John', 'It was John who helped me', 'Helped me who it was John'] },
        { id: 'E-ORDER-055', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: away / from / Running / the dog, / I / fell', correctAnswer: 'Running away from the dog, I fell', options: ['I fell away from the dog Running', 'Running away from the dog, I fell', 'Away from the dog running, I fell', 'The dog I fell running away from'] },
        { id: 'E-ORDER-056', type: 'order', topic: 'Inversion', prompt: 'Ordena: must / a great / So / been / impact / the film / have', correctAnswer: 'So great an impact must the film have been', options: ['So great an impact must the film have been', 'The film must have been so great an impact', 'Must have been the film so great an impact', 'So great the film must have been an impact'] },
        { id: 'E-ORDER-057', type: 'order', topic: 'Inversion', prompt: 'Ordena: were / Under / the circumstances / we / to call / no obligation', correctAnswer: 'Under no circumstances were we under obligation to call', options: ['Under no circumstances were we under obligation to call', 'We were under no obligation to call under the circumstances', 'Under no circumstances we were under obligation to call', 'To call we were under no obligation under the circumstances'] },
        { id: 'E-ORDER-058', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: advise / I / that / she / tomorrow / rest', correctAnswer: 'I advise that she rest tomorrow', options: ['She rest tomorrow I advise that', 'I advise that she rest tomorrow', 'That she rest tomorrow I advise', 'I advise that she rests tomorrow'] },
        { id: 'E-ORDER-059', type: 'order', topic: 'Cleft Sentence', prompt: 'Ordena: most / is / her / I / appreciate / honesty / What', correctAnswer: 'What I appreciate most is her honesty', options: ['I appreciate most what is her honesty', 'Her honesty is what I appreciate most', 'What I appreciate most is her honesty', 'Most is her honesty what I appreciate'] },
        { id: 'E-ORDER-060', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: the bridge, / to / the town / the road / continues / Crossing', correctAnswer: 'Crossing the bridge, the road continues to the town', options: ['The road continues to the town crossing the bridge', 'Crossing the bridge, the road continues to the town', 'To the town the road continues crossing the bridge', 'The bridge crossing, the road continues to the town'] },
   
        
   
        // --- PREGUNTAS NUEVAS PARA CUMPLIR EL REQUISITO DE 100+ POR TEMA ---
        // Se han agregado 146 preguntas adicionales (Past Simple: 28, Past Continuous: 30, Present Simple: 28, Present Continuous: 30, Used to: 30)
        // en el nivel DIFÍCIL.

        // Bloque 1: Past Simple (28 nuevas) - D-071 a D-098
        { id: 'D-071', type: 'mcq', topic: 'Past Simple', prompt: 'It was so cold that the water ___ into ice.', correctAnswer: 'froze', options: ['freezed', 'froze', 'frozen', 'freezing'] },
        { id: 'D-072', type: 'mcq', topic: 'Past Simple', prompt: 'When the market crashed, many companies ___ bankrupt.', correctAnswer: 'went', options: ['go', 'gone', 'went', 'going'] },
        { id: 'D-073', type: 'mcq', topic: 'Past Simple', prompt: 'He ___ the truth, but nobody believed him.', correctAnswer: 'spoke', options: ['speak', 'spoked', 'spoke', 'speaking'] },
        { id: 'D-074', type: 'mcq', topic: 'Past Simple', prompt: 'The jury ___ the defendant innocent.', correctAnswer: 'found', options: ['find', 'finded', 'found', 'finding'] },
        { id: 'D-075', type: 'mcq', topic: 'Past Simple', prompt: 'The old manuscript ___ discovered by archaeologists.', correctAnswer: 'was', options: ['is', 'were', 'was', 'be'] },
        { id: 'D-076', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Strike" es:', correctAnswer: 'Struck', options: ['Striked', 'Stroken', 'Struck', 'Striking'] },
        { id: 'D-077', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Wear" es:', correctAnswer: 'Wore', options: ['Wore', 'Weared', 'Worn', 'Wearing'] },
        { id: 'D-078', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Tear" es:', correctAnswer: 'Tore', options: ['Teared', 'Tore', 'Torn', 'Tearing'] },
        { id: 'D-079', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Swear" es:', correctAnswer: 'Swore', options: ['Sweared', 'Swore', 'Sworn', 'Swearing'] },
        { id: 'D-080', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Bid" (pujar) es:', correctAnswer: 'Bid', options: ['Bidded', 'Bode', 'Bid', 'Bidden'] },
        { id: 'D-081', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the contract / Did / sign / they / yesterday / ?', correctAnswer: 'Did they sign the contract yesterday?', options: ['Sign the contract did they yesterday?', 'Did they signed the contract yesterday?', 'Did they sign the contract yesterday?', 'Yesterday did they sign the contract?'] },
        { id: 'D-082', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the truth / He / not / to / confess / did', correctAnswer: 'He did not confess to the truth', options: ['Not confess to the truth He did', 'He did not confess to the truth', 'Confess to the truth He did not', 'The truth He did not confess to'] },
        { id: 'D-083', type: 'mcq', topic: 'Past Simple', prompt: 'The ancient city ___ founded in 500 BC.', correctAnswer: 'was', options: ['is', 'were', 'was', 'be'] },
        { id: 'D-084', type: 'mcq', topic: 'Past Simple', prompt: 'She ___ the alarm clock when she woke up.', correctAnswer: 'switched off', options: ['switch off', 'switched off', 'switching off', 'switchted off'] },
        { id: 'D-085', type: 'mcq', topic: 'Past Simple', prompt: 'The unexpected visitor ___ us by surprise.', correctAnswer: 'took', options: ['take', 'taked', 'took', 'taking'] },
        { id: 'D-086', type: 'mcq', topic: 'Past Simple', prompt: 'I ___ to finish the demanding project on time.', correctAnswer: 'managed', options: ['manage', 'managed', 'manages', 'managing'] },
        { id: 'D-087', type: 'mcq', topic: 'Past Simple', prompt: 'He ___ the whole bottle of wine himself.', correctAnswer: 'drank', options: ['drink', 'drank', 'drunk', 'drinked'] },
        { id: 'D-088', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Grind" es:', correctAnswer: 'Ground', options: ['Grinded', 'Ground', 'Grind', 'Grinding'] },
        { id: 'D-089', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Forbid" es:', correctAnswer: 'Forbade', options: ['Forbid', 'Forbidded', 'Forbade', 'Forbidden'] },
        { id: 'D-090', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Slink" es:', correctAnswer: 'Slunk', options: ['Slinked', 'Slank', 'Slunk', 'Slinking'] },
        { id: 'D-091', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Swell" es:', correctAnswer: 'Swelled', options: ['Swell', 'Swole', 'Swelled', 'Swollen'] },
        { id: 'D-092', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Wring" es:', correctAnswer: 'Wrung', options: ['Wringed', 'Wrung', 'Wrang', 'Wringing'] },
        { id: 'D-093', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the news / you / Did / understand / fully / ?', correctAnswer: 'Did you fully understand the news?', options: ['Understand the news did you fully?', 'Did you understood the news fully?', 'Did you fully understand the news?', 'Fully understand did you the news?'] },
        { id: 'D-094', type: 'order', topic: 'Past Simple', prompt: 'Ordena: not / the results / announce / The / company / did', correctAnswer: 'The company did not announce the results', options: ['The company not did announce the results', 'Did not announce the results The company', 'The company did not announce the results', 'Announce the results The company did not'] },
        { id: 'D-095', type: 'mcq', topic: 'Past Simple', prompt: 'The old factory ___ down last month.', correctAnswer: 'burned', options: ['burn', 'burnt', 'burned', 'burning'] },
        { id: 'D-096', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Lie" (mentir) es:', correctAnswer: 'Lied', options: ['Lay', 'Lied', 'Lain', 'Lying'] },
        { id: 'D-097', type: 'order', topic: 'Past Simple', prompt: 'Ordena: What / you / did / in / the / meeting / say / ?', correctAnswer: 'What did you say in the meeting?', options: ['Did you say what in the meeting?', 'What you said in the meeting did?', 'What did you say in the meeting?', 'In the meeting what did you say?'] },
        { id: 'D-098', type: 'mcq', topic: 'Past Simple', prompt: 'The soldiers ___ the city after a long siege.', correctAnswer: 'overcame', options: ['overcome', 'overcamed', 'overcame', 'overcoming'] },

        // Bloque 2: Past Continuous (30 nuevas) - D-099 a D-128
        { id: 'D-099', type: 'mcq', topic: 'Past Continuous', prompt: 'I ___ considering moving abroad when I met my future wife.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-100', type: 'mcq', topic: 'Past Continuous', prompt: 'They ___ relentlessly trying to contact the authorities.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'D-101', type: 'mcq', topic: 'Past Continuous', prompt: 'What specific research ___ the team carrying out at the time?', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-102', type: 'mcq', topic: 'Past Continuous', prompt: 'The witnesses ___ continuously providing inconsistent statements.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'D-103', type: 'mcq', topic: 'Past Continuous', prompt: 'She ___ constantly talking about her impending promotion.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-104', type: 'form', topic: 'Past Continuous', prompt: 'La forma interrogativa en Pasado Continuo con "Why / you / smile" es:', correctAnswer: 'Why were you smiling', options: ['Why was you smiling', 'Why did you smile', 'Why were you smiling', 'Why you were smiling'] },
        { id: 'D-105', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The CEO (negotiate)" es:', correctAnswer: 'Was negotiating', options: ['Were negotiating', 'Is negotiating', 'Was negotiating', 'Negotiates'] },
        { id: 'D-106', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "They (monitor)" es:', correctAnswer: 'Were not monitoring', options: ['Was not monitoring', 'Did not monitor', 'Were not monitoring', 'Not were monitoring'] },
        { id: 'D-107', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The conflict (escalate)" es:', correctAnswer: 'Was escalating', options: ['Were escalating', 'Is escalating', 'Was escalating', 'Escalates'] },
        { id: 'D-108', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The government (debate)" es:', correctAnswer: 'Was debating', options: ['Were debating', 'Is debating', 'Was debating', 'Debates'] },
        { id: 'D-109', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: the proposal / the committee / was / reviewing / all / morning', correctAnswer: 'The committee was reviewing the proposal all morning', options: ['Was reviewing the proposal the committee all morning', 'The committee reviewing was the proposal all morning', 'The committee was reviewing the proposal all morning', 'All morning the proposal was reviewing the committee'] },
        { id: 'D-110', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: Were / the terms / negotiating / they / with / the / other / party / ?', correctAnswer: 'Were they negotiating the terms with the other party?', options: ['They were negotiating the terms with the other party?', 'Negotiating the terms were they with the other party?', 'Were they negotiating the terms with the other party?', 'With the other party were they negotiating the terms?'] },
        { id: 'D-111', type: 'mcq', topic: 'Past Continuous', prompt: 'The old machinery ___ making a persistent rattling noise.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-112', type: 'mcq', topic: 'Past Continuous', prompt: 'We ___ attempting to solve the equation when the bell rang.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'D-113', type: 'mcq', topic: 'Past Continuous', prompt: 'The situation ___ rapidly deteriorating throughout the night.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-114', type: 'mcq', topic: 'Past Continuous', prompt: 'She ___ not continuously questioning every decision made.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-115', type: 'mcq', topic: 'Past Continuous', prompt: 'The financial markets ___ experiencing a turbulent period.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'D-116', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "I (supervise)" es:', correctAnswer: 'Was not supervising', options: ['Were not supervising', 'Did not supervise', 'Was not supervising', 'Not was supervising'] },
        { id: 'D-117', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "You (elaborate)" es:', correctAnswer: 'Were elaborating', options: ['Was elaborating', 'Are elaborating', 'Were elaborating', 'Elaborates'] },
        { id: 'D-118', type: 'form', topic: 'Past Continuous', prompt: 'La forma interrogativa en Pasado Continuo con "What / it / signify" es:', correctAnswer: 'What was it signifying', options: ['What were it signifying', 'What did it signify', 'What was it signifying', 'What it was signifying'] },
        { id: 'D-119', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The children (rehearse)" es:', correctAnswer: 'Were rehearsing', options: ['Was rehearsing', 'Is rehearsing', 'Were rehearsing', 'Rehearses'] },
        { id: 'D-120', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "He (intervene)" es:', correctAnswer: 'Was not intervening', options: ['Were not intervening', 'Did not intervene', 'Was not intervening', 'Not was intervening'] },
        { id: 'D-121', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: Was / the / scientist / observing / the / experiment / carefully / ?', correctAnswer: 'Was the scientist observing the experiment carefully?', options: ['The scientist was observing the experiment carefully?', 'Observing the experiment carefully was the scientist?', 'Was the scientist observing the experiment carefully?', 'Carefully was the scientist observing the experiment?'] },
        { id: 'D-122', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: They / the / contract / revising / were / before / the / deadline', correctAnswer: 'They were revising the contract before the deadline', options: ['Revising the contract They were before the deadline', 'They were revising the contract before the deadline', 'Before the deadline They were revising the contract', 'Were revising the contract They before the deadline'] },
        { id: 'D-123', type: 'mcq', topic: 'Past Continuous', prompt: 'The old rivalry ___ constantly being reignited by the media.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-124', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The crisis (unfold)" es:', correctAnswer: 'Was unfolding', options: ['Were unfolding', 'Is unfolding', 'Was unfolding', 'Unfolds'] },
        { id: 'D-125', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: not / We / the / procedure / following / were / strictly', correctAnswer: 'We were not following the procedure strictly', options: ['Following the procedure strictly We were not', 'We not were following the procedure strictly', 'We were not following the procedure strictly', 'Strictly We were not following the procedure'] },
        { id: 'D-126', type: 'mcq', topic: 'Past Continuous', prompt: 'He ___ invariably complaining about the smallest details.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'D-127', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The audience (applaud)" es:', correctAnswer: 'Was applauding', options: ['Were applauding', 'Is applauding', 'Was applauding', 'Applauds'] },
        { id: 'D-128', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: Who / to / were / the / negotiations / attending / ?', correctAnswer: 'Who were attending the negotiations?', options: ['Were attending the negotiations who?', 'Who the negotiations were attending?', 'Who were attending the negotiations?', 'The negotiations who were attending?'] },

        // Bloque 3: Present Simple (28 nuevas) - D-129 a D-156
        { id: 'D-129', type: 'mcq', topic: 'Present Simple', prompt: 'The new policy ___ into effect next quarter.', correctAnswer: 'comes', options: ['come', 'comes', 'coming', 'came'] },
        { id: 'D-130', type: 'mcq', topic: 'Present Simple', prompt: 'A highly optimized system typically ___ a lower risk of failure.', correctAnswer: 'entails', options: ['entail', 'entails', 'entailing', 'entailed'] },
        { id: 'D-131', type: 'mcq', topic: 'Present Simple', prompt: 'The company\'s stock ___ primarily on investor confidence.', correctAnswer: 'depends', options: ['depend', 'depends', 'depending', 'depended'] },
        { id: 'D-132', type: 'mcq', topic: 'Present Simple', prompt: 'The research data ___ the prior assumptions.', correctAnswer: 'contradicts', options: ['contradict', 'contradicts', 'contradicting', 'contradicted'] },
        { id: 'D-133', type: 'mcq', topic: 'Present Simple', prompt: '___ the prevailing conditions necessitate immediate action?', correctAnswer: 'Do', options: ['Do', 'Does', 'Is', 'Are'] },
        { id: 'D-134', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "This (apply) to all cases" es:', correctAnswer: 'Applies', options: ['Apply', 'Applies', 'Applying', 'Applied'] },
        { id: 'D-135', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "The evidence (suggest)" es:', correctAnswer: 'Does not suggest', options: ['Do not suggest', 'Does not suggest', 'Is not suggest', 'Did not suggest'] },
        { id: 'D-136', type: 'form', topic: 'Present Simple', prompt: 'La forma interrogativa de "The project (require) funding" es:', correctAnswer: 'Does the project require', options: ['Do the project require', 'Does the project require', 'Is the project require', 'The project requires'] },
        { id: 'D-137', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "It (behoove) us to act quickly" es:', correctAnswer: 'Behooves', options: ['Behoove', 'Behooves', 'Behooving', 'Behooved'] },
        { id: 'D-138', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "I (concur) with the findings" es:', correctAnswer: 'Do not concur', options: ['Does not concur', 'Do not concur', 'Am not concur', 'Did not concur'] },
        { id: 'D-139', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / usually / board / meet / on / Mondays', correctAnswer: 'The board usually meets on Mondays', options: ['Usually the board meets on Mondays', 'The board meet usually on Mondays', 'The board usually meets on Mondays', 'On Mondays the board usually meets'] },
        { id: 'D-140', type: 'order', topic: 'Present Simple', prompt: 'Ordena: Do / What / the / researchers / propose / ?', correctAnswer: 'What do the researchers propose?', options: ['The researchers propose what do?', 'What the researchers propose do?', 'What do the researchers propose?', 'Propose do the researchers what?'] },
        { id: 'D-141', type: 'mcq', topic: 'Present Simple', prompt: 'The scientific consensus ___ to global warming being man-made.', correctAnswer: 'points', options: ['point', 'points', 'pointing', 'pointed'] },
        { id: 'D-142', type: 'mcq', topic: 'Present Simple', prompt: 'The factory ___ 24 hours a day, 7 days a week.', correctAnswer: 'operates', options: ['operate', 'operates', 'operating', 'operated'] },
        { id: 'D-143', type: 'mcq', topic: 'Present Simple', prompt: 'She rarely ___ her opinion unless asked directly.', correctAnswer: 'offers', options: ['offer', 'offers', 'offering', 'offered'] },
        { id: 'D-144', type: 'mcq', topic: 'Present Simple', prompt: 'The contract ___ both parties to confidentiality.', correctAnswer: 'binds', options: ['bind', 'binds', 'binding', 'bound'] },
        { id: 'D-145', type: 'mcq', topic: 'Present Simple', prompt: 'We always ___ to the terms of the agreement.', correctAnswer: 'adhere', options: ['adhere', 'adheres', 'adhering', 'adhered'] },
        { id: 'D-146', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The law (stipulate)" es:', correctAnswer: 'Stipulates', options: ['Stipulate', 'Stipulates', 'Stipulating', 'Stipulated'] },
        { id: 'D-147', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "The team (yield)" es:', correctAnswer: 'Does not yield', options: ['Do not yield', 'Does not yield', 'Is not yield', 'Did not yield'] },
        { id: 'D-148', type: 'form', topic: 'Present Simple', prompt: 'La forma interrogativa de "The evidence (warrant) a conclusion" es:', correctAnswer: 'Does the evidence warrant', options: ['Do the evidence warrant', 'Does the evidence warrant', 'Is the evidence warrant', 'The evidence warrants'] },
        { id: 'D-149', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "He (refrain) from comment" es:', correctAnswer: 'Refrains', options: ['Refrain', 'Refrains', 'Refraining', 'Refrained'] },
        { id: 'D-150', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "I (endorse) the proposal" es:', correctAnswer: 'Do not endorse', options: ['Does not endorse', 'Do not endorse', 'Am not endorse', 'Did not endorse'] },
        { id: 'D-151', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / company / Do / they / represent / still / ?', correctAnswer: 'Do they still represent the company?', options: ['Still represent the company do they?', 'They still represent the company do?', 'Do they still represent the company?', 'Represent the company do they still?'] },
        { id: 'D-152', type: 'order', topic: 'Present Simple', prompt: 'Ordena: She / hardly / ever / makes / mistakes', correctAnswer: 'She hardly ever makes mistakes', options: ['Hardly ever She makes mistakes', 'She makes hardly ever mistakes', 'She hardly ever makes mistakes', 'Mistakes She hardly ever makes'] },
        { id: 'D-153', type: 'mcq', topic: 'Present Simple', prompt: 'The velocity of light ___ approximately 300,000 km/s.', correctAnswer: 'is', options: ['are', 'is', 'be', 'being'] },
        { id: 'D-154', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The report (encompass)" es:', correctAnswer: 'Encompasses', options: ['Encompass', 'Encompasses', 'Encompassing', 'Encompassed'] },
        { id: 'D-155', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / project / Does / require / extensive / resources / ?', correctAnswer: 'Does the project require extensive resources?', options: ['Require extensive resources does the project?', 'The project requires extensive resources does?', 'Does the project require extensive resources?', 'Extensive resources does the project require?'] },
        { id: 'D-156', type: 'mcq', topic: 'Present Simple', prompt: 'The committee ___ the results after careful deliberation.', correctAnswer: 'publishes', options: ['publish', 'publishes', 'publishing', 'published'] },

        // Bloque 4: Present Continuous (30 nuevas) - D-157 a D-186
        { id: 'D-157', type: 'mcq', topic: 'Present Continuous', prompt: 'The global temperature ___ steadily rising year after year.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-158', type: 'mcq', topic: 'Present Continuous', prompt: 'We ___ actively negotiating the terms of the acquisition.', correctAnswer: 'are', options: ['is', 'are', 'am', 'do'] },
        { id: 'D-159', type: 'mcq', topic: 'Present Continuous', prompt: 'The regulatory body ___ currently scrutinizing the documentation.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-160', type: 'mcq', topic: 'Present Continuous', prompt: 'The opposition ___ continually attempting to undermine the proposal.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-161', type: 'mcq', topic: 'Present Continuous', prompt: 'I ___ presently compiling all the necessary evidence.', correctAnswer: 'am', options: ['is', 'are', 'am', 'do'] },
        { id: 'D-162', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The CEO (address) the board" es:', correctAnswer: 'Is addressing', options: ['Are addressing', 'Am addressing', 'Is addressing', 'Addresses'] },
        { id: 'D-163', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "They (comply) with the request" es:', correctAnswer: 'Are not complying', options: ['Is not complying', 'Do not comply', 'Are not complying', 'Not are complying'] },
        { id: 'D-164', type: 'form', topic: 'Present Continuous', prompt: 'La forma interrogativa en Presente Continuo de "The market (stabilize)" es:', correctAnswer: 'Is the market stabilizing', options: ['Are the market stabilizing', 'Does the market stabilize', 'Is the market stabilizing', 'The market is stabilizing'] },
        { id: 'D-165', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "We (commence) the evaluation" es:', correctAnswer: 'Are commencing', options: ['Is commencing', 'Am commencing', 'Are commencing', 'Commences'] },
        { id: 'D-166', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "She (participate) in the debate" es:', correctAnswer: 'Is not participating', options: ['Are not participating', 'Does not participate', 'Is not participating', 'Not is participating'] },
        { id: 'D-167', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / economy / Is / rapidly / changing / ?', correctAnswer: 'Is the economy rapidly changing?', options: ['The economy is rapidly changing?', 'Rapidly changing is the economy?', 'Is the economy rapidly changing?', 'Changing rapidly is the economy?'] },
        { id: 'D-168', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / company / are / restructuring / the / They / division', correctAnswer: 'They are restructuring the company division', options: ['The company division They are restructuring', 'Are restructuring the company division They', 'They are restructuring the company division', 'Restructuring the company division They are'] },
        { id: 'D-169', type: 'mcq', topic: 'Present Continuous', prompt: 'The opposition parties ___ constantly challenging the government\'s decisions.', correctAnswer: 'are', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-170', type: 'mcq', topic: 'Present Continuous', prompt: 'Due to the storm, the plane ___ not currently landing.', correctAnswer: 'is', options: ['is', 'are', 'am', 'do'] },
        { id: 'D-171', type: 'mcq', topic: 'Present Continuous', prompt: 'The board ___ meticulously examining the financial statements.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-172', type: 'mcq', topic: 'Present Continuous', prompt: '___ the two nations currently engaging in high-level talks?', correctAnswer: 'Are', options: ['Is', 'Are', 'Am', 'Do'] },
        { id: 'D-173', type: 'mcq', topic: 'Present Continuous', prompt: 'The experimental drug ___ showing promising results.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-174', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The system (undergo) maintenance" es:', correctAnswer: 'Is undergoing', options: ['Are undergoing', 'Am undergoing', 'Is undergoing', 'Undergoes'] },
        { id: 'D-175', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "I (delegate) the task" es:', correctAnswer: 'Am not delegating', options: ['Is not delegating', 'Do not delegate', 'Am not delegating', 'Not am delegating'] },
        { id: 'D-176', type: 'form', topic: 'Present Continuous', prompt: 'La forma interrogativa en Presente Continuo de "The data (converge)" es:', correctAnswer: 'Is the data converging', options: ['Are the data converging', 'Does the data converge', 'Is the data converging', 'The data is converging'] },
        { id: 'D-177', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "He (devise) a new strategy" es:', correctAnswer: 'Is devising', options: ['Are devising', 'Am devising', 'Is devising', 'Devises'] },
        { id: 'D-178', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "We (adhere) to the schedule" es:', correctAnswer: 'Are not adhering', options: ['Is not adhering', 'Do not adhere', 'Are not adhering', 'Not are adhering'] },
        { id: 'D-179', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / regulations / Are / continually / evolving / ?', correctAnswer: 'Are the regulations continually evolving?', options: ['The regulations are continually evolving?', 'Continually evolving are the regulations?', 'Are the regulations continually evolving?', 'Evolving continually are the regulations?'] },
        { id: 'D-180', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: I / to / a / highly / sensitive / document / referring / am', correctAnswer: 'I am referring to a highly sensitive document', options: ['Referring to a highly sensitive document I am', 'I referring am to a highly sensitive document', 'I am referring to a highly sensitive document', 'A highly sensitive document I am referring to'] },
        { id: 'D-181', type: 'mcq', topic: 'Present Continuous', prompt: 'The opposition leader ___ constantly denouncing the proposed reforms.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'D-182', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The journalist (investigate) the scandal" es:', correctAnswer: 'Is investigating', options: ['Are investigating', 'Am investigating', 'Is investigating', 'Investigates'] },
        { id: 'D-183', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / parameters / not / We / are / establishing / for / the / study', correctAnswer: 'We are not establishing the parameters for the study', options: ['Establishing the parameters for the study We are not', 'We not are establishing the parameters for the study', 'We are not establishing the parameters for the study', 'The parameters for the study We are not establishing'] },
        { id: 'D-184', type: 'mcq', topic: 'Present Continuous', prompt: '___ the experts currently questioning the methodology?', correctAnswer: 'Are', options: ['Is', 'Are', 'Am', 'Do'] },
        { id: 'D-185', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The findings (emerge) slowly" es:', correctAnswer: 'Are emerging', options: ['Is emerging', 'Am emerging', 'Are emerging', 'Emerges'] },
        { id: 'D-186', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: Where / the / delegation / is / convening / this / afternoon / ?', correctAnswer: 'Where is the delegation convening this afternoon?', options: ['Is the delegation convening this afternoon where?', 'Where the delegation is convening this afternoon?', 'Where is the delegation convening this afternoon?', 'This afternoon where is the delegation convening?'] },

        // Bloque 5: Used to (30 nuevas) - D-187 a D-216
        { id: 'D-187', type: 'mcq', topic: 'Used to', prompt: 'She ___ accustomed to the arduous journey.', correctAnswer: 'is used to', options: ['used to', 'use to', 'is used to', 'was use to'] },
        { id: 'D-188', type: 'mcq', topic: 'Used to', prompt: 'The committee ___ convene weekly before the restructuring.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'D-189', type: 'mcq', topic: 'Used to', prompt: 'Did the firm ___ adhere to such stringent protocols?', correctAnswer: 'use to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'D-190', type: 'mcq', topic: 'Used to', prompt: 'I am gradually ___ to the new high-pressure work environment.', correctAnswer: 'getting used to', options: ['used to', 'use to', 'get used to', 'getting used to'] },
        { id: 'D-191', type: 'mcq', topic: 'Used to', prompt: 'They are not ___ dealing with this level of complexity.', correctAnswer: 'used to', options: ['use to', 'used to', 'using to', 'uses to'] },
        { id: 'D-192', type: 'form', topic: 'Used to', prompt: 'La forma afirmativa con "The policy (apply) universally" es:', correctAnswer: 'The policy used to apply universally', options: ['The policy use to apply universally', 'The policy used to applying universally', 'The policy used to apply universally', 'The policy use to applying universally'] },
        { id: 'D-193', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "He (frequent) that establishment" es:', correctAnswer: 'He did not use to frequent that establishment', options: ['He used not to frequent that establishment', 'He did not used to frequent that establishment', 'He did not use to frequent that establishment', 'He doesn\'t use to frequent that establishment'] },
        { id: 'D-194', type: 'form', topic: 'Used to', prompt: 'La forma interrogativa con "The staff (work) overtime" es:', correctAnswer: 'Did the staff use to work overtime', options: ['Used the staff to work overtime', 'Did the staff used to work overtime', 'Did the staff use to work overtime', 'Does the staff use to work overtime'] },
        { id: 'D-195', type: 'form', topic: 'Used to', prompt: 'La forma de "to get used to" con "I" es:', correctAnswer: 'I am getting used to', options: ['I used to', 'I am used to', 'I am getting used to', 'I get used to'] },
        { id: 'D-196', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The machinery" es:', correctAnswer: 'The machinery is used to', options: ['The machinery use to', 'The machinery used to', 'The machinery is used to', 'The machinery were use to'] },
        { id: 'D-197', type: 'order', topic: 'Used to', prompt: 'Ordena: the / process / We / a / less / used / bureaucratic / to / follow', correctAnswer: 'We used to follow a less bureaucratic process', options: ['Used to follow a less bureaucratic process We', 'We follow used to a less bureaucratic process', 'We used to follow a less bureaucratic process', 'A less bureaucratic process We used to follow'] },
        { id: 'D-198', type: 'order', topic: 'Used to', prompt: 'Ordena: Did / the / committee / approve / use / to / such / radical / changes / ?', correctAnswer: 'Did the committee use to approve such radical changes?', options: ['Use to approve such radical changes did the committee?', 'Did the committee used to approve such radical changes?', 'Did the committee use to approve such radical changes?', 'Such radical changes did the committee use to approve?'] },
        { id: 'D-199', type: 'mcq', topic: 'Used to', prompt: 'I never ___ question the authority of the supervisor.', correctAnswer: 'used to', options: ['use to', 'used to', 'am used to', 'is used to'] },
        { id: 'D-200', type: 'mcq', topic: 'Used to', prompt: 'The old factory ___ emit harmful fumes into the atmosphere.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'D-201', type: 'mcq', topic: 'Used to', prompt: 'She ___ accustomed to working under enormous pressure.', correctAnswer: 'is used to', options: ['used to', 'use to', 'is used to', 'was use to'] },
        { id: 'D-202', type: 'mcq', topic: 'Used to', prompt: 'Did the scientists ___ collaborate on joint projects?', correctAnswer: 'use to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'D-203', type: 'mcq', topic: 'Used to', prompt: 'I ___ accustomed to the persistent interference.', correctAnswer: 'got used to', options: ['used to', 'get use to', 'got used to', 'am used to'] },
        { id: 'D-204', type: 'form', topic: 'Used to', prompt: 'La forma afirmativa con "The board (disregard) the warnings" es:', correctAnswer: 'The board used to disregard the warnings', options: ['The board use to disregard the warnings', 'The board used to disregarding the warnings', 'The board used to disregard the warnings', 'The board use to disregarding the warnings'] },
        { id: 'D-205', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "We (tolerate) such delays" es:', correctAnswer: 'We did not use to tolerate such delays', options: ['We used not to tolerate such delays', 'We did not used to tolerate such delays', 'We did not use to tolerate such delays', 'We don\'t use to tolerate such delays'] },
        { id: 'D-206', type: 'form', topic: 'Used to', prompt: 'La forma interrogativa con "The company (adhere) to the guidelines" es:', correctAnswer: 'Did the company use to adhere to the guidelines', options: ['Used the company to adhere to the guidelines', 'Did the company used to adhere to the guidelines', 'Did the company use to adhere to the guidelines', 'Does the company use to adhere to the guidelines'] },
        { id: 'D-207', type: 'form', topic: 'Used to', prompt: 'La forma de "to get used to" con "He" es:', correctAnswer: 'He is getting used to', options: ['He used to', 'He is used to', 'He is getting used to', 'He get used to'] },
        { id: 'D-208', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The team" es:', correctAnswer: 'The team is used to', options: ['The team use to', 'The team used to', 'The team is used to', 'The team were use to'] },
        { id: 'D-209', type: 'order', topic: 'Used to', prompt: 'Ordena: He / such / was / not / used / to / intense / scrutiny', correctAnswer: 'He was not used to such intense scrutiny', options: ['Was not used to such intense scrutiny He', 'He not was used to such intense scrutiny', 'He was not used to such intense scrutiny', 'Such intense scrutiny He was not used to'] },
        { id: 'D-210', type: 'order', topic: 'Used to', prompt: 'Ordena: Did / the / system / generate / use / to / false / positives / ?', correctAnswer: 'Did the system use to generate false positives?', options: ['Use to generate false positives did the system?', 'Did the system used to generate false positives?', 'Did the system use to generate false positives?', 'False positives did the system use to generate?'] },
        { id: 'D-211', type: 'mcq', topic: 'Used to', prompt: 'They ___ engage in high-risk investments.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'D-212', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "The opposition (reject) the findings" es:', correctAnswer: 'The opposition did not use to reject the findings', options: ['The opposition used not to reject the findings', 'The opposition did not used to reject the findings', 'The opposition did not use to reject the findings', 'The opposition doesn\'t use to reject the findings'] },
        { id: 'D-213', type: 'order', topic: 'Used to', prompt: 'Ordena: Where / the / board / did / use / to / hold / meetings / ?', correctAnswer: 'Where did the board use to hold meetings?', options: ['Did the board use to hold meetings where?', 'Where the board did use to hold meetings?', 'Where did the board use to hold meetings?', 'Meetings where did the board use to hold?'] },
        { id: 'D-214', type: 'mcq', topic: 'Used to', prompt: 'The process ___ more streamlined in the past.', correctAnswer: 'used to be', options: ['use to be', 'used to be', 'was used to be', 'is used to be'] },
        { id: 'D-215', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The staff" es:', correctAnswer: 'The staff are used to', options: ['The staff use to', 'The staff used to', 'The staff are used to', 'The staff were use to'] },
        { id: 'D-216', type: 'order', topic: 'Used to', prompt: 'Ordena: the / pressure / not / He / was / used / to / of / the / job', correctAnswer: 'He was not used to the pressure of the job', options: ['Was not used to the pressure of the job He', 'He not was used to the pressure of the job', 'He was not used to the pressure of the job', 'The pressure of the job He was not used to'] },
    ],
    // Nivel EXPERTO: 60 preguntas (Originales) + 143 preguntas (Nuevas) = 203 preguntas
    expert: [
        // MCQS (Multiple Choice) - 20 ejemplos (Originales)
        { id: 'E-MCQ-001', type: 'mcq', topic: 'Inversion', prompt: 'Hardly ___ the door when the phone rang.', correctAnswer: 'had I opened', options: ['I had opened', 'had I opened', 'I opened', 'did I open'] },
        { id: 'E-MCQ-002', type: 'mcq', topic: 'Subjunctive', prompt: 'It is vital that he ___ the committee.', correctAnswer: 'attend', options: ['attends', 'attended', 'attend', 'is attending'] },
        { id: 'E-MCQ-003', type: 'mcq', topic: 'Vocabulary', prompt: 'The word for "extremely large" is:', correctAnswer: 'colossal', options: ['small', 'great', 'colossal', 'nice'] },
        { id: 'E-MCQ-004', type: 'mcq', topic: 'Reported Speech', prompt: 'She suggested ___ the meeting until tomorrow.', correctAnswer: 'postponing', options: ['to postpone', 'postponing', 'postpone', 'postponed'] },
        { id: 'E-MCQ-005', type: 'mcq', topic: 'Future Perfect Continuous', prompt: 'By the time you arrive, I ___ for three hours.', correctAnswer: 'will have been waiting', options: ['will be waiting', 'will have waited', 'will have been waiting', 'will wait'] },
        { id: 'E-MCQ-006', type: 'mcq', topic: 'Relative Clause', prompt: 'The document, ___ content was leaked, caused a scandal.', correctAnswer: 'whose', options: ['which', 'that', 'whose', 'whom'] },
        { id: 'E-MCQ-007', type: 'mcq', topic: 'Causative (Get)', prompt: 'We need to get the paperwork ___ by the director.', correctAnswer: 'signed', options: ['sign', 'to sign', 'signing', 'signed'] },
        { id: 'E-MCQ-008', type: 'mcq', topic: 'Modals (Perfect)', prompt: 'He ___ left; his car is still here.', correctAnswer: 'can\'t have', options: ['must have', 'can\'t have', 'should have', 'might have'] },
        { id: 'E-MCQ-009', type: 'mcq', topic: 'Causative (Have)', prompt: 'We had the roof ___ last week.', correctAnswer: 'repaired', options: ['repair', 'to repair', 'repairing', 'repaired'] },
        { id: 'E-MCQ-010', type: 'mcq', topic: 'Reduced Relative Clause', prompt: 'The man ___ by the police was arrested.', correctAnswer: 'questioned', options: ['questioning', 'questioned', 'who questioned', 'to question'] },
        { id: 'E-MCQ-011', type: 'mcq', topic: 'Inversion (Time)', prompt: 'No sooner had I arrived ___ the party started.', correctAnswer: 'than', options: ['when', 'then', 'than', 'that'] },
        { id: 'E-MCQ-012', type: 'mcq', topic: 'Subjunctive', prompt: 'It is requested that all members ___ present.', correctAnswer: 'be', options: ['are', 'be', 'will be', 'were'] },
        { id: 'E-MCQ-013', type: 'mcq', topic: 'Vocabulary', prompt: 'The word for "to pretend to be affected by a feeling" is:', correctAnswer: 'feign', options: ['act', 'feign', 'show', 'admit'] },
        { id: 'E-MCQ-014', type: 'mcq', topic: 'Participle Clause', prompt: '___ the facts, the judge made a ruling.', correctAnswer: 'Having considered', options: ['Considering', 'To consider', 'Having considered', 'Considered'] },
        { id: 'E-MCQ-015', type: 'mcq', topic: 'Wish/If Only', prompt: 'I wish you ___ stop complaining.', correctAnswer: 'would', options: ['will', 'would', 'did', 'should'] },
        { id: 'E-MCQ-016', type: 'mcq', topic: 'Inversion (Place)', prompt: 'In the corner ___ a strange statue.', correctAnswer: 'stood', options: ['stood', 'did stand', 'was standing', 'it stood'] },
        { id: 'E-MCQ-017', type: 'mcq', topic: 'Subjunctive (After It is)', prompt: 'It is imperative that the data ___ checked.', correctAnswer: 'be', options: ['is', 'are', 'be', 'was'] },
        { id: 'E-MCQ-018', type: 'mcq', topic: 'Vocabulary', prompt: 'The word for "secret or mysterious" is:', correctAnswer: 'arcane', options: ['open', 'public', 'arcane', 'simple'] },
        { id: 'E-MCQ-019', type: 'mcq', topic: 'Conditional (Inversion)', prompt: '___ for the warning, we would have entered the danger zone.', correctAnswer: 'Had it not been', options: ['If it had not been', 'Had it not been', 'If it was not', 'It had not been'] },
        { id: 'E-MCQ-020', type: 'mcq', topic: 'Reported Speech (Future)', prompt: 'She said she ___ be leaving soon.', correctAnswer: 'would', options: ['will', 'would', 'is', 'was'] },

        // FORM (Forma Correcta) - 20 ejemplos (Originales)
        { id: 'E-FORM-021', type: 'form', topic: 'Inversion (Only after)', prompt: 'La forma correcta: "Only after checking ___ the error" es:', correctAnswer: 'did he find', options: ['he found', 'he did find', 'did he find', 'found he'] },
        { id: 'E-FORM-022', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "We demand that he ___ immediately" es:', correctAnswer: 'resign', options: ['resigns', 'resigned', 'resign', 'is resigning'] },
        { id: 'E-FORM-023', type: 'form', topic: 'Nominal Clause', prompt: 'La palabra para empezar: "___ the committee decides is final" es:', correctAnswer: 'Whatever', options: ['Whenever', 'However', 'Whatever', 'Wherever'] },
        { id: 'E-FORM-024', type: 'form', topic: 'Causative (Let)', prompt: 'La forma correcta: "She let me (go) home early" es:', correctAnswer: 'go', options: ['to go', 'going', 'go', 'went'] },
        { id: 'E-FORM-025', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "falta de respeto" es:', correctAnswer: 'contempt', options: ['admiration', 'respect', 'contempt', 'awe'] },
        { id: 'E-FORM-026', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "Little ___ about the plan" es:', correctAnswer: 'did he know', options: ['he knew', 'he did know', 'did he know', 'knew he'] },
        { id: 'E-FORM-027', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "It is suggested that she ___ a lawyer" es:', correctAnswer: 'consult', options: ['consults', 'consulted', 'consult', 'is consulting'] },
        { id: 'E-FORM-028', type: 'form', topic: 'Participle Clause', prompt: 'La forma correcta: "___ the book, she went to bed" es:', correctAnswer: 'Having read', options: ['Reading', 'Read', 'Having read', 'To read'] },
        { id: 'E-FORM-029', type: 'form', topic: 'Causative (Help)', prompt: 'La forma correcta: "I helped him (prepare) the report" es:', correctAnswer: 'prepare', options: ['to prepare', 'preparing', 'prepare', 'prepared'] },
        { id: 'E-FORM-030', type: 'form', topic: 'Reported Speech (Modal)', prompt: 'Reporta: "I must leave" (He said he ___ leave)', correctAnswer: 'had to', options: ['must', 'had to', 'would', 'should'] },
        { id: 'E-FORM-031', type: 'form', topic: 'Inversion (Negative Adverb)', prompt: 'La forma correcta: "Never before ___ such blatant disregard" es:', correctAnswer: 'have I seen', options: ['I have seen', 'I saw', 'have I seen', 'did I see'] },
        { id: 'E-FORM-032', type: 'form', topic: 'Subjunctive (If I were to)', prompt: 'La forma correcta: "If I were to ___ the company..." es:', correctAnswer: 'acquire', options: ['acquired', 'acquire', 'acquiring', 'acquiress'] },
        { id: 'E-FORM-033', type: 'form', topic: 'Reduced Relative Clause', prompt: 'La forma correcta: "The individual ___ for the crime was released" es:', correctAnswer: 'imprisoned', options: ['imprisoning', 'imprisoned', 'who imprisoned', 'to imprison'] },
        { id: 'E-FORM-034', type: 'form', topic: 'Causative (Make)', prompt: 'La forma correcta: "The law makes it (illegal) to park here" es:', correctAnswer: 'illegal', options: ['illegally', 'illegal', 'to illegal', 'illegaling'] },
        { id: 'E-FORM-035', type: 'form', topic: 'Vocabulary', prompt: 'La palabra para "extremadamente meticuloso" es:', correctAnswer: 'fastidious', options: ['careless', 'fastidious', 'simple', 'hasty'] },
        { id: 'E-FORM-036', type: 'form', topic: 'Inversion', prompt: 'La forma correcta: "So worried ___ that he couldn\'t sleep" es:', correctAnswer: 'was he', options: ['he was', 'was he', 'he were', 'were he'] },
        { id: 'E-FORM-037', type: 'form', topic: 'Subjunctive', prompt: 'La forma correcta: "My advice is that she ___ tomorrow" es:', correctAnswer: 'start', options: ['starts', 'started', 'start', 'is starting'] },
        { id: 'E-FORM-038', type: 'form', topic: 'Participle Clause', prompt: 'La forma correcta: "___ in the contract, the clause is binding" es:', correctAnswer: 'As stated', options: ['Stating', 'Stated', 'To state', 'As stating'] },
        { id: 'E-FORM-039', type: 'form', topic: 'Causative (Have/Get)', prompt: 'La forma correcta: "We ___ the data anonymized" es:', correctAnswer: 'had/got', options: ['made', 'let', 'had/got', 'helped'] },
        { id: 'E-FORM-040', type: 'form', topic: 'Reported Speech (Advice)', prompt: 'Reporta: "You should study harder" (He advised me...)', correctAnswer: 'to study harder', options: ['study harder', 'to study harder', 'if I studied harder', 'I study harder'] },

        // ORDER (Ordenar Palabras) - 20 ejemplos (Originales)
        { id: 'E-ORDER-041', type: 'order', topic: 'Inversion', prompt: 'Ordena: were / not / Under / the / circumstances / they / to / accept / pressure / any', correctAnswer: 'Under no circumstances were they to accept any pressure', options: ['Under no circumstances they were to accept any pressure', 'Were they to accept any pressure under no circumstances', 'Under no circumstances were they to accept any pressure', 'Any pressure were they to accept under no circumstances'] },
        { id: 'E-ORDER-042', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: is / It / that / necessary / the / project / be / completed / promptly', correctAnswer: 'It is necessary that the project be completed promptly', options: ['That the project be completed promptly is necessary It', 'It is necessary that the project be completed promptly', 'The project be completed promptly is necessary that It', 'Is necessary that the project be completed promptly It'] },
        { id: 'E-ORDER-043', type: 'order', topic: 'Reduced Relative Clause', prompt: 'Ordena: in / the / by / report / errors / noted / were / rectified / the / editor', correctAnswer: 'The errors noted in the report were rectified by the editor', options: ['Noted in the report the errors were rectified by the editor', 'The errors noted in the report were rectified by the editor', 'Rectified by the editor were the errors noted in the report', 'The editor rectified the errors noted in the report were'] },
        { id: 'E-ORDER-044', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: the / issue / Resolved / the / was / next / the / day / being', correctAnswer: 'The issue being resolved, the next day was clear', options: ['The issue was resolved, the next day being clear', 'Resolved the issue being, the next day was clear', 'The issue being resolved, the next day was clear', 'Being resolved the issue, the next day was clear'] },
        { id: 'E-ORDER-045', type: 'order', topic: 'Wish/If Only', prompt: 'Ordena: that / he / wish / I / were / here', correctAnswer: 'I wish that he were here', options: ['Wish I that he were here', 'He were here I wish that', 'I wish that he were here', 'That he were here I wish'] },
        { id: 'E-ORDER-046', type: 'order', topic: 'Inversion (Seldom)', prompt: 'Ordena: a / public / rarely / appears / Seldom / in / the / figure', correctAnswer: 'Seldom does the public figure appear rarely in the public', options: ['Seldom the public figure appears rarely in public', 'Seldom does the public figure appear rarely in the public', 'The public figure seldom appears rarely in public', 'Rarely appears the public figure seldom in public'] },
        { id: 'E-ORDER-047', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: is / crucial / that / it / the / contract / be / ratified', correctAnswer: 'It is crucial that the contract be ratified', options: ['That the contract be ratified is crucial It', 'It is crucial that the contract be ratified', 'The contract be ratified is crucial that It', 'Is crucial that the contract be ratified It'] },
        { id: 'E-ORDER-048', type: 'order', topic: 'Nominal Clause', prompt: 'Ordena: is / not / clear / has / happened / What', correctAnswer: 'What has happened is not clear', options: ['Is not clear what has happened', 'What has happened is not clear', 'Not clear is what has happened', 'Happened what is not clear has'] },
        { id: 'E-ORDER-049', type: 'order', topic: 'Causative (Get)', prompt: 'Ordena: the / to / Get / report / him / approve', correctAnswer: 'Get him to approve the report', options: ['Approve the report Get him to', 'Get him approve to the report', 'Get him to approve the report', 'To approve the report get him'] },
        { id: 'E-ORDER-050', type: 'order', topic: 'Reported Speech', prompt: 'Ordena: to / advised / stay / the / inside / He / children', correctAnswer: 'He advised the children to stay inside', options: ['Advised the children to stay inside He', 'He to stay inside advised the children', 'He advised the children to stay inside', 'Stay inside He advised the children to'] },
        { id: 'E-ORDER-051', type: 'order', topic: 'Inversion (No sooner)', prompt: 'Ordena: had / arrived / No / sooner / than / he / the / meeting / began', correctAnswer: 'No sooner had he arrived than the meeting began', options: ['Had he arrived no sooner than the meeting began', 'No sooner he had arrived than the meeting began', 'No sooner had he arrived than the meeting began', 'Than the meeting began no sooner had he arrived'] },
        { id: 'E-ORDER-052', type: 'order', topic: 'Subjunctive', prompt: 'Ordena: demand / We / that / the / truth / be / disclosed', correctAnswer: 'We demand that the truth be disclosed', options: ['That the truth be disclosed We demand', 'The truth be disclosed We demand that', 'We demand that the truth be disclosed', 'Be disclosed the truth We demand that'] },
        { id: 'E-ORDER-053', type: 'order', topic: 'Reduced Relative Clause', prompt: 'Ordena: the / company / The / people / laid / off / were / compensated / by', correctAnswer: 'The people laid off by the company were compensated', options: ['Laid off by the company the people were compensated', 'The people were compensated laid off by the company', 'The people laid off by the company were compensated', 'Compensated were the people laid off by the company'] },
        { id: 'E-ORDER-054', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: his / report / submitted / Having / he / left / the / office', correctAnswer: 'Having submitted his report, he left the office', options: ['Submitted his report Having, he left the office', 'He left the office having submitted his report', 'Having submitted his report, he left the office', 'The office he left having submitted his report'] },
        { id: 'E-ORDER-055', type: 'order', topic: 'Participle Clause', prompt: 'Ordena: away / I / the / fell / running / from / dog', correctAnswer: 'Running away from the dog, I fell', options: ['I running away from the dog fell', 'Running away from the dog, I fell', 'Away from the dog running, I fell', 'The dog I fell running away from'] },
        { id: 'E-ORDER-056', type: 'order', topic: 'Inversion', prompt: 'Ordena: must / a great / So / been / impact / the film / have', correctAnswer: 'So great an impact must the film have been', options: ['So great an impact must the film have been', 'The film must have been so great an impact', 'Must have been the film so great an impact', 'So great the film must have been an impact'] },
        { id: 'E-ORDER-057', type: 'order', topic: 'Inversion', prompt: 'Ordena: were / Under / the circumstances / we / to call / no obligation', correctAnswer: 'Under no obligation were we to call', options: ['Under no circumstances were we under obligation to call', 'We were under no obligation to call under the circumstances', 'Under no circumstances we were under obligation to...'], options: ['Under no obligation were we to call under the circumstances', 'We were under no obligation to call under the circumstances', 'Under no obligation we were to call under the circumstances', 'To call under no obligation were we under the circumstances'] },
        { id: 'E-ORDER-058', type: 'order', topic: 'Wish/If Only', prompt: 'Ordena: a / better / decision / only / had / I / If / made', correctAnswer: 'If only I had made a better decision', options: ['Only if I had made a better decision', 'I had made a better decision if only', 'If only I had made a better decision', 'A better decision had I made if only'] },
        { id: 'E-ORDER-059', type: 'order', topic: 'Causative (Have)', prompt: 'Ordena: the / to / have / We / the / director / sign / contract / to / get', correctAnswer: 'We have to get the director to sign the contract', options: ['To get the director to sign the contract we have to', 'We have to have the contract signed by the director', 'We have to get the director to sign the contract', 'The contract to sign the director we have to get'] },
        { id: 'E-ORDER-060', type: 'order', topic: 'Reported Speech (Question)', prompt: 'Ordena: where / I / he / asked / was / going', correctAnswer: 'He asked where I was going', options: ['Where I was going he asked', 'He asked I was going where', 'He asked where I was going', 'I was going where he asked'] },

        // --- PREGUNTAS NUEVAS PARA CUMPLIR EL REQUISITO DE 100+ POR TEMA ---
        // Se han agregado 143 preguntas adicionales (Past Simple: 28, Past Continuous: 29, Present Simple: 28, Present Continuous: 29, Used to: 29)
        // en el nivel EXPERTO, con énfasis en estructuras más complejas y vocabulario avanzado.

        // Bloque 1: Past Simple (28 nuevas) - E-061 a E-088
        { id: 'E-061', type: 'mcq', topic: 'Past Simple', prompt: 'Rarely ___ such a clandestine operation proceed without internal opposition.', correctAnswer: 'did', options: ['does', 'did', 'has', 'was'] },
        { id: 'E-062', type: 'mcq', topic: 'Past Simple', prompt: 'The jury\'s verdict ___ a significant shift in public opinion.', correctAnswer: 'precipitated', options: ['precipitate', 'precipitates', 'precipitating', 'precipitated'] },
        { id: 'E-063', type: 'mcq', topic: 'Past Simple', prompt: 'Had the documents been scrutinized, the truth ___ emerged.', correctAnswer: 'would have', options: ['would', 'would have', 'did', 'had'] },
        { id: 'E-064', type: 'mcq', topic: 'Past Simple', prompt: 'Not until the audit ___ complete, did the discrepancies surface.', correctAnswer: 'was', options: ['is', 'were', 'was', 'be'] },
        { id: 'E-065', type: 'mcq', topic: 'Past Simple', prompt: 'It was mandated that the committee ___ the findings before the deadline.', correctAnswer: 'submit', options: ['submits', 'submitted', 'submit', 'submitting'] },
        { id: 'E-066', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Undergo" es:', correctAnswer: 'Underwent', options: ['Undergoed', 'Underwent', 'Undergone', 'Undergoing'] },
        { id: 'E-067', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Flee" es:', correctAnswer: 'Fled', options: ['Fleeed', 'Flew', 'Fled', 'Fleeing'] },
        { id: 'E-068', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Strive" es:', correctAnswer: 'Strove', options: ['Strived', 'Stroved', 'Strove', 'Striving'] },
        { id: 'E-069', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Abide" es:', correctAnswer: 'Abode', options: ['Abided', 'Abode', 'Abiden', 'Abiding'] },
        { id: 'E-070', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Forgo" es:', correctAnswer: 'Forewent', options: ['Forgoed', 'Forwent', 'Foregone', 'Forgoing'] },
        { id: 'E-071', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the / board / the / motion / vote / did / not / The / unanimously', correctAnswer: 'The board did not vote the motion unanimously', options: ['Not vote the motion unanimously did the board', 'The board not did vote the motion unanimously', 'The board did not vote the motion unanimously', 'Unanimously the board did not vote the motion'] },
        { id: 'E-072', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the / outcome / So / profound / the / of / was / that / the / impact / decision / resignation / it / led / to / his', correctAnswer: 'So profound was the impact of the decision that it led to his resignation', options: ['The impact of the decision was so profound that it led to his resignation', 'So profound the impact of the decision was that it led to his resignation', 'So profound was the impact of the decision that it led to his resignation', 'His resignation led to it that so profound was the impact of the decision'] },
        { id: 'E-073', type: 'mcq', topic: 'Past Simple', prompt: 'Never before ___ the discrepancy been so apparent in the fiscal report.', correctAnswer: 'was', options: ['is', 'were', 'was', 'be'] },
        { id: 'E-074', type: 'mcq', topic: 'Past Simple', prompt: 'The whistleblower ___ the entire clandestine operation to the media.', correctAnswer: 'divulged', options: ['divulge', 'divulges', 'divulging', 'divulged'] },
        { id: 'E-075', type: 'mcq', topic: 'Past Simple', prompt: 'Had we only known, we ___ mitigated the subsequent fallout.', correctAnswer: 'would have', options: ['would', 'would have', 'did', 'had'] },
        { id: 'E-076', type: 'mcq', topic: 'Past Simple', prompt: 'The prevailing assumption ___ challenged by the emerging evidence.', correctAnswer: 'was', options: ['is', 'were', 'was', 'be'] },
        { id: 'E-077', type: 'mcq', topic: 'Past Simple', prompt: 'Only then ___ the true extent of the mismanagement become evident.', correctAnswer: 'did', options: ['does', 'did', 'has', 'was'] },
        { id: 'E-078', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Oust" (expulsar) es:', correctAnswer: 'Ousted', options: ['Oust', 'Ousted', 'Oustt', 'Ousting'] },
        { id: 'E-079', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Cling" es:', correctAnswer: 'Clung', options: ['Clinged', 'Clung', 'Cling', 'Clinging'] },
        { id: 'E-080', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Beget" es:', correctAnswer: 'Begot', options: ['Beget', 'Begot', 'Begetted', 'Begetting'] },
        { id: 'E-081', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Foresake" es:', correctAnswer: 'Forsook', options: ['Foresake', 'Foresook', 'Forsook', 'Foresaken'] },
        { id: 'E-082', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Uphold" es:', correctAnswer: 'Upheld', options: ['Upheld', 'Upholded', 'Uphold', 'Upholding'] },
        { id: 'E-083', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the / mandate / Did / they / explicitly / reject / ?', correctAnswer: 'Did they explicitly reject the mandate?', options: ['Reject the mandate did they explicitly?', 'Did they rejected the mandate explicitly?', 'Did they explicitly reject the mandate?', 'Explicitly reject did they the mandate?'] },
        { id: 'E-084', type: 'order', topic: 'Past Simple', prompt: 'Ordena: the / discrepancy / did / not / He / willfully / disclose', correctAnswer: 'He did not willfully disclose the discrepancy', options: ['Not willfully disclose the discrepancy He did', 'He not did willfully disclose the discrepancy', 'He did not willfully disclose the discrepancy', 'The discrepancy He did not willfully disclose'] },
        { id: 'E-085', type: 'mcq', topic: 'Past Simple', prompt: 'Seldom ___ the CEO personally intervene in operational matters.', correctAnswer: 'did', options: ['does', 'did', 'has', 'was'] },
        { id: 'E-086', type: 'form', topic: 'Past Simple', prompt: 'El pasado simple de "Bet" es:', correctAnswer: 'Bet', options: ['Betted', 'Bet', 'Betting', 'Bote'] },
        { id: 'E-087', type: 'order', topic: 'Past Simple', prompt: 'Ordena: an / ethical / Was / violation / committed / ?', correctAnswer: 'Was an ethical violation committed?', options: ['An ethical violation was committed?', 'Committed was an ethical violation?', 'Was an ethical violation committed?', 'An ethical violation committed was?'] },
        { id: 'E-088', type: 'mcq', topic: 'Past Simple', prompt: 'The sudden market upheaval ___ a wave of regulatory reforms.', correctAnswer: 'triggered', options: ['trigger', 'triggers', 'triggering', 'triggered'] },

        // Bloque 2: Past Continuous (29 nuevas) - E-089 a E-117
        { id: 'E-089', type: 'mcq', topic: 'Past Continuous', prompt: 'I was ___ constantly beset by technical difficulties during the presentation.', correctAnswer: 'being', options: ['be', 'being', 'been', 'was'] },
        { id: 'E-090', type: 'mcq', topic: 'Past Continuous', prompt: 'The investigative committee ___ meticulously cataloging the documents.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-091', type: 'mcq', topic: 'Past Continuous', prompt: 'They ___ persistently challenging the validity of the evidence.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'E-092', type: 'mcq', topic: 'Past Continuous', prompt: 'At the time, the entire department ___ undergoing a profound cultural shift.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-093', type: 'mcq', topic: 'Past Continuous', prompt: 'She was ___ incessantly barraging the call center with complaints.', correctAnswer: 'being', options: ['be', 'being', 'been', 'was'] },
        { id: 'E-094', type: 'form', topic: 'Past Continuous', prompt: 'La forma interrogativa en Pasado Continuo con "To what extent / the / policy / influence" es:', correctAnswer: 'To what extent was the policy influencing', options: ['To what extent were the policy influencing', 'To what extent did the policy influence', 'To what extent was the policy influencing', 'To what extent the policy was influencing'] },
        { id: 'E-095', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The anomaly (manifest)" es:', correctAnswer: 'Was manifesting', options: ['Were manifesting', 'Is manifesting', 'Was manifesting', 'Manifests'] },
        { id: 'E-096', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "They (ascribe) the failures to external factors" es:', correctAnswer: 'Were not ascribing', options: ['Was not ascribing', 'Did not ascribe', 'Were not ascribing', 'Not were ascribing'] },
        { id: 'E-097', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The CEO (allude) to imminent changes" es:', correctAnswer: 'Was alluding', options: ['Were alluding', 'Is alluding', 'Was alluding', 'Alludes'] },
        { id: 'E-098', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The system (be) incessantly monitored" (Voz pasiva) es:', correctAnswer: 'Was being incessantly monitored', options: ['Were being incessantly monitored', 'Is being incessantly monitored', 'Was being incessantly monitored', 'Was incessantly monitored'] },
        { id: 'E-099', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: the / board / a / secretly / coup / were / plotting / The / executives', correctAnswer: 'The executives were secretly plotting a coup with the board', options: ['Secretly plotting a coup were the executives with the board', 'The executives plotting were secretly a coup with the board', 'The executives were secretly plotting a coup with the board', 'A coup were the executives secretly plotting with the board'] },
        { id: 'E-100', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: Was / the / due / diligence / conducted / rigorously / ?', correctAnswer: 'Was the due diligence being conducted rigorously?', options: ['The due diligence was conducted rigorously?', 'Conducted rigorously was the due diligence?', 'Was the due diligence being conducted rigorously?', 'Rigourosly was the due diligence conducted?'] },
        { id: 'E-101', type: 'mcq', topic: 'Past Continuous', prompt: 'The old paradigm ___ constantly being challenged by new theories.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-102', type: 'mcq', topic: 'Past Continuous', prompt: 'We ___ attempting to reconcile the disparate findings.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'E-103', type: 'mcq', topic: 'Past Continuous', prompt: 'The new regulations ___ incrementally being implemented across all divisions.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'E-104', type: 'mcq', topic: 'Past Continuous', prompt: 'He ___ not consciously obfuscating the data during the presentation.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-105', type: 'mcq', topic: 'Past Continuous', prompt: 'The subtle discrepancies ___ continually evading the auditor\'s detection.', correctAnswer: 'were', options: ['was', 'were', 'did', 'are'] },
        { id: 'E-106', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "I (subvert) the protocol" es:', correctAnswer: 'Was not subverting', options: ['Were not subverting', 'Did not subvert', 'Was not subverting', 'Not was subverting'] },
        { id: 'E-107', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The entity (amalgamate)" es:', correctAnswer: 'Was amalgamating', options: ['Were amalgamating', 'Is amalgamating', 'Was amalgamating', 'Amalgamates'] },
        { id: 'E-108', type: 'form', topic: 'Past Continuous', prompt: 'La forma interrogativa en Pasado Continuo con "Under what pretext / the / funds / divert" es:', correctAnswer: 'Under what pretext were the funds being diverted', options: ['Under what pretext was the funds being diverted', 'Under what pretext did the funds divert', 'Under what pretext were the funds being diverted', 'Under what pretext the funds were being diverted'] },
        { id: 'E-109', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The consensus (dissipate)" es:', correctAnswer: 'Was dissipating', options: ['Were dissipating', 'Is dissipating', 'Was dissipating', 'Dissipates'] },
        { id: 'E-110', type: 'form', topic: 'Past Continuous', prompt: 'La forma negativa en Pasado Continuo de "The variables (correlate)" es:', correctAnswer: 'Were not correlating', options: ['Was not correlating', 'Did not correlate', 'Were not correlating', 'Not were correlating'] },
        { id: 'E-111', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: the / anomaly / not / The / system / was / flagging / consistently', correctAnswer: 'The system was not consistently flagging the anomaly', options: ['Flagging the anomaly consistently was not the system', 'The system not was consistently flagging the anomaly', 'The system was not consistently flagging the anomaly', 'Consistently flagging the anomaly was not the system'] },
        { id: 'E-112', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: the / data / Were / the / researchers / deliberately / misrepresenting / ?', correctAnswer: 'Were the researchers deliberately misrepresenting the data?', options: ['The researchers were deliberately misrepresenting the data?', 'Deliberately misrepresenting the data were the researchers?', 'Were the researchers deliberately misrepresenting the data?', 'The data were the researchers deliberately misrepresenting?'] },
        { id: 'E-113', type: 'mcq', topic: 'Past Continuous', prompt: 'The controversial measure ___ perpetually dividing the political landscape.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-114', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The document (be) covertly disseminated" (Voz pasiva) es:', correctAnswer: 'Was being covertly disseminated', options: ['Were being covertly disseminated', 'Is being covertly disseminated', 'Was being covertly disseminated', 'Was covertly disseminated'] },
        { id: 'E-115', type: 'order', topic: 'Past Continuous', prompt: 'Ordena: the / protocol / The / firm / strictly / adhering / not / was / to', correctAnswer: 'The firm was not strictly adhering to the protocol', options: ['Adhering to the protocol The firm strictly not was', 'The firm not was strictly adhering to the protocol', 'The firm was not strictly adhering to the protocol', 'Strictly adhering to the protocol The firm was not'] },
        { id: 'E-116', type: 'mcq', topic: 'Past Continuous', prompt: 'I ___ constantly being inundated with requests for clarification.', correctAnswer: 'was', options: ['is', 'were', 'was', 'did'] },
        { id: 'E-117', type: 'form', topic: 'Past Continuous', prompt: 'La forma en Pasado Continuo de "The evidence (accumulate) slowly" es:', correctAnswer: 'Was accumulating', options: ['Were accumulating', 'Is accumulating', 'Was accumulating', 'Accumulates'] },

        // Bloque 3: Present Simple (28 nuevas) - E-118 a E-145
        { id: 'E-118', type: 'mcq', topic: 'Present Simple', prompt: 'The consensus among experts ___ the efficacy of the new methodology.', correctAnswer: 'undermines', options: ['undermine', 'undermines', 'undermining', 'undermined'] },
        { id: 'E-119', type: 'mcq', topic: 'Present Simple', prompt: 'A cohesive organizational structure typically ___ transparency.', correctAnswer: 'fosters', options: ['foster', 'fosters', 'fostering', 'fostered'] },
        { id: 'E-120', type: 'mcq', topic: 'Present Simple', prompt: 'The final outcome ___ exclusively on the successful execution of the strategy.', correctAnswer: 'hinges', options: ['hinge', 'hinges', 'hinging', 'hinged'] },
        { id: 'E-121', type: 'mcq', topic: 'Present Simple', prompt: 'The prevailing sentiment ___ an immediate cessation of hostilities.', correctAnswer: 'dictates', options: ['dictate', 'dictates', 'dictating', 'dictated'] },
        { id: 'E-122', type: 'mcq', topic: 'Present Simple', prompt: 'Scarcely ___ the commission publish a report without dissent.', correctAnswer: 'does', options: ['do', 'does', 'is', 'are'] },
        { id: 'E-123', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "This (supersede) all prior agreements" es:', correctAnswer: 'Supersedes', options: ['Supersede', 'Supersedes', 'Superseding', 'Superseded'] },
        { id: 'E-124', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "The data (corroborate) the hypothesis" es:', correctAnswer: 'Do not corroborate', options: ['Does not corroborate', 'Do not corroborate', 'Is not corroborate', 'Did not corroborate'] },
        { id: 'E-125', type: 'form', topic: 'Present Simple', prompt: 'La forma interrogativa de "The evidence (warrant) a conclusion" es:', correctAnswer: 'Does the evidence warrant', options: ['Do the evidence warrant', 'Does the evidence warrant', 'Is the evidence warrant', 'The evidence warrants'] },
        { id: 'E-126', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "It (behoove) the government to respond" es:', correctAnswer: 'Behooves', options: ['Behoove', 'Behooves', 'Behooving', 'Behooved'] },
        { id: 'E-127', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "I (acquiesce) to the demand" es:', correctAnswer: 'Do not acquiesce', options: ['Does not acquiesce', 'Do not acquiesce', 'Am not acquiesce', 'Did not acquiesce'] },
        { id: 'E-128', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / usually / board / the / on / meet / first / Monday / of / the / month', correctAnswer: 'The board usually meets on the first Monday of the month', options: ['Usually the board meets on the first Monday of the month', 'The board meet usually on the first Monday of the month', 'The board usually meets on the first Monday of the month', 'On the first Monday of the month the board usually meets'] },
        { id: 'E-129', type: 'order', topic: 'Present Simple', prompt: 'Ordena: How / Do / the / researchers / reconcile / the / findings / ?', correctAnswer: 'How do the researchers reconcile the findings?', options: ['The researchers reconcile the findings how do?', 'How the researchers reconcile the findings do?', 'How do the researchers reconcile the findings?', 'Reconcile the findings do the researchers how?'] },
        { id: 'E-130', type: 'mcq', topic: 'Present Simple', prompt: 'The principle of non-intervention ___ the foreign policy of the nation.', correctAnswer: 'underpins', options: ['underpin', 'underpins', 'underpinning', 'underpinned'] },
        { id: 'E-131', type: 'mcq', topic: 'Present Simple', prompt: 'The old axiom ___ true in this particular context.', correctAnswer: 'holds', options: ['hold', 'holds', 'holding', 'held'] },
        { id: 'E-132', type: 'mcq', topic: 'Present Simple', prompt: 'The political establishment rarely ___ public scrutiny without resistance.', correctAnswer: 'withstands', options: ['withstand', 'withstands', 'withstanding', 'withstood'] },
        { id: 'E-133', type: 'mcq', topic: 'Present Simple', prompt: 'The governing document clearly ___ the responsibilities of the parties.', correctAnswer: 'delineates', options: ['delineate', 'delineates', 'delineating', 'delineated'] },
        { id: 'E-134', type: 'mcq', topic: 'Present Simple', prompt: 'We invariably ___ to the most stringent ethical standards.', correctAnswer: 'adhere', options: ['adhere', 'adheres', 'adhering', 'adhered'] },
        { id: 'E-135', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The ruling (preclude) a successful appeal" es:', correctAnswer: 'Precludes', options: ['Preclude', 'Precludes', 'Precluding', 'Precluded'] },
        { id: 'E-136', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "The premise (hold) true across all scenarios" es:', correctAnswer: 'Does not hold', options: ['Do not hold', 'Does not hold', 'Is not hold', 'Did not hold'] },
        { id: 'E-137', type: 'form', topic: 'Present Simple', prompt: 'La forma interrogativa de "The measure (ameliorate) the situation" es:', correctAnswer: 'Does the measure ameliorate', options: ['Do the measure ameliorate', 'Does the measure ameliorate', 'Is the measure ameliorate', 'The measure ameliorates'] },
        { id: 'E-138', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "It (pari) passu with the change" es:', correctAnswer: 'Goes', options: ['Go', 'Goes', 'Going', 'Went'] },
        { id: 'E-139', type: 'form', topic: 'Present Simple', prompt: 'La forma negativa de "I (concede) the point entirely" es:', correctAnswer: 'Do not concede', options: ['Does not concede', 'Do not concede', 'Am not concede', 'Did not concede'] },
        { id: 'E-140', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / company / the / rarely / issues / a / public / statement', correctAnswer: 'The company rarely issues a public statement', options: ['Rarely issues a public statement the company', 'The company issues rarely a public statement', 'The company rarely issues a public statement', 'A public statement the company rarely issues'] },
        { id: 'E-141', type: 'order', topic: 'Present Simple', prompt: 'Ordena: the / process / Do / they / fully / comprehend / ?', correctAnswer: 'Do they fully comprehend the process?', options: ['Comprehend the process do they fully?', 'They fully comprehend the process do?', 'Do they fully comprehend the process?', 'The process do they fully comprehend?'] },
        { id: 'E-142', type: 'mcq', topic: 'Present Simple', prompt: 'The new legislation ___ broad implications for the sector.', correctAnswer: 'has', options: ['have', 'has', 'having', 'had'] },
        { id: 'E-143', type: 'form', topic: 'Present Simple', prompt: 'La forma correcta de "The committee (adjudge) the outcome" es:', correctAnswer: 'Adjudges', options: ['Adjudge', 'Adjudges', 'Adjudging', 'Adjudged'] },
        { id: 'E-144', type: 'order', topic: 'Present Simple', prompt: 'Ordena: Only / by / adherence / to / the / protocol / Do / we / avert / the / risk', correctAnswer: 'Only by strict adherence to the protocol do we avert the risk', options: ['Do we avert the risk only by strict adherence to the protocol', 'Only by strict adherence to the protocol we avert the risk do', 'Only by strict adherence to the protocol do we avert the risk', 'Avert the risk only by strict adherence to the protocol do we'] },
        { id: 'E-145', type: 'mcq', topic: 'Present Simple', prompt: 'The lack of transparency ___ a detrimental effect on morale.', correctAnswer: 'has', options: ['have', 'has', 'having', 'had'] },

        // Bloque 4: Present Continuous (29 nuevas) - E-146 a E-174
        { id: 'E-146', type: 'mcq', topic: 'Present Continuous', prompt: 'The political rhetoric ___ increasingly polarizing the electorate.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-147', type: 'mcq', topic: 'Present Continuous', prompt: 'The emerging markets ___ demonstrably shifting towards sustainable investment.', correctAnswer: 'are', options: ['is', 'are', 'am', 'do'] },
        { id: 'E-148', type: 'mcq', topic: 'Present Continuous', prompt: 'The ongoing deliberation ___ critically scrutinizing the initial projections.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-149', type: 'mcq', topic: 'Present Continuous', prompt: 'The system ___ incessantly generating false positives.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-150', type: 'mcq', topic: 'Present Continuous', prompt: 'I ___ currently compiling an exhaustive analysis of the data.', correctAnswer: 'am', options: ['is', 'are', 'am', 'do'] },
        { id: 'E-151', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The doctrine (undergo) a re-evaluation" es:', correctAnswer: 'Is undergoing', options: ['Are undergoing', 'Am undergoing', 'Is undergoing', 'Undergoes'] },
        { id: 'E-152', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "The variables (converge) rapidly" es:', correctAnswer: 'Are not converging', options: ['Is not converging', 'Do not converge', 'Are not converging', 'Not are converging'] },
        { id: 'E-153', type: 'form', topic: 'Present Continuous', prompt: 'La forma interrogativa en Presente Continuo de "The evidence (warrant) a conclusion" es:', correctAnswer: 'Is the evidence warranting', options: ['Are the evidence warranting', 'Does the evidence warrant', 'Is the evidence warranting', 'The evidence is warranting'] },
        { id: 'E-154', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "We (ameliorate) the situation" es:', correctAnswer: 'Are ameliorating', options: ['Is ameliorating', 'Am ameliorating', 'Are ameliorating', 'Ameliorates'] },
        { id: 'E-155', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "She (acquiesce) to the demands" es:', correctAnswer: 'Is not acquiescing', options: ['Are not acquiescing', 'Does not acquiesce', 'Is not acquiescing', 'Not is acquiescing'] },
        { id: 'E-156', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / negotiations / Is / still / the / delegation / pursuing / ?', correctAnswer: 'Is the delegation still pursuing the negotiations?', options: ['The delegation is still pursuing the negotiations?', 'Still pursuing the negotiations is the delegation?', 'Is the delegation still pursuing the negotiations?', 'Pursuing the negotiations is the delegation still?'] },
        { id: 'E-157', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / company / are / actively / diversifying / the / portfolio / They', correctAnswer: 'They are actively diversifying the company portfolio', options: ['The company portfolio They are actively diversifying', 'Are actively diversifying the company portfolio They', 'They are actively diversifying the company portfolio', 'Diversifying the company portfolio They are actively'] },
        { id: 'E-158', type: 'mcq', topic: 'Present Continuous', prompt: 'The subtle nuances of the data ___ consistently emerging.', correctAnswer: 'are', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-159', type: 'mcq', topic: 'Present Continuous', prompt: 'The incumbent administration ___ incrementally losing public support.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-160', type: 'mcq', topic: 'Present Continuous', prompt: 'The underlying assumptions ___ not holding true under empirical examination.', correctAnswer: 'are', options: ['is', 'are', 'am', 'do'] },
        { id: 'E-161', type: 'mcq', topic: 'Present Continuous', prompt: 'The experimental protocol ___ continually being refined.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-162', type: 'mcq', topic: 'Present Continuous', prompt: 'The board ___ actively soliciting input from external consultants.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-163', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The evidence (unfold) slowly" es:', correctAnswer: 'Is unfolding', options: ['Are unfolding', 'Am unfolding', 'Is unfolding', 'Unfolds'] },
        { id: 'E-164', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "I (intervene) immediately" es:', correctAnswer: 'Am not intervening', options: ['Is not intervening', 'Do not intervene', 'Am not intervening', 'Not am intervening'] },
        { id: 'E-165', type: 'form', topic: 'Present Continuous', prompt: 'La forma interrogativa en Presente Continuo de "The discrepancy (worsen)" es:', correctAnswer: 'Is the discrepancy worsening', options: ['Are the discrepancy worsening', 'Does the discrepancy worsen', 'Is the discrepancy worsening', 'The discrepancy is worsening'] },
        { id: 'E-166', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "He (articulate) a new vision" es:', correctAnswer: 'Is articulating', options: ['Are articulating', 'Am articulating', 'Is articulating', 'Articulates'] },
        { id: 'E-167', type: 'form', topic: 'Present Continuous', prompt: 'La forma negativa en Presente Continuo de "We (delineate) the parameters" es:', correctAnswer: 'Are not delineating', options: ['Is not delineating', 'Do not delineate', 'Are not delineating', 'Not are delineating'] },
        { id: 'E-168', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / results / the / auditor / Is / carefully / assessing / ?', correctAnswer: 'Is the auditor carefully assessing the results?', options: ['The auditor is carefully assessing the results?', 'Carefully assessing the results is the auditor?', 'Is the auditor carefully assessing the results?', 'Assessing the results is the auditor carefully?'] },
        { id: 'E-169', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / situation / The / not / committee / is / ameliorating / actively', correctAnswer: 'The committee is not actively ameliorating the situation', options: ['Ameliorating the situation The committee is not actively', 'The committee not is actively ameliorating the situation', 'The committee is not actively ameliorating the situation', 'Actively ameliorating the situation The committee is not'] },
        { id: 'E-170', type: 'mcq', topic: 'Present Continuous', prompt: 'The old dogma ___ slowly being eroded by empirical research.', correctAnswer: 'is', options: ['is', 'are', 'am', 'does'] },
        { id: 'E-171', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The populace (clamour) for reform" es:', correctAnswer: 'Is clamouring', options: ['Are clamouring', 'Am clamouring', 'Is clamouring', 'Clamours'] },
        { id: 'E-172', type: 'order', topic: 'Present Continuous', prompt: 'Ordena: the / guidelines / the / firm / strictly / Is / adhering / to / ?', correctAnswer: 'Is the firm strictly adhering to the guidelines?', options: ['The firm is strictly adhering to the guidelines?', 'Strictly adhering to the guidelines is the firm?', 'Is the firm strictly adhering to the guidelines?', 'Adhering to the guidelines is the firm strictly?'] },
        { id: 'E-173', type: 'mcq', topic: 'Present Continuous', prompt: 'We ___ not intentionally misrepresenting the facts.', correctAnswer: 'are', options: ['is', 'are', 'am', 'do'] },
        { id: 'E-174', type: 'form', topic: 'Present Continuous', prompt: 'La forma en Presente Continuo de "The entity (amalgamate) with its competitor" es:', correctAnswer: 'Is amalgamating', options: ['Are amalgamating', 'Am amalgamating', 'Is amalgamating', 'Amalgamates'] },

        // Bloque 5: Used to (29 nuevas) - E-175 a E-203
        { id: 'E-175', type: 'mcq', topic: 'Used to', prompt: 'The bureaucracy ___ adhere to an archaic system of governance.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-176', type: 'mcq', topic: 'Used to', prompt: 'The populace ___ readily acquiesce to governmental mandates.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-177', type: 'mcq', topic: 'Used to', prompt: 'Did the old regime ___ employ such severe deterrents?', correctAnswer: 'use to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-178', type: 'mcq', topic: 'Used to', prompt: 'The veteran diplomat is fully ___ the subtle protocols of international negotiation.', correctAnswer: 'used to', options: ['use to', 'used to', 'using to', 'uses to'] },
        { id: 'E-179', type: 'mcq', 'topic': 'Used to', prompt: 'The opposition is slowly ___ the prospect of perpetual resistance.', correctAnswer: 'getting used to', options: ['used to', 'use to', 'get used to', 'getting used to'] },
        { id: 'E-180', type: 'form', topic: 'Used to', prompt: 'La forma afirmativa con "The policy (supersede) existing regulations" es:', correctAnswer: 'The policy used to supersede existing regulations', options: ['The policy use to supersede existing regulations', 'The policy used to superseding existing regulations', 'The policy used to supersede existing regulations', 'The policy use to superseding existing regulations'] },
        { id: 'E-181', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "The committee (procrastinate) so readily" es:', correctAnswer: 'The committee did not use to procrastinate so readily', options: ['The committee used not to procrastinate so readily', 'The committee did not used to procrastinate so readily', 'The committee did not use to procrastinate so readily', 'The committee doesn\'t use to procrastinate so readily'] },
        { id: 'E-182', type: 'form', topic: 'Used to', prompt: 'La forma interrogativa con "The firm (adhere) to a rigid hierarchy" es:', correctAnswer: 'Did the firm use to adhere to a rigid hierarchy', options: ['Used the firm to adhere to a rigid hierarchy', 'Did the firm used to adhere to a rigid hierarchy', 'Did the firm use to adhere to a rigid hierarchy', 'Does the firm use to adhere to a rigid hierarchy'] },
        { id: 'E-183', type: 'form', topic: 'Used to', prompt: 'La forma de "to get used to" con "The veteran" es:', correctAnswer: 'The veteran is getting used to', options: ['The veteran used to', 'The veteran is used to', 'The veteran is getting used to', 'The veteran get used to'] },
        { id: 'E-184', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The populace" es:', correctAnswer: 'The populace is used to', options: ['The populace use to', 'The populace used to', 'The populace is used to', 'The populace were use to'] },
        { id: 'E-185', type: 'order', topic: 'Used to', prompt: 'Ordena: The / process / to / be / used / highly / cumbersome / did / not', correctAnswer: 'The process did not use to be highly cumbersome', options: ['Used to be highly cumbersome the process did not', 'The process not did use to be highly cumbersome', 'The process did not use to be highly cumbersome', 'Highly cumbersome the process did not use to be'] },
        { id: 'E-186', type: 'order', topic: 'Used to', prompt: 'Ordena: Did / the / committee / overlook / use / to / such / profound / discrepancies / ?', correctAnswer: 'Did the committee use to overlook such profound discrepancies?', options: ['Use to overlook such profound discrepancies did the committee?', 'Did the committee used to overlook such profound discrepancies?', 'Did the committee use to overlook such profound discrepancies?', 'Such profound discrepancies did the committee use to overlook?'] },
        { id: 'E-187', type: 'mcq', topic: 'Used to', prompt: 'The old financial system ___ tolerate such precarious levels of debt.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-188', type: 'mcq', topic: 'Used to', prompt: 'The old diplomatic approach ___ rely on subtle coercion.', correctAnswer: 'used to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-189', type: 'mcq', topic: 'Used to', prompt: 'The seasoned analyst is ___ discerning subtle patterns in complex data.', correctAnswer: 'used to', options: ['use to', 'used to', 'using to', 'is used to'] },
        { id: 'E-190', type: 'mcq', topic: 'Used to', prompt: 'Did the firm ___ consistently deviate from the established protocol?', correctAnswer: 'use to', options: ['use to', 'used to', 'is used to', 'was used to'] },
        { id: 'E-191', type: 'mcq', topic: 'Used to', prompt: 'The regulator ___ gradually acquiescing to industry pressure.', correctAnswer: 'is getting used to', options: ['used to', 'use to', 'is used to', 'is getting used to'] },
        { id: 'E-192', type: 'form', topic: 'Used to', prompt: 'La forma afirmativa con "The government (espouse) such a radical doctrine" es:', correctAnswer: 'The government used to espouse such a radical doctrine', options: ['The government use to espouse such a radical doctrine', 'The government used to espousing such a radical doctrine', 'The government used to espouse such a radical doctrine', 'The government use to espousing such a radical doctrine'] },
        { id: 'E-193', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "The media (scrutinize) every detail" es:', correctAnswer: 'The media did not use to scrutinize every detail', options: ['The media used not to scrutinize every detail', 'The media did not used to scrutinize every detail', 'The media did not use to scrutinize every detail', 'The media doesn\'t use to scrutinize every detail'] },
        { id: 'E-194', type: 'form', topic: 'Used to', prompt: 'La forma interrogativa con "The populace (demand) such stringent accountability" es:', correctAnswer: 'Did the populace use to demand such stringent accountability', options: ['Used the populace to demand such stringent accountability', 'Did the populace used to demand such stringent accountability', 'Did the populace use to demand such stringent accountability', 'Does the populace use to demand such stringent accountability'] },
        { id: 'E-195', type: 'form', topic: 'Used to', prompt: 'La forma de "to get used to" con "The auditor" es:', correctAnswer: 'The auditor is getting used to', options: ['The auditor used to', 'The auditor is used to', 'The auditor is getting used to', 'The auditor get used to'] },
        { id: 'E-196', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The institution" es:', correctAnswer: 'The institution is used to', options: ['The institution use to', 'The institution used to', 'The institution is used to', 'The institution were use to'] },
        { id: 'E-197', type: 'order', topic: 'Used to', prompt: 'Ordena: The / bureaucracy / not / to / operate / used / with / such / opacity / did', correctAnswer: 'The bureaucracy did not use to operate with such opacity', options: ['Used to operate with such opacity The bureaucracy did not', 'The bureaucracy not did use to operate with such opacity', 'The bureaucracy did not use to operate with such opacity', 'With such opacity The bureaucracy did not use to operate'] },
        { id: 'E-198', type: 'order', topic: 'Used to', prompt: 'Ordena: Did / the / board / a / consensus / reach / use / to / so / rapidly / ?', correctAnswer: 'Did the board use to reach a consensus so rapidly?', options: ['Use to reach a consensus so rapidly did the board?', 'Did the board used to reach a consensus so rapidly?', 'Did the board use to reach a consensus so rapidly?', 'A consensus so rapidly did the board use to reach?'] },
        { id: 'E-199', type: 'mcq', topic: 'Used to', prompt: 'I ___ perpetually question the inherent assumptions of the model.', correctAnswer: 'used to', options: ['use to', 'used to', 'am used to', 'is used to'] },
        { id: 'E-200', type: 'form', topic: 'Used to', prompt: 'La forma negativa con "The entity (amalgamate) with its competitor" es:', correctAnswer: 'The entity did not use to amalgamate with its competitor', options: ['The entity used not to amalgamate with its competitor', 'The entity did not used to amalgamate with its competitor', 'The entity did not use to amalgamate with its competitor', 'The entity doesn\'t use to amalgamate with its competitor'] },
        { id: 'E-201', type: 'order', topic: 'Used to', prompt: 'Ordena: How / the / firm / did / use / to / circumvent / the / regulations / ?', correctAnswer: 'How did the firm use to circumvent the regulations?', options: ['Did the firm use to circumvent the regulations how?', 'How the firm did use to circumvent the regulations?', 'How did the firm use to circumvent the regulations?', 'The regulations how did the firm use to circumvent?'] },
        { id: 'E-202', type: 'mcq', topic: 'Used to', prompt: 'The market ___ exhibit such erratic behavior in prior cycles.', correctAnswer: 'did not use to', options: ['used to not', 'did not use to', 'was not used to', 'is not used to'] },
        { id: 'E-203', type: 'form', topic: 'Used to', prompt: 'La forma de "to be used to" con "The veteran" es:', correctAnswer: 'The veteran is used to', options: ['The veteran use to', 'The veteran used to', 'The veteran is used to', 'The veteran were use to'] },
    ],   
        
   
    
};
// Total de preguntas: Normal (70) + Difícil (70) + Experto (60) = 200



// ===================================================================
// 3. LÓGICA DE INICIALIZACIÓN Y NAVEGACIÓN (Funciones Clave)
// ===================================================================

const appContainer = document.getElementById('app-container');
const appBody = document.getElementById('app-body');
const proButton = document.getElementById('pro-button');
const rankingWidget = document.getElementById('ranking-widget');

/**
 * Función que inyecta el ranking en la esquina superior derecha.
 */
function renderRankingWidget() {
    if (appState.gameMode !== 'group_vs_group' || appState.currentScreen !== 'quiz') {
        rankingWidget.style.display = 'none';
        return;
    }
    
    // 1. Calcular el Ranking
    const sortedGroups = [...appState.groups].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // Primero por puntaje
        }
        return b.lives - a.lives; // Segundo por vidas (más vidas es mejor)
    });

    const rankingHtml = sortedGroups.map((group, index) => {
        // Muestra corazones y una barra de progreso basada en el puntaje
        const hearts = '❤️'.repeat(group.lives);
        const maxScore = appState.gameDurationMode === 'limit_questions' ? appState.maxQuestions : (appState.shuffledQuestions.length || 10);
        const barWidth = Math.min(100, (group.score / maxScore) * 100); 
        
        return `
            <div class="ranking-item">
                <span class="ranking-name">#${index + 1}. ${group.name} 
                    <span style="font-size: 0.7em; color: ${appState.currentGroupIndex === group.id ? 'var(--color-secondary)' : '#666'};">
                        (${appState.currentGroupIndex === group.id ? 'ACTIVO' : 'Espera'})
                    </span>
                </span>
                <span class="ranking-hearts">${hearts}</span>
            </div>
            <div class="group-progress-bar">
                <div id="progress-${group.id}" class="progress-fill ${group.lives <= 0 ? 'fail' : ''}" style="width: ${barWidth}%;"></div>
            </div>
            <p style="font-size: 0.8em; margin-bottom: 8px;">Puntos: ${group.score}</p>
        `;
    }).join('');

    rankingWidget.innerHTML = `
        <h4 style="margin-top: 0; font-size: 1em; color: var(--color-primary);">🏆 Ranking Actual</h4>
        ${rankingHtml}
    `;
    rankingWidget.style.display = 'block';
}

/**
 * Renderiza la pantalla para configurar los grupos.
 */
function renderGroupConfiguration() {
    appState.currentScreen = 'group_config';
    appContainer.innerHTML = `
        <h2>👥 Configuración de Grupos</h2>
        <p>Define el número de grupos y sus nombres para el modo **Guerra de Conocimiento**.</p>
        
        <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
            <h4>1. Número de Grupos:</h4>
            <input type="number" id="num-groups" value="2" min="2" max="6" style="padding: 10px; width: 100px; margin-bottom: 15px;" onchange="updateGroupNameInputs()">
            <div id="group-name-inputs">
                </div>
            
            <h4>2. Modo de Duración:</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0; text-align: left;">
                <label>
                    <input type="radio" name="duration-mode" value="limit_lives" checked onclick="toggleMaxQuestionsInput(false)"> 
                    **⚔️ Batalla de Vidas** (Hasta que se agoten las vidas del nivel)
                </label>
                <label>
                    <input type="radio" name="duration-mode" value="limit_questions" onclick="toggleMaxQuestionsInput(true)"> 
                    **🏁 Carrera de Preguntas** (Jugar un número fijo de preguntas)
                </label>
            </div>
            <input type="number" id="max-questions-input" value="10" min="5" max="200" style="padding: 10px; width: 150px; margin-top: 10px; display: none;">

            <button class="btn btn-primary" style="margin-top: 20px;" onclick="initializeGroups()">
                Iniciar Guerra de Conocimiento
            </button>
        </div>
        <button class="btn btn-nav" onclick="renderModeSelector()">Volver al Modo de Juego</button>
    `;
    updateGroupNameInputs(); // Renderizar inputs iniciales
}

/**
 * Rellena los campos para nombrar los grupos.
 */
function updateGroupNameInputs() {
    const numGroups = parseInt(document.getElementById('num-groups').value) || 2;
    const container = document.getElementById('group-name-inputs');
    container.innerHTML = '<h4>Nombres de los Grupos:</h4>';
    for (let i = 0; i < numGroups; i++) {
        container.innerHTML += `
            <input type="text" id="group-name-${i}" value="Equipo ${i + 1}" placeholder="Nombre del Grupo ${i + 1}" style="padding: 8px; margin: 5px; width: 80%;">
        `;
    }
}

/**
 * Muestra/oculta el input para el número máximo de preguntas.
 */
function toggleMaxQuestionsInput(show) {
    document.getElementById('max-questions-input').style.display = show ? 'block' : 'none';
    appState.gameDurationMode = show ? 'limit_questions' : 'limit_lives';
}

/**
 * Inicializa los grupos y comienza la selección de nivel.
 */
function initializeGroups() {
    const numGroups = parseInt(document.getElementById('num-groups').value);
    const durationMode = document.querySelector('input[name="duration-mode"]:checked').value;
    const maxQuestions = parseInt(document.getElementById('max-questions-input').value) || 10;
    
    appState.groups = [];
    for (let i = 0; i < numGroups; i++) {
        const name = document.getElementById(`group-name-${i}`).value.trim() || `Equipo ${i + 1}`;
        // Asignamos un ID al grupo para el ranking
        appState.groups.push({
            id: i, 
            name: name,
            score: 0,
            lives: 0, // Las vidas se asignan al iniciar el nivel
            questions: []
        });
    }

    appState.gameDurationMode = durationMode;
    appState.maxQuestions = maxQuestions;
    appState.currentGroupIndex = 0;
    
    renderLevelSelector();
}

/**
 * Renderiza la pantalla de Selección de Modo de Juego (Modificado).
 */
function renderModeSelector() {
    appState.currentScreen = 'mode_selector';
    appBody.className = 'theme-normal';
    // updateProButtonVisibility(); // Asumimos que esta función existe
    rankingWidget.style.display = 'none';

    const individualModeName = appState.gameDurationMode === 'limit_lives' ? 'Unbreakable Mind 🧠' : 'Quick Challenge ⏱️';
    const groupModeName = appState.gameDurationMode === 'limit_lives' ? 'Battle of Lives ⚔️' : 'Question Race 🏁';

    appContainer.innerHTML = `
        <h2>🎮 Selection the game mode</h2>
        <p>¿Who play it and How will the points be measured?</p>

        <div class="level-selector-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            <div class="level-card normal-card">
                <h3>👤 Individual - ${individualModeName}</h3>
                <p>The player accumulates their own scores. The duration is defined by lives or questions.</p>
                <button class="btn btn-primary" onclick="renderIndividualDurationSelector()">Select individual</button>
            </div>
            <div class="level-card difficult-card">
                <h3>⚔️ Group vs. Group - ${groupModeName}</h3>
                <p>Competitive team mode. Teams take turns and compete for the highest score.</p>
                <button class="btn btn-primary" onclick="selectGameMode('group_vs_group')">Select groups</button>
            </div>
        </div>
        <button class="btn btn-nav" style="margin-top: 30px;" onclick="renderWelcomeScreen()">Volver</button>
    `;
}

/**
 * Renderiza la selección del modo de duración para el juego Individual.
 */
function renderIndividualDurationSelector() {
    appState.currentScreen = 'individual_duration_selector';
    appContainer.innerHTML = `
        <h2>👤 Individual Mode</h2>
        <p>"Select the duration of your training session:</p>
        
        <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
            <h4>Modo de Duración:</h4>
            <div style="display: flex; flex-direction: column; gap: 15px; margin: 15px 0; text-align: left;">
                <label>
                    <input type="radio" name="duration-mode-individual" value="limit_lives" ${appState.gameDurationMode === 'limit_lives' ? 'checked' : ''} onclick="toggleMaxQuestionsInputIndividual(false)"> 
                    **🧠 Unbreakable Mind** (Until the level's lives are depleted)
                </label>
                <label>
                    <input type="radio" name="duration-mode-individual" value="limit_questions" ${appState.gameDurationMode === 'limit_questions' ? 'checked' : ''} onclick="toggleMaxQuestionsInputIndividual(true)"> 
                    **⏱️ Quick Challenge** (Play a fixed number of questions)
                </label>
            </div>
            <input type="number" id="max-questions-input-individual" value="${appState.maxQuestions}" min="5" max="200" style="padding: 10px; width: 150px; margin-top: 10px; display: ${appState.gameDurationMode === 'limit_questions' ? 'block' : 'none'};">

            <button class="btn btn-primary" style="margin-top: 20px;" onclick="selectIndividualDuration()">
                Continue to Level Selection
            </button>
        </div>
        <button class="btn btn-nav" onclick="renderModeSelector()">Back to Mode Selection</button>
    `;
    // Toggle function específica para el selector individual
    window.toggleMaxQuestionsInputIndividual = (show) => {
        document.getElementById('max-questions-input-individual').style.display = show ? 'block' : 'none';
    };
}

/**
 * Guarda la duración seleccionada para el modo Individual y avanza.
 */
function selectIndividualDuration() {
    appState.gameMode = 'individual';
    appState.gameDurationMode = document.querySelector('input[name="duration-mode-individual"]:checked').value;
    appState.maxQuestions = parseInt(document.getElementById('max-questions-input-individual').value) || 10;
    renderLevelSelector();
}

/**
 * Selecciona el modo de juego y avanza (Modificado para Grupos).
 */
function selectGameMode(mode) {
    appState.gameMode = mode;
    if (mode === 'group_vs_group') {
        renderGroupConfiguration();
    } else {
        renderIndividualDurationSelector(); 
    }
}

/**
 * Obtiene el nombre ingenioso del modo de duración y juego.
 */
function getFullModeName() {
    const durationName = appState.gameDurationMode === 'limit_lives' ? 'Battle of lives' : 'Quick Challenge';
    const groupSuffix = appState.gameMode === 'group_vs_group' ? ` (${appState.groups.length} Groups)` : '';
    const questionSuffix = appState.gameDurationMode === 'limit_questions' ? ` (${appState.maxQuestions} Questions)` : '';
    const modePrefix = appState.gameMode === 'group_vs_group' ? 'Knowledge War ⚔️' : 'Unbreakable Mind 🧠';

    return `${modePrefix} - ${durationName}${questionSuffix}${groupSuffix}`;
}


/**
 * Renderiza la pantalla de Selección de Niveles (Modificado).
 */
function renderLevelSelector() {
    appState.currentScreen = 'level_selector';
    const lastLevel = appState.currentLevel || 'normal';
    appBody.className = `theme-${lastLevel}`;
    // updateProButtonVisibility(); // Asumimos que esta función existe
    rankingWidget.style.display = 'none';
    
    const modeText = getFullModeName();

    appContainer.innerHTML = `
        <h2>🎯 Select a Difficulty Level</h2>
        <p style="font-weight: 700;">Actual Mode: ${modeText}</p>
        <p>The game will end when the lives run out or when the question limit is reached.</p>
        <div class="level-selector-grid">
            <div class="level-card normal-card">
                <h3>NORMAL (Beginner)</h3>
                <p><strong>Temas:</strong> Basic Tenses, Vocabulary.</p>
                <p><strong>Vidas:</strong> ${appState.maxLives.normal} ❤️. **Total Questions:** ${questionsBank.normal.length}.</p>
                <button class="btn btn-primary" onclick="startLevel('normal')">Start NORMAL level</button>
            </div>
            <div class="level-card difficult-card">
                <h3>HARD (Upper-Intermediate)</h3>
                <p><strong>Temas:</strong> Perfect Tenses, Modals, Conditionals.</p>
                <p><strong>Vidas:</strong> ${appState.maxLives.difficult} ❤️. **Total Questions:** ${questionsBank.difficult.length}.</p>
                <button class="btn btn-primary" onclick="startLevel('difficult')">Start HARD level</button>
            </div>
            <div class="level-card expert-card">
                <h3>EXPERT (Professional Advanced)</h3>
                <p><strong>Temas:</strong> Inversions, Subjunctive, Reduced Clauses.</p>
                <p><strong>Vidas:</strong> ${appState.maxLives.expert} ❤️. **Total Questions:** ${questionsBank.expert.length}.</p>
                <button class="btn btn-primary" onclick="startLevel('expert')">Start EXPERT level</button>
            </div>
        </div>
        <button class="btn btn-nav" style="margin-top: 30px;" onclick="renderModeSelector()">Change game mode</button>
    `;
}

/**
 * Inicia el nivel seleccionado (Modificado para inicializar vidas y grupos).
 */
function startLevel(levelName) {
    appState.currentLevel = levelName;
    appState.currentQuestionIndex = -1;
    appState.shuffledQuestions = shuffleArray([...questionsBank[appState.currentLevel]]);
    appState.currentScreen = 'quiz';
    // updateProButtonVisibility(); // Asumimos que esta función existe
    appState.currentGroupIndex = 0;

    if (appState.gameMode === 'individual') {
        // Inicializa stats individuales con las vidas del nivel
        appState.stats[levelName].lives = appState.maxLives[levelName];
        appState.stats[levelName].totalAnswered = 0;
    } else {
        // Inicializa stats de grupos
        appState.groups.forEach(group => {
            group.lives = appState.maxLives[levelName]; // Asigna vidas por nivel
            group.score = 0;
            group.questions = [];
        });
        renderRankingWidget(); // Muestra el ranking al iniciar el quiz de grupos
    }

    // Resetear el contador de preguntas respondidas del nivel para que empiece en 1/X
    appState.stats[levelName].totalAnswered = 0;

    loadNextQuestion();
}

/**
 * Carga la siguiente pregunta o finaliza la sección (Modificado para soportar grupos y modos de duración).
 */
function loadNextQuestion() {
    stopTimer();
    
    const levelStats = appState.stats[appState.currentLevel];
    let currentStats;
    let maxLives = appState.maxLives[appState.currentLevel];
    let currentLives;
    let totalAnswered = levelStats.totalAnswered;

    if (appState.gameMode === 'group_vs_group') {
        // Comprobar si el juego de grupos terminó
        const activeGroups = appState.groups.filter(g => g.lives > 0);
        if (activeGroups.length <= 1 && appState.gameDurationMode === 'limit_lives') {
             // Si queda 1 o 0 grupos con vida y es Batalla de Vidas, se acaba.
             if (activeGroups.length === 0) alert(' All teams have been eliminated! End of the battle!.');
             return renderGroupResults(); 
        }

        currentStats = appState.groups[appState.currentGroupIndex];
        currentLives = currentStats.lives;
        
        // Si el grupo actual no tiene vidas, buscar el siguiente
        if (currentLives <= 0) {
            if (!moveToNextGroup()) {
                 return renderGroupResults(); // Si no hay más grupos con vida
            }
            // El grupo activo cambió, se recarga la pregunta para el nuevo grupo
            currentStats = appState.groups[appState.currentGroupIndex];
        }
        
    } else { // Modo Individual
        currentStats = levelStats;
        currentLives = levelStats.lives;
        // Modo Individual: Comprobar finalización por Vidas
        if (currentLives <= 0) {
            alert(`You have lost all your lives in this level! ${appState.currentLevel.toUpperCase()}! Game over.`);
            return renderSectionResults();
        }
    }
    
    // Comprobar finalización por Preguntas
    if (appState.gameDurationMode === 'limit_questions' && totalAnswered >= appState.maxQuestions) {
        return appState.gameMode === 'individual' ? renderSectionResults() : renderGroupResults();
    }

    // Obtener la siguiente pregunta del pool barajado
    appState.currentQuestionIndex++;
    if (appState.currentQuestionIndex >= appState.shuffledQuestions.length) {
        // Si se acaba el banco de preguntas y no se limitó por `maxQuestions`
        alert('¡All questions from the question bank have been answered! Game over.');
        return appState.gameMode === 'individual' ? renderSectionResults() : renderGroupResults();
    }
    appState.currentQuestion = appState.shuffledQuestions[appState.currentQuestionIndex];
    
    // Determinar el prompt y opciones de la pregunta
    let promptText = appState.currentQuestion.prompt;
    let shuffledOptions = shuffleArray([...appState.currentQuestion.options]);
    
    // Si la pregunta es de ordenar, la prompt es un array desordenado
    if (appState.currentQuestion.type === 'order') {
        promptText = `ORDER THE WORDS: ${shuffleArray(appState.currentQuestion.correctAnswer.split(' ')).join(' / ')}`;
    }
    
    // 9. Pantalla de Ejercicio Activo
    appBody.className = `theme-${appState.currentLevel}`;
    
    // El texto del header y vidas cambia según el modo de juego
    const livesDisplay = `<div id="error-counter" class="${getErrorColor(currentStats.lives, maxLives)}">Lives: ${currentStats.lives} ❤️ of ${maxLives}</div>`;
    const turnDisplay = appState.gameMode === 'group_vs_group' ? `<div class="quiz-info">Turn: ${currentStats.name}</div>` : '';
    const questionCounter = appState.gameDurationMode === 'limit_questions' ? 
        `<div class="quiz-info">Question: ${totalAnswered + 1} of ${appState.maxQuestions}</div>` :
        `<div class="quiz-info">Question: ${totalAnswered + 1}</div>`;

    // **AÑADIDO**: Muestra el nombre del modo de juego completo.
    const modeNameDisplay = `<div class="quiz-info" style="font-size: 0.9em; background-color: #e0e0e0; color: #333;">${getFullModeName()}</div>`;


    appContainer.innerHTML = `
        <div class="quiz-header">
            <div class="quiz-info">Nivel: ${appState.currentLevel.toUpperCase()}</div>
            ${modeNameDisplay}
            ${turnDisplay}
            ${questionCounter}
            ${livesDisplay}
            <div id="timer-display">15s</div>
        </div>

        <p class="quiz-prompt"><strong>${promptText}</strong></p>

        <div class="options-container" id="options-container">
            ${shuffledOptions.map((option) => `
                <button class="btn option-btn" data-answer="${option}" onclick="submitAnswer('${option}')">
                    ${option}
                </button>
            `).join('')}
        </div>

        <div id="feedback-area"></div>

        <div style="margin-top: 30px;">
            <button class="btn btn-nav" onclick="confirmExitLevel()">Back the Menu</button>
            <button class="btn btn-primary" id="next-btn" style="display: none;">${appState.gameMode === 'group_vs_group' ? 'Siguiente Turno' : 'Continue'}</button>
        </div>
    `;

    document.getElementById('next-btn').onclick = () => {
        if (appState.gameMode === 'group_vs_group') {
            moveToNextGroup();
        }
        loadNextQuestion();
    };
    renderRankingWidget(); // Actualiza el ranking con el grupo activo
    startTimer();
}

/**
 * Pasa el turno al siguiente grupo con vidas restantes.
 * Retorna true si hay un grupo siguiente, false si el juego terminó.
 */
function moveToNextGroup() {
    const totalGroups = appState.groups.length;
    let nextIndex = appState.currentGroupIndex;
    const initialIndex = appState.currentGroupIndex;
    
    // Mover al siguiente índice (circularmente)
    nextIndex = (nextIndex + 1) % totalGroups;

    // Buscar el primer grupo con vidas restantes (si es Batalla de Vidas)
    do {
        if (appState.groups[nextIndex].lives > 0 || appState.gameDurationMode === 'limit_questions') {
            appState.currentGroupIndex = nextIndex;
            return true; // Se encontró un grupo válido
        }
        nextIndex = (nextIndex + 1) % totalGroups;
    } while (nextIndex !== initialIndex);

    // Si se dio la vuelta completa y no se encontró un grupo válido
    return false;
}


// ===================================================================
// 4. SISTEMA DE TEMPORIZADOR Y FEEDBACK (Ajuste de Vidas)
// ===================================================================

/**
 * Lógica para determinar el color del contador de vidas.
 */
function getErrorColor(currentLives, maxLives) {
    if (currentLives === 0) return 'error-high';
    const ratio = currentLives / maxLives;
    if (ratio > 0.6) return 'error-low';
    if (ratio > 0.3) return 'error-medium';
    return 'error-high';
}

/**
 * Procesa la respuesta del usuario (Modificado para grupos y vidas).
 */
function submitAnswer(userSelection) {
    if (appState.currentScreen !== 'quiz') return; 

    stopTimer(); 

    let currentStats;
    let isGroupMode = appState.gameMode === 'group_vs_group';
    let levelStats = appState.stats[appState.currentLevel];

    if (isGroupMode) {
        currentStats = appState.groups[appState.currentGroupIndex];
    } else {
        currentStats = levelStats;
    }
    
    // Aumentar contador de preguntas respondidas (Global para el nivel)
    levelStats.totalAnswered++; 
    
    const correctAnswer = appState.currentQuestion.correctAnswer;
    const isCorrect = userSelection === correctAnswer;
    const feedbackArea = document.getElementById('feedback-area');
    
    // Deshabilitar botones
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
        currentStats.correct = (currentStats.correct || 0) + 1;
        currentStats.score = (currentStats.score || 0) + 1;
        feedbackArea.innerHTML = `<div class="feedback-message feedback-correct">¡Correct! ${isGroupMode ? `Point for ${currentStats.name}` : ''}.</div>`;
        document.querySelector(`[data-answer="${userSelection}"]`)?.classList.add('correct');
        // Efecto visual: Barra verde si es modo grupo
        if(isGroupMode) document.getElementById(`progress-${currentStats.id}`).classList.remove('fail');
        
    } else {
        currentStats.incorrect = (currentStats.incorrect || 0) + 1;
        currentStats.lives = Math.max(0, currentStats.lives - 1); // Descuenta 1 vida
        
        feedbackArea.innerHTML = `<div class="feedback-message feedback-incorrect">Incorrect. The answer correct was: <strong>${correctAnswer}</strong>. (Lost 1 life)</div>`;
        
        // Marcar la incorrecta y la correcta
        document.querySelector(`[data-answer="${userSelection}"]`)?.classList.add('selected-incorrect');
        document.querySelector(`[data-answer="${correctAnswer}"]`)?.classList.add('correct');
        
        // Efecto visual: Vibración y barra roja si es modo grupo
        if(isGroupMode) {
            rankingWidget.classList.add('shake-error');
            document.getElementById(`progress-${currentStats.id}`).classList.add('fail');
            setTimeout(() => rankingWidget.classList.remove('shake-error'), 500);
        }
    }
    
    // Registrar en el historial (al historial del grupo o individual)
    currentStats.questions.push({
        ...appState.currentQuestion,
        userAnswer: userSelection,
        isCorrect: isCorrect,
    });
    
    // Actualizar pantalla y ranking
    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'block';

    if (isGroupMode) {
        nextBtn.textContent = 'Next turn';
        renderRankingWidget();
    } else {
        const maxLives = appState.maxLives[appState.currentLevel];
        document.getElementById('error-counter').textContent = `Lives: ${currentStats.lives} ❤️ of ${maxLives}`;
        document.getElementById('error-counter').className = getErrorColor(currentStats.lives, maxLives);
    }
    
    // Comprobar condición de fin de juego (para evitar que se siga respondiendo)
    const totalAnswered = levelStats.totalAnswered;
    const maxQuestionsReached = appState.gameDurationMode === 'limit_questions' && totalAnswered >= appState.maxQuestions;
    const livesOver = isGroupMode ? (appState.groups.filter(g => g.lives > 0).length <= 1) : (currentStats.lives <= 0);

    if (maxQuestionsReached || livesOver) {
        nextBtn.textContent = 'View Final Results';
        // Si el juego es de grupos y aún hay turnos para dar, no finalizar inmediatamente
        if (isGroupMode && !maxQuestionsReached) {
             const remainingGroups = appState.groups.filter(g => g.lives > 0);
             if(remainingGroups.length > 1) nextBtn.textContent = 'Next turn';
        }
    }

    // Si es modo de preguntas limitadas y ya se respondieron todas, forzar finalización
    if (appState.gameDurationMode === 'limit_questions' && totalAnswered >= appState.maxQuestions) {
        nextBtn.textContent = 'View Final Results';
    }
}


// ... (startTimer, stopTimer, handleTimeout, confirmExitLevel, shuffleArray) se mantienen sin cambios

function handleTimeout() {
    appState.userAnswer = 'No answer (time expired)';
    submitAnswer(appState.userAnswer); // Usamos submitAnswer para centralizar la lógica de puntuación y vidas
}

function startTimer() {
    appState.timer = 15;
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;

    timerDisplay.textContent = `${appState.timer}s`;
    timerDisplay.className = '';

    appState.timerInterval = setInterval(() => {
        appState.timer--;
        timerDisplay.textContent = `${appState.timer}s`;

        if (appState.timer <= 5) {
            timerDisplay.classList.add('alert');
        }
        if (appState.timer <= 2) {
            timerDisplay.classList.remove('alert');
            timerDisplay.classList.add('critical');
        }
        if (appState.timer <= 0) {
            clearInterval(appState.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
}

function confirmExitLevel() {
    if (confirm('Are you sure you want to exit? Your progress for this session will be lost.')) {
        renderLevelSelector();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// ===================================================================
// 5. PANTALLA DE RESULTADOS GRUPALES E INDIVIDUALES (Modificado)
// ===================================================================

function renderSectionResults() {
    // Resultados Individuales 
    appState.currentScreen = 'section_results';
    stopTimer();
    const level = appState.currentLevel;
    const stats = appState.stats[level];
    
    // ... (Lógica de resultados individuales aquí) ...
    
    // updateProButtonVisibility(); // Asumimos que esta función existe
    rankingWidget.style.display = 'none';

    appContainer.innerHTML = `
        <h2>✨ Individual Results - ${level.toUpperCase()}</h2>
        <h3>Modo: ${getFullModeName()}</h3>
        <div class="results-summary">
            <div>Questions Answered: <strong>${stats.questions.length}</strong></div>
            <div>Correct: <strong style="color: #4CAF50;">${stats.correct}</strong></div>
            <div>Incorrect: <strong style="color: #F44336;">${stats.incorrect}</strong></div>
            <div>Remaining Lives: <strong style="color: ${stats.lives > 0 ? '#4CAF50' : '#F44336'};">${stats.lives} ❤️</strong></div>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-primary" onclick="renderLevelSelector()">Continue</button>
        </div>
    `;
}

/**
 * Renderiza la pantalla de resultados del modo Grupal (Ranking final y ganador).
 */
function renderGroupResults() {
    appState.currentScreen = 'group_results';
    stopTimer();
    rankingWidget.style.display = 'none';
    // updateProButtonVisibility(); // Asumimos que esta función existe

    // 1. Obtener Ranking Final
    const sortedGroups = [...appState.groups].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // Primero por puntaje (mayor es mejor)
        }
        return b.lives - a.lives; // Segundo por vidas restantes (mayor es mejor)
    });
    
    // 2. Determinar Ganador
    const winner = sortedGroups[0];
    const isTie = sortedGroups.length > 1 && sortedGroups[0].score === sortedGroups[1].score && sortedGroups[0].lives === sortedGroups[1].lives;

    const winnerMessage = isTie ? 
        `TIE! Several teams have ${winner.score} points and ${winner.lives} lives. Shared victory! 🤝` : 
        `The winner is **${winner.name}**! with ${winner.score} points and ${winner.lives} vidas restantes. 🏆🎉`;

    const rankingHtml = sortedGroups.map((group, index) => {
        const status = group.lives <= 0 && appState.gameDurationMode === 'limit_lives' ? '(ELIMINATED)' : (index === 0 && !isTie ? '🥇 WINNER' : '');
        const color = group.lives <= 0 && appState.gameDurationMode === 'limit_lives' ? '#757575' : (index === 0 && !isTie ? '#FFC107' : 'var(--color-text-dark)');

        return `
            <div style="padding: 10px; border: 1px solid #ddd; margin-bottom: 5px; border-radius: 5px; background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">
                <h4 style="color: ${color}; margin: 0;">#${index + 1}. ${group.name} <span style="font-size: 0.8em; color: ${color};">${status}</span></h4>
                <p style="font-size: 0.9em; margin: 0;">Puntos: **${group.score}** | Vidas: **${group.lives} ❤️**</p>
            </div>
        `;
    }).join('');

    appContainer.innerHTML = `
        <h2>👑 Final results - ${getFullModeName()}</h2>
        <p style="font-size: 1.2em; font-weight: 700; margin: 20px 0;">${winnerMessage}</p>
        
        <div style="max-width: 500px; margin: 30px auto;">
            <h3>Final Leaderboard</h3>
            ${rankingHtml}
        </div>

        <div style="margin-top: 40px;">
            <button class="btn btn-primary" onclick="renderModeSelector()">Back to Mode Selection</button>
            <button class="btn btn-nav" onclick="confirmRestart()">Restart App</button>
        </div>
    `;
}

// ===================================================================
// 6. FUNCIONES DE UTILIDAD Y PRO (Se mantienen o se ajustan)
// ===================================================================

function renderWelcomeScreen() {
    appState.currentScreen = 'welcome';
    appBody.className = 'theme-normal';
    // updateProButtonVisibility(); // Asumimos que esta función existe
    rankingWidget.style.display = 'none';

    appContainer.innerHTML = `
        <h1>Welcome to the English Challenge!</h1>
        <h2>Test your knowledge of grammar and vocabulary.</h2>
        <p>Choose a game mode and a difficulty level to start learning.</p>
        <div style="margin-top: 40px;">
            <button class="btn btn-primary" onclick="renderModeSelector()">START GAME</button>
        </div>
    `;
}

function confirmRestart() {
    if (confirm('Are you sure you want to reset the entire application?')) {
        // Reiniciar estado global
        appState.currentScreen = 'welcome';
        appState.gameMode = 'individual';
        appState.currentLevel = null;
        appState.groups = [];
        // Reiniciar contadores y vidas
        for (const level in appState.stats) {
            appState.stats[level] = { correct: 0, incorrect: 0, lives: appState.maxLives[level], totalAnswered: 0, questions: [] };
        }
        renderWelcomeScreen();
    }
}


// --- Funciones PRO (Se mantienen con el GIF de rana) ---

const proModal = document.getElementById('pro-modal');
const gifModal = document.getElementById('gif-modal');
const gifContainer = document.getElementById('gif-container');

function showProModal() {
    proModal.style.display = 'flex';
    proModal.querySelector('.modal-content').innerHTML = `
        <div>
            <h2>💎 Unlock PRO</h2>
            <p>Access advanced features and exclusive questions.</p>
            <div class="pro-plans">
                <button class="btn plan-btn" onclick="subscribe('Mensual')">
                Plan Mensual <br> <strong>$5 USD/mes</strong>
                </button>
                <button class="btn plan-btn annual-btn" onclick="subscribe('Anual')">
                    <span class="save-tag">¡Ahorra!</span>
                    Plan Anual <br> <strong>$50 USD/año</strong>
                </button>
            </div>

            <div style="margin-top: 20px;">
                <h4>Select your Payment Method:</h4>
                <select id="payment-method" style="padding: 10px; border-radius: 5px; width: 80%;">
                    <option value="Visa">💳 Tarjeta de Crédito (Visa/Mastercard)</option>
                    <option value="PayPal">🅿️ PayPal</option>
                    <option value="Crypto">₿ Criptomoneda (BTC/ETH)</option>
                </select>
            </div>

            <button class="btn btn-nav" onclick="closeModals()">Back</button>
        </div>
    `;
}

function subscribe(planName) {
    proModal.style.display = 'none';
    gifModal.style.display = 'flex';

    // 1. Mensaje de Error de Transacción con el GIF de rana corregido
    gifContainer.innerHTML = `
        <div style= "background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); text-align: center; max-width: 450px; max-height: auto; width: 90%; margin-top: 2px;">

            <img src="img/rana-que-salta-meme-meme-rana.gif" alt="Animación de proceso" style="width: 60%; height: auto; border-radius: 8px;"> 
        
            <p style="text-align: center; margin-top: 15px; font-weight: 700; color: #F44336;">
            ❌ TRANSACTION ERROR ❌
            </p>
            <p style="text-align: center; margin-bottom: 10px; font-size: 0.9em; color: #555;">
                The payment for the **Plan ${planName}** Plan has been declined.
                Please try another payment method or verify your information.
            </p>

            <button class="btn btn-nav" style="margin-top: 7px;" onclick="closeModals()">Cerrar</button>

        </div>
    `;

    setTimeout(() => {
        // Animación de escala (si es necesario)
        gifContainer.style.transform = 'scale(1.05)';
        setTimeout(() => gifContainer.style.transform = 'scale(1)', 150);
    }, 10);
}

function closeModals() {
    proModal.style.display = 'none';
    gifModal.style.display = 'none';
}

function updateProButtonVisibility() {
    // Lógica para ocultar PRO en pantallas clave (ej. resultados o config)
    // if (appState.currentScreen === 'quiz') {
    //     proButton.style.display = 'none';
    // } else {
    //     proButton.style.display = 'block';
    // }
}


// Inicia la aplicación al cargar la página.
document.addEventListener('DOMContentLoaded', renderWelcomeScreen);