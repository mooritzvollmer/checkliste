const openModalBtn = document.getElementById("openModal");
        const modal = document.getElementById("modal");
        const overlay = document.getElementById("modalOverlay");
        const saveBtn = document.getElementById("saveSettings");
        const darkModeCheckbox = document.getElementById("darkMode");
        const easyLanguageCheckbox = document.getElementById("easyLanguage");
        const largeTextCheckbox = document.getElementById("largeText");

        function toggleModal(show) {
            if (show) {
                modal.classList.remove("hidden");
                overlay.classList.remove("hidden");
                document.body.classList.add("modal-open");
            } else {
                modal.classList.add("hidden");
                overlay.classList.add("hidden");
                document.body.classList.remove("modal-open");
            }
        }

        function updateBodyClass(checkbox, className) {
            if (checkbox.checked) {
                document.body.classList.add(className);
            } else {
                document.body.classList.remove(className);
            }
        }

        openModalBtn.addEventListener("click", () => toggleModal(true));
        overlay.addEventListener("click", () => toggleModal(false));

        darkModeCheckbox.addEventListener("change", () => updateBodyClass(darkModeCheckbox, "dark-mode"));
        easyLanguageCheckbox.addEventListener("change", () => updateBodyClass(easyLanguageCheckbox, "easy-language"));
        largeTextCheckbox.addEventListener("change", () => updateBodyClass(largeTextCheckbox, "large-text"));

        saveBtn.addEventListener("click", () => toggleModal(false));


// AKKORDEON

// Funktion, um das Akkordeon zu steuern
function setupAccordion() {
    const panels = document.querySelectorAll('.panel');
  
    panels.forEach((panel) => {
      const trigger = panel.querySelector('.panel-trigger');
      const content = panel.querySelector('.panel-content');
  
      // CSS-Übergangseffekt hinzufügen
      content.style.transition = 'max-height 0.2s ease';
      content.style.maxHeight = '0px';
  
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
  
        // Alle Panels schließen
        panels.forEach((otherPanel) => {
          if (otherPanel !== panel) {
            const otherTrigger = otherPanel.querySelector('.panel-trigger');
            const otherContent = otherPanel.querySelector('.panel-content');
            otherContent.style.maxHeight = '0px';
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
  
        if (expanded) {
          // Das aktuelle Panel schließen
          content.style.maxHeight = '0px';
        } else {
          // Das aktuelle Panel öffnen
          content.style.maxHeight = content.scrollHeight + '500px';
        }
  
        // Trigger-Zustand aktualisieren
        trigger.setAttribute('aria-expanded', !expanded);
      });
    });
  }
  
  // Das Akkordeon-Setup ausführen, wenn das DOM geladen ist
  document.addEventListener('DOMContentLoaded', () => {
    setupAccordion();
  });
  




  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".panel").forEach(panel => {
        const progressBar = panel.querySelector(".progress-bar");
        const checkboxes = panel.querySelectorAll("input[type='checkbox']");
        const panelId = panel.getAttribute("data-panel-id");

        function updateProgress() {
            const checkedCount = panel.querySelectorAll("input[type='checkbox']:checked").length;
            const totalCount = checkboxes.length;
            const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            saveProgressState(panelId, progress);
        }

        function saveProgressState(panelId, progress) {
            let progressStates = JSON.parse(localStorage.getItem("progressStates")) || {};
            progressStates[panelId] = progress;
            localStorage.setItem("progressStates", JSON.stringify(progressStates));
        }

        function loadProgressState(panelId) {
            let progressStates = JSON.parse(localStorage.getItem("progressStates")) || {};
            if (progressStates[panelId] !== undefined) {
                progressBar.style.width = `${progressStates[panelId]}%`;
            }
        }

        loadProgressState(panelId);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                updateProgress();
                saveCheckboxState();
            });
        });
    });

    const checkboxes = document.querySelectorAll(".check-for-progress");
    const globalScoreElement = document.getElementById("global-score");

    function saveCheckboxState() {
        const checkboxStates = {};
        checkboxes.forEach(checkbox => {
            checkboxStates[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
        updateGlobalScore();
    }

    function loadCheckboxState() {
        const savedStates = localStorage.getItem("checkboxStates");
        if (savedStates) {
            const checkboxStates = JSON.parse(savedStates);
            checkboxes.forEach(checkbox => {
                if (checkboxStates.hasOwnProperty(checkbox.id)) {
                    checkbox.checked = checkboxStates[checkbox.id];
                }
            });
        }
        updateGlobalScore();
    }

    function updateGlobalScore() {
        const checkedCount = document.querySelectorAll(".check-for-progress:checked").length;
        const totalCount = checkboxes.length;
        const score = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
        globalScoreElement.textContent = `${score}%`;
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", saveCheckboxState);
    });

    document.getElementById("reset-checkboxes").addEventListener("click", function () {
        localStorage.removeItem("checkboxStates");
        localStorage.removeItem("progressStates");

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        document.querySelectorAll(".panel").forEach(panel => {
            const progressBar = panel.querySelector(".progress-bar");
            if (progressBar) {
                progressBar.style.width = "0%";
            }
        });

        globalScoreElement.textContent = "Dein Fortschritt: 0%";
    });

    loadCheckboxState();
    document.querySelectorAll(".panel").forEach(panel => {
        const panelId = panel.getAttribute("data-panel-id");
        loadProgressState(panelId);
    });
});


