        const projectInput = document.getElementById('project-input');
        const projectGitUrlInput = document.getElementById('project-git-url');
        const addProjectBtn = document.getElementById('add-project-btn');
        const projectList = document.getElementById('project-list');
        const projectProgressBar = document.getElementById('project-progress-bar');
        const projectProgressText = document.getElementById('project-progress-text');
        const projectCountText = document.getElementById('project-count');
        const streakCounter = document.getElementById('streak-counter');
        const lastCompletedDateText = document.getElementById('last-completed-date');
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        const csTopicInput = document.getElementById('cs-topic-input');
        const addCsTopicBtn = document.getElementById('add-cs-topic-btn');
        const csTopicList = document.getElementById('cs-topic-list');
        const iotTopicInput = document.getElementById('iot-topic-input');
        const addIotTopicBtn = document.getElementById('add-iot-topic-btn');
        const iotTopicList = document.getElementById('iot-topic-list');
        const cybersecTopicInput = document.getElementById('cybersec-topic-input');
        const addCybersecTopicBtn = document.getElementById('add-cybersec-topic-btn');
        const cybersecTopicList = document.getElementById('cybersec-topic-list');
        const networkingTopicInput = document.getElementById('networking-topic-input');
        const addNetworkingTopicBtn = document.getElementById('add-networking-topic-btn');
        const networkingTopicList = document.getElementById('networking-topic-list');
        const cpPlatformInput = document.getElementById('cp-platform-input');
        const cpProblemInput = document.getElementById('cp-problem-input');
        const cpDifficultyInput = document.getElementById('cp-difficulty-input');
        const cpProblemUrlInput = document.getElementById('cp-problem-url');
        const cpSolutionUrlInput = document.getElementById('cp-solution-url');
        const addCpProblemBtn = document.getElementById('add-cp-problem-btn');
        const cpProblemList = document.getElementById('cp-problem-list');
        const placementCompanyInput = document.getElementById('placement-company');
        const placementRoleInput = document.getElementById('placement-role');
        const placementDateInput = document.getElementById('placement-date');
        const placementStatusInput = document.getElementById('placement-status');
        const placementNotesInput = document.getElementById('placement-notes');
        const addPlacementAppBtn = document.getElementById('add-placement-app-btn');
        const placementAppList = document.getElementById('placement-app-list');
        const clearDataBtn = document.getElementById('clear-data-btn');
        const hackathonNameInput = document.getElementById('hackathon-name');
        const hackathonDateInput = document.getElementById('hackathon-date');
        const hackathonRoleInput = document.getElementById('hackathon-role');
        const hackathonProjectUrlInput = document.getElementById('hackathon-project-url');
        const hackathonResultInput = document.getElementById('hackathon-result');
        const addHackathonBtn = document.getElementById('add-hackathon-btn');
        const hackathonList = document.getElementById('hackathon-list');
        const achievementDescInput = document.getElementById('achievement-desc');
        const achievementTypeInput = document.getElementById('achievement-type');
        const achievementDateInput = document.getElementById('achievement-date');
        const achievementProofUrlInput = document.getElementById('achievement-proof-url');
        const addAchievementBtn = document.getElementById('add-achievement-btn');
        const achievementList = document.getElementById('achievement-list');

        // --- Constants ---
        const TOTAL_PROJECTS_GOAL = 365;
        const LOCAL_STORAGE_KEY = 'csTrackerState_v3';

        // --- State ---
        let state = {
            projects: [],
            learningTopics: {
                cs: [],
                iot: [],
                cybersec: [],
                networking: []
            },
            cpProblems: [],
            placementApps: [],
            hackathons: [],
            achievements: [],
            streak: 0,
            lastCompletedProjectDate: null
        };

        // --- Utility Functions ---
        const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

        // --- Backend Integration Placeholders ---
        const loadFromBackend = async () => {
            console.log("Attempting to load data from backend (placeholder)...");
            return null;
        };
        const saveToBackend = async (currentState) => {
            console.log("Attempting to save data to backend (placeholder)...", currentState);
            return true;
        };

        const saveState = async () => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
            console.log("State saved to Local Storage.");
            const backendSuccess = await saveToBackend(state);
            if (!backendSuccess) {
                console.warn("Failed to sync state with backend (placeholder). Using local storage.");
            }
        };

        const loadState = async () => {
            let loadedState = null;
            if (!loadedState) {
                const localState = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (localState) {
                    console.log("Loading state from Local Storage.");
                    loadedState = JSON.parse(localState);
                } else {
                    console.log("No saved state found. Initializing default state.");
                }
            } else {
                console.log("Loading state from Backend (placeholder).");
            }

            state = {
                projects: loadedState?.projects || [],
                learningTopics: {
                    cs: loadedState?.learningTopics?.cs || [],
                    iot: loadedState?.learningTopics?.iot || [],
                    cybersec: loadedState?.learningTopics?.cybersec || [],
                    networking: loadedState?.learningTopics?.networking || []
                },
                cpProblems: loadedState?.cpProblems || [],
                placementApps: loadedState?.placementApps || [],
                hackathons: loadedState?.hackathons || [],
                achievements: loadedState?.achievements || [],
                streak: loadedState?.streak || 0,
                lastCompletedProjectDate: loadedState?.lastCompletedProjectDate || null
            };

            state.projects.forEach(p => p.id = p.id || generateId());
            Object.values(state.learningTopics).flat().forEach(t => t.id = t.id || generateId());
            state.cpProblems.forEach(cp => cp.id = cp.id || generateId());
            state.placementApps.forEach(app => app.id = app.id || generateId());
            state.hackathons.forEach(h => h.id = h.id || generateId());
            state.achievements.forEach(a => a.id = a.id || generateId());

            calculateStreak();
        };

        const getTodayDateString = () => new Date().toISOString().split('T')[0];
        const getYesterdayDateString = () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toISOString().split('T')[0];
        };

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
            try {
                const [year, month, day] = datePart.split('-');
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch (e) { return dateString; }
        };

        const createLink = (url, text) => {
            if (!url) return '';
            let safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
            return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="link">${text}</a>`;
        };

        // --- Rendering Functions ---
        const renderProjects = () => {
            projectList.innerHTML = '';
            if (state.projects.length === 0) {
                projectList.innerHTML = '<li class="text-gray-500 italic text-sm">No projects logged yet.</li>';
            } else {
                [...state.projects].reverse().forEach((project) => {
                    const li = document.createElement('li');
                    li.className = 'text-sm list-item-added bg-gray-700 p-2 rounded shadow flex justify-between items-start';
                    li.innerHTML = `
                        <div class="flex-grow mr-2">
                            <span class="font-medium">${project.text}</span>
                            <span class="text-xs text-gray-400 block">(${formatDate(project.date)})</span>
                            ${project.gitUrl ? `<span class="text-xs block mt-1">${createLink(project.gitUrl, 'Git Repo')}</span>` : ''}
                        </div>
                        <button data-id="${project.id}" class="delete-project-btn text-red-500 hover:text-red-400 ml-2 p-1 rounded flex-shrink-0">
                            <svg data-lucide="trash-2" class="w-3 h-3"></svg>
                        </button>
                    `;
                    projectList.appendChild(li);
                });
                document.querySelectorAll('.delete-project-btn').forEach(button => {
                    button.addEventListener('click', handleDeleteProject);
                });
            }
            updateProjectProgress();
            lucide.createIcons();
        };

        const updateProjectProgress = () => {
            const completedCount = state.projects.length;
            const percentage = Math.min(100, (completedCount / TOTAL_PROJECTS_GOAL) * 100);
            projectProgressBar.style.width = `${percentage}%`;
            projectProgressText.textContent = `${Math.round(percentage)}%`;
            projectCountText.textContent = `${completedCount} / ${TOTAL_PROJECTS_GOAL} Projects Completed`;
        };

        const calculateStreak = () => {
            const today = getTodayDateString();
            const yesterday = getYesterdayDateString();
            if (!state.lastCompletedProjectDate) state.streak = 0;
            else if (state.lastCompletedProjectDate === today) {}
            else if (state.lastCompletedProjectDate !== yesterday) state.streak = 0;
            renderStreak();
        };

        const renderStreak = () => {
            streakCounter.textContent = `${state.streak} Day${state.streak !== 1 ? 's' : ''}`;
            lastCompletedDateText.textContent = `Last project completed: ${formatDate(state.lastCompletedProjectDate)}`;
        };

        const renderLearningTopics = (topicType) => {
            const listElement = document.getElementById(`${topicType}-topic-list`);
            const topics = state.learningTopics[topicType];
            listElement.innerHTML = '';
            if (topics.length === 0) {
                listElement.innerHTML = `<li class="text-gray-500 italic text-sm">No ${topicType} topics added yet.</li>`;
                return;
            }
            topics.forEach((topic) => {
                const li = document.createElement('li');
                li.className = `text-sm list-item-added flex justify-between items-center p-1.5 rounded ${topic.status === 'done' ? 'bg-green-900 bg-opacity-50 line-through text-gray-400' : 'bg-gray-700'}`;
                li.innerHTML = `
                    <span class="flex-grow mr-2">${topic.text}</span>
                    <div>
                        <button data-id="${topic.id}" data-type="${topicType}" class="toggle-topic-btn text-green-400 hover:text-green-300 mr-1 p-1 rounded">
                            <svg data-lucide="${topic.status === 'done' ? 'rotate-ccw' : 'check'}" class="w-4 h-4"></svg>
                        </button>
                        <button data-id="${topic.id}" data-type="${topicType}" class="delete-topic-btn text-red-500 hover:text-red-400 p-1 rounded">
                            <svg data-lucide="trash-2" class="w-4 h-4"></svg>
                        </button>
                    </div>`;
                listElement.appendChild(li);
            });
            listElement.querySelectorAll('.toggle-topic-btn').forEach(b => b.addEventListener('click', handleToggleTopicStatus));
            listElement.querySelectorAll('.delete-topic-btn').forEach(b => b.addEventListener('click', handleDeleteTopic));
            lucide.createIcons();
        };

        const renderAllLearningTopics = () => {
            renderLearningTopics('cs'); renderLearningTopics('iot'); renderLearningTopics('cybersec'); renderLearningTopics('networking');
        };

        const renderCpProblems = () => {
            cpProblemList.innerHTML = '';
            if (state.cpProblems.length === 0) {
                cpProblemList.innerHTML = '<li class="text-gray-500 italic text-sm">No problems logged yet.</li>';
            } else {
                [...state.cpProblems].reverse().forEach((problem) => {
                    const li = document.createElement('li');
                    li.className = 'list-item-added bg-gray-700 p-3 rounded shadow flex justify-between items-start';
                    li.innerHTML = `
                        <div class="flex-grow mr-2 text-sm">
                            <span class="font-medium">${problem.problem}</span>
                            <span class="text-xs px-2 py-0.5 rounded ml-2 ${
                                problem.difficulty === 'Easy' ? 'bg-green-700 text-green-100' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-700 text-yellow-100' :
                                'bg-red-700 text-red-100'
                            }">${problem.difficulty}</span><br>
                            <span class="text-xs text-gray-400">${problem.platform} - ${formatDate(problem.date)}</span>
                            ${problem.problemUrl ? `<span class="text-xs block mt-1">${createLink(problem.problemUrl, 'Problem Link')}</span>` : ''}
                            ${problem.solutionUrl ? `<span class="text-xs block mt-1">${createLink(problem.solutionUrl, 'Solution Link')}</span>` : ''}
                        </div>
                        <button data-id="${problem.id}" class="delete-cp-btn text-red-500 hover:text-red-400 ml-2 p-1 rounded flex-shrink-0">
                            <svg data-lucide="trash-2" class="w-4 h-4"></svg>
                        </button>`;
                    cpProblemList.appendChild(li);
                });
                document.querySelectorAll('.delete-cp-btn').forEach(b => b.addEventListener('click', handleDeleteCpProblem));
            }
            lucide.createIcons();
        };

        const renderPlacementApps = () => {
            placementAppList.innerHTML = '';
            if (state.placementApps.length === 0) {
                placementAppList.innerHTML = '<li class="text-gray-500 italic text-sm">No applications tracked yet.</li>';
            } else {
                const sortedApps = [...state.placementApps].sort((a, b) => new Date(b.date) - new Date(a.date));
                sortedApps.forEach((app) => {
                    const li = document.createElement('li');
                    li.className = 'list-item-added bg-gray-700 p-3 rounded shadow flex justify-between items-start';
                    let statusColor = 'bg-gray-500 text-gray-100';
                    if (app.status === 'Applied') statusColor = 'bg-blue-600 text-blue-100';
                    else if (app.status === 'OA') statusColor = 'bg-purple-600 text-purple-100';
                    else if (app.status === 'Interview') statusColor = 'bg-yellow-600 text-yellow-100';
                    else if (app.status === 'Offer') statusColor = 'bg-green-600 text-green-100';
                    else if (app.status === 'Rejected') statusColor = 'bg-red-600 text-red-100';
                    li.innerHTML = `
                        <div class="flex-grow mr-2 text-sm">
                            <span class="font-medium">${app.company} - ${app.role}</span>
                            <span class="text-xs px-2 py-0.5 rounded ml-2 ${statusColor}">${app.status}</span><br>
                            <span class="text-xs text-gray-400">Applied: ${formatDate(app.date)}</span>
                            ${app.notes ? `<p class="text-xs text-gray-300 mt-1 whitespace-pre-wrap break-words">Notes: ${app.notes}</p>` : ''}
                        </div>
                        <button data-id="${app.id}" class="delete-placement-btn text-red-500 hover:text-red-400 ml-2 p-1 rounded flex-shrink-0">
                            <svg data-lucide="trash-2" class="w-4 h-4"></svg>
                        </button>`;
                    placementAppList.appendChild(li);
                });
                document.querySelectorAll('.delete-placement-btn').forEach(b => b.addEventListener('click', handleDeletePlacementApp));
            }
            lucide.createIcons();
        };

        const renderHackathons = () => {
            hackathonList.innerHTML = '';
            if (state.hackathons.length === 0) {
                hackathonList.innerHTML = '<li class="text-gray-500 italic text-sm">No hackathons logged yet.</li>';
            } else {
                const sortedHackathons = [...state.hackathons].sort((a, b) => new Date(b.date) - new Date(a.date));
                sortedHackathons.forEach((hackathon) => {
                    const li = document.createElement('li');
                    li.className = 'list-item-added bg-gray-700 p-3 rounded shadow flex justify-between items-start';
                    li.innerHTML = `
                        <div class="flex-grow mr-2 text-sm">
                            <span class="font-medium">${hackathon.name}</span>
                            ${hackathon.result ? `<span class="text-xs px-2 py-0.5 rounded ml-2 bg-indigo-700 text-indigo-100">${hackathon.result}</span>` : ''}<br>
                            <span class="text-xs text-gray-400">Date: ${formatDate(hackathon.date)} | Role: ${hackathon.role}</span>
                            ${hackathon.projectUrl ? `<span class="text-xs block mt-1">${createLink(hackathon.projectUrl, 'Project Link')}</span>` : ''}
                        </div>
                        <button data-id="${hackathon.id}" class="delete-hackathon-btn text-red-500 hover:text-red-400 ml-2 p-1 rounded flex-shrink-0">
                            <svg data-lucide="trash-2" class="w-4 h-4"></svg>
                        </button>`;
                    hackathonList.appendChild(li);
                });
                document.querySelectorAll('.delete-hackathon-btn').forEach(b => b.addEventListener('click', handleDeleteHackathon));
            }
            lucide.createIcons();
        };

        const renderAchievements = () => {
            achievementList.innerHTML = '';
            if (state.achievements.length === 0) {
                achievementList.innerHTML = '<li class="text-gray-500 italic text-sm">No achievements logged yet.</li>';
            } else {
                const sortedAchievements = [...state.achievements].sort((a, b) => new Date(b.date) - new Date(a.date));
                sortedAchievements.forEach((achievement) => {
                    const li = document.createElement('li');
                    li.className = 'list-item-added bg-gray-700 p-3 rounded shadow flex justify-between items-start';
                    li.innerHTML = `
                        <div class="flex-grow mr-2 text-sm">
                            <span class="font-medium">${achievement.description}</span>
                            <span class="text-xs px-2 py-0.5 rounded ml-2 bg-pink-700 text-pink-100">${achievement.type}</span><br>
                            <span class="text-xs text-gray-400">Date: ${formatDate(achievement.date)}</span>
                            ${achievement.proofUrl ? `<span class="text-xs block mt-1">${createLink(achievement.proofUrl, 'Proof/Link')}</span>` : ''}
                        </div>
                        <button data-id="${achievement.id}" class="delete-achievement-btn text-red-500 hover:text-red-400 ml-2 p-1 rounded flex-shrink-0">
                            <svg data-lucide="trash-2" class="w-4 h-4"></svg>
                        </button>`;
                    achievementList.appendChild(li);
                });
                document.querySelectorAll('.delete-achievement-btn').forEach(b => b.addEventListener('click', handleDeleteAchievement));
            }
            lucide.createIcons();
        };

        // --- Event Handlers ---
        addProjectBtn.addEventListener('click', () => {
            const projectText = projectInput.value.trim();
            const gitUrl = projectGitUrlInput.value.trim();
            if (projectText) {
                const today = getTodayDateString();
                const yesterday = getYesterdayDateString();
                if (state.lastCompletedProjectDate === yesterday) state.streak += 1;
                else if (state.lastCompletedProjectDate !== today) state.streak = 1;
                state.lastCompletedProjectDate = today;

                state.projects.push({ id: generateId(), text: projectText, gitUrl: gitUrl || undefined, date: new Date().toISOString() });
                projectInput.value = ''; projectGitUrlInput.value = '';
                saveState(); renderProjects(); renderStreak();
            } else {
                projectInput.placeholder = "Please enter a project description!"; projectInput.classList.add('border-red-500');
                setTimeout(() => { projectInput.placeholder = "e.g., Built a basic API with Flask"; projectInput.classList.remove('border-red-500'); }, 2000);
            }
        });

        const handleDeleteProject = (event) => {
            const idToDelete = event.currentTarget.dataset.id;
            state.projects = state.projects.filter(p => p.id !== idToDelete);
            if (state.projects.length > 0) {
                const lastProject = state.projects.reduce((latest, current) => new Date(latest.date) > new Date(current.date) ? latest : current);
                state.lastCompletedProjectDate = lastProject.date.split('T')[0];
            } else {
                state.lastCompletedProjectDate = null; state.streak = 0;
            }
            calculateStreak();
            saveState(); renderProjects();
        };

        const handleAddLearningTopic = (topicType) => {
            const inputElement = document.getElementById(`${topicType}-topic-input`); const topicText = inputElement.value.trim();
            if (topicText) { state.learningTopics[topicType].push({ id: generateId(), text: topicText, status: 'todo' }); inputElement.value = ''; saveState(); renderLearningTopics(topicType); }
        };
        addCsTopicBtn.addEventListener('click', () => handleAddLearningTopic('cs'));
        addIotTopicBtn.addEventListener('click', () => handleAddLearningTopic('iot'));
        addCybersecTopicBtn.addEventListener('click', () => handleAddLearningTopic('cybersec'));
        addNetworkingTopicBtn.addEventListener('click', () => handleAddLearningTopic('networking'));

        const handleToggleTopicStatus = (event) => {
            const button = event.currentTarget; const idToToggle = button.dataset.id; const topicType = button.dataset.type;
            const topic = state.learningTopics[topicType].find(t => t.id === idToToggle);
            if (topic) { topic.status = topic.status === 'todo' ? 'done' : 'todo'; saveState(); renderLearningTopics(topicType); }
        };

        const handleDeleteTopic = (event) => {
            const button = event.currentTarget; const idToDelete = button.dataset.id; const topicType = button.dataset.type;
            state.learningTopics[topicType] = state.learningTopics[topicType].filter(t => t.id !== idToDelete);
            saveState(); renderLearningTopics(topicType);
        };

        addCpProblemBtn.addEventListener('click', () => {
            const platform = cpPlatformInput.value.trim(); const problem = cpProblemInput.value.trim(); const difficulty = cpDifficultyInput.value; const problemUrl = cpProblemUrlInput.value.trim(); const solutionUrl = cpSolutionUrlInput.value.trim();
            if (platform && problem) {
                state.cpProblems.push({ id: generateId(), platform, problem, difficulty, problemUrl: problemUrl || undefined, solutionUrl: solutionUrl || undefined, date: new Date().toISOString() });
                cpPlatformInput.value = ''; cpProblemInput.value = ''; cpDifficultyInput.value = 'Easy'; cpProblemUrlInput.value = ''; cpSolutionUrlInput.value = '';
                saveState(); renderCpProblems();
            } else {
                cpProblemInput.placeholder = "Platform and Problem Name required!"; cpProblemInput.classList.add('border-red-500');
                setTimeout(() => { cpProblemInput.placeholder = "e.g., Two Sum"; cpProblemInput.classList.remove('border-red-500'); }, 2000);
            }
        });

        const handleDeleteCpProblem = (event) => {
            const idToDelete = event.currentTarget.dataset.id; state.cpProblems = state.cpProblems.filter(p => p.id !== idToDelete); saveState(); renderCpProblems();
        };

        addPlacementAppBtn.addEventListener('click', () => {
            const company = placementCompanyInput.value.trim(); const role = placementRoleInput.value.trim(); const date = placementDateInput.value; const status = placementStatusInput.value; const notes = placementNotesInput.value.trim();
            if (company && role && date) {
                state.placementApps.push({ id: generateId(), company, role, date, status, notes: notes || undefined });
                placementCompanyInput.value = ''; placementRoleInput.value = ''; placementDateInput.value = ''; placementStatusInput.value = 'Wishlist'; placementNotesInput.value = '';
                saveState(); renderPlacementApps();
            } else {
                if (!company) placementCompanyInput.classList.add('border-red-500'); if (!role) placementRoleInput.classList.add('border-red-500'); if (!date) placementDateInput.classList.add('border-red-500');
                setTimeout(() => { placementCompanyInput.classList.remove('border-red-500'); placementRoleInput.classList.remove('border-red-500'); placementDateInput.classList.remove('border-red-500'); }, 2000);
            }
        });

        const handleDeletePlacementApp = (event) => {
            const idToDelete = event.currentTarget.dataset.id; state.placementApps = state.placementApps.filter(app => app.id !== idToDelete); saveState(); renderPlacementApps();
        };

        addHackathonBtn.addEventListener('click', () => {
            const name = hackathonNameInput.value.trim();
            const date = hackathonDateInput.value;
            const role = hackathonRoleInput.value.trim();
            const projectUrl = hackathonProjectUrlInput.value.trim();
            const result = hackathonResultInput.value.trim();

            if (name && date && role) {
                state.hackathons.push({
                    id: generateId(),
                    name, date, role,
                    projectUrl: projectUrl || undefined,
                    result: result || undefined
                });
                hackathonNameInput.value = ''; hackathonDateInput.value = ''; hackathonRoleInput.value = ''; hackathonProjectUrlInput.value = ''; hackathonResultInput.value = '';
                saveState();
                renderHackathons();
            } else {
                if (!name) hackathonNameInput.classList.add('border-red-500'); if (!date) hackathonDateInput.classList.add('border-red-500'); if (!role) hackathonRoleInput.classList.add('border-red-500');
                setTimeout(() => { hackathonNameInput.classList.remove('border-red-500'); hackathonDateInput.classList.remove('border-red-500'); hackathonRoleInput.classList.remove('border-red-500'); }, 2000);
            }
        });

        const handleDeleteHackathon = (event) => {
            const idToDelete = event.currentTarget.dataset.id;
            state.hackathons = state.hackathons.filter(h => h.id !== idToDelete);
            saveState();
            renderHackathons();
        };

        addAchievementBtn.addEventListener('click', () => {
            const description = achievementDescInput.value.trim();
            const type = achievementTypeInput.value;
            const date = achievementDateInput.value;
            const proofUrl = achievementProofUrlInput.value.trim();

            if (description && type && date) {
                state.achievements.push({
                    id: generateId(),
                    description, type, date,
                    proofUrl: proofUrl || undefined
                });
                achievementDescInput.value = ''; achievementTypeInput.value = 'Certification'; achievementDateInput.value = ''; achievementProofUrlInput.value = '';
                saveState();
                renderAchievements();
            } else {
                if (!description) achievementDescInput.classList.add('border-red-500'); if (!type) achievementTypeInput.classList.add('border-red-500'); if (!date) achievementDateInput.classList.add('border-red-500');
                setTimeout(() => { achievementDescInput.classList.remove('border-red-500'); achievementTypeInput.classList.remove('border-red-500'); achievementDateInput.classList.remove('border-red-500'); }, 2000);
            }
        });

        const handleDeleteAchievement = (event) => {
            const idToDelete = event.currentTarget.dataset.id;
            state.achievements = state.achievements.filter(a => a.id !== idToDelete);
            saveState();
            renderAchievements();
        };

        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear ALL locally saved data? This cannot be undone and does not affect any backend data.')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                state = {
                    projects: [], learningTopics: { cs: [], iot: [], cybersec: [], networking: [] }, cpProblems: [], placementApps: [], hackathons: [], achievements: [], streak: 0, lastCompletedProjectDate: null
                };
                renderProjects(); renderAllLearningTopics(); renderCpProblems(); renderPlacementApps(); renderHackathons(); renderAchievements(); renderStreak();
                console.log("Local storage cleared.");
            }
        });

        const fetchQuote = () => {
            const quotes = [
                { text: "The grind never stops. Keep pushing!", author: "Your Future Self" },
                { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
                { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
                { text: "Strive for progress, not perfection.", author: "Unknown" },
                { text: "Your limitation—it's only your imagination.", author: "Unknown" },
                { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" }
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteText.textContent = `"${randomQuote.text}"`; quoteAuthor.textContent = `- ${randomQuote.author}`;
        };

        document.addEventListener('DOMContentLoaded', async () => {
            await loadState();
            renderProjects();
            renderAllLearningTopics();
            renderCpProblems();
            renderPlacementApps();
            renderHackathons();
            renderAchievements();
            renderStreak();
            fetchQuote();
            lucide.createIcons();
        });
