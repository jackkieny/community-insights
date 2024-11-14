package routes

import (
	"context"
	"log"
	"strings"
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
		log.Println("Received login request")

		var user LoginUser

		if err := c.BodyParser(&user); err != nil {
			log.Println("Error parsing JSON:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"serverError": "Cannot parse JSON",
			})
		}
		log.Println("Parsed user data:", user)

		if !auth.ValidateEmail(user.Email) {
			log.Println("Invalid email format:", user.Email)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}
		log.Println("Validated email format:", user.Email)

		user.Email = strings.ToLower(user.Email)
		log.Println("Converted email to lower case:", user.Email)

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err != nil {
			log.Println("Error finding user in database:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}
		log.Println("Found user in database:", user.Email)

		if !auth.CheckPasswordHash(user.Password, result["password"].(string)) {
			log.Println("Password does not match for user:", user.Email)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}
		log.Println("Password matched for user:", user.Email)

		// Create a new session using the mongo document id
		sess, err := store.Get(c)
		if err != nil {
			log.Println("Error getting session details:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"serverError": "Cannot get session details",
			})
		}
		log.Println("Session created")

		userId := result["_id"].(primitive.ObjectID).Hex()
		sess.Set("userId", userId)
		if err := sess.Save(); err != nil {
			log.Println("Error saving session:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"serverError": "Internal error when creating session",
			})
		}
		log.Println("Session saved for user:", userId)

		return c.JSON(fiber.Map{
			"message": "Success",
		})
	})
}
