// Каждая задача - это объект
export const Storage = {
    saveTasks(tasks) {
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    },

    loadTasks() {
        const tasks = localStorage.getItem('todo_tasks');
        return tasks ? JSON.parse(tasks) : [];
    },

    // Имитация внешнего API (загрузка базовых задач)
    async fetchMockTasks() {
        // Можно использовать реальный JSONPlaceholder или просто вернуть Promise
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, text: "Изучить модули в JS", priority: "high", completed: false, createdAt: Date.now() }
                ]);
            }, 500);
        });
    }
};