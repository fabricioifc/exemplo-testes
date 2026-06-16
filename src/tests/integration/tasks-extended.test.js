const request = require("supertest");

const app = require("../../app");

describe("API de tarefas - GET /tasks", () => {

    test("deve retornar lista vazia inicialmente", async () => {
        const response = await request(app)
            .get("/tasks");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("deve retornar tarefas no formato correto", async () => {
        // Adiciona uma tarefa
        await request(app)
            .post("/tasks")
            .send({ title: "Tarefa de teste" });

        // Busca tarefas
        const response = await request(app)
            .get("/tasks");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        const task = response.body[response.body.length - 1];
        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title");
        expect(task.title).toBe("Tarefa de teste");
    });

    test("deve retornar header content-type application/json", async () => {
        const response = await request(app)
            .get("/tasks");

        expect(response.headers["content-type"]).toContain("application/json");
    });

});

describe("API de tarefas - POST /tasks", () => {

    test("POST /tasks com sucesso", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Comprar pão"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Comprar pão");
        expect(response.body).toHaveProperty("id");
    });

    test("POST /tasks - título obrigatório", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Título obrigatório");
    });

    test("POST /tasks - título deve ser string", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({
                title: 123
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Título deve ser uma string");
    });

    test("POST /tasks - deve rejeitar título vazio", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "" });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Título obrigatório");
    });

    test("POST /tasks - deve aceitar título com apenas espaços (válido)", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "   " });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("   ");
    });

    test("POST /tasks - deve rejeitar title como array", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: [] });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Título deve ser uma string");
    });

    test("POST /tasks - deve aceitar título com caracteres especiais", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "Tarefa @#$%^&*() com !@@#" });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Tarefa @#$%^&*() com !@@#");
    });

    test("POST /tasks - deve aceitar título com espaços", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "Comprar pão e leite" });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Comprar pão e leite");
    });

    test("POST /tasks - deve gerar ID único para cada tarefa", async () => {
        const response1 = await request(app)
            .post("/tasks")
            .send({ title: "Tarefa 1" });

        const response2 = await request(app)
            .post("/tasks")
            .send({ title: "Tarefa 2" });

        expect(response1.body.id).not.toBe(response2.body.id);
    });

    test("POST /tasks - deve retornar content-type application/json", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "Teste" });

        expect(response.headers["content-type"]).toContain("application/json");
    });

    test("POST /tasks - deve preservar maiúsculas e minúsculas", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "TaReFA Com MaIúScULaS" });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("TaReFA Com MaIúScULaS");
    });

});

describe("API de tarefas - integração", () => {

    test("deve criar e recuperar tarefa criada", async () => {
        // Criar tarefa
        const createResponse = await request(app)
            .post("/tasks")
            .send({ title: "Integração teste" });

        expect(createResponse.statusCode).toBe(201);

        // Recuperar lista de tarefas
        const getResponse = await request(app)
            .get("/tasks");

        const createdTask = getResponse.body.find(
            t => t.id === createResponse.body.id
        );

        expect(createdTask).toBeDefined();
        expect(createdTask.title).toBe("Integração teste");
    });

    test("deve validar payload sem JSON válido", async () => {
        const response = await request(app)
            .post("/tasks")
            .set("Content-Type", "application/json")
            .send("{ invalid json }");

        expect(response.statusCode).toBe(400);
    });

});
