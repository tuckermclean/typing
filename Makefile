all: run

run:
	docker run -p 80:80 -v `pwd`:/usr/share/nginx/html -it nginx
