package products

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func readJSON(r *http.Request, out any) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	return dec.Decode(out)
}

// helper: success
func ok(w http.ResponseWriter, status int, data any) {
	writeJSON(w, status, APIResponse{
		StatusCode: status,
		Data:       data,
	})
}

// helper: error
func fail(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, APIResponse{
		StatusCode: status,
		Message:    message,
	})
}

// ListProducts godoc
// @Summary List products
// @Description ดึงรายการรหัสสินค้าและบาร์โค้ดทั้งหมดในระบบ
// @Tags products
// @Produce json
// @Success 200 {object} products.APIResponse "ดึงรายการสินค้าสำเร็จ"
// @Router /products [get]
func (h *Handler) ListProducts(w http.ResponseWriter, r *http.Request) {
	items := h.svc.List()
	ok(w, http.StatusOK, items)
}

// CreateProduct godoc
// @Summary Create product
// @Description เพิ่มรหัสสินค้าและสร้างบาร์โค้ดตามมาตรฐาน Code 39
// @Tags products
// @Accept json
// @Produce json
// @Param payload body products.CreateProductRequest true "รหัสสินค้า"
// @Success 201 {object} products.APIResponse "สร้างบาร์โค้ดสำเร็จ"
// @Failure 400 {object} products.APIResponse "ข้อมูลไม่ถูกต้อง"
// @Failure 500 {object} products.APIResponse "เกิดข้อผิดพลาดภายในระบบ"
// @Router /products [post]
func (h *Handler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req CreateProductRequest
	if err := readJSON(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "invalid json")
		return
	}

	p, err := h.svc.Create(req.Code)
	if err != nil {
		fail(w, http.StatusBadRequest, err.Error())
		return
	}

	ok(w, http.StatusCreated, p)
}

// DeleteProduct godoc
// @Summary Delete product
// @Description ลบรหัสสินค้าออกจากระบบตาม ID
// @Tags products
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} products.APIResponse "ลบข้อมูลสำเร็จ"
// @Failure 400 {object} products.APIResponse "ID ไม่ถูกต้อง"
// @Failure 404 {object} products.APIResponse "ไม่พบข้อมูล"
// @Failure 500 {object} products.APIResponse "เกิดข้อผิดพลาดภายในระบบ"
// @Router /products/{id} [delete]
func (h *Handler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		fail(w, http.StatusNotFound, "not found")
		return
	}

	id, err := strconv.Atoi(parts[3])
	if err != nil || id <= 0 {
		fail(w, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.svc.Delete(id); err != nil {
		if err == ErrNotFound {
			fail(w, http.StatusNotFound, "not found")
			return
		}
		fail(w, http.StatusInternalServerError, "server error")
		return
	}

	writeJSON(w, http.StatusOK, APIResponse{
		StatusCode: http.StatusOK,
		Message:    "Delete barcode success",
	})
}
