package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
    "github.com/jackkieny/community-insights/auth"
)

func LogoutRoute(app *fiber.App, store *session.Store) {
    app.Use("/api/logout", auth.Authenticate(store)) 
    app.Get("/api/logout", func(c *fiber.Ctx) error {
        sess, err := store.Get(c)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Cannot get session",
            })
        }

        if err := sess.Destroy(); err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not delete the session",
            })
        }

        return c.SendString("Logged out")
    })
}
