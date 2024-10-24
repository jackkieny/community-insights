package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type Group struct {
	Archived     bool    `json:"archived"`
	Role         string  `json:"role"`
	ID           string  `json:"id"`
	Labels       []Label `json:"labels"`
	Name         string  `json:"name"`
	DisplayName  string  `json:"display_name"`
	TotalMembers int     `json:"total_members"`
	TotalPosts   int     `json:"total_posts"`
	LogoURL      string  `json:"logo_url"`
	Color        string  `json:"color"`
}

type Label struct {
	ID          string `json:"id"`
	DisplayName string `json:"display_name"`
	Color       string `json:"color"`
}

type MemberData struct {
	Role string `json:"role"`
}

func GetCommunities(authToken string) ([]Group, error) {
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("error loading .env file, %v", err)
	}

	communitiesURL := os.Getenv("SKOOL_COMMUNITIES_URL")
	labelsURL := os.Getenv("SKOOL_LABELS_URL")

	request, err := http.NewRequest("GET", communitiesURL, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.AddCookie(&http.Cookie{Name: "auth_token", Value: authToken})
	webClient := &http.Client{}
	response, err := webClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("did not receive 200 status code. Got %d", response.StatusCode)
	}

	var result map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		return nil, err
	}

	var communitiesList []Group

	communities := result["groups"].([]interface{})
	for _, group := range communities {
		groupMap := group.(map[string]interface{})
		metadata := groupMap["metadata"].(map[string]interface{})
		members := metadata["member"].(string)

		var memberData MemberData
		err = json.Unmarshal([]byte(members), &memberData)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling member data for community %s", metadata["display_name"].(string))
		}

		labelsList := []Label{}
		if memberData.Role == "group-admin" {
			fullLabelsURL := labelsURL + groupMap["id"].(string) + "/labels"

			labels_request, err := http.NewRequest("GET", fullLabelsURL, nil)
			if err != nil {
				return nil, err
			}

			labels_request.Header.Set("Content-Type", "application/json")
			labels_request.AddCookie(&http.Cookie{Name: "auth_token", Value: authToken})
			labels_resp, err := webClient.Do(labels_request)
			if err != nil {
				return nil, fmt.Errorf("error getting lables for community %s", metadata["display_name"].(string))
			}
			defer labels_resp.Body.Close()

			if labels_resp.StatusCode != http.StatusOK {
				return nil, fmt.Errorf("did not receive 200 status code. Got %d", labels_resp.StatusCode)
			}

			var labelsResult map[string]interface{}
			err = json.NewDecoder(labels_resp.Body).Decode(&labelsResult)
			if err != nil {
				return nil, fmt.Errorf("error decoding labels for community %s", metadata["display_name"].(string))
			}

			for _, label := range labelsResult["labels"].([]interface{}) {
				labelMap := label.(map[string]interface{})
				metadata := labelMap["metadata"].(map[string]interface{})

				labelObject := Label{
					ID:          labelMap["id"].(string),
					DisplayName: metadata["display_name"].(string),
					Color:       metadata["color"].(string),
				}
				labelsList = append(labelsList, labelObject)
			}
		}

		var archived bool = false
		var logoURL string = ""
		if metadata["archived"] != nil {
			archived = true
		}
		if metadata["logo_url"] != nil {
			logoURL = metadata["logo_url"].(string)
		}

		groupObject := Group{
			Archived:     archived,
			Role:         memberData.Role,
			ID:           groupMap["id"].(string),
			Labels:       labelsList,
			Name:         groupMap["name"].(string),
			DisplayName:  metadata["display_name"].(string),
			TotalMembers: int(metadata["total_members"].(float64)),
			TotalPosts:   int(metadata["total_posts"].(float64)),
			LogoURL:      logoURL,
			Color:        metadata["color"].(string),
		}
		communitiesList = append(communitiesList, groupObject)

	}

	return communitiesList, nil

}
