const repository = require("../../repositories/taskRepository");

describe("Task Repository", () => {

    beforeEach(() => {
        // Limpar o array de tarefas antes de cada teste
        repository.findAll().length = 0;
    });

    test("deve salvar uma tarefa", () => {
        const task = { id: 1, title: "Tarefa 1" };

        repository.save(task);
        const tasks = repository.findAll();

        expect(tasks).toContain(task);
        expect(tasks).toHaveLength(1);
    });

    test("deve salvar múltiplas tarefas", () => {
        const task1 = { id: 1, title: "Tarefa 1" };
        const task2 = { id: 2, title: "Tarefa 2" };
        const task3 = { id: 3, title: "Tarefa 3" };

        repository.save(task1);
        repository.save(task2);
        repository.save(task3);

        const tasks = repository.findAll();

        expect(tasks).toHaveLength(3);
        expect(tasks).toEqual([task1, task2, task3]);
    });

    test("deve retornar array vazio quando nenhuma tarefa foi salva", () => {
        const tasks = repository.findAll();

        expect(tasks).toEqual([]);
        expect(Array.isArray(tasks)).toBe(true);
    });

    test("deve manter ordem de inserção das tarefas", () => {
        const task1 = { id: 1, title: "Primeira" };
        const task2 = { id: 2, title: "Segunda" };
        const task3 = { id: 3, title: "Terceira" };

        repository.save(task1);
        repository.save(task2);
        repository.save(task3);

        const tasks = repository.findAll();

        expect(tasks[0]).toBe(task1);
        expect(tasks[1]).toBe(task2);
        expect(tasks[2]).toBe(task3);
    });

    test("deve retornar a mesma referência de array", () => {
        const task = { id: 1, title: "Tarefa" };
        repository.save(task);

        const tasks1 = repository.findAll();
        const tasks2 = repository.findAll();

        expect(tasks1).toBe(tasks2);
    });

});
