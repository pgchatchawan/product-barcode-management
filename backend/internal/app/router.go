package app

import (
	"net/http"

	httpSwagger "github.com/swaggo/http-swagger/v2"

	"github.com/pgchatchawan/product-barcode-management/backend/internal/products"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()

	// health
	mux.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
})


	// swagger
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	// products
	products.RegisterRoutes(mux)

	return mux
}
