document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initializeNavigation === 'function') {
    window.initializeNavigation();
  }

  if (typeof window.initializeInteractions === 'function') {
    window.initializeInteractions();
  }

  const exploreButton = document.querySelector('[data-explore]');
  const mapSection = document.getElementById('interactive-map');
  const mapButtons = document.querySelectorAll('.world-island');
  const mapInfoTitle = document.getElementById('mapInfoTitle');
  const mapInfoText = document.getElementById('mapInfoText');
  const profileTrigger = document.querySelector('.map-avatar');
  const profileModal = document.getElementById('profileModal');
  const profileCloseButton = document.querySelector('.profile-close');
  const storyButton = document.querySelector('[data-story-target]');
  const celestialCard = document.querySelector('.constellation');
  const celestialPhrase = document.querySelector('.celestial-phrase');
  const celestialGroups = document.querySelectorAll('.celestial-sun-group, .celestial-moon-group');
  let isCelestialSequenceActive = false;
  let celestialMessageTimer = null;
  let celestialPhraseHideTimer = null;

  const hideCelestialCharacters = () => {
    celestialGroups.forEach((group) => {
      group.classList.add('is-hidden');
    });
  };

  const showCelestialCharacters = () => {
    celestialGroups.forEach((group) => {
      group.classList.remove('is-hidden');
    });
  };

  const setCelestialPhraseState = (state) => {
    if (!celestialPhrase) {
      return;
    }

    celestialPhrase.classList.remove('is-visible', 'is-hiding');

    if (state === 'visible') {
      celestialPhrase.classList.add('is-visible');
    }

    if (state === 'hiding') {
      celestialPhrase.classList.add('is-hiding');
    }
  };

  const finishCelestialMessageSequence = () => {
    if (celestialMessageTimer) {
      clearTimeout(celestialMessageTimer);
      celestialMessageTimer = null;
    }

    if (celestialPhraseHideTimer) {
      clearTimeout(celestialPhraseHideTimer);
      celestialPhraseHideTimer = null;
    }

    setCelestialPhraseState('hidden');
    showCelestialCharacters();
    isCelestialSequenceActive = false;
  };

  const triggerCelestialMessage = () => {
    if (isCelestialSequenceActive || !celestialCard || !celestialPhrase) {
      return;
    }

    isCelestialSequenceActive = true;
    hideCelestialCharacters();
    setCelestialPhraseState('visible');

    if (celestialMessageTimer) {
      clearTimeout(celestialMessageTimer);
      celestialMessageTimer = null;
    }

    if (celestialPhraseHideTimer) {
      clearTimeout(celestialPhraseHideTimer);
      celestialPhraseHideTimer = null;
    }

    celestialMessageTimer = setTimeout(() => {
      celestialMessageTimer = null;
      setCelestialPhraseState('hiding');

      celestialPhraseHideTimer = setTimeout(() => {
        finishCelestialMessageSequence();
      }, 800);
    }, 10000);
  };

  const logicVideoLauncher = document.getElementById('logicVideoLauncher');
  const rocketTrigger = document.getElementById('rocketTrigger');

  if (logicVideoLauncher && rocketTrigger) {
    const reduceMotionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const rocketSequence = {
      flightDuration: reduceMotionQuery && reduceMotionQuery.matches ? 0 : 1800,
      revealDelay: reduceMotionQuery && reduceMotionQuery.matches ? 0 : 900,
      holdDuration: 10000,
      returnDuration: reduceMotionQuery && reduceMotionQuery.matches ? 0 : 1800,
      timers: [],
    };

    const clearRocketSequenceTimers = () => {
      rocketSequence.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      rocketSequence.timers = [];
    };

    const resetRocketSequence = () => {
      clearRocketSequenceTimers();
      logicVideoLauncher.classList.remove('is-fired', 'is-link-visible', 'is-link-hiding', 'is-returning');
      rocketTrigger.disabled = false;
      rocketTrigger.setAttribute('aria-disabled', 'false');
      rocketTrigger.style.opacity = '';
    };

    const beginRocketSequence = () => {
      if (logicVideoLauncher.classList.contains('is-fired') || logicVideoLauncher.classList.contains('is-returning')) {
        return;
      }

      clearRocketSequenceTimers();
      logicVideoLauncher.classList.remove('is-link-visible', 'is-link-hiding', 'is-returning');
      logicVideoLauncher.classList.add('is-fired');
      rocketTrigger.disabled = true;
      rocketTrigger.setAttribute('aria-disabled', 'true');
      rocketTrigger.style.opacity = '';

      const revealTimer = setTimeout(() => {
        logicVideoLauncher.classList.add('is-link-visible');
      }, rocketSequence.revealDelay);

      const holdTimer = setTimeout(() => {
        logicVideoLauncher.classList.add('is-link-hiding');
        logicVideoLauncher.classList.add('is-returning');
      }, rocketSequence.revealDelay + rocketSequence.holdDuration);

      const returnTimer = setTimeout(() => {
        resetRocketSequence();
      }, rocketSequence.revealDelay + rocketSequence.holdDuration + rocketSequence.returnDuration);

      rocketSequence.timers = [revealTimer, holdTimer, returnTimer];
    };

    rocketTrigger.addEventListener('click', beginRocketSequence);

    if (reduceMotionQuery && reduceMotionQuery.matches) {
      rocketTrigger.style.opacity = '1';
    }

    window.addEventListener('beforeunload', clearRocketSequenceTimers);
  }

  const logicGame = document.getElementById('logicGame');
  const logicScoreDisplay = document.getElementById('logicScore');
  const logicLevelLabel = document.getElementById('logicLevelLabel');
  const logicProgressBar = document.getElementById('logicProgressBar');
  const logicFeedback = document.getElementById('logicFeedback');
  const logicFeedbackState = {
    message: '',
    type: '',
  };
  const logicStagePanels = document.querySelectorAll('.logic-stage');
  const logicDifficultyButtons = document.querySelectorAll('.logic-difficulty-btn');
  const logicStageButtons = document.querySelectorAll('.logic-stage-btn');
  const logicReplayBtn = document.getElementById('logicReplayBtn');

  const logicGameState = {
    difficulty: 'beginner',
    score: 0,
    stage: 1,
    stageProgress: 0,
    challengeIndex: 0,
    masterIndex: 0,
    solveAttempt: 0,
    masterAttempt: 0,
    currentChallenge: null,
    masterChallenge: null,
    solveSolved: false,
  };

  const gateTruthTable = {
    AND: (a, b) => a && b,
    OR: (a, b) => a || b,
    NOT: (a) => Number(!a),
  };

  const difficultySets = {
    beginner: {
      label: 'Beginner',
      solveChallenges: [
        { gate: 'AND', target: 1, prompt: 'Choose values to make the AND gate output 1.', inputs: [1, 1] },
        { gate: 'OR', target: 1, prompt: 'Choose values to make the OR gate output 1.', inputs: [0, 1] },
        { gate: 'NOT', target: 1, prompt: 'Choose values to make the NOT gate output 1.', inputs: [0] },
      ],
      masterChallenges: [
        { prompt: 'Calculate: (A AND B) OR C = 1', target: 1, values: [1, 1, 0], evaluate: (a, b, c) => (a && b) || c ? 1 : 0 },
        { prompt: 'Calculate: NOT (A OR B) = 1', target: 1, values: [0, 0, 0], evaluate: (a, b, c) => Number(!(a || b)) },
        { prompt: 'Calculate: (A OR NOT B) AND C = 1', target: 1, values: [1, 0, 1], evaluate: (a, b, c) => ((a || !b) && c) ? 1 : 0 },
      ],
    },
    intermediate: {
      label: 'Intermediate',
      solveChallenges: [
        { gate: 'AND', target: 0, prompt: 'Choose values to make the AND gate output 0.', inputs: [1, 0] },
        { gate: 'OR', target: 0, prompt: 'Choose values to make the OR gate output 0.', inputs: [0, 0] },
        { gate: 'NOT', target: 0, prompt: 'Choose values to make the NOT gate output 0.', inputs: [1] },
      ],
      masterChallenges: [
        { prompt: 'Calculate: (A AND NOT B) OR C = 1', target: 1, values: [1, 0, 1], evaluate: (a, b, c) => ((a && !b) || c) ? 1 : 0 },
        { prompt: 'Calculate: NOT (A AND B) OR C = 1', target: 1, values: [0, 0, 1], evaluate: (a, b, c) => Number(!(a && b) || c) },
        { prompt: 'Calculate: (A OR B) AND NOT C = 1', target: 1, values: [1, 0, 0], evaluate: (a, b, c) => ((a || b) && !c) ? 1 : 0 },
      ],
    },
    advanced: {
      label: 'Advanced',
      solveChallenges: [
        { gate: 'AND', target: 0, prompt: 'Choose values to make the AND gate output 0 while keeping one input high.', inputs: [1, 0] },
        { gate: 'OR', target: 1, prompt: 'Choose values to make the OR gate output 1 with the smallest possible input set.', inputs: [0, 1] },
        { gate: 'NOT', target: 1, prompt: 'Choose values to make the NOT gate output 1.', inputs: [0] },
      ],
      masterChallenges: [
        { prompt: 'Calculate: (NOT A AND B) OR (A AND NOT C) = 1', target: 1, values: [0, 1, 0], evaluate: (a, b, c) => ((!a && b) || (a && !c)) ? 1 : 0 },
        { prompt: 'Calculate: NOT ((A OR B) AND C) = 1', target: 1, values: [0, 1, 0], evaluate: (a, b, c) => Number(!((a || b) && c)) },
        { prompt: 'Calculate: (A AND NOT B) OR (NOT A AND C) = 1', target: 1, values: [0, 1, 1], evaluate: (a, b, c) => ((a && !b) || (!a && c)) ? 1 : 0 },
      ],
    },
  };

  const updateProgress = () => {
    if (!logicProgressBar) {
      return;
    }

    const pct = Math.max(0, Math.min(100, (logicGameState.stageProgress / 100) * 100));
    logicProgressBar.style.width = `${pct}%`;
  };

  const renderFeedback = () => {
    if (!logicFeedback) {
      return;
    }

    logicFeedback.textContent = logicFeedbackState.message;
    logicFeedback.classList.remove('is-visible', 'correct', 'incorrect');

    if (!logicFeedbackState.message) {
      return;
    }

    logicFeedback.classList.add('is-visible');

    if (logicFeedbackState.type === 'correct') {
      logicFeedback.classList.add('correct');
    }

    if (logicFeedbackState.type === 'incorrect') {
      logicFeedback.classList.add('incorrect');
    }
  };

  const clearFeedback = () => {
    logicFeedbackState.message = '';
    logicFeedbackState.type = '';
    renderFeedback();
  };

  const setFeedback = (message, type = '') => {
    logicFeedbackState.message = message || '';
    logicFeedbackState.type = type;
    renderFeedback();
  };

  const setStageVisibility = () => {
    logicStagePanels.forEach((panel, index) => {
      panel.classList.toggle('active', index + 1 === logicGameState.stage);
    });

    logicStageButtons.forEach((button) => {
      button.classList.toggle('active', Number(button.dataset.stage || 1) === logicGameState.stage);
    });

    if (logicLevelLabel) {
      logicLevelLabel.textContent = String(logicGameState.stage);
    }
  };

  const calculateGateOutput = (gate, a, b) => {
    if (gate === 'NOT') {
      return gateTruthTable.NOT(a);
    }

    return gateTruthTable[gate](a, b) ? 1 : 0;
  };

  const applyGateStates = () => {
    const gateCards = document.querySelectorAll('.logic-gate-card');

    gateCards.forEach((card) => {
      const gate = card.dataset.gate;
      const aButton = card.querySelector('[data-input="a"].active');
      const bButton = card.querySelector('[data-input="b"].active');
      const valueA = Number((aButton ? aButton.dataset.value : '0') || '0');
      const valueB = gate === 'NOT' ? 0 : Number((bButton ? bButton.dataset.value : '0') || '0');
      const output = calculateGateOutput(gate, valueA, valueB);
      const outputNode = card.querySelector('[data-output]');
      const outputValueNode = card.querySelector('.logic-output-value');
      const wireA = card.querySelector('.wire-a');
      const wireB = card.querySelector('.wire-b');
      const inputNodes = card.querySelectorAll('.logic-input-node');

      if (outputNode) {
        outputNode.textContent = String(output);
      }

      if (outputValueNode) {
        outputValueNode.textContent = String(output);
      }

      card.classList.remove('is-output-on', 'is-output-off', 'circuit-flash');
      card.classList.add(output === 1 ? 'is-output-on' : 'is-output-off');

      card.offsetWidth;
      card.classList.add('circuit-flash');

      inputNodes.forEach((node) => {
        const side = node.dataset.inputSide;
        const isOn = side === 'a' ? valueA === 1 : valueB === 1;
        node.classList.toggle('is-on', isOn);
        node.classList.toggle('is-off', !isOn);
      });

      if (wireA) {
        wireA.classList.toggle('is-active', valueA === 1);
        wireA.classList.toggle('is-muted', valueA !== 1);
      }

      if (wireB) {
        wireB.classList.toggle('is-active', valueB === 1);
        wireB.classList.toggle('is-muted', valueB !== 1);
      }
    });
  };

  const initGateCards = () => {
    document.querySelectorAll('.logic-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const gate = button.dataset.gate;
        const input = button.dataset.input;
        const value = Number(button.dataset.value || 0);

        const sameGroup = document.querySelectorAll(`.logic-toggle[data-gate="${gate}"][data-input="${input}"]`);
        sameGroup.forEach((toggle) => {
          const isActive = Number(toggle.dataset.value || 0) === value;
          toggle.classList.toggle('active', isActive);
        });

        applyGateStates();
      });
    });
  };

  const getCurrentSolveChallenge = () => {
    const challengeSet = difficultySets[logicGameState.difficulty].solveChallenges;
    return challengeSet[logicGameState.challengeIndex % challengeSet.length];
  };

  const getCurrentMasterChallenge = () => {
    const challengeSet = difficultySets[logicGameState.difficulty].masterChallenges;
    return challengeSet[logicGameState.masterIndex % challengeSet.length];
  };

  const getSolveInputValues = () => {
    const answerToggles = document.querySelectorAll('.logic-answer-toggle');
    const values = { 0: null, 1: null };

    answerToggles.forEach((toggle) => {
      const index = Number(toggle.dataset.inputIndex || 0);
      if (toggle.classList.contains('active')) {
        values[index] = Number(toggle.dataset.value || 0);
      }
    });

    return values;
  };

  const resetSolveSelections = () => {
    document.querySelectorAll('.logic-answer-toggle').forEach((toggle) => {
      toggle.classList.remove('active');
    });
  };

  const updateSolveCompletionState = () => {
    const nextChallengeButton = document.getElementById('logicNextChallenge');
    if (nextChallengeButton) {
      nextChallengeButton.disabled = !logicGameState.solveSolved;
      nextChallengeButton.setAttribute('aria-disabled', String(!logicGameState.solveSolved));
    }
  };

  const setSolveControls = (challenge) => {
    const controls = document.querySelectorAll('.logic-answer-toggle');

    controls.forEach((toggle) => {
      toggle.classList.remove('active');
    });

    const prompt = document.getElementById('logicChallengePrompt');
    if (prompt) {
      prompt.textContent = challenge.prompt;
    }

    logicGameState.solveAttempt = 0;
    logicGameState.solveSolved = false;
    clearFeedback();
    updateSolveCompletionState();
  };

  const resetMasterSelections = () => {
    document.querySelectorAll('.logic-master-toggle').forEach((toggle) => {
      toggle.classList.remove('active');
    });
  };

  const setMasterControls = (challenge) => {
    const controls = document.querySelectorAll('.logic-master-toggle');
    const prompt = document.getElementById('logicMasterPrompt');
    if (prompt) {
      prompt.textContent = challenge.prompt;
    }

    logicGameState.masterAttempt = 0;
    controls.forEach((toggle) => {
      toggle.classList.remove('active');
    });
    clearFeedback();
  };

  const checkSolveChallenge = () => {
    const challenge = getCurrentSolveChallenge();
    const values = getSolveInputValues();

    clearFeedback();

    if (values[0] === null || values[1] === null) {
      setFeedback('Choose both A and B before checking the answer.', 'incorrect');
      return;
    }

    logicGameState.solveAttempt += 1;

    let actual = 0;

    if (challenge.gate === 'NOT') {
      actual = gateTruthTable.NOT(values[0]);
    } else {
      actual = gateTruthTable[challenge.gate](values[0], values[1]) ? 1 : 0;
    }

    if (actual === challenge.target) {
      logicGameState.score += 10;
      if (logicScoreDisplay) {
        logicScoreDisplay.textContent = String(logicGameState.score);
      }
      setFeedback('Correct! Well done!', 'correct');
      logicGameState.solveSolved = true;
      logicGameState.challengeIndex += 1;
      logicGameState.stageProgress = Math.min(100, logicGameState.stageProgress + 15);
      updateProgress();
      updateSolveCompletionState();
    } else {
      const attemptMessage = `Attempt ${logicGameState.solveAttempt} — Incorrect answer. Try again!`;
      setFeedback(attemptMessage, 'incorrect');
      logicGameState.solveSolved = false;
      updateSolveCompletionState();
    }
  };

  const checkMasterChallenge = () => {
    const challenge = getCurrentMasterChallenge();
    const controls = document.querySelectorAll('.logic-master-toggle');
    const values = [0, 0, 0];

    clearFeedback();

    controls.forEach((toggle) => {
      const index = Number(toggle.dataset.inputIndex || 0);
      if (toggle.classList.contains('active')) {
        values[index] = Number(toggle.dataset.value || 0);
      }
    });

    logicGameState.masterAttempt += 1;
    const output = challenge.evaluate ? challenge.evaluate(values[0], values[1], values[2]) : 0;

    if (output === challenge.target) {
      logicGameState.score += 20;
      if (logicScoreDisplay) {
        logicScoreDisplay.textContent = String(logicGameState.score);
      }
      setFeedback('Correct! Well done!', 'correct');
      logicGameState.masterIndex += 1;
      logicGameState.stageProgress = Math.min(100, logicGameState.stageProgress + 20);
      updateProgress();
      if (logicGameState.masterIndex >= difficultySets[logicGameState.difficulty].masterChallenges.length) {
        setFeedback('Circuit Master complete! You finished the challenge set.', 'correct');
        logicGameState.stage = 3;
        setStageVisibility();
      } else {
        setTimeout(() => {
          setMasterControls(getCurrentMasterChallenge());
          setFeedback('', '');
        }, 500);
      }
    } else {
      const attemptMessage = `Attempt ${logicGameState.masterAttempt} — Incorrect answer. Try again!`;
      setFeedback(attemptMessage, 'incorrect');
    }
  };

  const resetGame = () => {
    logicGameState.score = 0;
    logicGameState.stage = 1;
    logicGameState.challengeIndex = 0;
    logicGameState.masterIndex = 0;
    logicGameState.solveAttempt = 0;
    logicGameState.masterAttempt = 0;
    logicGameState.stageProgress = 0;
    logicGameState.solveSolved = false;
    updateProgress();
    setStageVisibility();
    if (logicScoreDisplay) {
      logicScoreDisplay.textContent = '0';
    }

    const beginnerChallenge = difficultySets[logicGameState.difficulty].solveChallenges[0];
    resetSolveSelections();
    resetMasterSelections();
    setSolveControls(beginnerChallenge);
    setMasterControls(difficultySets[logicGameState.difficulty].masterChallenges[0]);
    setFeedback('', '');
    updateSolveCompletionState();
  };

  if (logicGame && logicScoreDisplay && logicLevelLabel) {
    logicDifficultyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        logicDifficultyButtons.forEach((entry) => entry.classList.toggle('active', entry === button));
        logicGameState.difficulty = button.dataset.difficulty;
        resetGame();
      });
    });

    logicStageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        clearFeedback();
        logicGameState.stage = Number(button.dataset.stage || 1);
        setStageVisibility();
      });
    });

    const solveButtons = document.querySelectorAll('.logic-answer-toggle');
    solveButtons.forEach((button) => {
      button.addEventListener('click', () => {
        clearFeedback();
        logicGameState.solveSolved = false;
        updateSolveCompletionState();

        const index = Number(button.dataset.inputIndex || 0);
        const value = Number(button.dataset.value || 0);
        const related = document.querySelectorAll(`.logic-answer-toggle[data-input-index="${index}"]`);
        related.forEach((toggle) => {
          toggle.classList.toggle('active', Number(toggle.dataset.value || 0) === value);
        });
      });
    });

    const masterButtons = document.querySelectorAll('.logic-master-toggle');
    masterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        clearFeedback();
        const index = Number(button.dataset.inputIndex || 0);
        const value = Number(button.dataset.value || 0);
        const related = document.querySelectorAll(`.logic-master-toggle[data-input-index="${index}"]`);
        related.forEach((toggle) => {
          toggle.classList.toggle('active', Number(toggle.dataset.value || 0) === value);
        });
      });
    });

    const masterNext = document.getElementById('logicMasterNext');
    if (masterNext) {
      masterNext.disabled = false;
    }

    const logicCheckAnswer = document.getElementById('logicCheckAnswer');
    if (logicCheckAnswer) {
      logicCheckAnswer.addEventListener('click', checkSolveChallenge);
    }

    const logicNextChallenge = document.getElementById('logicNextChallenge');
    if (logicNextChallenge) {
      logicNextChallenge.addEventListener('click', () => {
        if (!logicGameState.solveSolved) {
          return;
        }

        const nextChallenge = getCurrentSolveChallenge();
        logicGameState.solveAttempt = 0;
        setSolveControls(nextChallenge);
        setFeedback('Challenge updated. Keep going!', 'correct');
        updateSolveCompletionState();
      });
    }

    const logicCheckMaster = document.getElementById('logicCheckMaster');
    if (logicCheckMaster) {
      logicCheckMaster.addEventListener('click', checkMasterChallenge);
    }

    const logicMasterNext = document.getElementById('logicMasterNext');
    if (logicMasterNext) {
      logicMasterNext.addEventListener('click', () => {
        const nextChallenge = getCurrentMasterChallenge();
        logicGameState.masterAttempt = 0;
        setMasterControls(nextChallenge);
        setFeedback('Next circuit loaded.', 'correct');
      });
    }

    if (logicReplayBtn) {
      logicReplayBtn.addEventListener('click', resetGame);
    }

    initGateCards();
    applyGateStates();
    setStageVisibility();
    const firstSolveChallenge = getCurrentSolveChallenge();
    resetSolveSelections();
    resetMasterSelections();
    setSolveControls(firstSolveChallenge);
    setMasterControls(getCurrentMasterChallenge());
    updateProgress();
    updateSolveCompletionState();
  }

  const openProfileModal = () => {
    if (!profileModal) {
      return;
    }

    profileModal.hidden = false;
    requestAnimationFrame(() => {
      profileModal.classList.add('is-open');
    });
  };

  const closeProfileModal = () => {
    if (!profileModal) {
      return;
    }

    profileModal.classList.remove('is-open');
    setTimeout(() => {
      profileModal.hidden = true;
    }, 180);
  };

  const setActiveIsland = (targetButton) => {
    mapButtons.forEach((button) => {
      const isActive = button === targetButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (targetButton && mapInfoTitle && mapInfoText) {
      mapInfoTitle.textContent = targetButton.dataset.title || 'WORLD MAP';
      mapInfoText.textContent = targetButton.dataset.description || 'Explore the digital universe.';
    }
  };

  mapButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');

    button.addEventListener('mouseenter', () => setActiveIsland(button));
    button.addEventListener('focus', () => setActiveIsland(button));
    button.addEventListener('click', () => {
      setActiveIsland(button);

      const targetId = button.dataset.target;
      const targetSection = targetId ? document.getElementById(targetId) : null;

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  if (profileTrigger) {
    profileTrigger.addEventListener('click', openProfileModal);
    profileTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProfileModal();
      }
    });
  }

  if (profileCloseButton) {
    profileCloseButton.addEventListener('click', closeProfileModal);
  }

  if (profileModal) {
    profileModal.addEventListener('click', (event) => {
      if (event.target && event.target.matches('[data-close-profile]')) {
        closeProfileModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !profileModal.hidden) {
        closeProfileModal();
      }
    });
  }

  if (storyButton) {
    storyButton.addEventListener('click', () => {
      closeProfileModal();

      const storySection = document.getElementById('about');
      if (storySection) {
        storySection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }

  const storyTabs = document.querySelectorAll('.story-tab');
  const storyPanels = document.querySelectorAll('.story-panel');

  storyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.storyTarget;
      if (!targetId) {
        return;
      }

      storyTabs.forEach((button) => {
        const isActive = button === tab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
      });

      storyPanels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    });
  });

  if (celestialCard) {
    celestialCard.addEventListener('click', triggerCelestialMessage);
    celestialCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        triggerCelestialMessage();
      }
    });
  }

  if (exploreButton && mapSection) {
    exploreButton.addEventListener('click', (event) => {
      event.preventDefault();
      mapSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }
});
