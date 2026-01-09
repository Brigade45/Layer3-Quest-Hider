// Layer3 Quest Hider - Content Script
(function() {
  'use strict';

  const STORAGE_KEY = 'layer3_hidden_quests';

  // Get hidden quests from localStorage
  function getHiddenQuests() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  // Save hidden quests to localStorage
  function saveHiddenQuests(quests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
  }

  // Extract quest ID (from link or unique text combination)
  function getQuestId(card) {
    // Use link if available
    const link = card.querySelector('a[href*="/quests/"]');
    if (link) {
      return link.getAttribute('href');
    }

    // Otherwise use title text
    const title = card.querySelector('h2, h3, [class*="title"]');
    if (title) {
      return 'title:' + title.textContent.trim();
    }

    // Last resort: hash the entire text
    return 'text:' + card.textContent.trim().substring(0, 100);
  }

  // Create hide button
  function createHideButton() {
    const btn = document.createElement('button');
    btn.className = 'l3-hide-btn';
    btn.innerHTML = '×';
    btn.title = 'Hide this quest';
    return btn;
  }

  // Process quest cards
  function processCards() {
    const hiddenQuests = getHiddenQuests();

    // Find quest cards on Layer3 (trying different selectors)
    const selectors = [
      '[class*="QuestCard"]',
      '[class*="quest-card"]',
      '[class*="Card"]',
      'a[href*="/quests/"]',
      '[data-testid*="quest"]',
      'article',
      '.group' // Tailwind group class
    ];

    let cards = [];

    // Find main card containers
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // If this is a card-like element
        if (el.offsetHeight > 100 && el.offsetWidth > 100) {
          // Not already processed and not added as a parent
          if (!el.classList.contains('l3-processed') && !el.querySelector('.l3-hide-btn')) {
            cards.push(el);
          }
        }
      });
    });

    // If no cards found, try a general approach
    if (cards.length === 0) {
      // Find large elements within grid or list
      document.querySelectorAll('div').forEach(div => {
        if (div.offsetHeight > 150 &&
            div.offsetWidth > 200 &&
            div.offsetHeight < 500 &&
            div.children.length > 0 &&
            !div.classList.contains('l3-processed') &&
            !div.querySelector('.l3-hide-btn') &&
            (div.textContent.includes('Collect') ||
             div.textContent.includes('Quest') ||
             div.textContent.includes('Mint') ||
             div.querySelector('img'))) {

          // Check if any parent is already processed
          let hasProcessedParent = false;
          let parent = div.parentElement;
          while (parent) {
            if (parent.classList.contains('l3-processed')) {
              hasProcessedParent = true;
              break;
            }
            parent = parent.parentElement;
          }

          if (!hasProcessedParent) {
            cards.push(div);
          }
        }
      });
    }

    cards.forEach(card => {
      // Skip if already processed
      if (card.classList.contains('l3-processed')) return;

      const questId = getQuestId(card);

      // Check if in hidden list
      if (hiddenQuests.includes(questId)) {
        card.style.display = 'none';
        card.classList.add('l3-hidden');
        return;
      }

      // Set position
      const computedStyle = window.getComputedStyle(card);
      if (computedStyle.position === 'static') {
        card.style.position = 'relative';
      }

      // Add hide button
      const hideBtn = createHideButton();
      hideBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const hidden = getHiddenQuests();
        hidden.push(questId);
        saveHiddenQuests(hidden);

        // Animated hiding
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
          card.style.display = 'none';
          card.classList.add('l3-hidden');
        }, 300);
      });

      card.appendChild(hideBtn);
      card.classList.add('l3-processed');
    });
  }

  // Create control panel for hidden quests
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'l3-control-panel';
    panel.innerHTML = `
      <button class="l3-panel-toggle" title="Layer3 Hider Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke-width="2"/>
        </svg>
      </button>
      <div class="l3-panel-content">
        <h3>🙈 Hidden Quests</h3>
        <p class="l3-hidden-count">0 quests hidden</p>
        <button class="l3-show-all">Show All</button>
      </div>
    `;

    document.body.appendChild(panel);

    const toggle = panel.querySelector('.l3-panel-toggle');
    const content = panel.querySelector('.l3-panel-content');
    const showAllBtn = panel.querySelector('.l3-show-all');
    const countText = panel.querySelector('.l3-hidden-count');

    function updateCount() {
      const count = getHiddenQuests().length;
      countText.textContent = `${count} quests hidden`;
    }

    toggle.addEventListener('click', () => {
      content.classList.toggle('visible');
      updateCount();
    });

    showAllBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      document.querySelectorAll('.l3-hidden').forEach(el => {
        el.style.display = '';
        el.style.opacity = '1';
        el.style.transform = '';
        el.classList.remove('l3-hidden');
      });
      updateCount();
      content.classList.remove('visible');

      // Re-process the page
      document.querySelectorAll('.l3-processed').forEach(el => {
        el.classList.remove('l3-processed');
        const btn = el.querySelector('.l3-hide-btn');
        if (btn) btn.remove();
      });
      setTimeout(processCards, 100);
    });

    updateCount();
  }

  // Initialize when page loads and on changes
  function init() {
    createControlPanel();
    processCards();

    // Watch for DOM changes (for lazy loading)
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });
      if (shouldProcess) {
        setTimeout(processCards, 200);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check on scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(processCards, 300);
    });
  }

  // Start when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
