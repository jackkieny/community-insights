package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
    "github.com/rs/zerolog/log"
)

func LogoutRoute(app *fiber.App, store *session.Store) {
	app.Use("/api/logout", auth.Authenticate(store))
	app.Post("/api/logout", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
            log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
        }

		if err := sess.Destroy(); err != nil {
            log.Error().Err(err).Str("route", c.Path()).Msg("Error destroying session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
        }

		return c.SendString("Logged out")
	})
}
