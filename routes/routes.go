package routes

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	app.Static("/", "./fe/dist")

	app.Get("/", func(c *fiber.Ctx) error {
		// return c.SendString("Hello, World!")
		return c.SendFile("./fe/dist/index.html")
	})

	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./fe/dist/index.html")
	})
}
