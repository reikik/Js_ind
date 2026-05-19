import { Storage } from './storage.js';
import { Render } from './render.js';

// Состояние приложения (Массив объектов)
let tasks = Storage.loadTasks();
let taskToDeleteId = null; // Для модального окна

// DOM Элементы
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const errorContainer = document.getElementById('error-message');
const todoListContainer = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');

// --- Функция фильтрации, сортировки и поиска ---
function updateApp() {
    let filtered = [...tasks];

    // 1. Поиск
    const searchLog = searchInput.value.toLowerCase().trim();
    if (searchLog) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(searchLog));
    }

    // 2. Фильтрация по статусу
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    if (activeFilter === 'active') filtered = filtered.filter(t => !t.completed);
    if (activeFilter === 'completed') filtered = filtered.filter(t => t.completed);

    // 3. Сортировка
    const sortBy = sortSelect.value;
    if (sortBy === 'date-desc') filtered.sort((a, b) => b.createdAt - a.createdAt);
    if (sortBy === 'date-asc') filtered.sort((a, b) => a.createdAt - b.createdAt);
    if (sortBy === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => weight[b.priority] - weight[a.priority]);
    }

    Render.renderList(filtered, todoListContainer);
    Storage.saveTasks(tasks);
}

// --- Обработчики Событий ---

// Добавление задачи + Валидация
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    // Валидация 
    if (!text) {
        Render.showValidationError('Поле не может быть пустым!', errorContainer);
        return;
    }
    if (text.length < 3) {
        Render.showValidationError('Название задачи должно быть минимум 3 символа!', errorContainer);
        return;
    }

    Render.clearValidationError(errorContainer);

    const newTask = {
        id: Date.now(),
        text,
        priority: prioritySelect.value,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    taskInput.value = '';
    updateApp();
});

// Клик по элементам списка
todoListContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    const id = Number(item.dataset.id);

    // Переключение статуса
    if (e.target.classList.contains('toggle-status')) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        updateApp();
    }

    // Удаление (вызов модального окна)
    if (e.target.classList.contains('delete-btn')) {
        taskToDeleteId = id;
        modal.classList.remove('hidden'); // Показываем модалку
    }
});

// Модальное окно: подтверждение
document.getElementById('modal-confirm').addEventListener('click', () => {
    if (taskToDeleteId) {
        tasks = tasks.filter(t => t.id !== taskToDeleteId);
        taskToDeleteId = null;
        modal.classList.add('hidden');
        updateApp();
    }
});

document.getElementById('modal-close').addEventListener('click', () => {
    taskToDeleteId = null;
    modal.classList.add('hidden');
});

// Поиск, сортировка и фильтры
searchInput.addEventListener('input', updateApp);
sortSelect.addEventListener('change', updateApp);

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        updateApp();
    });
});

// Инициализация при запуске
window.addEventListener('DOMContentLoaded', async () => {
    if (tasks.length === 0) {
        // Если локально пусто, подтянем "из сети" 
        tasks = await Storage.fetchMockTasks();
    }
    updateApp();
});