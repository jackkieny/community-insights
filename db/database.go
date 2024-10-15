package db

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Init() *mongo.Client {
	log.Println("Connecting to MongoDB...")

	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file %s", err)
	}

	MONGO_URI := os.Getenv("MONGO_URI")

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(MONGO_URI).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %s", err)
	}

	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
		log.Fatalf("Error when trying to ping MongoDB: %s", err)
	}

	log.Println("Connected to MongoDB!")

	return client
}
