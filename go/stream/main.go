// Command stream prints a chat completion as it is generated (Server-Sent Events),
// using only the standard library.
//
// Usage: go run ./stream "Your question"
package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

// Reasoning models stream their thinking first in delta.reasoning_content,
// so the answer printed below can take a few seconds to start.
type chunk struct {
	Choices []struct {
		Delta struct {
			Content string `json:"content"`
		} `json:"delta"`
	} `json:"choices"`
	Usage *struct {
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
		prompt = "Write a four-line poem about shipping code on Friday."
	}

	body, err := json.Marshal(map[string]any{
		"model":          model,
		"messages":       []map[string]string{{"role": "user", "content": prompt}},
		"stream":         true,
		"stream_options": map[string]bool{"include_usage": true},
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
	req.Header.Set("Accept", "text/event-stream")

	// No client timeout: a long answer can legitimately stream for minutes.
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		exit(err.Error())
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		exit(fmt.Sprintf("HTTP %d: %s", resp.StatusCode, raw))
	}

	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 4*1024*1024)
	for scanner.Scan() {
		data, ok := strings.CutPrefix(scanner.Text(), "data:")
		if !ok {
			continue // blank separators and SSE comments
		}
		data = strings.TrimSpace(data)
		if data == "[DONE]" {
			break
		}
		var c chunk
		if err := json.Unmarshal([]byte(data), &c); err != nil {
			exit(fmt.Sprintf("bad chunk %q: %v", data, err))
		}
		if len(c.Choices) > 0 {
			fmt.Print(c.Choices[0].Delta.Content)
		}
		if c.Usage != nil {
			fmt.Printf("\n\n[%s] prompt_tokens=%d completion_tokens=%d", model, c.Usage.PromptTokens, c.Usage.CompletionTokens)
		}
	}
	fmt.Println()
	if err := scanner.Err(); err != nil {
		exit(err.Error())
	}
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
