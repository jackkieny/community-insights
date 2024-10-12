package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/jackkieny/community-insights/db"
	"github.com/jackkieny/community-insights/routes"
)

func main() {

	client := db.Init()

	app := fiber.New()

	routes.Setup(app)
	routes.RegisterRoute(app, client)

	log.Fatal(app.Listen(":5000"))
}
