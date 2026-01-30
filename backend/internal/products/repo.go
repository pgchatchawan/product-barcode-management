package products

import (
	"errors"
	"sort"
	"sync"
	"time"
)

var ErrNotFound = errors.New("not found")

type Repo interface {
	List() []Product
	Create(code string) Product
	Delete(id int) error
}

type memoryRepo struct {
	mu     sync.Mutex
	nextID int
	items  map[int]Product
}

func NewMemoryRepo() Repo {
	return &memoryRepo{
		nextID: 1,
		items:  make(map[int]Product),
	}
}

func (r *memoryRepo) List() []Product {
	r.mu.Lock()
	defer r.mu.Unlock()

	out := make([]Product, 0, len(r.items))
	for _, p := range r.items {
		out = append(out, p)
	}

	// เรียงล่าสุดขึ้นบน (id มาก -> บน)
	sort.Slice(out, func(i, j int) bool { return out[i].ID > out[j].ID })
	return out
}

func (r *memoryRepo) Create(code string) Product {
	r.mu.Lock()
	defer r.mu.Unlock()

	p := Product{
		ID:        r.nextID,
		Code:      code,
		CreatedAt: time.Now(),
	}
	r.items[p.ID] = p
	r.nextID++
	return p
}

func (r *memoryRepo) Delete(id int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.items[id]; !ok {
		return ErrNotFound
	}
	delete(r.items, id)
	return nil
}
