export const Render = {
    // Динамическое создание элементов списка 
    renderList(tasks, container) {
        container.innerHTML = ''; // Очистка

        if (tasks.length === 0) {
            container.innerHTML = '<li class="empty-list">Список задач пуст</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="toggle-status">
                <span class="task-text">${this.escapeHTML(task.text)}</span>
                <button class="delete-btn">&times;</button>
            `;

            container.appendChild(li);
        });
    },

    // Защита от XSS (ввода скриптов пользователем)
    escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },

    showValidationError(message, errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    },

    clearValidationError(errorContainer) {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
    }
};