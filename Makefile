all: upload

run:
	docker run -p 80:80 -v `pwd`:/usr/share/nginx/html -it nginx

upload:
	rsync -avzP . noumenon@aztlan.dcxxiv.com:/var/www/html/typing/
