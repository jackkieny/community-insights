package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
)

func SessionRoute(app *fiber.App, store *session.Store) {
	app.Use("/api/session", auth.Authenticate(store))
	app.Get("/api/session", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).SendString("Session is active")
	})
}
