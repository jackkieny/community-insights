package routes

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackkieny/community-insights/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RequestAccessUser struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	WhatsappNumber string `json:"whatsappNumber"`
	CommunityLink  string `json:"communityLink"`
	Revenue        string `json:"revenue"`
}

func RequestAccessRoute(app *fiber.App, client *mongo.Client) {
	app.Post("/api/requestaccess", func(c *fiber.Ctx) error {
		log.Println("Received request access request")

		var user RequestAccessUser

		if err := c.BodyParser(&user); err != nil {
			log.Println("Error parsing JSON:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"serverError": "Cannot parse JSON",
			})
		}

		if user.Name == "" || user.Email == "" || user.CommunityLink == "" || user.Revenue == "" {
			log.Println("Missing required fields")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Missing required fields",
			})
		}

		user.Email = strings.ToLower(user.Email)
		log.Println("Convert email to lower case:", user.Email)

		if !auth.ValidateEmail(user.Email) {
			log.Println("Invalid email format:", user.Email)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}
		log.Println("Email validated:", user.Email)

		collection := client.Database("community_insights").Collection("requestAccess")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		log.Println("Checking if user already requested access")
		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err == nil {
			log.Println("User already requested access:", user.Email)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "User already requested access",
			})
		}
		log.Println("User has not requested access:", user.Email)

		log.Println("Inserting user into database")
		_, err = collection.InsertOne(ctx, bson.M{
			"name":           user.Name,
			"email":          user.Email,
			"whatsappNumber": user.WhatsappNumber,
			"communityLink":  user.CommunityLink,
			"revenue":        user.Revenue,
		})
		if err != nil {
			log.Println("Error inserting user into database:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error inserting user into database",
			})
		}

		log.Println("Access request made for user", user.Email)

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Request created",
		})
	})
}
