const { test, expect } = require("@playwright/test");

test.describe("Aplicação de Tarefas - E2E", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3030");
    });

    test("deve carregar a página inicial", async ({ page }) => {
        const title = await page.title();
        expect(title).toBeDefined();
    });

    test("deve adicionar uma tarefa simples", async ({ page }) => {
        await page.fill("#title", "Estudar JavaScript");
        await page.click("button");

        // Usar last() para pegar o último item adicionado
        await expect(page.locator("li").last())
            .toContainText("Estudar JavaScript");
    });

    test("deve adicionar múltiplas tarefas", async ({ page }) => {
        // Adiciona primeira tarefa
        await page.fill("#title", "Tarefa 1");
        await page.click("button");
        await expect(page.locator("li").last()).toContainText("Tarefa 1");

        // Limpa o input
        await page.fill("#title", "");

        // Adiciona segunda tarefa
        await page.fill("#title", "Tarefa 2");
        await page.click("button");
        await expect(page.locator("li").last()).toContainText("Tarefa 2");

        // Limpa o input
        await page.fill("#title", "");

        // Adiciona terceira tarefa
        await page.fill("#title", "Tarefa 3");
        await page.click("button");
        await expect(page.locator("li").last()).toContainText("Tarefa 3");

        // Verifica que todas as tarefas estão visíveis
        const tasks = await page.locator("li").count();
        expect(tasks).toBeGreaterThanOrEqual(3);
    });

    test("deve adicionar tarefa com caracteres especiais", async ({ page }) => {
        const specialTitle = "Tarefa @#$%^&*()!";
        await page.fill("#title", specialTitle);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(specialTitle);
    });

    test("deve adicionar tarefa com espaços", async ({ page }) => {
        const titleWithSpaces = "Comprar pão e leite na padaria";
        await page.fill("#title", titleWithSpaces);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(titleWithSpaces);
    });

    test("deve ter campo de input com ID 'title'", async ({ page }) => {
        const input = page.locator("#title");
        await expect(input).toBeVisible();
    });

    test("deve ter um botão para adicionar tarefa", async ({ page }) => {
        const button = page.locator("button");
        await expect(button).toBeVisible();
    });

    test("deve limpar o campo de input após adicionar tarefa", async ({ page }) => {
        const input = page.locator("#title");

        await input.fill("Minha tarefa");
        await page.click("button");

        // Verifica que o input foi limpo
        const inputValue = await input.inputValue();
        expect(inputValue).toBe("");
    });

    test("deve manter tarefas após recarregamento da página", async ({ page }) => {
        const uniqueTitle = `Tarefa persistente ${Date.now()}`;

        // Adiciona uma tarefa
        await page.fill("#title", uniqueTitle);
        await page.click("button");
        await expect(page.locator("li").last()).toContainText(uniqueTitle);

        // Recarrega a página
        await page.reload();

        // Verifica que a tarefa ainda está lá
        const hasTask = await page.locator("li").filter({ hasText: uniqueTitle }).count();
        expect(hasTask).toBeGreaterThan(0);
    });

    test("deve ter lista de tarefas visível", async ({ page }) => {
        const list = page.locator("ul");
        await expect(list).toBeVisible();
    });

    test("deve adicionar tarefa com números", async ({ page }) => {
        const titleWithNumbers = `Estudar até ${new Date().getFullYear()}`;
        await page.fill("#title", titleWithNumbers);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(titleWithNumbers);
    });

    test("deve aceitar tarefas com emojis", async ({ page }) => {
        const titleWithEmoji = "Comprar pão 🍞";
        await page.fill("#title", titleWithEmoji);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(titleWithEmoji);
    });

    test("deve existir um elemento de lista para as tarefas", async ({ page }) => {
        await page.fill("#title", "Teste de estrutura");
        await page.click("button");

        const listItems = page.locator("li");
        const count = await listItems.count();

        expect(count).toBeGreaterThan(0);
    });

    test("deve adicionar tarefa com texto longo", async ({ page }) => {
        const longTitle = "Esta é uma tarefa muito longa com muitos caracteres para testar se o sistema consegue lidar com títulos extensos sem problema algum";
        await page.fill("#title", longTitle);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(longTitle);
    });

    test("deve preservar maiúsculas e minúsculas", async ({ page }) => {
        const mixedCaseTitle = "TaReFA Com MaIúScULaS";
        await page.fill("#title", mixedCaseTitle);
        await page.click("button");

        await expect(page.locator("li").last())
            .toContainText(mixedCaseTitle);
    });

});

test.describe("Aplicação de Tarefas - Validações E2E", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3030");
    });

    test("não deve adicionar tarefa vazia", async ({ page }) => {
        const initialCount = await page.locator("li").count();

        // Clica no botão sem preencher o campo
        await page.click("button");

        // Aguarda um pouco para validação
        await page.waitForTimeout(500);

        const finalCount = await page.locator("li").count();

        // Não deve ter adicionado nova tarefa
        expect(finalCount).toBe(initialCount);
    });

});
