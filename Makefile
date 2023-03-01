build-dev: 
	docker build -t api-server -f Dockerfile.dev

build-production:
	docker build -t api-server-production -f Dockerfile.production