package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	_ "github.com/pgchatchawan/product-barcode-management/backend/docs"
	"github.com/pgchatchawan/product-barcode-management/backend/internal/app"
)

// @title Product Barcode Management API
// @version 1.0
// @description API สำหรับจัดการรหัสสินค้าและบาร์โค้ด (Code 39)
// @BasePath /api/v1
func main() {
	_ = godotenv.Load()

	router := app.NewRouter()

	log.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
