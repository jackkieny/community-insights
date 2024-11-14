package routes

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
)

func LogoutRoute(app *fiber.App, store *session.Store) {
	app.Use("/api/logout", auth.Authenticate(store))
	app.Post("/api/logout", func(c *fiber.Ctx) error {
		log.Println("Logout route accessed")

		sess, err := store.Get(c)
		if err != nil {
			log.Println("Error getting session:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot get session",
			})
		}

		if err := sess.Destroy(); err != nil {
			log.Println("Error destroying session:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Could not delete the session",
			})
		}

		log.Println("User logged out successfully")
		return c.SendString("Logged out")
	})
}
