package routes

import (
    "context"
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/session"
    "github.com/jackkieny/community-insights/auth"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Post("/api/login", func(c *fiber.Ctx) error {

		var user LoginUser

		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot parse JSON",
			})
		}

		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}

		if !auth.CheckPasswordHash(user.Password, result["password"].(string)) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}

		// Create a new session using the mongo document id
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot get session details",
			})
		}

		userId := result["_id"].(primitive.ObjectID).Hex()
		sess.Set("userId", userId)
		if err := sess.Save(); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal error when creating session",
			})
		}

		return c.JSON(fiber.Map{
			"message": "Success",
		})

	})

}
