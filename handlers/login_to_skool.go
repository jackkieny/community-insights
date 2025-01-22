package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginToSkool(email, password string) (string, error) {
	if err := godotenv.Load(); err != nil {
		return "", fmt.Errorf("error loading .env file, %v", err)
	}

	url := os.Getenv("SKOOL_LOGIN_URL")

	payload := LoginPayload{
		Email:    email,
		Password: password,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("error marshalling payload, %v", err)
	}

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", fmt.Errorf("error creating request, %v", err)
	}

	request.Header.Set("Content-Type", "application/json")

	webClient := &http.Client{}
	response, err := webClient.Do(request)
	if err != nil {
		return "", fmt.Errorf("error sending request, %v", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("did not receive 200 status code. Got %d", response.StatusCode)
	}

	cookies := response.Cookies()
	for _, cookie := range cookies {
		if cookie.Name == "auth_token" {
			return cookie.Value, nil
		}
	}

	return "", fmt.Errorf("could not find auth_token in response")
}
