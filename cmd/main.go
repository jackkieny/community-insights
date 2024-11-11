package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/db"
	"github.com/jackkieny/community-insights/routes"
)

func main() {

	client := db.Init()

	app := fiber.New()
	store := session.New()

	routes.Setup(app)
	routes.LoginRoute(app, client, store)
	routes.RegisterRoute(app, client)
	routes.LogoutRoute(app, store)
	routes.RequestAccessRoute(app, client)
	routes.SkoolLoginRoute(app, client, store)

	log.Fatal(app.Listen(":5000"))
}
