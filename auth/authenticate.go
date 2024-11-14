package auth

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

func Authenticate(store *session.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Println("Authenticating user from IP: ", c.IP())
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when retrieving the store",
			})
		}

		userId := sess.Get("userId")
		log.Println("userId: ", userId)
		if userId == nil {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		return c.Next()
	}
}
