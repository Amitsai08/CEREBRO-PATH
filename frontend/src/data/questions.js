/**
 * CEREBRO PATH — Comprehensive Aptitude Assessment Bank
 * 
 * For 10th Grade: Tests across ALL streams (Science, Arts, Commerce) to find best fit
 * For 12th Grade: Deep-dives into the student's chosen stream for specialization
 * 
 * Each stream has 10 curated, interactive questions covering real-world scenarios,
 * critical thinking, and domain-specific knowledge.
 */

export const aptitudeQuestions = {
    // ─────────────────────────────────────────────
    // LOGICAL REASONING (Universal — All Students)
    // ─────────────────────────────────────────────
    logical: [
        { id: 'l1', type: 'pattern', question: '🧩 Find the missing number: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '36'], answer: '42', difficulty: 'medium' },
        { id: 'l2', type: 'logic', question: '🔍 A doctor tells his patient: "I am not your brother, but your brother is my father." Who is the doctor?', options: ['Uncle', 'Cousin', 'Sister', 'Son'], answer: 'Sister', difficulty: 'hard' },
        { id: 'l3', type: 'math', question: '📊 A shopkeeper marks up goods 40% above cost, then offers 20% discount. What is the actual profit %?', options: ['20%', '12%', '15%', '8%'], answer: '12%', difficulty: 'hard' },
        { id: 'l4', type: 'pattern', question: '🔢 What comes next: J, F, M, A, M, J, J, ?', options: ['K', 'A', 'S', 'O'], answer: 'A', difficulty: 'easy' },
        { id: 'l5', type: 'logic', question: '🧠 If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', options: ['100 min', '5 min', '20 min', '1 min'], answer: '5 min', difficulty: 'hard' },
        { id: 'l6', type: 'spatial', question: '🎲 A cube has 6 faces. If I paint all faces red and cut it into 27 equal cubes, how many small cubes have exactly 2 painted faces?', options: ['8', '12', '6', '4'], answer: '12', difficulty: 'hard' },
        { id: 'l7', type: 'pattern', question: '🔄 Mirror image: If DELHI is coded as CEKGH, then MUMBAI is coded as?', options: ['LTLAAH', 'NVNCBJ', 'LTLAZH', 'NVNCBI'], answer: 'LTLAAH', difficulty: 'medium' },
        { id: 'l8', type: 'logic', question: '⚖️ You have 8 identical-looking balls. One is heavier. Using a balance scale, what is the minimum weighings needed to find it?', options: ['3', '2', '4', '1'], answer: '2', difficulty: 'hard' },
        { id: 'l9', type: 'data', question: '📈 A class has 40 students. 20 play cricket, 25 play football, 10 play both. How many play neither?', options: ['5', '10', '15', '0'], answer: '5', difficulty: 'medium' },
        { id: 'l10', type: 'logic', question: '🕐 A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], answer: '7.5°', difficulty: 'hard' }
    ],

    // ─────────────────────────────────────────────
    // SCIENCE (For 10th: Exploration | For 12th: Deep)
    // ─────────────────────────────────────────────
    science: [
        { id: 's1', question: '⚡ A circuit has 3 resistors of 6Ω each in parallel. What is the total resistance?', options: ['18Ω', '6Ω', '2Ω', '3Ω'], answer: '2Ω', difficulty: 'hard', stream: 'Engineering' },
        { id: 's2', question: '🧬 CRISPR-Cas9 is a revolutionary tool for what?', options: ['Drug delivery', 'Gene editing', 'Brain imaging', 'Vaccine storage'], answer: 'Gene editing', difficulty: 'medium', stream: 'Medical' },
        { id: 's3', question: '🌡️ At what temperature do Celsius and Fahrenheit scales read the same value?', options: ['-40°', '0°', '-273°', '100°'], answer: '-40°', difficulty: 'hard', stream: 'Science' },
        { id: 's4', question: '🔬 Which quantum number determines the shape of an orbital?', options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'], answer: 'Azimuthal (l)', difficulty: 'hard', stream: 'Science' },
        { id: 's5', question: '🚀 If you double the velocity of an object, its kinetic energy becomes:', options: ['Double', 'Triple', 'Quadruple', 'Half'], answer: 'Quadruple', difficulty: 'medium', stream: 'Engineering' },
        { id: 's6', question: '🫀 Which chamber of the heart pumps oxygenated blood to the entire body?', options: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'], answer: 'Left Ventricle', difficulty: 'medium', stream: 'Medical' },
        { id: 's7', question: '⚗️ In a titration, phenolphthalein turns pink in the presence of:', options: ['Acid', 'Base', 'Salt', 'Neutral solution'], answer: 'Base', difficulty: 'easy', stream: 'Science' },
        { id: 's8', question: '💻 In binary, what is the decimal equivalent of 11010?', options: ['22', '26', '28', '30'], answer: '26', difficulty: 'medium', stream: 'Engineering' },
        { id: 's9', question: '🧪 What happens when sodium reacts with water?', options: ['Nothing', 'Explosion + NaOH + H₂', 'It dissolves quietly', 'Forms NaCl'], answer: 'Explosion + NaOH + H₂', difficulty: 'medium', stream: 'Science' },
        { id: 's10', question: '🏥 Insulin is produced by which cells in the pancreas?', options: ['Alpha cells', 'Beta cells', 'Delta cells', 'Gamma cells'], answer: 'Beta cells', difficulty: 'hard', stream: 'Medical' }
    ],

    // ─────────────────────────────────────────────
    // COMMERCE (For 10th: Exploration | For 12th: Deep)
    // ─────────────────────────────────────────────
    commerce: [
        { id: 'c1', question: '📊 A company\'s P/E ratio is 25 and EPS is ₹40. What is its market price per share?', options: ['₹100', '₹500', '₹1000', '₹625'], answer: '₹1000', difficulty: 'hard', stream: 'Commerce' },
        { id: 'c2', question: '🏦 What is the current CRR set by RBI used for?', options: ['Control inflation', 'Fund government projects', 'Pay bank employees', 'Print new notes'], answer: 'Control inflation', difficulty: 'medium', stream: 'Commerce' },
        { id: 'c3', question: '📈 When supply decreases and demand stays constant, what happens to price?', options: ['Decreases', 'Stays same', 'Increases', 'Fluctuates randomly'], answer: 'Increases', difficulty: 'easy', stream: 'Commerce' },
        { id: 'c4', question: '💼 Under GST, what is the threshold turnover limit for registration (goods)?', options: ['₹10 Lakh', '₹20 Lakh', '₹40 Lakh', '₹50 Lakh'], answer: '₹40 Lakh', difficulty: 'hard', stream: 'Commerce' },
        { id: 'c5', question: '🏢 Depreciation is charged on which type of assets?', options: ['Current Assets', 'Fixed Assets', 'Intangible Assets', 'Liquid Assets'], answer: 'Fixed Assets', difficulty: 'medium', stream: 'Commerce' },
        { id: 'c6', question: '📉 If GDP growth is negative for 2 consecutive quarters, the economy is in:', options: ['Boom', 'Recession', 'Inflation', 'Stagnation'], answer: 'Recession', difficulty: 'medium', stream: 'Commerce' },
        { id: 'c7', question: '💰 A ₹10,000 FD at 8% compounded annually becomes ₹____ after 2 years:', options: ['₹11,600', '₹11,664', '₹11,800', '₹12,000'], answer: '₹11,664', difficulty: 'hard', stream: 'Commerce' },
        { id: 'c8', question: '⚖️ FEMA replaced which earlier act?', options: ['MRTP Act', 'FERA', 'SEBI Act', 'Companies Act'], answer: 'FERA', difficulty: 'hard', stream: 'Commerce' },
        { id: 'c9', question: '🏪 Which type of business entity provides unlimited liability?', options: ['Private Ltd', 'LLP', 'Sole Proprietorship', 'Public Ltd'], answer: 'Sole Proprietorship', difficulty: 'medium', stream: 'Commerce' },
        { id: 'c10', question: '📋 The "Double Entry" system of bookkeeping was introduced by:', options: ['Adam Smith', 'Luca Pacioli', 'Karl Marx', 'J.M. Keynes'], answer: 'Luca Pacioli', difficulty: 'hard', stream: 'Commerce' }
    ],

    // ─────────────────────────────────────────────
    // ARTS & HUMANITIES (For 10th: Exploration)
    // ─────────────────────────────────────────────
    arts: [
        { id: 'a1', question: '🎨 The Impressionist movement originated in which country?', options: ['Italy', 'Spain', 'France', 'Netherlands'], answer: 'France', difficulty: 'medium', stream: 'Arts' },
        { id: 'a2', question: '📜 The Preamble of the Indian Constitution borrows the concept of "Justice" from which country?', options: ['USA', 'Britain', 'USSR', 'France'], answer: 'USSR', difficulty: 'hard', stream: 'Arts' },
        { id: 'a3', question: '🌍 The Non-Aligned Movement was co-founded by Nehru, Tito, and:', options: ['Mandela', 'Nasser', 'Churchill', 'Mao'], answer: 'Nasser', difficulty: 'medium', stream: 'Arts' },
        { id: 'a4', question: '✍️ "The Waste Land" was written by:', options: ['W.B. Yeats', 'T.S. Eliot', 'Robert Frost', 'Sylvia Plath'], answer: 'T.S. Eliot', difficulty: 'hard', stream: 'Arts' },
        { id: 'a5', question: '🗳️ The 73rd Amendment to the Constitution relates to:', options: ['Fundamental Rights', 'Panchayati Raj', 'Emergency Powers', 'Directive Principles'], answer: 'Panchayati Raj', difficulty: 'medium', stream: 'Arts' },
        { id: 'a6', question: '🎭 Kathakali is a classical dance form from:', options: ['Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Karnataka'], answer: 'Kerala', difficulty: 'easy', stream: 'Arts' },
        { id: 'a7', question: '📰 The "Fourth Estate" refers to:', options: ['Judiciary', 'Executive', 'Media/Press', 'Military'], answer: 'Media/Press', difficulty: 'medium', stream: 'Arts' },
        { id: 'a8', question: '🗿 The Ajanta Caves are primarily known for:', options: ['Sculptures', 'Paintings', 'Inscriptions', 'Architecture'], answer: 'Paintings', difficulty: 'easy', stream: 'Arts' },
        { id: 'a9', question: '📚 "Arthashastra" was authored by:', options: ['Valmiki', 'Kautilya', 'Kalidas', 'Tulsidas'], answer: 'Kautilya', difficulty: 'medium', stream: 'Arts' },
        { id: 'a10', question: '🏛️ The doctrine of "Separation of Powers" was proposed by:', options: ['Locke', 'Montesquieu', 'Rousseau', 'Hobbes'], answer: 'Montesquieu', difficulty: 'hard', stream: 'Arts' }
    ],

    // ─────────────────────────────────────────────
    // ENGINEERING (For 12th: Deep Specialization)
    // ─────────────────────────────────────────────
    engineering: [
        { id: 'e1', question: '⚙️ In Object-Oriented Programming, "Polymorphism" means:', options: ['Data hiding', 'Same name different behavior', 'Memory allocation', 'Looping'], answer: 'Same name different behavior', difficulty: 'medium', stream: 'Engineering' },
        { id: 'e2', question: '🔧 Which material has the highest Young\'s Modulus?', options: ['Rubber', 'Steel', 'Diamond', 'Copper'], answer: 'Diamond', difficulty: 'hard', stream: 'Engineering' },
        { id: 'e3', question: '📐 The time complexity of binary search is:', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 'O(log n)', difficulty: 'medium', stream: 'Engineering' },
        { id: 'e4', question: '🏗️ The maximum bending moment in a simply supported beam with UDL occurs at:', options: ['Supports', 'Quarter span', 'Mid-span', 'Nowhere'], answer: 'Mid-span', difficulty: 'hard', stream: 'Engineering' },
        { id: 'e5', question: '💡 What does IoT stand for in modern engineering?', options: ['Input of Things', 'Internet of Things', 'Integration of Technology', 'Internal Operations Tool'], answer: 'Internet of Things', difficulty: 'easy', stream: 'Engineering' },
        { id: 'e6', question: '🔌 A transformer works on the principle of:', options: ['Coulomb\'s Law', 'Electromagnetic Induction', 'Ohm\'s Law', 'Bernoulli\'s Principle'], answer: 'Electromagnetic Induction', difficulty: 'medium', stream: 'Engineering' },
        { id: 'e7', question: '🖥️ Which sorting algorithm has the best average-case performance?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], answer: 'Merge Sort', difficulty: 'medium', stream: 'Engineering' },
        { id: 'e8', question: '🏭 The Carnot cycle gives the maximum efficiency between:', options: ['Two pressure levels', 'Two temperature levels', 'Two volume levels', 'Two density levels'], answer: 'Two temperature levels', difficulty: 'hard', stream: 'Engineering' },
        { id: 'e9', question: '🌐 HTTP status code 404 means:', options: ['Server Error', 'Unauthorized', 'Not Found', 'Success'], answer: 'Not Found', difficulty: 'easy', stream: 'Engineering' },
        { id: 'e10', question: '⚡ In a full-wave rectifier, the output frequency is __ the input frequency:', options: ['Same as', 'Half of', 'Double', 'Triple'], answer: 'Double', difficulty: 'medium', stream: 'Engineering' }
    ],

    // ─────────────────────────────────────────────
    // MEDICAL (For 12th: Deep Specialization)
    // ─────────────────────────────────────────────
    medical: [
        { id: 'm1', question: '🧬 Which enzyme unwinds DNA during replication?', options: ['DNA Polymerase', 'Helicase', 'Ligase', 'Topoisomerase'], answer: 'Helicase', difficulty: 'hard', stream: 'Medical' },
        { id: 'm2', question: '🫁 Emphysema primarily affects which organ?', options: ['Heart', 'Lungs', 'Liver', 'Kidneys'], answer: 'Lungs', difficulty: 'medium', stream: 'Medical' },
        { id: 'm3', question: '💊 Penicillin was discovered by:', options: ['Louis Pasteur', 'Alexander Fleming', 'Robert Koch', 'Edward Jenner'], answer: 'Alexander Fleming', difficulty: 'easy', stream: 'Medical' },
        { id: 'm4', question: '🔬 The Krebs Cycle takes place in the:', options: ['Nucleus', 'Cytoplasm', 'Mitochondrial Matrix', 'Cell Membrane'], answer: 'Mitochondrial Matrix', difficulty: 'hard', stream: 'Medical' },
        { id: 'm5', question: '🧪 Blood group O is a "universal donor" because RBCs lack:', options: ['A antigens', 'B antigens', 'Both A and B antigens', 'Rh factor'], answer: 'Both A and B antigens', difficulty: 'medium', stream: 'Medical' },
        { id: 'm6', question: '🦴 The longest bone in the human body is:', options: ['Tibia', 'Humerus', 'Femur', 'Radius'], answer: 'Femur', difficulty: 'easy', stream: 'Medical' },
        { id: 'm7', question: '🧠 Parkinson\'s disease is caused by deficiency of:', options: ['Serotonin', 'Dopamine', 'GABA', 'Acetylcholine'], answer: 'Dopamine', difficulty: 'hard', stream: 'Medical' },
        { id: 'm8', question: '🩺 Normal resting heart rate for adults is:', options: ['40-50 bpm', '60-100 bpm', '100-120 bpm', '120-140 bpm'], answer: '60-100 bpm', difficulty: 'easy', stream: 'Medical' },
        { id: 'm9', question: '💉 The MMR vaccine protects against:', options: ['Malaria, Mumps, Rubella', 'Measles, Mumps, Rubella', 'Measles, Malaria, Rabies', 'Mumps, Meningitis, Rubella'], answer: 'Measles, Mumps, Rubella', difficulty: 'medium', stream: 'Medical' },
        { id: 'm10', question: '🧫 Which type of immunity is provided by vaccines?', options: ['Natural Active', 'Artificial Active', 'Natural Passive', 'Artificial Passive'], answer: 'Artificial Active', difficulty: 'hard', stream: 'Medical' }
    ],

    // ─────────────────────────────────────────────
    // DIPLOMA / VOCATIONAL (For 10th: Exploration)
    // ─────────────────────────────────────────────
    diploma: [
        { id: 'd1', question: '🔧 Which tool is used to measure electrical current?', options: ['Voltmeter', 'Ammeter', 'Ohmmeter', 'Wattmeter'], answer: 'Ammeter', difficulty: 'easy', stream: 'Diploma' },
        { id: 'd2', question: '🏗️ The ratio of cement:sand:aggregate in M20 concrete is:', options: ['1:1:2', '1:1.5:3', '1:2:4', '1:3:6'], answer: '1:1.5:3', difficulty: 'hard', stream: 'Diploma' },
        { id: 'd3', question: '🖥️ HTML stands for:', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Logic', 'None'], answer: 'Hyper Text Markup Language', difficulty: 'easy', stream: 'Diploma' },
        { id: 'd4', question: '⚡ A fuse wire is made of which material?', options: ['Copper', 'Aluminum', 'Lead-Tin alloy', 'Steel'], answer: 'Lead-Tin alloy', difficulty: 'medium', stream: 'Diploma' },
        { id: 'd5', question: '🔩 The thread angle in a metric screw thread is:', options: ['55°', '60°', '47.5°', '29°'], answer: '60°', difficulty: 'hard', stream: 'Diploma' },
        { id: 'd6', question: '💻 Which programming language is best for automation and scripting?', options: ['Java', 'C++', 'Python', 'Assembly'], answer: 'Python', difficulty: 'easy', stream: 'Diploma' },
        { id: 'd7', question: '🏢 AutoCAD is primarily used for:', options: ['Animation', 'Technical Drawing', 'Video Editing', 'Music Production'], answer: 'Technical Drawing', difficulty: 'easy', stream: 'Diploma' },
        { id: 'd8', question: '🔌 SMPS stands for:', options: ['Switch Mode Power Supply', 'Standard Main Power System', 'Simple Mode Power Source', 'System Managed Power Supply'], answer: 'Switch Mode Power Supply', difficulty: 'medium', stream: 'Diploma' },
        { id: 'd9', question: '🏭 TIG welding uses which shielding gas?', options: ['Oxygen', 'Nitrogen', 'Argon', 'Hydrogen'], answer: 'Argon', difficulty: 'hard', stream: 'Diploma' },
        { id: 'd10', question: '📱 Which protocol is used for secure web communication?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 'HTTPS', difficulty: 'easy', stream: 'Diploma' }
    ]
};

/**
 * Returns the appropriate question sets based on student grade level.
 * 
 * 10th Grade: Gets a taste of ALL streams (science, commerce, arts, diploma) — 10 questions each
 * 12th Grade: Deep dives into their stream specialization (engineering OR medical) — 10 each
 */
export const getTestPlan = (classLevel) => {
    if (classLevel === '10th') {
        // 10th graders: Explore broad streams to find best fit
        return {
            phases: [
                { key: 'logical', label: '🧠 Logical Reasoning', icon: '🧩', questions: aptitudeQuestions.logical },
                { key: 'science', label: '🔬 Science Aptitude', icon: '⚗️', questions: aptitudeQuestions.science },
                { key: 'commerce', label: '💼 Commerce Aptitude', icon: '📊', questions: aptitudeQuestions.commerce },
                { key: 'arts', label: '🎨 Arts & Humanities', icon: '📜', questions: aptitudeQuestions.arts },
                { key: 'diploma', label: '🔧 Diploma / Vocational', icon: '⚙️', questions: aptitudeQuestions.diploma },
            ],
            totalQuestions: 50,
            description: 'Explore all career streams — Science, Commerce, Arts & Diploma — to discover your perfect fit.'
        };
    } else {
        // 12th graders: Deep-dive into ALL specializations equally
        return {
            phases: [
                { key: 'logical', label: '🧠 Logical Reasoning', icon: '🧩', questions: aptitudeQuestions.logical },
                { key: 'engineering', label: '⚙️ Engineering', icon: '🔧', questions: aptitudeQuestions.engineering },
                { key: 'medical', label: '🏥 Medical', icon: '🩺', questions: aptitudeQuestions.medical },
                { key: 'commerce', label: '💼 Commerce', icon: '📈', questions: aptitudeQuestions.commerce },
                { key: 'arts', label: '🎨 Arts & Humanities', icon: '📜', questions: aptitudeQuestions.arts },
                { key: 'diploma', label: '🔧 Diploma / Vocational', icon: '⚙️', questions: aptitudeQuestions.diploma },
            ],
            totalQuestions: 60,
            description: 'In-depth assessment across Engineering, Medical, Commerce, Arts & Diploma to pinpoint your ideal specialization.'
        };
    }
};
