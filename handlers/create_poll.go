package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type CreatePollPayload struct {
	GroupId string   `json:"group_id"`
	Options []string `json:"options"`
}

func CreatePoll(pollOptions []string, currentCommunity, authToken string) (string, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		return "", fmt.Errorf("error loading .env file, %v", err)
	}

	url := os.Getenv("SKOOL_POLL_URL")

	// Create payload
	payload := CreatePollPayload{
		GroupId: currentCommunity,
		Options: pollOptions,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("error marshalling payload, %v", err)
	}

	// Create request
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", err
	}

	request.Header.Set("Content-Type", "application/json")
	request.AddCookie(&http.Cookie{Name: "auth_token", Value: authToken})
	webClient := &http.Client{}

	// Send request
	response, err := webClient.Do(request)
	if err != nil {
		return "", fmt.Errorf("error sending request, %v", err)
	}
	defer response.Body.Close()

	// Check status code
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("did not receive 200 status code. Got %d", response.StatusCode)
	}

	// Read response body
	var result map[string]interface{}
	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("error decoding response body, %v", err)
	}

	pollId := result["poll_id"].(string)

	return pollId, nil
}

func DeletePoll() int {
	// Skeleton for later
	return 0
}
