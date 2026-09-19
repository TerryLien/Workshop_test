# Changelog

## [0.1.0] - Step 1: add / complete / delete items, remaining counter, localStorage persistence

### Added
- Added a to-do input field and an Add button for creating new tasks.
- Added support for creating new to-do items and rendering them in the list immediately.
- Added checkboxes and delete buttons for each task.
- Added a remaining-items counter displayed at the bottom of the app.
- Added an empty-state message for when no tasks exist.

### Changed
- Completed tasks now display with a strikethrough and reduced opacity.
- Deleting a task updates the list and the remaining counter in real time.
- Empty or whitespace-only input is ignored so no blank tasks are created.
- Task data is saved to localStorage so items remain after a page refresh.

## [0.2.0] - Step 2: dark mode toggle (with saved preference and OS-setting fallback), All/Active/Completed filters

### Added
- Added a dark mode toggle button for switching between light and dark themes.
- Added All, Active, and Completed filters for managing task visibility.
- Added filtered task views so users can focus on different task states quickly.

### Changed
- Dark mode preference is remembered so the selected theme persists across reloads.
- If no manual theme preference is set, the app follows the system light/dark setting automatically.
- The task rendering logic was updated to respect the current filter selection.
- The remaining count continues to reflect unfinished tasks regardless of which filter is active.
