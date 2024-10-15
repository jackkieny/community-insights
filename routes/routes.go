package routes

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	app.Static("/", "./fe/build")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendFile("./fe/build/index.html")
	})
}
