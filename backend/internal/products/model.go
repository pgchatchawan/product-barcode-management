	package products

import "time"

type Product struct {
	ID        int       `json:"id" example:"1"`
	Code      string    `json:"code" example:"ABCD-1234-EFGH-5678"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateProductRequest struct {
	Code string `json:"code" example:"ABCD-1234-EFGH-5678"`
}

type ErrorResponse struct {
	Message string `json:"message" example:"invalid product code"`
}

type APIResponse struct {
	StatusCode int    `json:"statusCode"`
	Data       any    `json:"data,omitempty"`
	Message    string `json:"message,omitempty"`
}

