// Command chat sends one chat completion request to TokenRa using only the standard library.
//
// Usage: go run ./chat "Your question"
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatResponse struct {
	Choices []struct {
		Message message `json:"message"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
	} `json:"usage"`
}

func main() {
	apiKey := os.Getenv("TOKENRA_API_KEY")
	if apiKey == "" {
		exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")
	}
	baseURL := strings.TrimRight(getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"), "/")
	model := getenv("TOKENRA_MODEL", "deepseek-v4.1-flash")
	prompt := strings.Join(os.Args[1:], " ")
	if prompt == "" {
		prompt = "Explain what an API gateway does in two sentences."
	}

	body, err := json.Marshal(map[string]any{
		"model": model,
		"messages": []message{
			{Role: "system", Content: "You are a concise technical assistant."},
			{Role: "user", Content: prompt},
		},
	})
	if err != nil {
		exit(err.Error())
	}
	req, err := http.NewRequest(http.MethodPost, baseURL+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		exit(err.Error())
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := (&http.Client{Timeout: 2 * time.Minute}).Do(req)
	if err != nil {
		exit(err.Error())
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		exit(err.Error())
	}
	if resp.StatusCode != http.StatusOK {
		exit(fmt.Sprintf("HTTP %d: %s", resp.StatusCode, raw))
	}

	var out chatResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		exit(err.Error())
	}
	if len(out.Choices) == 0 {
		exit(fmt.Sprintf("no choices in response: %s", raw))
	}
	fmt.Println(out.Choices[0].Message.Content)
	fmt.Printf("\n[%s] prompt_tokens=%d completion_tokens=%d\n", model, out.Usage.PromptTokens, out.Usage.CompletionTokens)
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func exit(msg string) {
	fmt.Fprintln(os.Stderr, msg)
	os.Exit(1)
}
