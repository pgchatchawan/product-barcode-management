package app

import (
	"encoding/json"
	"net/http"
)

type SuccessResponse struct {
	StatusCode int `json:"statusCode"`
	Data       any `json:"data,omitempty"`
}

type ErrorResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func write(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

/* ---------- Success ---------- */

func OK(w http.ResponseWriter, data any) {
	write(w, http.StatusOK, SuccessResponse{
		StatusCode: http.StatusOK,
		Data:       data,
	})
}

func Created(w http.ResponseWriter, data any) {
	write(w, http.StatusCreated, SuccessResponse{
		StatusCode: http.StatusCreated,
		Data:       data,
	})
}

/* ---------- Error ---------- */

func BadRequest(w http.ResponseWriter, message string) {
	write(w, http.StatusBadRequest, ErrorResponse{
		StatusCode: http.StatusBadRequest,
		Message:    message,
	})
}

func InternalError(w http.ResponseWriter) {
	write(w, http.StatusInternalServerError, ErrorResponse{
		StatusCode: http.StatusInternalServerError,
		Message:    "Internal server error",
	})
}
