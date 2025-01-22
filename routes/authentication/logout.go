package authenticationRoutes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/rs/zerolog/log"
)

/*** PROTECTED ***/
func LogoutRoute(app *fiber.App, store *session.Store) {
	app.Post("/api/logout", func(c *fiber.Ctx) error {
		// Get the session
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

		// Destroy the session
		if err := sess.Destroy(); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error destroying session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		return c.SendString("Logged out")
	})
}
