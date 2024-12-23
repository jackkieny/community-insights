package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/rs/zerolog/log"
)

func SessionRoute(app *fiber.App, store *session.Store) {
	app.Get("/api/session", func(c *fiber.Ctx) error {

		// Get all sessions
		sess, err := store.Get(c)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Check the user is logged in
		userId := sess.Get("userId")
		if userId == nil {
			log.Warn().Str("route", c.Path()).Str("IP", c.IP()).Msg("Unauthorized access attempt")
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		return c.Status(fiber.StatusOK).SendString("Session is active")
	})
}
