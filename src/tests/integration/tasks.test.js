const request = require("supertest");

const app = require("../../app");

describe("API de tarefas", () => {

    test("POST /tasks", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Comprar pão"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.title)
            .toBe("Comprar pão");

    });

});

describe("API de tarefas - validação", () => {

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
});