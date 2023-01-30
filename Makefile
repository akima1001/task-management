include .env
dc-up:
	docker compose up --build -d
dc-down:
	docker compose down