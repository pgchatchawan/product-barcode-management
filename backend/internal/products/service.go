package products

import (
	"errors"
	"regexp"
	"strings"
)

var (
	// XXXX-XXXX-XXXX-XXXX (A-Z, 0-9) รวม 16 ตัว + ขีด 3 ตำแหน่ง
	codePattern = regexp.MustCompile(`^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$`)
)

type Service struct {
	repo Repo
}

func NewService(repo Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) List() []Product {
	return s.repo.List()
}

func (s *Service) Create(code string) (Product, error) {
	code = strings.TrimSpace(code)
	code = strings.ToUpper(code)

	if !codePattern.MatchString(code) {
		return Product{}, errors.New("invalid product code format (XXXX-XXXX-XXXX-XXXX)")
	}

	p := s.repo.Create(code)
	return p, nil
}

func (s *Service) Delete(id int) error {
	return s.repo.Delete(id)
}
